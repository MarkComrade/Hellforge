const { normalizeDungeonType } = require('../api/combatApi.js');
const { applyDamage, resolveCard, endPlayerTurn } = require('../services/combatEngine.js');
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

// ═══════════════════════════════════════════════════════════════════════════════
// COMBAT ENGINE — FULL LOGIC TESTS
//
// Calculation reference:
//   weaponMult  = Math.max(1, Math.pow(gearSum / 2, 0.55))
//   directDmg   = Math.floor(base * weaponMult * vulnMult / defenseMult)
//   dotTick     = Math.max(1, Math.floor(atkMult + Math.floor(maxHp * 0.05)))
//   detonation  = Math.floor(tickDmg * stacks * 0.5)
//   lifestealHP = Math.floor(damageTaken * pct / 100)
//   reflected   = Math.max(1, Math.floor(total * pct / 100))
//
// Gear sums used (melee + ranged attack_multiplier from DB):
//   T1: 1.0 + 1.0 = 2.0   weaponMult = (2/2)^0.55  = 1.0000
//   T3: 1.65+ 1.55= 3.2   weaponMult = (3.2/2)^0.55 ≈ 1.2950
//   T4: 2.2 + 2.0 = 4.2   weaponMult = (4.2/2)^0.55 ≈ 1.5039
//   T6: 3.6 + 3.2 = 6.8   weaponMult = (6.8/2)^0.55 ≈ 1.9603
// ═══════════════════════════════════════════════════════════════════════════════

// ── Mirror of engine formulas (for computing expected values in tests) ────────
function wMult(gearSum) {
    return Math.max(1, Math.pow(gearSum / 2, 0.55));
}
function dotTick(atkMult, targetMaxHp) {
    return Math.max(1, Math.floor(atkMult + Math.floor(targetMaxHp * 0.05)));
}
function directDmg(base, weaponMultiplier, vulnMultiplier = 1, defenseMult = 1) {
    return Math.floor((base * weaponMultiplier * vulnMultiplier) / defenseMult);
}

// ── Session factory ───────────────────────────────────────────────────────────
// isPlayer=true → player is attacker (applies the DoT to the enemy)
// isPlayer=false → enemy is attacker (applies DoT to player)
function makeSession({
    playerHp = 100,
    playerMaxHp = 100,
    enemyHp = 100,
    enemyMaxHp = 100,
    snap = {}
} = {}) {
    const defaultSnap = {
        attackMultiplier: 2,
        meleeMultiplier: 1,
        rangedMultiplier: 1,
        defenseMultiplier: 1
    };
    const session = new CombatSession({
        playerMaxHp,
        playerCurrentHp: playerHp,
        equipmentSnapshot: Object.assign(defaultSnap, snap)
    });
    session.setEnemies([
        {
            archetype: 'Dummy',
            hp: enemyHp,
            maxHp: enemyMaxHp,
            cards: [],
            cardsPerTurn: { min: 0, max: 0 }
        }
    ]);
    session.deck.hand = [{ id: 8 }, { id: 8 }, { id: 8 }, { id: 8 }];
    session.deck.drawPile = Array.from({ length: 20 }, () => ({ id: 8 }));
    return session;
}
function putCard(session, id, slot = 0) {
    session.deck.hand[slot] = { id };
}
function addEnemyAttack(session, damage, index = 0) {
    session.enemies[index].cards = [{ name: 'Attack', effects: { damage }, likelihood: 1 }];
    session.enemies[index].cardsPerTurn = { min: 1, max: 1 };
}

// ── Card reference ────────────────────────────────────────────────────────────
//   id:1   melee  single  {damage:3, bleed:1}
//   id:5   melee  single  {damage:2, bleed:2}
//   id:6   melee  self    {block:4}
//   id:7   melee  self    {extraPlays:2, backfire:8}
//   id:8   melee  single  {damage:4}
//   id:64  ranged single  {damage:2, scorch:1}
//   id:126 helmet self    {healing:2, regen:1}
//   id:306 melee  single  {damage:3, vulnerable:{pct:10,turns:1}}
//   id:347 melee  single  {damage:14, lifesteal:{pct:30,turns:2}}
//   id:361 melee  self    {block:5, deflect:{pct:8,turns:2}}
//   id:363 melee  all     {damage:8, bleed:2}
//   id:568 helmet self    {cleanse:true}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. weaponMult curve
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — weaponMult curve');

