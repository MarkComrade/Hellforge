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

        await connection.execute('DELETE FROM player_stash WHERE playerId = ?', [userId]);
        await connection.execute('DELETE FROM player_loadout WHERE playerId = ?', [userId]);

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

        // helmet slot — armor table
        if (inventoryData.helmet) {
            const [armorRows] = await connection.query(
                'SELECT tier FROM armors WHERE armorId = ?',
                [inventoryData.helmet]
            );
            if (!armorRows[0]) throw new Error(`Armor id ${inventoryData.helmet} not found`);
            const tier = Number(armorRows[0].tier);
            const cards = pickCardsForItem('Helmet', tier);
            const instanceId = await createItemInstance(
                connection,
                'armor',
                inventoryData.helmet,
                cards
            );
            const [helmetResult] = await connection.execute(
                'UPDATE player_loadout SET armor_id = ?, instance_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
                [inventoryData.helmet, instanceId, userId, 'helmet']
            );
            if (helmetResult.affectedRows === 0)
                throw new Error(`No equipped helmet row found for player ${userId}`);
        }

        // armor slot — armor table
        if (inventoryData.armor) {
            const [armorRows] = await connection.query(
                'SELECT tier FROM armors WHERE armorId = ?',
                [inventoryData.armor]
            );
            if (!armorRows[0]) throw new Error(`Armor id ${inventoryData.armor} not found`);
            const tier = Number(armorRows[0].tier);
            const cards = pickCardsForItem('Armor', tier);
            const instanceId = await createItemInstance(
                connection,
                'armor',
                inventoryData.armor,
                cards
            );
            const [armorResult] = await connection.execute(
                'UPDATE player_loadout SET armor_id = ?, instance_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
                [inventoryData.armor, instanceId, userId, 'armor']
            );
            if (armorResult.affectedRows === 0)
                throw new Error(`No equipped armor row found for player ${userId}`);
        }

        // melee slot — weapon table
        if (inventoryData.melee) {
            const [weaponRows] = await connection.query(
                'SELECT tier FROM weapons WHERE weaponId = ?',
                [inventoryData.melee]
            );
            if (!weaponRows[0]) throw new Error(`Weapon id ${inventoryData.melee} not found`);
            const tier = Number(weaponRows[0].tier);
            const cards = pickCardsForItem('Melee', tier);
            const instanceId = await createItemInstance(
                connection,
                'weapon',
                inventoryData.melee,
                cards
            );
            const [meleeResult] = await connection.execute(
                'UPDATE player_loadout SET weapon_id = ?, instance_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
                [inventoryData.melee, instanceId, userId, 'melee']
            );
            if (meleeResult.affectedRows === 0)
                throw new Error(`No equipped melee row found for player ${userId}`);
        }

        // ranged slot — weapon table
        if (inventoryData.ranged) {
            const [weaponRows] = await connection.query(
                'SELECT tier FROM weapons WHERE weaponId = ?',
                [inventoryData.ranged]
            );
            if (!weaponRows[0]) throw new Error(`Weapon id ${inventoryData.ranged} not found`);
            const tier = Number(weaponRows[0].tier);
            const cards = pickCardsForItem('Ranged', tier);
            const instanceId = await createItemInstance(
                connection,
                'weapon',
                inventoryData.ranged,
                cards
            );
            const [rangedResult] = await connection.execute(
                'UPDATE player_loadout SET weapon_id = ?, instance_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
                [inventoryData.ranged, instanceId, userId, 'ranged']
            );
            if (rangedResult.affectedRows === 0)
                throw new Error(`No equipped ranged row found for player ${userId}`);
        }

        await connection.commit();
        return { success: true, affectedRows: 4 };
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
