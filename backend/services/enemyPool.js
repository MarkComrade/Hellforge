'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// enemyPool.js
//
// 4 dungeons × 4 enemies = 16 archetypes.
// Each enemy has exactly 5 cards with a likelihood weight for selection.
//
// Card effects available to enemies (no extraPlays, no strength):
//   damage    – dealt to player
//   block     – gained by the enemy
//   bleed     – applied to player (stacking DoT)
//   scorch    – applied to player (stacking DoT)
//   vulnerable– applied to player { pct, turns }
//   lifesteal – enemy heals % of damage it deals { pct, turns }
//   healing   – enemy heals directly
//
// Cards tagged defensive: true are only selected when HP < LOW_HP_THRESHOLD.
// All other cards are only selected when HP >= LOW_HP_THRESHOLD.
//
// Damage and healing values are base stats at level 1.
// generateEnemy() scales them by dungeon level before storing on the session.
// ─────────────────────────────────────────────────────────────────────────────

const LOW_HP_THRESHOLD = 0.3; // below 30 % HP → switch to defensive cards
const DMG_SCALE_PER_LEVEL = 0.1; // +10 % per level above 1   (e.g. lvl 5 = ×1.40)

// ─────────────────────────────────────────────────────────────────────────────
// Archetypes
// ─────────────────────────────────────────────────────────────────────────────

