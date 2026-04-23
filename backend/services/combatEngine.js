'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// combatEngine.js
//
// Stateless combat logic that mutates a CombatSession via its existing setters.
//
// Turn flow:
//   Player plays cards  →  resolveCard(session, cardIndex)  (once per card)
//   Player ends turn    →  endPlayerTurn(session)
//     1. Tick player DoTs (bleed / scorch)
//     2. Decrement player turn-based statuses (vulnerable / lifesteal)
//     3. Enemy selects & executes cards  →  resolveEnemyCards(session)
//     4. Tick enemy DoTs
//     5. Decrement enemy turn-based statuses
//     6. Advance turn, startPlayerTurn() (resets player block + strength)
// ─────────────────────────────────────────────────────────────────────────────

const { getCardById } = require('./cardPool.js');
const { selectTurnCards } = require('./enemyPool.js');
const { TURN_OWNERS } = require('../models/CombatSession.js');

// ─────────────────────────────────────────────────────────────────────────────
// Status helpers
// ─────────────────────────────────────────────────────────────────────────────

function findStatus(statuses, type) {
    return statuses.find((s) => s.type === type) || null;
}

function upsertStackStatus(statuses, type, stacks) {
    const existing = findStatus(statuses, type);
    if (existing) {
        existing.stacks += stacks;
    } else {
        statuses.push({ type, stacks });
    }
}

function upsertTurnStatus(statuses, type, pct, turns) {
    const existing = findStatus(statuses, type);
    if (existing) {
        existing.turns = Math.max(existing.turns, turns);
        existing.pct = Math.max(existing.pct, pct);
    } else {
        statuses.push({ type, pct, turns });
    }
}

