const { normalizeDungeonType } = require('../api/combatApi.js');
const { applyDamage } = require('../services/combatEngine.js');
const { normalizeDungeonKey, getBaseTier } = require('../services/lootAlgorithm.js');
const { getCardById, buildDeckFromEquipment } = require('../services/cardPool.js');
const { generateEnemy, rollEnemyCount } = require('../services/enemyPool.js');
const { CombatSession, TURN_OWNERS } = require('../models/CombatSession.js');
const {
    calculateAdjustedPrice,
    getMaxAllowedPrice,
    withAdjustedPrice
} = require('../services/pricing.js');

function sortedIds(cards) {
    if (!cards) {
        cards = [];
    }
    const ids = [];
    for (let i = 0; i < cards.length; i++) {
        ids.push(cards[i].id);
    }
    for (let i = 0; i < ids.length - 1; i++) {
        for (let j = 0; j < ids.length - 1 - i; j++) {
            if (ids[j] > ids[j + 1]) {
                const temp = ids[j];
                ids[j] = ids[j + 1];
                ids[j + 1] = temp;
            }
        }
    }

    return ids;
}

QUnit.module('normalizeDungeonType');

QUnit.test.each(
    'normalizeDungeonType cases',
    [
        ['crypt', 'crypt'],
        ['Crypt', 'crypt'],
        ['  Crypt  ', 'crypt'],
        ['Gates Of Hell', 'gates_of_hell'],
        [null, ''],
        [undefined, '']
    ],
    (assert, [input, expected]) => {
        assert.strictEqual(normalizeDungeonType(input), expected);
    }
);

QUnit.module('normalizeDungeonKey');

QUnit.test.each(
    'loot key normalize cases',
    [
        ['crypt', 'crypt'],
        ['LABYRINTH', 'labyrinth'],
        ['gates of hell', 'gates_of_hell'],
        ['  laboratory ', 'laboratory'],
        [null, ''],
        [undefined, '']
    ],
    (assert, [input, expected]) => {
        assert.strictEqual(normalizeDungeonKey(input), expected);
    }
);

QUnit.module('getBaseTier');

QUnit.test.each(
    'base tier by dungeon + level',
    [
        ['crypt', 1, 1],
        ['crypt', 10, 2],
        ['labyrinth', 1, 2],
        ['laboratory', 19, 4],
        ['gates_of_hell', 20, 6],
        ['laboratory', 50, 6],
        ['crypt', -5, 1]
    ],
    (assert, [dungeon, level, expected]) => {
        assert.strictEqual(getBaseTier(dungeon, level), expected);
    }
);

QUnit.module('getCardById');

QUnit.test.each(
    'getCardById valid and invalid ids',
    [
        [1, true],
        [2, true],
        [61, true],
        [121, true],
        [181, true],
        [9999, false],
        [0, false],
        [-1, false]
    ],
    (assert, [cardId, exists]) => {
        const card = getCardById(cardId);
        if (exists) {
            assert.ok(card, `card ${cardId} should exist`);
            assert.strictEqual(card.id, cardId);
        } else {
            assert.strictEqual(card, null, `card ${cardId} should be null`);
        }
    }
);

QUnit.module('buildDeckFromEquipment');

QUnit.test.each(
    'combines all slots into one deck',
    [
        [[], [], [], [], []],
        [[1], [], [], [], [1]],
        [[1, 2], [61], [], [], [1, 2, 61]],
        [[1], [61], [121], [181], [1, 61, 121, 181]]
    ],
    (assert, [meleeIds, rangedIds, helmetIds, armorIds, expectedIds]) => {
        const snapshot = {
            melee_cards: meleeIds.map((id) => getCardById(id)),
            ranged_cards: rangedIds.map((id) => getCardById(id)),
            helmet_cards: helmetIds.map((id) => getCardById(id)),
            armor_cards: armorIds.map((id) => getCardById(id))
        };
        const deck = buildDeckFromEquipment(snapshot);
        assert.deepEqual(sortedIds(deck), expectedIds);
    }
);

QUnit.module('rollEnemyCount');

QUnit.test.each(
    'rollEnemyCount level 1-3 always returns 1',
    [
        ['crypt', 1],
        ['labyrinth', 2],
        ['laboratory', 3],
        ['gates_of_hell', 1],
        ['unknown', 2]
    ],
    (assert, [dungeonType, level]) => {
        for (let i = 0; i < 10; i++) {
            assert.strictEqual(rollEnemyCount(dungeonType, level), 1);
        }
    }
);

QUnit.test('rollEnemyCount always stays between 1 and 5', (assert) => {
    const types = ['crypt', 'labyrinth', 'laboratory', 'gates_of_hell', 'unknown'];
    for (const type of types) {
        for (let level = 1; level <= 10; level++) {
            const count = rollEnemyCount(type, level);
            assert.ok(count >= 1 && count <= 5);
        }
    }
});

QUnit.module('generateEnemy');

QUnit.test.each(
    'basic enemy shape',
    [
        ['crypt', 1],
        ['labyrinth', 4],
        ['laboratory', 7],
        ['gates_of_hell', 10],
        ['unknown_type', 2]
    ],
    (assert, [dungeonType, level]) => {
        const enemy = generateEnemy(dungeonType, level);
        assert.ok(enemy);
        assert.strictEqual(typeof enemy.archetype, 'string');
        assert.ok(enemy.hp > 0);
        assert.ok(enemy.maxHp >= enemy.hp);
        assert.ok(Array.isArray(enemy.cards));
    }
);