const ENEMY_POOL = {
    crypt: [
        {
            id: 'skeleton',
            name: 'Skeleton',
            img_path: '/textures/enemies/skeleton.png',
            baseHp: 22,
            hpPerLevel: 4,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Rusty Slash', likelihood: 30, effects: { damage: 7 } },
                { name: 'Bone Tear', likelihood: 25, effects: { damage: 5, bleed: 2 } },
                { name: 'Heavy Swing', likelihood: 20, effects: { damage: 10 } },
                { name: 'Bone Shield', likelihood: 15, effects: { block: 10 }, defensive: true },
                {
                    name: 'Dark Feast',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 20, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'zombie',
            name: 'Zombie',
            img_path: '/textures/enemies/zombie.png',
            baseHp: 32,
            hpPerLevel: 5,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Rotting Bite', likelihood: 30, effects: { damage: 8, bleed: 2 } },
                { name: 'Crushing Slam', likelihood: 25, effects: { damage: 12 } },
                { name: 'Corpse Burn', likelihood: 20, effects: { scorch: 3 } },
                { name: 'Rotten Guard', likelihood: 15, effects: { block: 14 }, defensive: true },
                {
                    name: 'Undead Recovery',
                    likelihood: 10,
                    effects: { healing: 10 },
                    defensive: true
                }
            ]
        },
        {
            id: 'crypt_guard',
            name: 'Crypt Guard',
            img_path: '/textures/enemies/crypt_guard.png',
            baseHp: 28,
            hpPerLevel: 5,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Guard Strike', likelihood: 30, effects: { damage: 9 } },
                {
                    name: 'Crippling Slash',
                    likelihood: 25,
                    effects: { damage: 6, vulnerable: { pct: 20, turns: 1 } }
                },
                { name: 'Shield Raise', likelihood: 20, effects: { block: 12 } },
                {
                    name: 'Fortified Guard',
                    likelihood: 15,
                    effects: { block: 16 },
                    defensive: true
                },
                {
                    name: 'Soul Drain',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 25, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'wraith',
            name: 'Wraith',
            img_path: '/textures/enemies/wraith.png',
            baseHp: 20,
            hpPerLevel: 3,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Spectral Burn', likelihood: 25, effects: { damage: 6, scorch: 2 } },
                { name: 'Phantom Claw', likelihood: 25, effects: { damage: 5, bleed: 2 } },
                {
                    name: 'Haunting Hex',
                    likelihood: 20,
                    effects: { vulnerable: { pct: 20, turns: 2 } }
                },
                {
                    name: 'Soul Siphon',
                    likelihood: 20,
                    effects: { lifesteal: { pct: 25, turns: 2 } },
                    defensive: true
                },
                { name: 'Ghostly Veil', likelihood: 10, effects: { block: 10 }, defensive: true }
            ]
        }
    ],

    labyrinth: [
        {
            id: 'minotaur',
            name: 'Minotaur',
            img_path: '/textures/enemies/minotaur.png',
            baseHp: 45,
            hpPerLevel: 7,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Brutal Smash', likelihood: 30, effects: { damage: 14 } },
                { name: 'Horn Rend', likelihood: 25, effects: { damage: 10, bleed: 3 } },
                {
                    name: 'Crippling Charge',
                    likelihood: 20,
                    effects: { damage: 18, vulnerable: { pct: 25, turns: 1 } }
                },
                { name: 'Thick Hide', likelihood: 15, effects: { block: 16 }, defensive: true },
                {
                    name: 'Battle Recovery',
                    likelihood: 10,
                    effects: { healing: 14 },
                    defensive: true
                }
            ]
        },
        {
            id: 'stone_golem',
            name: 'Stone Golem',
            img_path: '/textures/enemies/stone_golem.png',
            baseHp: 60,
            hpPerLevel: 9,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { name: 'Stone Fist', likelihood: 25, effects: { damage: 16 } },
                {
                    name: 'Crushing Blow',
                    likelihood: 25,
                    effects: { damage: 12, vulnerable: { pct: 20, turns: 2 } }
                },
                { name: 'Rock Shield', likelihood: 20, effects: { block: 22 } },
                { name: 'Granite Wall', likelihood: 20, effects: { block: 26 }, defensive: true },
                { name: 'Core Repair', likelihood: 10, effects: { healing: 16 }, defensive: true }
            ]
        },
        {
            id: 'shadow_knight',
            name: 'Shadow Knight',
            img_path: '/textures/enemies/shadow_knight.png',
            baseHp: 40,
            hpPerLevel: 6,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Shadow Rend', likelihood: 25, effects: { damage: 12, bleed: 3 } },
                {
                    name: 'Darkened Strike',
                    likelihood: 25,
                    effects: { damage: 14, vulnerable: { pct: 25, turns: 2 } }
                },
                { name: 'Cursed Flame', likelihood: 20, effects: { damage: 10, scorch: 3 } },
                { name: 'Night Guard', likelihood: 20, effects: { block: 18 }, defensive: true },
                {
                    name: 'Blood Drain',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 30, turns: 2 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'labyrinth_stalker',
            name: 'Labyrinth Stalker',
            img_path: '/textures/enemies/labyrinth_stalker.png',
            baseHp: 35,
            hpPerLevel: 5,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Jagged Claw', likelihood: 25, effects: { damage: 10, bleed: 3 } },
                { name: 'Burning Pounce', likelihood: 25, effects: { damage: 8, scorch: 4 } },
                {
                    name: 'Predator Gaze',
                    likelihood: 20,
                    effects: { vulnerable: { pct: 30, turns: 2 } }
                },
                {
                    name: 'Life Drain',
                    likelihood: 20,
                    effects: { lifesteal: { pct: 30, turns: 2 } },
                    defensive: true
                },
                { name: 'Smoke Veil', likelihood: 10, effects: { block: 14 }, defensive: true }
            ]
        }
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // GATES OF HELL  ─ extreme difficulty, levels 1-15, base damage 20-32
    // ═══════════════════════════════════════════════════════════════════════
    gates_of_hell: [
        {
            id: 'demon',
            name: 'Demon',
            img_path: '/textures/enemies/demon.png',
            baseHp: 70,
            hpPerLevel: 11,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Infernal Slash', likelihood: 30, effects: { damage: 24, scorch: 5 } },
                { name: 'Hellfire Strike', likelihood: 25, effects: { damage: 28 } },
                {
                    name: 'Demonic Crush',
                    likelihood: 20,
                    effects: { damage: 18, vulnerable: { pct: 30, turns: 2 } }
                },
                { name: 'Flame Barrier', likelihood: 15, effects: { block: 26 }, defensive: true },
                {
                    name: 'Hellish Recovery',
                    likelihood: 10,
                    effects: { healing: 22 },
                    defensive: true
                }
            ]
        },
        {
            id: 'soul_reaper',
            name: 'Soul Reaper',
            img_path: '/textures/enemies/soul_reaper.png',
            baseHp: 58,
            hpPerLevel: 9,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Soul Rend', likelihood: 25, effects: { damage: 20, bleed: 6 } },
                {
                    name: 'Reaper Curse',
                    likelihood: 25,
                    effects: { damage: 16, vulnerable: { pct: 30, turns: 3 } }
                },
                { name: 'Ashen Flame', likelihood: 20, effects: { damage: 14, scorch: 5 } },
                {
                    name: 'Soul Harvest',
                    likelihood: 20,
                    effects: { lifesteal: { pct: 40, turns: 3 } },
                    defensive: true
                },
                { name: 'Dark Renewal', likelihood: 10, effects: { healing: 20 }, defensive: true }
            ]
        },
        {
            id: 'hell_knight',
            name: 'Hell Knight',
            img_path: '/textures/enemies/hell_knight.png',
            baseHp: 85,
            hpPerLevel: 13,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { name: 'Hellblade Slash', likelihood: 25, effects: { damage: 26 } },
                { name: 'Blood Cleave', likelihood: 25, effects: { damage: 20, bleed: 5 } },
                {
                    name: 'Crushing Verdict',
                    likelihood: 20,
                    effects: { damage: 22, vulnerable: { pct: 35, turns: 2 } }
                },
                {
                    name: 'Infernal Shield',
                    likelihood: 20,
                    effects: { block: 32 },
                    defensive: true
                },
                {
                    name: 'Soul Feast',
                    likelihood: 10,
                    effects: { lifesteal: { pct: 35, turns: 3 } },
                    defensive: true
                }
            ]
        },
        {
            id: 'infernal_brute',
            name: 'Infernal Brute',
            img_path: '/textures/enemies/infernal_brute.png',
            baseHp: 75,
            hpPerLevel: 12,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { name: 'Brutal Crush', likelihood: 30, effects: { damage: 30 } },
                { name: 'Savage Tear', likelihood: 25, effects: { damage: 22, bleed: 6 } },
                { name: 'Molten Smash', likelihood: 20, effects: { damage: 26, scorch: 6 } },
                { name: 'Iron Hide', likelihood: 15, effects: { block: 28 }, defensive: true },
                {
                    name: 'Infernal Recovery',
                    likelihood: 10,
                    effects: { healing: 24 },
                    defensive: true
                }
            ]
        }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// Weighted random pick from an array of { likelihood, ... } objects.
