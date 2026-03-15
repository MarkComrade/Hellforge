const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries

//!Login Query

async function loginUser(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'A felhasználónév nem létezik' };
        }

        const user = rows[0];

        if (user.password !== password) {
            return { success: false, message: 'Helytelen jelszó' };
        }

        return { success: true, userId: user.userId, message: 'Sikeres bejelentkezés' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a bejelentkezés során' };
    }
}

async function registerUser(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE name = ?', [username]);

        if (rows.length > 0) {
            return { success: false, message: 'A felhasználónév már létezik' };
        }

        if (password.length < 5) {
            return {
                success: false,
                message: 'A jelszónak legalább 5 karakter hosszúnak kell lennie'
            };
        }

        const [result] = await pool.query('INSERT INTO user (name, password) VALUES (?, ?)', [
            username,
            password
        ]);

        await pool.query('INSERT INTO player_inventory (playerId) VALUES (?)', [result.insertId]);

        return { success: true, userId: result.insertId, message: 'Sikeres regisztráció' };
    } catch (error) {
        return { success: false, message: error.message || 'Hiba történt a regisztráció során' };
    }
}

async function loginAdmin(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'A felhasználónév nem létezik' };
        }

        const admin = rows[0];

        if (admin.password !== password) {
            return { success: false, message: 'Helytelen jelszó' };
        }

        return { success: true, adminId: admin.adminId, message: 'Sikeres bejelentkezés' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a bejelentkezés során' };
    }
}
async function selectleadboard() {
    const query =
        'SELECT u.name, pi.gold as score FROM player_inventory pi JOIN user u ON pi.playerId = u.userId ORDER BY pi.gold DESC LIMIT 10;';
    const [rows] = await pool.execute(query);
    return rows;
}

async function getUserRankAndScore(username) {
    const query =
        'SELECT u.name, pi.gold as score, (SELECT COUNT(*) + 1 FROM player_inventory pi2 WHERE pi2.gold > pi.gold) as `rank` FROM player_inventory pi JOIN user u ON pi.playerId = u.userId WHERE u.name = ?';
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
}

//!Stash Queries

const STASH_LIMIT = 60;

async function getStash(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT s.stashId, s.armor_id, s.weapon_id, s.misc_item_id,
                    a.name AS armor_name, a.type AS armor_type, a.img_path AS armor_img, a.price AS armor_price, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.type AS weapon_type, w.img_path AS weapon_img, w.price AS weapon_price, w.tier AS weapon_tier, w.attack_multiplier,
                    m.name AS misc_name, m.img_path AS misc_img, m.value AS misc_value
             FROM player_stash s
             LEFT JOIN armors a ON s.armor_id = a.armorId
             LEFT JOIN weapons w ON s.weapon_id = w.weaponId
             LEFT JOIN misc_items m ON s.misc_item_id = m.itemId
             WHERE s.playerId = ?
               AND (s.armor_id IS NOT NULL OR s.weapon_id IS NOT NULL OR s.misc_item_id IS NOT NULL)`,
            [playerId]
        );
        return { success: true, stash: rows };
    } catch (error) {
        return { success: false, message: 'Hiba történt a stash lekérése során' };
    }
}

async function getStashCount(playerId) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count
         FROM player_stash
         WHERE playerId = ?
           AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
        [playerId]
    );
    return rows[0].count;
}

async function addArmorToStash(playerId, armorId) {
    try {
        const count = await getStashCount(playerId);
        if (count >= STASH_LIMIT) {
            return { success: false, message: 'A stash megtelt! Maximum 60 tárgy tárolható.' };
        }
        await pool.query('INSERT INTO player_stash (playerId, armor_id) VALUES (?, ?)', [
            playerId,
            armorId
        ]);
        return { success: true, message: 'Páncél hozzáadva a stash-hez' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a páncél hozzáadása során' };
    }
}

async function addWeaponToStash(playerId, weaponId) {
    try {
        const count = await getStashCount(playerId);
        if (count >= STASH_LIMIT) {
            return { success: false, message: 'A stash megtelt! Maximum 60 tárgy tárolható.' };
        }
        await pool.query('INSERT INTO player_stash (playerId, weapon_id) VALUES (?, ?)', [
            playerId,
            weaponId
        ]);
        return { success: true, message: 'Fegyver hozzáadva a stash-hez' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a fegyver hozzáadása során' };
    }
}

async function addMiscToStash(playerId, miscItemId) {
    try {
        const count = await getStashCount(playerId);
        if (count >= STASH_LIMIT) {
            return { success: false, message: 'A stash megtelt! Maximum 60 tárgy tárolható.' };
        }
        await pool.query('INSERT INTO player_stash (playerId, misc_item_id) VALUES (?, ?)', [
            playerId,
            miscItemId
        ]);
        return { success: true, message: 'Tárgy hozzáadva a stash-hez' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a tárgy hozzáadása során' };
    }
}

async function removeFromStash(stashId, playerId) {
    try {
        const [result] = await pool.query(
            'DELETE FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (result.affectedRows === 0) {
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }
        return { success: true, message: 'Tárgy eltávolítva a stash-ből' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a tárgy eltávolítása során' };
    }
}

async function getPlayerInventory(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT pi.gold, pi.helmet, pi.armor, pi.melee, pi.ranged,
                    h.name AS helmet_name, h.img_path AS helmet_img, h.tier AS helmet_tier, h.defense_multiplier AS helmet_defense,
                    a.name AS armor_name, a.img_path AS armor_img, a.tier AS armor_tier, a.defense_multiplier AS armor_defense,
                    m.name AS melee_name, m.img_path AS melee_img, m.tier AS melee_tier, m.attack_multiplier AS melee_attack,
                    r.name AS ranged_name, r.img_path AS ranged_img, r.tier AS ranged_tier, r.attack_multiplier AS ranged_attack
             FROM player_inventory pi
             LEFT JOIN armors h ON pi.helmet = h.armorId
             LEFT JOIN armors a ON pi.armor = a.armorId
             LEFT JOIN weapons m ON pi.melee = m.weaponId
             LEFT JOIN weapons r ON pi.ranged = r.weaponId
             WHERE pi.playerId = ?`,
            [playerId]
        );
        if (rows.length === 0) {
            return { success: false, message: 'Játékos nem található' };
        }
        return { success: true, inventory: rows[0] };
    } catch (error) {
        return { success: false, message: 'Hiba történt a felszerelés lekérése során' };
    }
}