QUnit.module('pricing');

QUnit.test.each(
    'calculateAdjustedPrice deterministic cases',
    [
        [100, 1, 'crypt', 1, 100],
        [100, 4, 'crypt', 1, 175],
        [100, 1, 'gates of hell', 1, 25],
        [0, 1, 'crypt', 1, 1],
        [100, 10, 'crypt', 1, 175],
        [100, -10, 'gates_of_hell', 1, 25]
    ],
    (assert, [basePrice, itemTier, dungeonName, dungeonLevel, expected]) => {
        const actual = calculateAdjustedPrice(basePrice, itemTier, dungeonName, dungeonLevel, {
            markupMin: 1,
            markupMax: 1
        });
        assert.strictEqual(actual, expected);
    }
);

QUnit.test.each(
    'getMaxAllowedPrice deterministic cases',
    [
        [100, 1, 'crypt', 1, 200],
        [100, 4, 'crypt', 1, 350],
        [100, 1, 'gates_of_hell', 1, 50],
        [0, 1, 'crypt', 1, 2]
    ],
    (assert, [basePrice, itemTier, dungeonName, dungeonLevel, expected]) => {
        const actual = getMaxAllowedPrice(basePrice, itemTier, dungeonName, dungeonLevel, {
            markupMax: 2
        });
        assert.strictEqual(actual, expected);
    }
);

QUnit.test('withAdjustedPrice keeps fields and adds adjustedPrice', (assert) => {
    const item = { id: 7, name: 'Test Item', price: 100, tier: 4 };
    const priced = withAdjustedPrice(item, 'crypt', 1, { markupMin: 1, markupMax: 1 });
    assert.strictEqual(priced.id, 7);
    assert.strictEqual(priced.name, 'Test Item');
    assert.strictEqual(priced.adjustedPrice, 175);
});
QUnit.module('combatEngine');
QUnit.test.each(
    'applyDamage deterministic cases',
    [
        [{ block: 0 }, 10, true, { damageTaken: 10, blocked: 0 }],
        [{ block: 5 }, 10, true, { damageTaken: 5, blocked: 5 }],
        [{ block: 10 }, 5, true, { damageTaken: 0, blocked: 5 }],
        [{ block: 0 }, 10, false, { damageTaken: 10, blocked: 0 }]
    ],
    (assert, [target, amount, blockable, expected]) => {
        const actual = applyDamage(target, amount, blockable);
        assert.deepEqual(actual, expected);
    }
);

QUnit.module('CombatSession basic methods');

QUnit.test.each(
    'setTurnOwner cases',
    [
        [TURN_OWNERS.PLAYER, true, TURN_OWNERS.PLAYER],
        [TURN_OWNERS.ENEMY, true, TURN_OWNERS.ENEMY],
        ['player', true, TURN_OWNERS.PLAYER],
        ['enemy', true, TURN_OWNERS.ENEMY],
        ['invalid', false, TURN_OWNERS.PLAYER]
    ],
    (assert, [nextOwner, expectedResult, expectedOwner]) => {
        const session = new CombatSession();
        session.turnOwner = TURN_OWNERS.PLAYER;
        const result = session.setTurnOwner(nextOwner);
        assert.strictEqual(result, expectedResult);
        assert.strictEqual(session.turnOwner, expectedOwner);
    }
);

QUnit.test.each(
    'getMaxCardsThisTurn cases',
    [
        [5, 0, 5],
        [5, 2, 7],
        [0, 0, 0],
        [3, -5, 0],
        [1, 10, 11]
    ],
    (assert, [baseCards, bonusCards, expected]) => {
        const session = new CombatSession();
        session.turnRules.baseCardsPerTurn = baseCards;
        session.turnRules.bonusCardsThisTurn = bonusCards;
        assert.strictEqual(session.getMaxCardsThisTurn(), expected);
    }
);

QUnit.test.each(
    'getRemainingCardPlays cases',
    [
        [5, 0, 0, 5],
        [5, 0, 3, 2],
        [5, 0, 5, 0],
        [5, 0, 7, 0],
        [3, 2, 2, 3],
        [5, 3, 1, 7]
    ],
    (assert, [baseCards, bonusCards, played, expected]) => {
        const session = new CombatSession();
        session.turnRules.baseCardsPerTurn = baseCards;
        session.turnRules.bonusCardsThisTurn = bonusCards;
        session.turnRules.cardsPlayedThisTurn = played;
        assert.strictEqual(session.getRemainingCardPlays(), expected);
    }
);

QUnit.test.each(
    '_clamp cases',
    [
        [5, 0, 10, 5],
        [-5, 0, 10, 0],
        [15, 0, 10, 10],
        [420, 2, 8, 8],
        [null, 1, 9, 1],
        [undefined, 1, 9, 1],
        ['5', 0, 10, 0]
    ],
    (assert, [value, min, max, expected]) => {
        const session = new CombatSession();
        assert.strictEqual(session._clamp(value, min, max), expected);
    }
);