QUnit.test('T1 gear sum=2.0: (2/2)^0.55 = 1.0 (no scaling)', (assert) => {
    // max(1, (2/2)^0.55) = max(1, 1) = 1.0
    assert.strictEqual(wMult(2.0), 1.0);
});

QUnit.test('T3 gear sum=3.2: (3.2/2)^0.55 = 1.6^0.55 ≈ 1.295', (assert) => {
    const m = wMult(3.2);
    // 1.6^0.55 = exp(0.55 * ln(1.6)) = exp(0.55 * 0.4700) = exp(0.2585) ≈ 1.2950
    assert.ok(m >= 1.29 && m <= 1.31, `got ${m}, expected ≈ 1.295`);
});

QUnit.test('T4 gear sum=4.2: (4.2/2)^0.55 = 2.1^0.55 ≈ 1.504', (assert) => {
    const m = wMult(4.2);
    // exp(0.55 * ln(2.1)) = exp(0.55 * 0.7419) = exp(0.4081) ≈ 1.5039
    assert.ok(m >= 1.5 && m <= 1.51, `got ${m}, expected ≈ 1.504`);
});

QUnit.test('T6 gear sum=6.8: (6.8/2)^0.55 = 3.4^0.55 ≈ 1.960', (assert) => {
    const m = wMult(6.8);
    // exp(0.55 * ln(3.4)) = exp(0.55 * 1.2238) = exp(0.6731) ≈ 1.9603
    assert.ok(m >= 1.95 && m <= 1.97, `got ${m}, expected ≈ 1.960`);
});

QUnit.test('gear sum below 2.0 is clamped to 1.0 (no negative scaling)', (assert) => {
    // min possible real sum = 1.0 (if only one weapon equipped); max(1, (1/2)^0.55) = max(1, 0.68) = 1
    assert.strictEqual(wMult(1.0), 1.0);
    assert.strictEqual(wMult(0), 1.0);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Direct damage: weapon scaling
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — direct damage weapon scaling');

QUnit.test('T1 gear, card 8 damage:4 → floor(4 × 1.0) = 4', (assert) => {
    // weaponMult = 1.0, no vuln, no str → 4
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 96, `expected 96 (100 - 4)`);
});

QUnit.test('T4 gear, card 8 damage:4 → floor(4 × 1.5039) = floor(6.016) = 6', (assert) => {
    // weaponMult = wMult(4.2) ≈ 1.5039, floor(4 * 1.5039) = floor(6.0156) = 6
    const expected = directDmg(4, wMult(4.2));
    assert.strictEqual(expected, 6, `formula gives ${expected}`);
    const session = makeSession({ snap: { attackMultiplier: 4.2 } });
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 100 - expected);
});

QUnit.test('T6 gear, card 8 damage:4 → floor(4 × 1.9603) = floor(7.841) = 7', (assert) => {
    // weaponMult = wMult(6.8) ≈ 1.9603, floor(4 * 1.9603) = 7
    const expected = directDmg(4, wMult(6.8));
    assert.strictEqual(expected, 7, `formula gives ${expected}`);
    const session = makeSession({ snap: { attackMultiplier: 6.8 } });
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 100 - expected);
});