function pruneStatuses(statuses) {
    for (let i = statuses.length - 1; i >= 0; i--) {
        const s = statuses[i];
        if ((s.stacks !== undefined && s.stacks <= 0) || (s.turns !== undefined && s.turns <= 0)) {
            statuses.splice(i, 1);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DoT damage formula
//
// Each bleed or scorch tick deals:
//   floor(target.maxHp * 0.05)  +  player's total attack multiplier
//
// attackMultiplier is pre-summed from equipped melee + ranged attack_multiplier
// and stored in session.player.equipmentSnapshot.attackMultiplier when combat
// starts. Defaults to 5 if not present.
// ─────────────────────────────────────────────────────────────────────────────

function calcDotDamage(session, target) {
    const atkMult = Number(session.player.equipmentSnapshot?.attackMultiplier || 5);
    const pctDmg = Math.floor(target.maxHp * 0.05);
    return Math.max(1, atkMult + pctDmg);
}

// Detonate all bleed stacks on a target immediately at 50% of their tick value.
// Used when scorch is applied to a bleeding target, and vice-versa.
function detonateBleed(session, target, isPlayer, enemyIndex) {
    const bleed = findStatus(target.statuses, 'bleed');
    if (!bleed || bleed.stacks <= 0) return;

    const tickDmg = calcDotDamage(session, target);
    const totalDmg = Math.floor(tickDmg * bleed.stacks * 0.5);
    const setHp = isPlayer
        ? (hp) => session.setPlayerHp(hp)
        : (hp) => session.setEnemyHp(hp, enemyIndex);
    const targetLabel = isPlayer ? 'You' : target.archetype || 'Enemy';

    // Remove bleed first
    const idx = target.statuses.indexOf(bleed);
    target.statuses.splice(idx, 1);

    if (totalDmg > 0) {
        setHp(target.hp - totalDmg);
        session.appendLog({
            type: 'status',
            message: `Scorch ignites ${targetLabel}'s bleed — ${totalDmg} instant damage (${bleed.stacks} stacks detonated at 50%).`
        });
    }
}

function detonateScorch(session, target, isPlayer, enemyIndex) {
    const scorch = findStatus(target.statuses, 'scorch');
    if (!scorch || scorch.stacks <= 0) return;

    const tickDmg = calcDotDamage(session, target);
    const totalDmg = Math.floor(tickDmg * scorch.stacks * 0.5);
    const setHp = isPlayer
        ? (hp) => session.setPlayerHp(hp)
        : (hp) => session.setEnemyHp(hp, enemyIndex);
    const targetLabel = isPlayer ? 'You' : target.archetype || 'Enemy';

    const idx = target.statuses.indexOf(scorch);
    target.statuses.splice(idx, 1);

    if (totalDmg > 0) {
        setHp(target.hp - totalDmg);
        session.appendLog({
            type: 'status',
            message: `Bleed extinguishes ${targetLabel}'s scorch — ${totalDmg} instant damage (${scorch.stacks} stacks detonated at 50%).`
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Damage helper
//
// Apply damage to a target object (player or enemy).
// blockable = true  → block absorbs first, remainder hits HP
// blockable = false → bypasses block entirely (DoT damage)
// Returns { damageTaken, blocked }.
function applyDamage(target, amount, blockable) {
    const raw = Math.max(0, Math.floor(amount));
    if (!blockable || target.block <= 0) {
        return { damageTaken: raw, blocked: 0 };
    }
    const blocked = Math.min(target.block, raw);
    const damageTaken = raw - blocked;
    target.block -= blocked;
    return { damageTaken, blocked };
}

function getVulnMultiplier(target) {
    const v = findStatus(target.statuses, 'vulnerable');
    return v ? 1 + v.pct / 100 : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared effect applier (used for both player cards and enemy cards)
// ─────────────────────────────────────────────────────────────────────────────

// Apply a card's effects object.
//   attacker / defender — the combat session's player or enemy objects
//   isPlayerCard        — true when the player is acting, false for enemy
//   session             — needed for setPlayerHp / setEnemyHp so resolution fires
//   enemyIndex          — which enemies[] slot the defender/attacker occupies
function applyEffects(effects, attacker, defender, isPlayerCard, session, enemyIndex) {
    // Fallback: if no enemyIndex given, use 0
    if (enemyIndex === undefined) enemyIndex = 0;

    const setAttackerHp = isPlayerCard
        ? (hp) => session.setPlayerHp(hp)
        : (hp) => session.setEnemyHp(hp, enemyIndex);
    const setDefenderHp = isPlayerCard
        ? (hp) => session.setEnemyHp(hp, enemyIndex)
        : (hp) => session.setPlayerHp(hp);
    const attackerLabel = isPlayerCard ? 'You' : attacker.archetype || 'Enemy';
    const defenderLabel = isPlayerCard ? defender.archetype || 'Enemy' : 'You';

    // ── damage ───────────────────────────────────────────────────────────────
    if (effects.damage) {
        const base = effects.damage + (attacker.strength || 0);
        const scaled = Math.floor(base * getVulnMultiplier(defender));
        const { damageTaken, blocked } = applyDamage(defender, scaled, true);

        setDefenderHp(defender.hp - damageTaken);

        // lifesteal — heals attacker % of damage dealt
        const ls = findStatus(attacker.statuses, 'lifesteal');
        if (ls && damageTaken > 0) {
            const heal = Math.floor(damageTaken * (ls.pct / 100));
            if (heal > 0) {
                setAttackerHp(attacker.hp + heal);
                session.appendLog({
                    type: 'lifesteal',
                    message: `${attackerLabel} lifesteals ${heal} HP.`
                });
            }
        }

        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${defenderLabel} ${isPlayerCard ? 'takes' : 'take'} ${damageTaken} damage${blocked > 0 ? ` (${blocked} blocked)` : ''}.`,
            meta: { damageTaken, blocked }
        });

        if (!session.isActive()) return;
    }

    // ── block (attacker gains) ────────────────────────────────────────────────
    if (effects.block) {
        attacker.block += effects.block;
        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${attackerLabel} gain${isPlayerCard ? '' : 's'} ${effects.block} block. (Total: ${attacker.block})`
        });
    }

    // ── bleed on defender — detonates scorch if present ────────────────────
    if (effects.bleed) {
        if (findStatus(defender.statuses, 'scorch')) {
            detonateScorch(session, defender, !isPlayerCard, isPlayerCard ? enemyIndex : -1);
            if (!session.isActive()) return;
        }
        upsertStackStatus(defender.statuses, 'bleed', effects.bleed);
        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${defenderLabel} receive${isPlayerCard ? 's' : ''} ${effects.bleed} bleed (${effects.bleed} turn${effects.bleed > 1 ? 's' : ''}).`
        });
    }

    // ── scorch on defender — detonates bleed if present ──────────────────────
    if (effects.scorch) {
        if (findStatus(defender.statuses, 'bleed')) {
            detonateBleed(session, defender, !isPlayerCard, isPlayerCard ? enemyIndex : -1);
            if (!session.isActive()) return;
        }
        upsertStackStatus(defender.statuses, 'scorch', effects.scorch);
        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${defenderLabel} receive${isPlayerCard ? 's' : ''} ${effects.scorch} scorch (${effects.scorch} turn${effects.scorch > 1 ? 's' : ''}).`
        });
    }

    // ── vulnerable on defender ───────────────────────────────────────────────
    if (effects.vulnerable) {
        const { pct, turns } = effects.vulnerable;
        upsertTurnStatus(defender.statuses, 'vulnerable', pct, turns);
        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${defenderLabel} ${isPlayerCard ? 'is' : 'are'} vulnerable (+${pct}% dmg) for ${turns} turn(s).`
        });
    }

    // ── lifesteal (player card only — grants status before next hit) ─────────
    if (effects.lifesteal) {
        const { pct, turns } = effects.lifesteal;
        upsertTurnStatus(attacker.statuses, 'lifesteal', pct, turns);
        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${attackerLabel} gain${isPlayerCard ? '' : 's'} lifesteal (${pct}%) for ${turns} turn(s).`
        });
    }

    // ── healing (attacker heals directly) ────────────────────────────────────
    if (effects.healing) {
        setAttackerHp(attacker.hp + effects.healing);
        session.appendLog({
            type: isPlayerCard ? 'player' : 'enemy',
            message: `${attackerLabel} heal${isPlayerCard ? '' : 's'} for ${effects.healing}.`
        });
        if (!session.isActive()) return;
    }

    // ── backfire (player cards only) ─────────────────────────────────────────
    if (effects.backfire && isPlayerCard) {
        session.setPlayerHp(attacker.hp - effects.backfire);
        session.appendLog({
            type: 'player',
            message: `You take ${effects.backfire} self-damage.`
        });
        if (!session.isActive()) return;
    }

    // ── extraPlays (player cards only) ───────────────────────────────────────
    if (effects.extraPlays && isPlayerCard) {
        session.addBonusCardPlays(effects.extraPlays);
        session.appendLog({
            type: 'player',
            message: `You gain ${effects.extraPlays} extra card play(s) this turn.`
        });
    }

    // ── strength (player cards only — current turn bonus) ────────────────────
    if (effects.strength && isPlayerCard) {
        attacker.strength += effects.strength;
        session.appendLog({
            type: 'player',
            message: `You gain ${effects.strength} strength this turn.`
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Status tick helpers
// ─────────────────────────────────────────────────────────────────────────────

// Tick bleed and scorch on a target — unblockable, stacks -1 per tick.
// Damage per tick = player's attackMultiplier + 5% of target's maxHp.
function tickDots(session, target, isPlayer, enemyIndex) {
    const setHp = isPlayer
        ? (hp) => session.setPlayerHp(hp)
        : (hp) => session.setEnemyHp(hp, enemyIndex);
    const label = isPlayer ? 'You' : target.archetype || 'Enemy';
    const tickDmg = calcDotDamage(session, target);

    for (const s of target.statuses) {
        if (!session.isActive()) return;

        if ((s.type === 'bleed' || s.type === 'scorch') && s.stacks > 0) {
            setHp(target.hp - tickDmg);
            session.appendLog({
                type: 'status',
                message: `${label} ${s.type === 'bleed' ? `bleed${isPlayer ? '' : 's'}` : `scorch${isPlayer ? '' : 'es'}`} for ${tickDmg} damage. (${s.stacks - 1} turn${s.stacks - 1 !== 1 ? 's' : ''} remaining)`
            });
            s.stacks -= 1;
        }
    }
}

// Decrement turns on vulnerable / lifesteal, prune expired entries.
function tickTurnStatuses(target) {
    for (const s of target.statuses) {
        if (s.turns !== undefined) s.turns -= 1;
    }
    pruneStatuses(target.statuses);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public — player card
// ─────────────────────────────────────────────────────────────────────────────

// Play the card at hand[cardIndex].
// targetIndex is the enemies[] slot the player chose (required for 'single' cards).
// Returns { ok: true } or { ok: false, reason: string }.
function resolveCard(session, cardIndex, targetIndex) {
    if (!session.isActive()) return { ok: false, reason: 'Combat is already resolved.' };
    if (session.turnOwner !== TURN_OWNERS.PLAYER)
        return { ok: false, reason: "It is not the player's turn." };
    if (!session.canPlayCard()) return { ok: false, reason: 'No card plays remaining this turn.' };

    const cardRef = session.deck.hand[cardIndex];
    if (!cardRef) return { ok: false, reason: `No card at hand index ${cardIndex}.` };

    const card = getCardById(cardRef.id);
    if (!card) return { ok: false, reason: `Unknown card id ${cardRef.id}.` };

    // ── Resolve targets based on the card's targetType ───────────────────────
    const alive = session.getAliveEnemies();
    const tType = card.targetType || 'single';

    // Self-only cards never need an enemy target
    if (tType === 'self') {
        session.removeCardFromHand(cardIndex, card.exhaust === true);
        session.registerCardPlayed();
        session.appendLog({ type: 'player', message: `You play ${card.name}.` });
        applyEffects(card.effects || {}, session.player, session.player, true, session, 0);
        return { ok: true };
    }

    // For enemy-targeting cards, we need at least one alive enemy
    if (alive.length === 0) {
        return { ok: false, reason: 'No enemies alive to target.' };
    }

    // Remove card from hand and register play before applying effects
    session.removeCardFromHand(cardIndex, card.exhaust === true);
    session.registerCardPlayed();
    session.appendLog({ type: 'player', message: `You play ${card.name}.` });

    if (tType === 'single') {
        const tIdx = Number.isInteger(targetIndex) ? targetIndex : 0;
        const target = session.enemies[tIdx];
        if (!target || target.hp <= 0) {
            const fallback = alive[0];
            applyEffects(
                card.effects || {},
                session.player,
                fallback,
                true,
                session,
                fallback.index
            );
        } else {
            applyEffects(card.effects || {}, session.player, target, true, session, tIdx);
        }
    } else if (tType === 'all') {
        // Hit every living enemy
        for (const enemy of alive) {
            if (!session.isActive()) break;
            applyEffects(card.effects || {}, session.player, enemy, true, session, enemy.index);
        }
    } else if (tType === 'random') {
        // Hit N random living enemies (may hit the same one twice if fewer alive)
        const count = Number(card.affectedTargets) || 1;
        for (let i = 0; i < count; i++) {
            if (!session.isActive()) break;
            const pool = session.getAliveEnemies();
            if (pool.length === 0) break;
            const pick = pool[Math.floor(Math.random() * pool.length)];
            applyEffects(card.effects || {}, session.player, pick, true, session, pick.index);
        }
    }

    return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public — end player turn
// ─────────────────────────────────────────────────────────────────────────────

// Orchestrates everything that happens from "End Turn" to the start of the
// next player turn. Exits early at any point if combat is resolved.
function endPlayerTurn(session) {
    if (!session.isActive()) return;

    // 1. Player DoTs tick
    tickDots(session, session.player, true, -1);
    if (!session.isActive()) return;

    // 2. Player turn-based statuses decrement
    tickTurnStatuses(session.player);

    // 3. Enemy turn — each living enemy selects and executes cards
    session.startEnemyTurn(); // resets block + strength for all enemies
    resolveEnemyCards(session);
    if (!session.isActive()) return;

    // 4. Enemy DoTs tick (each living enemy)
    for (const enemy of session.enemies) {
        if (!session.isActive()) break;
        if (enemy.hp > 0) {
            tickDots(session, enemy, false, enemy.index);
        }
    }
    if (!session.isActive()) return;

    // 5. Enemy turn-based statuses decrement (each enemy)
    for (const enemy of session.enemies) {
        if (enemy.hp > 0) {
            tickTurnStatuses(enemy);
        }
    }

    // 6. Advance turn, start new player turn (resets player block + strength)
    session.incrementTurn();
    session.startPlayerTurn();
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal — enemy turn execution
// ─────────────────────────────────────────────────────────────────────────────

function resolveEnemyCards(session) {
    for (const enemy of session.enemies) {
        if (!session.isActive()) return;
        if (enemy.hp <= 0) continue;

        const cards = selectTurnCards(enemy);
        for (const card of cards) {
            if (!session.isActive()) return;
            applyEffects(card.effects || {}, enemy, session.player, false, session, enemy.index);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
    resolveCard,
    endPlayerTurn
};
