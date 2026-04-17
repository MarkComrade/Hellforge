/**
 * test_cards.js — run with:  node test_cards.js
 *
 * Tests:
 * 1. Register a temp user.
 * 2. Give them gold.
 * 3. Buy the same weapon (weaponId=1, Rusty Sword) 3 times.
 * 4. Drop loot that produces the same armor (armorId=2, Rusty Chestplate) 3 times
 *    by calling insertIntoLoadout directly.
 * 5. Read all loadout items + instances + cards from DB and assert every
 *    non-misc item has exactly 5 unique-instance cards.
 * 6. Delete one item and verify IDs compact (no gaps) and remaining items keep their cards.
 * 7. Delete the temp user and clean up.
 */

require('dotenv').config();

const {
    pool,
    registerUser,
    deleteUser,
    addGoldToInventory,
    purchaseItemToLoadout,
    insertIntoLoadout,
    getLoadout,
    deleteFromLoadout
} = require('./sql/database.js');
const { pickCardsForItem } = require('./services/cardPool.js');

const TEST_USER = `__test_cards_${Date.now()}`;
const TEST_PASS = 'testpass99';

let passed = 0;
let failed = 0;

function assert(condition, label) {
    if (condition) {
        console.log(`  ✓  ${label}`);
        passed++;
    } else {
        console.error(`  ✗  ${label}`);
        failed++;
    }
}

async function cleanupUser() {
    try {
        await deleteUser(TEST_USER);
    } catch (_) {}
}

async function run() {
    console.log('\n=== HELLFORGE card-instance test ===\n');

    // ── 1. Register ──────────────────────────────────────────────────────────
    console.log('[1] Register temp user');
    const reg = await registerUser(TEST_USER, TEST_PASS);
    assert(reg.success, `registerUser succeeded (userId=${reg.userId})`);
    if (!reg.success) {
        console.error('    Cannot continue without a user.');
        await pool.end();
        return;
    }
    const playerId = reg.userId;

    // ── 2. Give gold ─────────────────────────────────────────────────────────
    console.log('\n[2] Add 9999 gold to loadout');
    const gold = await addGoldToInventory(playerId, 9999);
    assert(gold.success, 'addGoldToInventory succeeded');

    // ── 3. Buy same weapon (weaponId=1 = Rusty Sword, Melee T1) 3 times ─────
    console.log('\n[3] Purchase weaponId=1 three times');
    for (let i = 1; i <= 3; i++) {
        const r = await purchaseItemToLoadout(playerId, 1, 'weapon', 5);
        assert(r.success, `purchase #${i} succeeded`);
    }

    // ── 4. Insert same armor via loot pipeline 3 times ───────────────────────
    console.log('\n[4] Insert armorId=2 (Rusty Chestplate, Armor T1) via insertIntoLoadout x3');
    for (let i = 1; i <= 3; i++) {
        const cards = pickCardsForItem('Armor', 1);
        assert(cards.length === 5, `pickCardsForItem returned 5 cards (run ${i})`);
        const r = await insertIntoLoadout(playerId, 'armor', 2, cards);
        assert(r.success, `insertIntoLoadout armor #${i} succeeded`);
    }

    // ── 5. Read back and verify ───────────────────────────────────────────────
    console.log('\n[5] Verify every non-misc loadout item has 5 cards and a unique instance_id');
    const { success, loadout } = await getLoadout(playerId);
    assert(success, 'getLoadout succeeded');

    // Filter to items that should have instances (armor/weapon, not misc, not gold)
    const gearItems = (loadout || []).filter((i) => i.armor_id || i.weapon_id);
    assert(gearItems.length >= 6, `at least 6 gear items in loadout (found ${gearItems.length})`);

    const instanceIds = new Set();
    for (const item of gearItems) {
        const name = item.armor_name || item.weapon_name || '?';
        assert(item.instance_id != null, `"${name}" has an instance_id (${item.instance_id})`);
        assert(!instanceIds.has(item.instance_id), `instance_id ${item.instance_id} is unique`);
        instanceIds.add(item.instance_id);
        assert(
            Array.isArray(item.cards) && item.cards.length === 5,
            `"${name}" (instance ${item.instance_id}) has exactly 5 cards (got ${item.cards?.length ?? 0})`
        );
    }

    // ── 6. Delete one item and verify re-indexing (no gaps, cards intact) ───
    console.log('\n[6] Delete one loadout item, verify IDs compact and remaining cards survive');

    // Grab a fresh loadout to get real loadoutIds
    const before = await getLoadout(playerId);
    const toDelete = before.loadout.find((i) => i.weapon_id != null);
    assert(toDelete != null, 'found a weapon item to delete');

    // Grab current instance count before deletion
    const [beforeInstances] = await pool.query(
        'SELECT instanceId FROM item_instances ORDER BY instanceId ASC'
    );
    const countBefore = beforeInstances.length;

    const delResult = await deleteFromLoadout(playerId, toDelete.loadoutId);
    assert(delResult.success, `deleteFromLoadout(${toDelete.loadoutId}) succeeded`);

    // After compaction, no gaps in item_instances
    const [allInstances] = await pool.query(
        'SELECT instanceId FROM item_instances ORDER BY instanceId ASC'
    );
    assert(
        allInstances.length === countBefore - 1,
        `instance count decreased by 1 (was ${countBefore}, now ${allInstances.length})`
    );

    let gapFree = true;
    for (let i = 0; i < allInstances.length; i++) {
        if (allInstances[i].instanceId !== i + 1) {
            gapFree = false;
            break;
        }
    }
    assert(
        gapFree,
        `item_instances IDs are gap-free after deletion (count=${allInstances.length})`
    );

    // Every remaining instance still has 5 cards
    console.log('\n[6b] Verify remaining items still have 5 cards after re-index');
    const after = await getLoadout(playerId);
    const remainingGear = (after.loadout || []).filter((i) => i.armor_id || i.weapon_id);
    for (const item of remainingGear) {
        const name = item.armor_name || item.weapon_name || '?';
        assert(
            Array.isArray(item.cards) && item.cards.length === 5,
            `"${name}" (instance ${item.instance_id}) still has 5 cards after re-index`
        );
    }

    // ── 7. Verify directly in DB after re-index ───────────────────────────────
    console.log('\n[7] Cross-check item_instance_cards in DB after re-index');
    const [dbCards] = await pool.query(
        `SELECT ii.instanceId, COUNT(iic.id) AS card_count
         FROM item_instances ii
         JOIN player_loadout pl ON pl.instance_id = ii.instanceId
         LEFT JOIN item_instance_cards iic ON iic.instance_id = ii.instanceId
         WHERE pl.playerId = ?
         GROUP BY ii.instanceId`,
        [playerId]
    );
    for (const row of dbCards) {
        assert(
            Number(row.card_count) === 5,
            `DB: instance ${row.instanceId} has ${row.card_count} card rows`
        );
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    console.log('\n[8] Cleanup');
    await cleanupUser();
    console.log('  Temp user deleted.');

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
    await pool.end();
    process.exit(failed > 0 ? 1 : 0);
}

run().catch(async (err) => {
    console.error('Unhandled error:', err);
    await cleanupUser();
    await pool.end();
    process.exit(1);
});