async function swapEquipment(playerId, stashId, slot) {
    const validSlots = ['helmet', 'armor', 'melee', 'ranged'];
    if (!validSlots.includes(slot)) {
        return { success: false, message: 'Érvénytelen slot' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get the stash item
        const [stashRows] = await connection.query(
            `SELECT * FROM player_stash WHERE stashId = ? AND playerId = ?`,
            [stashId, playerId]
        );
        if (stashRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }
        const stashItem = stashRows[0];

        // Determine new item id from stash based on slot
        let newItemId;
        if (slot === 'helmet' || slot === 'armor') {
            newItemId = stashItem.armor_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'Ez a tárgy nem páncél' };
            }
        } else {
            newItemId = stashItem.weapon_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'Ez a tárgy nem fegyver' };
            }
        }

        // Get currently equipped item id
        const [invRows] = await connection.query(
            `SELECT \`${slot}\` AS equippedId FROM player_inventory WHERE playerId = ?`,
            [playerId]
        );
        const currentEquippedId = invRows[0].equippedId;

        // Update equipped slot to new item
        await connection.query(`UPDATE player_inventory SET \`${slot}\` = ? WHERE playerId = ?`, [
            newItemId,
            playerId
        ]);

        // Update the stash row: replace item with old equipped item
        if (slot === 'helmet' || slot === 'armor') {
            await connection.query(
                `UPDATE player_stash SET armor_id = ?, weapon_id = NULL, misc_item_id = NULL WHERE stashId = ?`,
                [currentEquippedId, stashId]
            );
        } else {
            await connection.query(
                `UPDATE player_stash SET weapon_id = ?, armor_id = NULL, misc_item_id = NULL WHERE stashId = ?`,
                [currentEquippedId, stashId]
            );
        }

        await connection.commit();
        return { success: true, message: 'Felszerelés cserélve' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a csere során' };
    } finally {
        connection.release();
    }
}

const LOADOUT_LIMIT = 10;

//!Loadout Queries