function pickByLikelihood(cards) {
    const total = cards.reduce((sum, c) => sum + c.likelihood, 0);
    let roll = Math.random() * total;
    for (const card of cards) {
        roll -= card.likelihood;
        if (roll <= 0) return card;
    }
    return cards[cards.length - 1];
}

// Scale a base stat value for the given dungeon level.
function scaleForLevel(base, level) {
    return Math.round(base * (1 + (level - 1) * DMG_SCALE_PER_LEVEL));
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

// Select the cards the enemy plays this turn.
//
// Normal HP: pick 1-3 offensive cards (non-defensive) by likelihood.
//
// Low HP (< LOW_HP_THRESHOLD): always play at least 2 cards —
//   slot 1 is always a defensive card (block / heal / lifesteal),
//   slot 2+ are offensive cards picked by likelihood.
//   Total card count is max(2, normal random count).
//
// Falls back to the full pool if either sub-pool is empty.
function selectTurnCards(enemy) {
    const isLowHp = enemy.hp / enemy.maxHp < LOW_HP_THRESHOLD;

    const offensivePool = enemy.cards.filter((c) => !c.defensive);
    const defensivePool = enemy.cards.filter((c) => c.defensive);

    const range = enemy.cardsPerTurn.max - enemy.cardsPerTurn.min;
    const rolledCount = enemy.cardsPerTurn.min + Math.floor(Math.random() * (range + 1));

    if (!isLowHp) {
        const pool = offensivePool.length > 0 ? offensivePool : enemy.cards;
        const selected = [];
        for (let i = 0; i < rolledCount; i++) {
            selected.push(pickByLikelihood(pool));
        }
        return selected;
    }

    // Low HP — guaranteed 1 defensive + at least 1 offensive
    const defPool = defensivePool.length > 0 ? defensivePool : enemy.cards;
    const atkPool = offensivePool.length > 0 ? offensivePool : enemy.cards;

    const totalCount = Math.max(2, rolledCount);
    const selected = [pickByLikelihood(defPool)];
    for (let i = 1; i < totalCount; i++) {
        selected.push(pickByLikelihood(atkPool));
    }
    return selected;
}

// Build a fully initialised enemy object ready for CombatSession.setEnemy().
// Damage and healing are scaled to the current dungeon level; everything else
// (block values, status stacks/turns) stays as defined in the archetype.
function generateEnemy(dungeonType, dungeonLevel) {
    const pool = ENEMY_POOL[dungeonType] || ENEMY_POOL.crypt;
    const archetype = pool[Math.floor(Math.random() * pool.length)];
    const level = Math.max(1, Math.floor(Number(dungeonLevel) || 1));

    const maxHp = archetype.baseHp + (level - 1) * archetype.hpPerLevel;

    const scaledCards = archetype.cards.map((card) => {
        const scaled = { likelihood: card.likelihood, effects: { ...card.effects } };
        if (scaled.effects.damage !== undefined)
            scaled.effects.damage = scaleForLevel(scaled.effects.damage, level);
        if (scaled.effects.healing !== undefined)
            scaled.effects.healing = scaleForLevel(scaled.effects.healing, level);
        if (card.defensive) scaled.defensive = true;
        return scaled;
    });

    return {
        enemyId: archetype.id,
        archetype: archetype.name,
        img_path: archetype.img_path || null,
        hp: maxHp,
        maxHp,
        block: 0,
        strength: 0,
        statuses: [],
        cardsPerTurn: { ...archetype.cardsPerTurn },
        cards: scaledCards
    };
}

// Generate a group of enemies for a multi-enemy encounter.
// count determines how many enemies to spawn (1-5).
// Each enemy is independently rolled from the dungeon's archetype pool.
function generateEnemyGroup(dungeonType, dungeonLevel, count) {
    const clamped = Math.max(1, Math.min(5, Math.floor(Number(count) || 1)));
    const enemies = [];
    for (let i = 0; i < clamped; i++) {
        const enemy = generateEnemy(dungeonType, dungeonLevel);
        enemy.index = i;
        enemies.push(enemy);
    }
    return enemies;
}

// Roll how many enemies to spawn based on dungeon type.
// Harder dungeons have a higher chance of multiple enemies.
function rollEnemyCount(dungeonType) {
    const roll = Math.random();
    switch (dungeonType) {
        case 'crypt':
            return roll < 0.55 ? 1 : roll < 0.85 ? 2 : roll < 0.97 ? 3 : 4;
        case 'labyrinth':
            return roll < 0.35 ? 1 : roll < 0.65 ? 2 : roll < 0.88 ? 3 : roll < 0.97 ? 4 : 5;
        case 'laboratory':
            return roll < 0.25 ? 1 : roll < 0.5 ? 2 : roll < 0.78 ? 3 : roll < 0.93 ? 4 : 5;
        case 'gates_of_hell':
            return roll < 0.12 ? 1 : roll < 0.3 ? 2 : roll < 0.58 ? 3 : roll < 0.85 ? 4 : 5;
        default:
            return roll < 0.5 ? 1 : roll < 0.82 ? 2 : roll < 0.96 ? 3 : 4;
    }
}

module.exports = {
    generateEnemy,
    generateEnemyGroup,
    rollEnemyCount,
    selectTurnCards,
    ENEMY_POOL
};
