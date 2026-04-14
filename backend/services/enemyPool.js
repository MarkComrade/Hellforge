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
    // ═══════════════════════════════════════════════════════════════════════
    // CRYPT  ─ low difficulty, levels 1-5, base damage 7-14
    // ═══════════════════════════════════════════════════════════════════════
    crypt: [
        {
            id: 'skeleton',
            name: 'Skeleton',
            baseHp: 22,
            hpPerLevel: 4,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 7 } },
                { likelihood: 25, effects: { damage: 5, bleed: 2 } },
                { likelihood: 20, effects: { damage: 10 } },
                { likelihood: 15, effects: { block: 10 }, defensive: true },
                { likelihood: 10, effects: { lifesteal: { pct: 20, turns: 2 } }, defensive: true }
            ]
        },
        {
            id: 'zombie',
            name: 'Zombie',
            baseHp: 32,
            hpPerLevel: 5,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { likelihood: 30, effects: { damage: 8, bleed: 2 } },
                { likelihood: 25, effects: { damage: 12 } },
                { likelihood: 20, effects: { scorch: 3 } },
                { likelihood: 15, effects: { block: 14 }, defensive: true },
                { likelihood: 10, effects: { healing: 10 }, defensive: true }
            ]
        },
        {
            id: 'crypt_guard',
            name: 'Crypt Guard',
            baseHp: 28,
            hpPerLevel: 5,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 9 } },
                { likelihood: 25, effects: { damage: 6, vulnerable: { pct: 20, turns: 1 } } },
                { likelihood: 20, effects: { block: 12 } },
                { likelihood: 15, effects: { block: 16 }, defensive: true },
                { likelihood: 10, effects: { lifesteal: { pct: 25, turns: 2 } }, defensive: true }
            ]
        },
        {
            id: 'wraith',
            name: 'Wraith',
            baseHp: 20,
            hpPerLevel: 3,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 6, scorch: 2 } },
                { likelihood: 25, effects: { damage: 5, bleed: 2 } },
                { likelihood: 20, effects: { vulnerable: { pct: 20, turns: 2 } } },
                { likelihood: 20, effects: { lifesteal: { pct: 25, turns: 2 } }, defensive: true },
                { likelihood: 10, effects: { block: 10 }, defensive: true }
            ]
        }
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // LABYRINTH  ─ medium difficulty, levels 1-8, base damage 10-20
    // ═══════════════════════════════════════════════════════════════════════
    labyrinth: [
        {
            id: 'minotaur',
            name: 'Minotaur',
            baseHp: 45,
            hpPerLevel: 7,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 14 } },
                { likelihood: 25, effects: { damage: 10, bleed: 3 } },
                { likelihood: 20, effects: { damage: 18, vulnerable: { pct: 25, turns: 1 } } },
                { likelihood: 15, effects: { block: 16 }, defensive: true },
                { likelihood: 10, effects: { healing: 14 }, defensive: true }
            ]
        },
        {
            id: 'stone_golem',
            name: 'Stone Golem',
            baseHp: 60,
            hpPerLevel: 9,
            cardsPerTurn: { min: 1, max: 2 },
            cards: [
                { likelihood: 25, effects: { damage: 16 } },
                { likelihood: 25, effects: { damage: 12, vulnerable: { pct: 20, turns: 2 } } },
                { likelihood: 20, effects: { block: 22 } },
                { likelihood: 20, effects: { block: 26 }, defensive: true },
                { likelihood: 10, effects: { healing: 16 }, defensive: true }
            ]
        },
        {
            id: 'shadow_knight',
            name: 'Shadow Knight',
            baseHp: 40,
            hpPerLevel: 6,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 12, bleed: 3 } },
                { likelihood: 25, effects: { damage: 14, vulnerable: { pct: 25, turns: 2 } } },
                { likelihood: 20, effects: { damage: 10, scorch: 3 } },
                { likelihood: 20, effects: { block: 18 }, defensive: true },
                { likelihood: 10, effects: { lifesteal: { pct: 30, turns: 2 } }, defensive: true }
            ]
        },
        {
            id: 'labyrinth_stalker',
            name: 'Labyrinth Stalker',
            baseHp: 35,
            hpPerLevel: 5,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 10, bleed: 3 } },
                { likelihood: 25, effects: { damage: 8, scorch: 4 } },
                { likelihood: 20, effects: { vulnerable: { pct: 30, turns: 2 } } },
                { likelihood: 20, effects: { lifesteal: { pct: 30, turns: 2 } }, defensive: true },
                { likelihood: 10, effects: { block: 14 }, defensive: true }
            ]
        }
    ],

    // ═══════════════════════════════════════════════════════════════════════
    // LABORATORY  ─ hard difficulty, levels 1-10, base damage 12-24
    // ═══════════════════════════════════════════════════════════════════════
    laboratory: [
        {
            id: 'mutant',
            name: 'Mutant',
            baseHp: 55,
            hpPerLevel: 8,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 18, bleed: 4 } },
                { likelihood: 25, effects: { damage: 22 } },
                { likelihood: 20, effects: { damage: 14, scorch: 4 } },
                { likelihood: 15, effects: { block: 20 }, defensive: true },
                { likelihood: 10, effects: { healing: 18 }, defensive: true }
            ]
        },
        {
            id: 'chemist',
            name: 'Chemist',
            baseHp: 40,
            hpPerLevel: 6,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 12, scorch: 5 } },
                { likelihood: 25, effects: { damage: 10, vulnerable: { pct: 30, turns: 2 } } },
                { likelihood: 25, effects: { scorch: 6, bleed: 3 } },
                { likelihood: 15, effects: { lifesteal: { pct: 30, turns: 3 } }, defensive: true },
                { likelihood: 10, effects: { block: 18 }, defensive: true }
            ]
        },
        {
            id: 'lab_guardian',
            name: 'Lab Guardian',
            baseHp: 65,
            hpPerLevel: 10,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 20 } },
                { likelihood: 25, effects: { damage: 16, vulnerable: { pct: 25, turns: 2 } } },
                { likelihood: 20, effects: { block: 24 } },
                { likelihood: 15, effects: { block: 28 }, defensive: true },
                { likelihood: 10, effects: { healing: 20 }, defensive: true }
            ]
        },
        {
            id: 'specimen',
            name: 'Specimen',
            baseHp: 38,
            hpPerLevel: 6,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 14, scorch: 5 } },
                { likelihood: 25, effects: { damage: 12, bleed: 5 } },
                { likelihood: 20, effects: { scorch: 7, vulnerable: { pct: 25, turns: 2 } } },
                { likelihood: 20, effects: { lifesteal: { pct: 35, turns: 2 } }, defensive: true },
                { likelihood: 10, effects: { block: 16 }, defensive: true }
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
            baseHp: 70,
            hpPerLevel: 11,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 24, scorch: 5 } },
                { likelihood: 25, effects: { damage: 28 } },
                { likelihood: 20, effects: { damage: 18, vulnerable: { pct: 30, turns: 2 } } },
                { likelihood: 15, effects: { block: 26 }, defensive: true },
                { likelihood: 10, effects: { healing: 22 }, defensive: true }
            ]
        },
        {
            id: 'soul_reaper',
            name: 'Soul Reaper',
            baseHp: 58,
            hpPerLevel: 9,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 20, bleed: 6 } },
                { likelihood: 25, effects: { damage: 16, vulnerable: { pct: 30, turns: 3 } } },
                { likelihood: 20, effects: { damage: 14, scorch: 5 } },
                { likelihood: 20, effects: { lifesteal: { pct: 40, turns: 3 } }, defensive: true },
                { likelihood: 10, effects: { healing: 20 }, defensive: true }
            ]
        },
        {
            id: 'hell_knight',
            name: 'Hell Knight',
            baseHp: 85,
            hpPerLevel: 13,
            cardsPerTurn: { min: 1, max: 3 },
            cards: [
                { likelihood: 25, effects: { damage: 26 } },
                { likelihood: 25, effects: { damage: 20, bleed: 5 } },
                { likelihood: 20, effects: { damage: 22, vulnerable: { pct: 35, turns: 2 } } },
                { likelihood: 20, effects: { block: 32 }, defensive: true },
                { likelihood: 10, effects: { lifesteal: { pct: 35, turns: 3 } }, defensive: true }
            ]
        },
        {
            id: 'infernal_brute',
            name: 'Infernal Brute',
            baseHp: 75,
            hpPerLevel: 12,
            cardsPerTurn: { min: 2, max: 3 },
            cards: [
                { likelihood: 30, effects: { damage: 30 } },
                { likelihood: 25, effects: { damage: 22, bleed: 6 } },
                { likelihood: 20, effects: { damage: 26, scorch: 6 } },
                { likelihood: 15, effects: { block: 28 }, defensive: true },
                { likelihood: 10, effects: { healing: 24 }, defensive: true }
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
        hp: maxHp,
        maxHp,
        block: 0,
        strength: 0,
        statuses: [],
        cardsPerTurn: { ...archetype.cardsPerTurn },
        cards: scaledCards
    };
}

module.exports = {
    generateEnemy,
    selectTurnCards,
    ENEMY_POOL
};
