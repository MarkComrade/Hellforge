const { pickCardsForItem } = require('../../services/cardPool.js');
const { pool } = require('../core/connection.js');
const { findNextAvailableId } = require('../core/idHelpers.js');
const { createItemInstance } = require('../core/itemInstanceHelpers.js');

const LOADOUT_LIMIT = 10;

async function upgradeWeakestGearDB(weakestSlot, playerId) {
    const validSlots = ['helmet', 'armor', 'melee', 'ranged'];
    if (!validSlots.includes(weakestSlot)) {
        throw new Error(`Invalid slot: ${weakestSlot}`);
    }
    const isArmorSlot = weakestSlot === 'helmet' || weakestSlot === 'armor';
    const column = isArmorSlot ? 'armor_id' : 'weapon_id';
    const query = `UPDATE player_loadout SET \`${column}\` = \`${column}\` + 1 WHERE playerId = ? AND equipped = 1 AND slot = ?`;
    const [result] = await pool.execute(query, [playerId, weakestSlot]);
    return result;
}

async function fetchWeaponByTier(tier) {
    try {
        const [rows] = await pool.query(
            `SELECT weaponId AS id, name, type, tier, img_path
             FROM weapons
             WHERE tier = ?
             ORDER BY RAND()
             LIMIT 1`,
            [tier]
        );

        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchArmorByTier(tier) {
    try {
        const [rows] = await pool.query(
            `SELECT armorId AS id, name, type, tier, img_path
             FROM armors
             WHERE tier = ?
             ORDER BY RAND()
             LIMIT 1`,
            [tier]
        );

        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchRandomMisc() {
    try {
        const [rows] = await pool.query(
            `SELECT itemId AS id, name, img_path, value
             FROM misc_items
             ORDER BY RAND()
             LIMIT 1`
        );

        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getRandomShopItems(limit = 5) {
    try {
        const parsedLimit = Number.parseInt(limit, 10);
        const safeLimit = Number.isInteger(parsedLimit)
            ? Math.min(Math.max(parsedLimit, 1), 12)
            : 5;

        const [rows] = await pool.query(
            `SELECT *
             FROM (
                SELECT
                    'weapon' AS category,
                    weaponId AS itemId,
                    type,
                    name,
                    img_path,
                    tier,
                    price,
                    attack_multiplier,
                    NULL AS defense_multiplier
                FROM weapons

                UNION ALL

                SELECT
                    'armor' AS category,
                    armorId AS itemId,
                    type,
                    name,
                    img_path,
                    tier,
                    price,
                    NULL AS attack_multiplier,
                    defense_multiplier
                FROM armors
             ) AS shop_items
             ORDER BY -LOG(1 - RAND()) / CASE WHEN tier = 6 THEN 0.03 ELSE 1.0 END
             LIMIT ?`,
            [safeLimit]
        );

        return rows;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function insertIntoLoadout(playerId, type, itemId, cards = []) {
    try {
        let column;
        const itemDbType = type === 'weapon' ? 'weapon' : type === 'armor' ? 'armor' : 'misc';
        if (type === 'weapon') column = 'weapon_id';
        else if (type === 'armor') column = 'armor_id';
        else if (type === 'misc') column = 'misc_item_id';
        else return { success: false, message: 'Invalid item type.' };

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const instanceId = await createItemInstance(connection, itemDbType, itemId, cards);

            const loadoutId = await findNextAvailableId('player_loadout', 'loadoutId', connection);
            await connection.query(
                `INSERT INTO player_loadout (loadoutId, playerId, \`${column}\`, instance_id, equipped) VALUES (?, ?, ?, ?, 0)`,
                [loadoutId, playerId, itemId, instanceId]
            );
            await connection.commit();
            return { success: true, message: 'Item inserted into loadout.' };
        } catch (error) {
            await connection.rollback();
            console.error('insertIntoLoadout error:', error);
            return { success: false, message: 'Database error while inserting loot.' };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database error while inserting loot.' };
    }
}

async function purchaseItemToLoadout(playerId, itemId, category, price) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            'SELECT COUNT(*) AS count FROM player_loadout WHERE playerId = ? AND equipped = 0 AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)',
            [playerId]
        );
        if (Number(countRows[0].count) >= LOADOUT_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Loadout is full. Maximum 10 items allowed.' };
        }

        const [loadoutGoldRows] = await connection.query(
            'SELECT loadoutId, gold_amount FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL FOR UPDATE',
            [playerId]
        );
        const totalGold = loadoutGoldRows.reduce((sum, row) => sum + (row.gold_amount || 0), 0);

        let itemRow;
        if (category === 'weapon') {
            const [rows] = await connection.query(
                'SELECT weaponId AS id, type, tier, price FROM weapons WHERE weaponId = ?',
                [itemId]
            );
            itemRow = rows[0];
        } else {
            const [rows] = await connection.query(
                'SELECT armorId AS id, type, tier, price FROM armors WHERE armorId = ?',
                [itemId]
            );
            itemRow = rows[0];
        }

        if (!itemRow) {
            await connection.rollback();
            return { success: false, message: 'Item not found.' };
        }

        if (totalGold < price) {
            await connection.rollback();
            return {
                success: false,
                message: `Not enough gold. Need ${price}, have ${totalGold}.`
            };
        }

        let remaining = price;
        for (const row of loadoutGoldRows) {
            if (remaining <= 0) break;
            const deduct = Math.min(row.gold_amount, remaining);
            const newAmount = row.gold_amount - deduct;
            remaining -= deduct;

            if (newAmount === 0) {
                await connection.query('DELETE FROM player_loadout WHERE loadoutId = ?', [
                    row.loadoutId
                ]);
            } else {
                await connection.query(
                    'UPDATE player_loadout SET gold_amount = ? WHERE loadoutId = ?',
                    [newAmount, row.loadoutId]
                );
            }
        }

        if (category === 'weapon') {
            const generatedCards = pickCardsForItem(itemRow.type, Number(itemRow.tier));
            const instanceId = await createItemInstance(
                connection,
                'weapon',
                itemId,
                generatedCards
            );
            const newLoadoutId = await findNextAvailableId(
                'player_loadout',
                'loadoutId',
                connection
            );
            await connection.query(
                'INSERT INTO player_loadout (loadoutId, playerId, weapon_id, instance_id, equipped) VALUES (?, ?, ?, ?, 0)',
                [newLoadoutId, playerId, itemId, instanceId]
            );
        } else {
            const generatedCards = pickCardsForItem(itemRow.type, Number(itemRow.tier));
            const instanceId = await createItemInstance(
                connection,
                'armor',
                itemId,
                generatedCards
            );
            const newLoadoutId = await findNextAvailableId(
                'player_loadout',
                'loadoutId',
                connection
            );
            await connection.query(
                'INSERT INTO player_loadout (loadoutId, playerId, armor_id, instance_id, equipped) VALUES (?, ?, ?, ?, 0)',
                [newLoadoutId, playerId, itemId, instanceId]
            );
        }

        await connection.commit();
        return { success: true, remainingGold: totalGold - price };
    } catch (error) {
        await connection.rollback();
        console.error('purchaseItemToLoadout error:', error);
        return { success: false, message: 'Database error during purchase.' };
    } finally {
        connection.release();
    }
}

async function sellItemFromLoadout(playerId, loadoutId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ? AND equipped = 0 FOR UPDATE',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in loadout.' };
        }
        const loadoutItem = loadoutRows[0];

        let sellPrice = 0;
        let itemName = 'Unknown';
        let basePrice = 0;

        if (loadoutItem.armor_id) {
            const [armorRows] = await connection.query(
                'SELECT name, price FROM armors WHERE armorId = ?',
                [loadoutItem.armor_id]
            );
            if (armorRows.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Armor data not found.' };
            }
            basePrice = armorRows[0].price;
            itemName = armorRows[0].name;
        } else if (loadoutItem.weapon_id) {
            const [weaponRows] = await connection.query(
                'SELECT name, price FROM weapons WHERE weaponId = ?',
                [loadoutItem.weapon_id]
            );
            if (weaponRows.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Weapon data not found.' };
            }
            basePrice = weaponRows[0].price;
            itemName = weaponRows[0].name;
        } else if (loadoutItem.misc_item_id) {
            const [miscRows] = await connection.query(
                'SELECT name, value FROM misc_items WHERE itemId = ?',
                [loadoutItem.misc_item_id]
            );
            if (miscRows.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Misc item data not found.' };
            }
            basePrice = miscRows[0].value;
            itemName = miscRows[0].name;
        } else {
            await connection.rollback();
            return { success: false, message: 'Loadout entry has no sellable item.' };
        }

        let sellPercent = 40 + Math.floor(Math.random() * 21);
        sellPrice = Math.floor((basePrice * sellPercent) / 100);
        if (sellPrice < 1) {
            sellPrice = 1;
        }

        await connection.query('DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?', [
            loadoutId,
            playerId
        ]);

        if (loadoutItem.instance_id) {
            await connection.query('DELETE FROM item_instances WHERE instanceId = ?', [
                loadoutItem.instance_id
            ]);
        }

        const newLoadoutId = await findNextAvailableId('player_loadout', 'loadoutId', connection);
        await connection.query(
            'INSERT INTO player_loadout (loadoutId, playerId, gold_amount) VALUES (?, ?, ?)',
            [newLoadoutId, playerId, sellPrice]
        );

        const [goldRows] = await connection.query(
            'SELECT COALESCE(SUM(gold_amount), 0) AS gold FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL',
            [playerId]
        );
        let newTotalGold = goldRows[0].gold;

        await connection.commit();
        return {
            success: true,
            message: `Sold ${itemName} for ${sellPrice} gold.`,
            soldFor: sellPrice,
            itemName,
            remainingGold: newTotalGold
        };
    } catch (error) {
        await connection.rollback();
        console.error('sellItemFromLoadout error:', error);
        return { success: false, message: 'Database error during sale.' };
    } finally {
        connection.release();
    }
}

async function getItemBaseInfo(itemId, category) {
    try {
        let query;
        if (category === 'weapon') {
            query = 'SELECT price, tier FROM weapons WHERE weaponId = ?';
        } else if (category === 'armor') {
            query = 'SELECT price, tier FROM armors WHERE armorId = ?';
        } else {
            return null;
        }

        const [rows] = await pool.query(query, [itemId]);
        return rows[0] || null;
    } catch (error) {
        console.error('getItemBaseInfo error:', error);
        return null;
    }
}

module.exports = {
    upgradeWeakestGearDB,
    fetchWeaponByTier,
    fetchArmorByTier,
    fetchRandomMisc,
    getRandomShopItems,
    insertIntoLoadout,
    purchaseItemToLoadout,
    sellItemFromLoadout,
    getItemBaseInfo
};