async function getLoadout(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT l.loadoutId, l.armor_id, l.weapon_id, l.misc_item_id,
                    a.name AS armor_name, a.type AS armor_type, a.img_path AS armor_img, a.price AS armor_price, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.type AS weapon_type, w.img_path AS weapon_img, w.price AS weapon_price, w.tier AS weapon_tier, w.attack_multiplier,
                    m.name AS misc_name, m.img_path AS misc_img, m.value AS misc_value
             FROM player_loadout l
             LEFT JOIN armors a ON l.armor_id = a.armorId
             LEFT JOIN weapons w ON l.weapon_id = w.weaponId
             LEFT JOIN misc_items m ON l.misc_item_id = m.itemId
             WHERE l.playerId = ?
               AND (l.armor_id IS NOT NULL OR l.weapon_id IS NOT NULL OR l.misc_item_id IS NOT NULL)`,
            [playerId]
        );
        return { success: true, loadout: rows };
    } catch (error) {
        return { success: false, message: 'Hiba történt a loadout lekérése során' };
    }
}

async function getLoadoutCount(playerId) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count
         FROM player_loadout
         WHERE playerId = ?
           AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
        [playerId]
    );
    return rows[0].count;
}

async function moveStashToLoadout(playerId, stashId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check loadout limit
        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count
                         FROM player_loadout
                         WHERE playerId = ?
                             AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (countRows[0].count >= LOADOUT_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Inventory is full.' };
        }

        // Get the stash item
        const [stashRows] = await connection.query(
            'SELECT * FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (stashRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in stash.' };
        }
        const stashItem = stashRows[0];

        // Insert into loadout
        await connection.query(
            'INSERT INTO player_loadout (playerId, armor_id, weapon_id, misc_item_id) VALUES (?, ?, ?, ?)',
            [playerId, stashItem.armor_id, stashItem.weapon_id, stashItem.misc_item_id]
        );

        // Remove from stash
        await connection.query('DELETE FROM player_stash WHERE stashId = ? AND playerId = ?', [
            stashId,
            playerId
        ]);

        await connection.commit();
        return { success: true, message: 'Item moved to inventory.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error moving item to inventory.' };
    } finally {
        connection.release();
    }
}

async function swapLoadoutEquipment(playerId, loadoutId, slot) {
    const validSlots = ['helmet', 'armor', 'melee', 'ranged'];
    if (!validSlots.includes(slot)) {
        return { success: false, message: 'Érvénytelen slot' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get the loadout item
        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const loadoutItem = loadoutRows[0];

        // Determine new item id from loadout based on slot
        let newItemId;
        if (slot === 'helmet' || slot === 'armor') {
            newItemId = loadoutItem.armor_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'This item is not armor.' };
            }
        } else {
            newItemId = loadoutItem.weapon_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'This item is not a weapon.' };
            }
        }

        // Get currently equipped item id
        const [invRows] = await connection.query(
            `SELECT \`${slot}\` AS equippedId FROM player_inventory WHERE playerId = ?`,
            [playerId]
        );
        const currentEquippedId = invRows[0].equippedId;

        // Update equipped slot to new item
        await connection.query(`UPDATE player_inventory SET \`${slot}\` = ? WHERE playerId = ?`, [
            newItemId,
            playerId
        ]);

        // Update the loadout row: replace item with old equipped item
        if (slot === 'helmet' || slot === 'armor') {
            await connection.query(
                'UPDATE player_loadout SET armor_id = ?, weapon_id = NULL, misc_item_id = NULL WHERE loadoutId = ?',
                [currentEquippedId, loadoutId]
            );
        } else {
            await connection.query(
                'UPDATE player_loadout SET weapon_id = ?, armor_id = NULL, misc_item_id = NULL WHERE loadoutId = ?',
                [currentEquippedId, loadoutId]
            );
        }

        await connection.commit();
        return { success: true, message: 'Equipment swapped from inventory.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error swapping equipment.' };
    } finally {
        connection.release();
    }
}

async function deleteFromLoadout(playerId, loadoutId) {
    try {
        const [result] = await pool.query(
            'DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (result.affectedRows === 0) {
            return { success: false, message: 'Item not found in inventory.' };
        }
        return { success: true, message: 'Item deleted from inventory.' };
    } catch (error) {
        return { success: false, message: 'Error deleting item from inventory.' };
    }
}

async function moveLoadoutToStash(playerId, loadoutId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check stash limit
        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count
                         FROM player_stash
                         WHERE playerId = ?
                             AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (countRows[0].count >= STASH_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Stash is full.' };
        }

        // Get the loadout item
        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const loadoutItem = loadoutRows[0];

        // Insert into stash
        await connection.query(
            'INSERT INTO player_stash (playerId, armor_id, weapon_id, misc_item_id) VALUES (?, ?, ?, ?)',
            [playerId, loadoutItem.armor_id, loadoutItem.weapon_id, loadoutItem.misc_item_id]
        );

        // Remove from loadout
        await connection.query('DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?', [
            loadoutId,
            playerId
        ]);

        await connection.commit();
        return { success: true, message: 'Item moved to stash.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error moving item to stash.' };
    } finally {
        connection.release();
    }
}