QUnit.test('T6 gear, 10-base damage → floor(10 × 1.9603) = 19 (never doubles)', (assert) => {
    // Confirms the user-defined max ≈ 19.8 damage on 10-base at T6
    const expected = directDmg(10, wMult(6.8));
    assert.strictEqual(expected, 19);
    // Stays below ×2.0 of base
    assert.ok(expected < 20, 'T6 should not quite double a 10-base card');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Strength: added to base BEFORE weapon multiplier
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — strength');

QUnit.test('T1 gear, strength=5, card damage:4 → floor((4+5) × 1.0) = 9', (assert) => {
    // strength adds before mult: (4+5)*1.0 = 9
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.player.strength = 5;
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 91, `expected 91 (100 - 9)`);
});

QUnit.test(
    'T6 gear, strength=5, card damage:4 → floor((4+5) × 1.9603) = floor(17.64) = 17',
    (assert) => {
        // (4+5) * wMult(6.8) = 9 * 1.9603 = 17.64 → floor = 17
        const expected = directDmg(9, wMult(6.8)); // base=4+5=9
        assert.strictEqual(expected, 17);
        const session = makeSession({ snap: { attackMultiplier: 6.8 } });
        session.player.strength = 5;
        resolveCard(session, 0, 0);
        assert.strictEqual(session.enemies[0].hp, 100 - expected);
    }
);

QUnit.test('strength resets to 0 at the start of the next player turn', (assert) => {
    const session = makeSession();
    session.player.strength = 8;
    endPlayerTurn(session);
    assert.strictEqual(session.player.strength, 0);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Vulnerable: applied BEFORE multiplier, stacks with weapon mult
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — vulnerable');

QUnit.test('T1, card 8 damage:4, +25% vuln → floor(4 × 1.0 × 1.25) = 5', (assert) => {
    // floor(4 * 1.0 * 1.25) = floor(5) = 5
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].statuses.push({ type: 'vulnerable', pct: 25, turns: 1 });
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 95);
});

QUnit.test(
    'T6, card 8 damage:4, +25% vuln → floor(4 × 1.9603 × 1.25) = floor(9.80) = 9',
    (assert) => {
        // 4 * 1.9603 * 1.25 = 9.8015 → floor = 9
        const expected = directDmg(4, wMult(6.8), 1.25);
        assert.strictEqual(expected, 9);
        const session = makeSession({ snap: { attackMultiplier: 6.8 } });
        session.enemies[0].statuses.push({ type: 'vulnerable', pct: 25, turns: 1 });
        resolveCard(session, 0, 0);
        assert.strictEqual(session.enemies[0].hp, 100 - expected);
    }
);

QUnit.test('vulnerable decrements by 1 each turn and expires', (assert) => {
    const session = makeSession();
    session.enemies[0].statuses.push({ type: 'vulnerable', pct: 20, turns: 1 });
    endPlayerTurn(session);
    // After the turn the 1-turn vulnerable should be pruned
    assert.strictEqual(
        session.enemies[0].statuses.find((s) => s.type === 'vulnerable'),
        undefined
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Defense multiplier: divides enemy incoming damage
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — defense multiplier');

QUnit.test(
    'T1 defense (1.0): enemy 10 dmg passes through unchanged → floor(10/1.0) = 10',
    (assert) => {
        const session = makeSession({ snap: { defenseMultiplier: 1.0 } });
        addEnemyAttack(session, 10);
        endPlayerTurn(session);
        assert.strictEqual(session.player.hp, 90);
    }
);

QUnit.test('T4 defense (1.80): enemy 10 dmg → floor(10/1.80) = floor(5.55) = 5', (assert) => {
    // Mythical Helmet 1.65 + Mythical Armor 1.95 = 3.60 / 2 = 1.80
    const expected = Math.floor(10 / 1.8); // = 5
    assert.strictEqual(expected, 5);
    const session = makeSession({ snap: { defenseMultiplier: 1.8 } });
    addEnemyAttack(session, 10);
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 100 - expected);
});

QUnit.test('T6 defense (3.10): enemy 10 dmg → floor(10/3.10) = floor(3.22) = 3', (assert) => {
    // Hellish Helmet 2.8 + Hellish Armor 3.4 = 6.2 / 2 = 3.1
    const expected = Math.floor(10 / 3.1); // = 3
    assert.strictEqual(expected, 3);
    const session = makeSession({ snap: { defenseMultiplier: 3.1 } });
    addEnemyAttack(session, 10);
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 100 - expected);
});

QUnit.test('defense does not affect player outgoing damage (only incoming)', (assert) => {
    // High defense should have no effect on card the player plays
    const session = makeSession({ snap: { attackMultiplier: 2.0, defenseMultiplier: 5.0 } });
    resolveCard(session, 0, 0); // card 8: damage:4, T1 weaponMult=1
    assert.strictEqual(session.enemies[0].hp, 96); // still 100-4, not scaled by defense
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DoT tick values
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — DoT tick values');

QUnit.test(
    'player bleed on enemy, T1 gear (atkMult=2), enemy maxHp=100 → floor(2+5) = 7',
    (assert) => {
        // atkMult = attackMultiplier = 2.0
        // pctDmg = floor(100 * 0.05) = 5
        // tick = max(1, floor(2.0 + 5)) = 7
        const expected = dotTick(2.0, 100);
        assert.strictEqual(expected, 7);
        const session = makeSession({ snap: { attackMultiplier: 2.0 } });
        session.enemies[0].statuses.push({ type: 'bleed', stacks: 1 });
        endPlayerTurn(session);
        assert.strictEqual(session.enemies[0].hp, 100 - expected);
    }
);

QUnit.test(
    'player bleed on enemy, T6 gear (atkMult=6.8), enemy maxHp=100 → floor(6.8+5) = floor(11.8) = 11',
    (assert) => {
        // Critical: 6.8 is a float; floor(11.8) = 11, not 11.8
        const expected = dotTick(6.8, 100);
        assert.strictEqual(expected, 11, 'float atkMult must be floored, no fractional damage');
        const session = makeSession({ snap: { attackMultiplier: 6.8 } });
        session.enemies[0].statuses.push({ type: 'bleed', stacks: 1 });
        endPlayerTurn(session);
        assert.strictEqual(session.enemies[0].hp, 100 - expected);
    }
);

QUnit.test('enemy bleed on player always uses atkMult=1 → floor(1+5) = 6', (assert) => {
    // Enemies have no equipment, isPlayer=false → atkMult=1
    const expected = dotTick(1, 100);
    assert.strictEqual(expected, 6);
    const session = makeSession({ playerHp: 100, snap: { attackMultiplier: 6.8 } }); // high gear should NOT affect enemy DoT
    session.player.statuses.push({ type: 'bleed', stacks: 1 });
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 100 - expected, 'player gear does not boost enemy DoT');
});

QUnit.test(
    'DoT tick scales with enemy maxHp (5% component), T1, maxHp=200 → floor(2+10) = 12',
    (assert) => {
        // pctDmg = floor(200 * 0.05) = 10, tick = max(1, floor(2 + 10)) = 12
        const expected = dotTick(2.0, 200);
        assert.strictEqual(expected, 12);
        const session = makeSession({
            enemyHp: 200,
            enemyMaxHp: 200,
            snap: { attackMultiplier: 2.0 }
        });
        session.enemies[0].statuses.push({ type: 'bleed', stacks: 1 });
        endPlayerTurn(session);
        assert.strictEqual(session.enemies[0].hp, 200 - expected);
    }
);

QUnit.test('DoT tick is unblockable: full tick damage applied even with prior block', (assert) => {
    // startEnemyTurn() resets enemy block to 0 before DoT fires (correct turn flow).
    // The key assertion: HP is reduced by the full tickDmg, not max(0, tickDmg - block).
    const tick = dotTick(2.0, 100); // 7
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].block = 20; // cleared by startEnemyTurn before DoT fires
    session.enemies[0].statuses.push({ type: 'bleed', stacks: 1 });
    endPlayerTurn(session);
    assert.strictEqual(
        session.enemies[0].hp,
        100 - tick,
        'full tick damage taken — block did not reduce it'
    );
});

QUnit.test('scorch ticks identically to bleed', (assert) => {
    const expected = dotTick(2.0, 100); // 7
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].statuses.push({ type: 'scorch', stacks: 1 });
    endPlayerTurn(session);
    assert.strictEqual(session.enemies[0].hp, 100 - expected);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 7. DoT stack drain over multiple turns
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — DoT stack drain');

QUnit.test('bleed:3 on enemy drains 3 ticks over 3 turns, each tick = 7 (T1, 100hp)', (assert) => {
    // tick = 7, total over 3 turns = 21
    const tick = dotTick(2.0, 100); // 7
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].statuses.push({ type: 'bleed', stacks: 3 });

    endPlayerTurn(session); // turn 1 tick: hp 100→93, stacks 3→2
    assert.strictEqual(session.enemies[0].hp, 100 - tick, 'after turn 1');
    assert.strictEqual(session.enemies[0].statuses.find((s) => s.type === 'bleed').stacks, 2);

    endPlayerTurn(session); // turn 2 tick: hp 93→86, stacks 2→1
    assert.strictEqual(session.enemies[0].hp, 100 - tick * 2, 'after turn 2');
    assert.strictEqual(session.enemies[0].statuses.find((s) => s.type === 'bleed').stacks, 1);

    endPlayerTurn(session); // turn 3 tick: hp 86→79, stacks 1→0→pruned
    assert.strictEqual(session.enemies[0].hp, 100 - tick * 3, 'after turn 3');
    assert.strictEqual(
        session.enemies[0].statuses.find((s) => s.type === 'bleed'),
        undefined,
        'bleed pruned after last tick'
    );
});

QUnit.test('new bleed stacks reapplied mid-fight continue from accumulated value', (assert) => {
    // Apply bleed:1, tick once → apply bleed:2 more → total stacks should be 2
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].statuses.push({ type: 'bleed', stacks: 1 });
    endPlayerTurn(session); // tick, stacks 1→0→pruned
    assert.strictEqual(
        session.enemies[0].statuses.find((s) => s.type === 'bleed'),
        undefined
    );

    // Reapply
    putCard(session, 5); // bleed:2
    resolveCard(session, 0, 0);
    const bleed = session.enemies[0].statuses.find((s) => s.type === 'bleed');
    assert.strictEqual(bleed.stacks, 2);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. Detonation
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — detonation');

QUnit.test(
    'scorch applied to bleeding enemy detonates bleed at 50%: bleed:3, tickDmg=7 → floor(7×3×0.5)=10',
    (assert) => {
        // T1 gear, enemy 100hp:
        //   tick = dotTick(2.0, 100) = 7
        //   detonation = floor(7 * 3 * 0.5) = floor(10.5) = 10
        //   card 64 (ranged, damage:2, scorch:1): direct = floor(2 * wMult(2)) = 2
        //   enemy HP: 100 - 2 (direct) - 10 (detonation) = 88
        const tick = dotTick(2.0, 100); // 7
        const det = Math.floor(tick * 3 * 0.5); // 10
        const direct = directDmg(2, wMult(2.0)); // 2
        assert.strictEqual(tick, 7);
        assert.strictEqual(det, 10);

        const session = makeSession({ snap: { attackMultiplier: 2.0 } });
        session.enemies[0].statuses.push({ type: 'bleed', stacks: 3 });
        putCard(session, 64); // scorch:1 → triggers detonation
        resolveCard(session, 0, 0);

        assert.strictEqual(session.enemies[0].hp, 100 - direct - det);
        assert.strictEqual(
            session.enemies[0].statuses.find((s) => s.type === 'bleed'),
            undefined,
            'bleed removed'
        );
        assert.ok(
            session.enemies[0].statuses.find((s) => s.type === 'scorch'),
            'scorch applied after'
        );
    }
);

QUnit.test(
    'bleed applied to scorched enemy detonates scorch at 50%: scorch:4, tickDmg=7 → floor(7×4×0.5)=14',
    (assert) => {
        // tick = 7, detonation = floor(7*4*0.5) = floor(14) = 14
        // card 1 (melee, damage:3, bleed:1): direct = floor(3 * wMult(2)) = 3
        // enemy HP: 100 - 3 - 14 = 83
        const tick = dotTick(2.0, 100); // 7
        const det = Math.floor(tick * 4 * 0.5); // 14
        const direct = directDmg(3, wMult(2.0)); // 3

        const session = makeSession({ snap: { attackMultiplier: 2.0 } });
        session.enemies[0].statuses.push({ type: 'scorch', stacks: 4 });
        putCard(session, 1); // bleed:1 → triggers detonation
        resolveCard(session, 0, 0);

        assert.strictEqual(session.enemies[0].hp, 100 - direct - det);
        assert.strictEqual(
            session.enemies[0].statuses.find((s) => s.type === 'scorch'),
            undefined,
            'scorch removed'
        );
        assert.ok(
            session.enemies[0].statuses.find((s) => s.type === 'bleed'),
            'bleed applied after'
        );
    }
);

QUnit.test('detonation damage is unblockable (bypasses enemy block)', (assert) => {
    // Enemy has block:50 — detonation still goes through
    const tick = dotTick(2.0, 100); // 7
    const det = Math.floor(tick * 2 * 0.5); // 7
    const direct = directDmg(3, wMult(2.0)); // 3 — this DOES get blocked (blockable=true)
    // direct hit: min(3, 50) = 3 blocked → enemy takes 0 direct damage
    // detonation: unblockable → enemy takes 7

    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].block = 50;
    session.enemies[0].statuses.push({ type: 'scorch', stacks: 2 });
    putCard(session, 1); // damage:3, bleed:1
    resolveCard(session, 0, 0);

    // direct: fully blocked (block 50 >= 3), HP unchanged from direct
    // detonation: 7 damage through block
    assert.strictEqual(session.enemies[0].hp, 100 - det, 'only detonation damage taken');
    assert.strictEqual(session.enemies[0].block, 50 - direct, 'block reduced only by direct hit');
});

QUnit.test('detonation uses T6 weapon scaling: tick = dotTick(6.8, 100) = 11', (assert) => {
    // T6: atkMult=6.8, tick=11, bleed:2 detonation=floor(11*2*0.5)=11
    const tick = dotTick(6.8, 100); // 11
    const det = Math.floor(tick * 2 * 0.5); // 11
    const direct = directDmg(2, wMult(6.8)); // floor(2*1.9603) = 3

    const session = makeSession({ snap: { attackMultiplier: 6.8 } });
    session.enemies[0].statuses.push({ type: 'bleed', stacks: 2 });
    putCard(session, 64); // ranged: damage:2, scorch:1
    resolveCard(session, 0, 0);

    assert.strictEqual(session.enemies[0].hp, 100 - direct - det);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 9. Lifesteal
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — lifesteal');

QUnit.test('T1, card 347 damage:14, lifesteal:30% → deal 14, heal floor(14×0.30)=4', (assert) => {
    // weaponMult = 1.0, scaled = 14, heal = floor(14 * 30/100) = floor(4.2) = 4
    const session = makeSession({ playerHp: 70, snap: { attackMultiplier: 2.0 } });
    putCard(session, 347); // damage:14, lifesteal:{pct:30,turns:2}
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 86, '14 damage dealt');
    assert.strictEqual(session.player.hp, 74, '70 + 4 heal = 74');
});

QUnit.test(
    'T6, card 347 damage:14, lifesteal:30% → deal floor(14×1.9603)=27, heal floor(27×0.30)=8',
    (assert) => {
        // scaled = floor(14 * wMult(6.8)) = floor(14 * 1.9603) = floor(27.444) = 27
        // heal = floor(27 * 30/100) = floor(8.1) = 8
        const scaled = directDmg(14, wMult(6.8)); // 27
        const heal = Math.floor(scaled * 0.3); // 8
        assert.strictEqual(scaled, 27);
        assert.strictEqual(heal, 8);
        const session = makeSession({ playerHp: 70, snap: { attackMultiplier: 6.8 } });
        putCard(session, 347);
        resolveCard(session, 0, 0);
        assert.strictEqual(session.enemies[0].hp, 100 - scaled);
        assert.strictEqual(session.player.hp, 70 + heal);
    }
);

QUnit.test('lifesteal does not over-heal above maxHp', (assert) => {
    const session = makeSession({
        playerHp: 99,
        playerMaxHp: 100,
        snap: { attackMultiplier: 2.0 }
    });
    putCard(session, 347); // heals 4 → should cap at 100
    resolveCard(session, 0, 0);
    assert.strictEqual(session.player.hp, 100, 'should not exceed maxHp');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. Deflect
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — deflect');

QUnit.test('deflect 30%, enemy hits 20 → reflected = max(1, floor(20×0.30)) = 6', (assert) => {
    // player takes 20 damage, reflects floor(20 * 30/100) = 6 back
    // turns:1 works because tickTurnStatuses now runs AFTER enemy attacks
    const session = makeSession({ playerHp: 100 });
    session.player.statuses.push({ type: 'deflect', pct: 30, turns: 1 });
    addEnemyAttack(session, 20);
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 80, 'player takes 20');
    assert.strictEqual(session.enemies[0].hp, 94, 'enemy takes 6 reflected');
});

QUnit.test('player block reduces incoming before deflect reflects post-block total', (assert) => {
    // player has 5 block, enemy hits 20: damageTaken=15, blocked=5
    // deflect 50%: reflects floor((15+5) * 0.50) = 10
    const session = makeSession({ playerHp: 100 });
    session.player.statuses.push({ type: 'deflect', pct: 50, turns: 1 });
    session.player.block = 5;
    addEnemyAttack(session, 20);
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 85, 'player takes 15 (5 blocked)');
    assert.strictEqual(session.enemies[0].hp, 90, 'enemy takes 10 (50% of 20 total)');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. Block lifetime
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — block lifetime');

QUnit.test('player block absorbs damage, remainder hits HP', (assert) => {
    // player block:7, enemy hits 10: blocked 7, takes 3
    const session = makeSession({ playerHp: 100 });
    session.player.block = 7;
    addEnemyAttack(session, 10);
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 97, '10 - 7 block = 3 taken');
    assert.strictEqual(session.player.block, 0, 'block consumed to 0');
});

QUnit.test('player block resets to 0 at start of each player turn', (assert) => {
    const session = makeSession();
    putCard(session, 6); // Guard: block:4
    resolveCard(session, 0);
    assert.strictEqual(session.player.block, 4);
    endPlayerTurn(session);
    assert.strictEqual(session.player.block, 0, 'block expired at turn start');
});

QUnit.test('enemy block absorbs player direct damage (not DoT)', (assert) => {
    // enemy block:6, card 8 damage:4, T1: scaled=4 → enemy absorbs all, hp stays at 100, block=2
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].block = 6;
    resolveCard(session, 0, 0);
    assert.strictEqual(session.enemies[0].hp, 100, 'block absorbed all damage');
    assert.strictEqual(session.enemies[0].block, 2, '6-4=2 block remaining');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 12. Regen + bleed interaction
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — regen');

QUnit.test('regen fires BEFORE bleed tick on player: regen:8 + bleed:1 → net +2 HP', (assert) => {
    // Player starts at 80 HP
    // DoT phase (isPlayer=false on tickDots call, !isPlayer=true → regen fires):
    //   regen:8 → hp 80 → 88
    //   bleed:1 ticks (enemy applied it, atkMult=1): tick = dotTick(1, 100) = 6
    //   hp 88 → 82
    const tick = dotTick(1, 100); // 6
    const session = makeSession({ playerHp: 80, snap: { attackMultiplier: 2.0 } });
    session.player.statuses.push({ type: 'regen', stacks: 8 }, { type: 'bleed', stacks: 1 });
    endPlayerTurn(session);
    assert.strictEqual(session.player.hp, 80 + 8 - tick, `expected ${80 + 8 - tick}`);
});

QUnit.test('regen does NOT tick for enemies', (assert) => {
    // Enemy regen should be ignored (regen is a player-only mechanic)
    const session = makeSession({ snap: { attackMultiplier: 2.0 } });
    session.enemies[0].hp = 60;
    session.enemies[0].statuses.push({ type: 'regen', stacks: 10 });
    endPlayerTurn(session);
    assert.strictEqual(session.enemies[0].hp, 60, 'enemy HP unchanged, regen did not fire');
});

// ═══════════════════════════════════════════════════════════════════════════════
// 13. Cleanse
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — cleanse');

QUnit.test(
    'cleanse removes bleed + scorch simultaneously, leaves other statuses intact',
    (assert) => {
        const session = makeSession();
        session.player.statuses.push(
            { type: 'bleed', stacks: 3 },
            { type: 'scorch', stacks: 2 },
            { type: 'regen', stacks: 4 }
        );
        putCard(session, 568); // Clear Head: cleanse:true
        resolveCard(session, 0);
        assert.strictEqual(
            session.player.statuses.find((s) => s.type === 'bleed'),
            undefined
        );
        assert.strictEqual(
            session.player.statuses.find((s) => s.type === 'scorch'),
            undefined
        );
        assert.ok(
            session.player.statuses.find((s) => s.type === 'regen'),
            'regen preserved'
        );
    }
);

// ═══════════════════════════════════════════════════════════════════════════════
// 14. Multi-target (AoE)
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — all-target');

QUnit.test('card 363 (damage:8, bleed:2, all) hits both enemies at T4 scaling', (assert) => {
    // T4 weaponMult ≈ 1.5039, scaled = floor(8 * 1.5039) = floor(12.031) = 12
    const scaled = directDmg(8, wMult(4.2));
    assert.strictEqual(scaled, 12);

    const session = makeSession({ snap: { attackMultiplier: 4.2 } });
    session.setEnemies([
        { archetype: 'A', hp: 50, maxHp: 50, cards: [], cardsPerTurn: { min: 0, max: 0 } },
        { archetype: 'B', hp: 50, maxHp: 50, cards: [], cardsPerTurn: { min: 0, max: 0 } }
    ]);
    putCard(session, 363);
    resolveCard(session, 0);

    assert.strictEqual(session.enemies[0].hp, 50 - scaled, 'enemy A HP');
    assert.strictEqual(session.enemies[1].hp, 50 - scaled, 'enemy B HP');
    assert.strictEqual(session.enemies[0].statuses.find((s) => s.type === 'bleed').stacks, 2);
    assert.strictEqual(session.enemies[1].statuses.find((s) => s.type === 'bleed').stacks, 2);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 15. Multi-turn scripted fight — full HP tracking
//
// Setup:
//   Player: 100 HP, T4 gear (attackMultiplier=4.2, defenseMultiplier=1.8)
//   Enemy:  100 HP, passive (no cards)
//   weaponMult = wMult(4.2) ≈ 1.5039
//
// Turn 1: play card 1 (damage:3, bleed:1)
//   direct = floor(3 × 1.5039) = floor(4.5117) = 4  →  enemy: 96
//   end turn → enemy bleed:1 ticks: dotTick(4.2, 100) = floor(4.2+5) = floor(9.2) = 9
//              enemy: 96 - 9 = 87   bleed pruned
//
// Turn 2: play card 64 (damage:2, scorch:1)
//   direct = floor(2 × 1.5039) = floor(3.007) = 3  →  enemy: 84
//   end turn → enemy scorch:1 ticks: dotTick(4.2, 100) = 9
//              enemy: 84 - 9 = 75   scorch pruned
//
// Turn 3: play card 8 (damage:4)
//   direct = floor(4 × 1.5039) = floor(6.016) = 6  →  enemy: 69
//   end turn → no DoTs  →  enemy stays at 69
// ═══════════════════════════════════════════════════════════════════════════════
QUnit.module('combat math — multi-turn scripted fight');

QUnit.test('3-turn fight: all HP values match step-by-step calculations', (assert) => {
    const GEAR_SUM = 4.2;
    const DEF_MULT = 1.8;
    const wm = wMult(GEAR_SUM); // ≈ 1.5039
    const tick = dotTick(GEAR_SUM, 100); // floor(4.2 + 5) = 9

    const session = makeSession({
        playerHp: 100,
        playerMaxHp: 100,
        enemyHp: 100,
        enemyMaxHp: 100,
        snap: { attackMultiplier: GEAR_SUM, defenseMultiplier: DEF_MULT }
    });

    // ── Turn 1 ──────────────────────────────────────────────────────────────
    putCard(session, 1); // Rusty Slash: damage:3, bleed:1
    const t1_direct = directDmg(3, wm); // 4
    resolveCard(session, 0, 0);
    assert.strictEqual(
        session.enemies[0].hp,
        100 - t1_direct,
        `T1 after card: enemy ${100 - t1_direct}`
    );

    endPlayerTurn(session); // bleed:1 ticks (9), pruned
    const t1_hp = 100 - t1_direct - tick;
    assert.strictEqual(session.enemies[0].hp, t1_hp, `T1 after tick: enemy ${t1_hp}`);
    assert.strictEqual(
        session.enemies[0].statuses.find((s) => s.type === 'bleed'),
        undefined,
        'T1: bleed pruned'
    );

    // ── Turn 2 ──────────────────────────────────────────────────────────────
    putCard(session, 64); // Scratch Shot: damage:2, scorch:1
    const t2_direct = directDmg(2, wm); // 3
    resolveCard(session, 0, 0);
    assert.strictEqual(
        session.enemies[0].hp,
        t1_hp - t2_direct,
        `T2 after card: enemy ${t1_hp - t2_direct}`
    );

    endPlayerTurn(session); // scorch:1 ticks (9), pruned
    const t2_hp = t1_hp - t2_direct - tick;
    assert.strictEqual(session.enemies[0].hp, t2_hp, `T2 after tick: enemy ${t2_hp}`);
    assert.strictEqual(
        session.enemies[0].statuses.find((s) => s.type === 'scorch'),
        undefined,
        'T2: scorch pruned'
    );

    // ── Turn 3 ──────────────────────────────────────────────────────────────
    putCard(session, 8); // Cheap Shot: damage:4
    const t3_direct = directDmg(4, wm); // 6
    resolveCard(session, 0, 0);
    assert.strictEqual(
        session.enemies[0].hp,
        t2_hp - t3_direct,
        `T3 after card: enemy ${t2_hp - t3_direct}`
    );

    endPlayerTurn(session); // no DoTs → enemy HP unchanged
    const t3_hp = t2_hp - t3_direct;
    assert.strictEqual(session.enemies[0].hp, t3_hp, `T3 after turn: enemy ${t3_hp}`);

    // ── Final state ──────────────────────────────────────────────────────────
    // Expected: 100 - 4 - 9 - 3 - 9 - 6 = 69
    const expectedFinal = 100 - t1_direct - tick - t2_direct - tick - t3_direct;
    assert.strictEqual(session.enemies[0].hp, expectedFinal, `final: enemy HP = ${expectedFinal}`);
    assert.strictEqual(session.player.hp, 100, 'player untouched (passive enemy)');
    assert.strictEqual(session.isResolved, false, 'enemy still alive');
});
