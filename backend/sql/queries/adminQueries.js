const { pool } = require('../core/connection.js');
const { pickCardsForItem } = require('../../services/cardPool.js');
const { createItemInstance } = require('../core/itemInstanceHelpers.js');

async function deleteUser(username) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [userRows] = await connection.execute('SELECT userId FROM user WHERE name = ?', [
            username
        ]);

        if (userRows.length === 0) {
            throw new Error('User not found');
        }

        const userId = userRows[0].userId;

        const [stashInstances] = await connection.execute(
            'SELECT instance_id FROM player_stash WHERE playerId = ? AND instance_id IS NOT NULL',
            [userId]
        );
        const [loadoutInstances] = await connection.execute(
            'SELECT instance_id FROM player_loadout WHERE playerId = ? AND instance_id IS NOT NULL',
            [userId]
        );
        const instanceIds = [
            ...stashInstances.map((r) => r.instance_id),
            ...loadoutInstances.map((r) => r.instance_id)
        ];

        await connection.execute('DELETE FROM player_stash WHERE playerId = ?', [userId]);
        await connection.execute('DELETE FROM player_loadout WHERE playerId = ?', [userId]);

        for (const id of instanceIds) {
            await connection.execute('DELETE FROM item_instances WHERE instanceId = ?', [id]);
        }

        const [result] = await connection.execute('DELETE FROM user WHERE userId = ?', [userId]);

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserInventory(userId) {
    const [userRows] = await pool.query('SELECT userId, name FROM user WHERE userId = ?', [userId]);
    if (userRows.length === 0) return null;

    const [rows] = await pool.query(
        `SELECT l.slot, l.armor_id, l.weapon_id,
                a.name AS armor_name, a.img_path AS armor_img, a.tier AS armor_tier,
                w.name AS weapon_name, w.img_path AS weapon_img, w.tier AS weapon_tier
         FROM player_loadout l
         LEFT JOIN armors a ON l.armor_id = a.armorId
         LEFT JOIN weapons w ON l.weapon_id = w.weaponId
         WHERE l.playerId = ? AND l.equipped = 1`,
        [userId]
    );

    const result = { userId: Number(userId), username: userRows[0].name };

    for (const row of rows) {
        if (row.slot === 'helmet') {
            result.helmet_id = row.armor_id;
            result.helmet_name = row.armor_name;
            result.helmet_img = row.armor_img;
            result.helmet_tier = row.armor_tier;
        } else if (row.slot === 'armor') {
            result.armor_id = row.armor_id;
            result.armor_name = row.armor_name;
            result.armor_img = row.armor_img;
            result.armor_tier = row.armor_tier;
        } else if (row.slot === 'melee') {
            result.melee_id = row.weapon_id;
            result.melee_name = row.weapon_name;
            result.melee_img = row.weapon_img;
            result.melee_tier = row.weapon_tier;
        } else if (row.slot === 'ranged') {
            result.ranged_id = row.weapon_id;
            result.ranged_name = row.weapon_name;
            result.ranged_img = row.weapon_img;
            result.ranged_tier = row.weapon_tier;
        }
    }

    return result;
}

async function getAllArmors() {
    const query = 'SELECT armorId, name, type, tier FROM armors ORDER BY type, tier ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

async function getAllWeapons() {
    const query = 'SELECT weaponId, name, type, tier FROM weapons ORDER BY type, tier ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

async function updateUserInventory(userId, inventoryData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        async function replaceSlot(slot, itemType, itemId, cardType, idColumn) {
            const [itemRows] = await connection.query(
                `SELECT tier FROM ${itemType === 'armor' ? 'armors' : 'weapons'} WHERE ${itemType === 'armor' ? 'armorId' : 'weaponId'} = ?`,
                [itemId]
            );
            if (!itemRows[0]) throw new Error(`${itemType} id ${itemId} not found`);

            const [oldRows] = await connection.execute(
                'SELECT instance_id FROM player_loadout WHERE playerId = ? AND equipped = 1 AND slot = ?',
                [userId, slot]
            );
            const oldInstanceId = oldRows[0]?.instance_id ?? null;

            const tier = Number(itemRows[0].tier);
            const cards = pickCardsForItem(cardType, tier);
            const newInstanceId = await createItemInstance(connection, itemType, itemId, cards);

            const [updateResult] = await connection.execute(
                `UPDATE player_loadout SET ${idColumn} = ?, instance_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?`,
                [itemId, newInstanceId, userId, slot]
            );
            if (updateResult.affectedRows === 0)
                throw new Error(`No equipped ${slot} row found for player ${userId}`);

            if (oldInstanceId !== null) {
                await connection.execute('DELETE FROM item_instances WHERE instanceId = ?', [
                    oldInstanceId
                ]);
            }
        }

        let affectedRows = 0;
        if (inventoryData.helmet) {
            await replaceSlot('helmet', 'armor', inventoryData.helmet, 'Helmet', 'armor_id');
            affectedRows++;
        }
        if (inventoryData.armor) {
            await replaceSlot('armor', 'armor', inventoryData.armor, 'Armor', 'armor_id');
            affectedRows++;
        }
        if (inventoryData.melee) {
            await replaceSlot('melee', 'weapon', inventoryData.melee, 'Melee', 'weapon_id');
            affectedRows++;
        }
        if (inventoryData.ranged) {
            await replaceSlot('ranged', 'weapon', inventoryData.ranged, 'Ranged', 'weapon_id');
            affectedRows++;
        }

        await connection.commit();
        return { success: true, affectedRows };
    } catch (error) {
        await connection.rollback();
        console.error('updateUserInventory error:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    deleteUser,
    getUserInventory,
    getAllArmors,
    getAllWeapons,
    updateUserInventory
};