async function getGoldBalances(playerId) {
    try {
        const [inventoryRows] = await pool.query(
            `SELECT COALESCE(gold, 0) AS total
             FROM player_inventory
             WHERE playerId = ?`,
            [playerId]
        );

        const [loadoutRows] = await pool.query(
            `SELECT COALESCE(SUM(gold_amount), 0) AS total
             FROM player_loadout
             WHERE playerId = ?
               AND gold_amount IS NOT NULL`,
            [playerId]
        );

        return {
            success: true,
            gold: {
                stash: inventoryRows.length > 0 ? Number(inventoryRows[0].total) : 0,
                loadout: Number(loadoutRows[0].total)
            }
        };
    } catch (error) {
        return { success: false, message: 'Error reading gold balances.' };
    }
}

async function transferGoldBetweenStorage(playerId, from, amount) {
    const normalizedAmount = parseInt(amount, 10);
    if (from !== 'stash' && from !== 'loadout') {
        return { success: false, message: 'Invalid source storage.' };
    }

    if (!Number.isInteger(normalizedAmount) || normalizedAmount <= 0) {
        return { success: false, message: 'Amount must be a positive whole number.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [inventoryRows] = await connection.query(
            `SELECT COALESCE(gold, 0) AS gold
             FROM player_inventory
             WHERE playerId = ?
             LIMIT 1
             FOR UPDATE`,
            [playerId]
        );

        if (inventoryRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Player inventory not found.' };
        }

        const stashGold = Number(inventoryRows[0].gold);

        const [loadoutRows] = await connection.query(
            `SELECT COALESCE(SUM(gold_amount), 0) AS total
             FROM player_loadout
             WHERE playerId = ?
               AND gold_amount IS NOT NULL
             FOR UPDATE`,
            [playerId]
        );
        const loadoutGold = Number(loadoutRows[0].total);
        const initialTotalGold = stashGold + loadoutGold;

        const sourceTotal = from === 'stash' ? stashGold : loadoutGold;

        if (sourceTotal < normalizedAmount) {
            await connection.rollback();
            return { success: false, message: 'Not enough gold in source storage.' };
        }

        let updatedStashGold = stashGold;
        let updatedLoadoutGold = loadoutGold;

        if (from === 'stash') {
            updatedStashGold = stashGold - normalizedAmount;
            updatedLoadoutGold = loadoutGold + normalizedAmount;
        } else {
            updatedLoadoutGold = loadoutGold - normalizedAmount;
            updatedStashGold = stashGold + normalizedAmount;
        }

        await connection.query(
            `UPDATE player_inventory
             SET gold = ?
             WHERE playerId = ?`,
            [updatedStashGold, playerId]
        );

        await connection.query(
            `DELETE FROM player_loadout
             WHERE playerId = ?
               AND gold_amount IS NOT NULL`,
            [playerId]
        );

        if (updatedLoadoutGold > 0) {
            await connection.query(
                `INSERT INTO player_loadout (playerId, gold_amount) VALUES (?, ?)`,
                [playerId, updatedLoadoutGold]
            );
        }

        const finalTotalGold = updatedStashGold + updatedLoadoutGold;
        if (finalTotalGold !== initialTotalGold) {
            await connection.rollback();
            return { success: false, message: 'Gold total mismatch detected.' };
        }

        await connection.commit();

        return {
            success: true,
            message: 'Gold transferred successfully.',
            gold: {
                stash: updatedStashGold,
                loadout: updatedLoadoutGold
            }
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error transferring gold.' };
    } finally {
        connection.release();
    }
}

//!Export
module.exports = {
    pool,
    selectleadboard,
    getUserRankAndScore,
    loginUser,
    registerUser,
    loginAdmin,
    getStash,
    getStashCount,
    addArmorToStash,
    addWeaponToStash,
    addMiscToStash,
    removeFromStash,
    getPlayerInventory,
    swapEquipment,
    getLoadout,
    getLoadoutCount,
    moveStashToLoadout,
    moveLoadoutToStash,
    swapLoadoutEquipment,
    deleteFromLoadout,
    getGoldBalances,
    transferGoldBetweenStorage
};
