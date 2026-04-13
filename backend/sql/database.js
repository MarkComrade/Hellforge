const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { getCardById, pickCardsForItem } = require('../services/cardPool.js');

const SALT_ROUNDS = 12;

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

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { success: false, message: 'Helytelen jelszó' };
        }

        return { success: true, userId: user.userId, message: 'Sikeres bejelentkezés' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a bejelentkezés során' };
    }
}

async function registerUser(username, password) {
    const [existingRows] = await pool.query('SELECT userId FROM user WHERE name = ?', [username]);
    if (existingRows.length > 0) {
        return { success: false, message: 'A felhasználónév már létezik' };
    }

    if (password.length < 5) {
        return {
            success: false,
            message: 'A jelszónak legalább 5 karakter hosszúnak kell lennie'
        };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO user (name, password) VALUES (?, ?)', [
            username,
            hashedPassword
        ]);
        const userId = result.insertId;

        // Starter gear: Rusty Helmet (armorId=1), Rusty Chestplate (armorId=2),
        //               Rusty Sword (weaponId=1), Rusty Bow (weaponId=2)
        const starterGear = [
            { dbType: 'armor', itemType: 'Helmet', itemId: 1 },
            { dbType: 'armor', itemType: 'Armor', itemId: 2 },
            { dbType: 'weapon', itemType: 'Melee', itemId: 1 },
            { dbType: 'weapon', itemType: 'Ranged', itemId: 2 }
        ];

        const instanceIds = [];
        for (const gear of starterGear) {
            const [ins] = await connection.query(
                'INSERT INTO item_instances (item_type, item_ref_id) VALUES (?, ?)',
                [gear.dbType, gear.itemId]
            );
            const instanceId = ins.insertId;
            instanceIds.push(instanceId);

            const cards = pickCardsForItem(gear.itemType, 1);
            if (cards.length > 0) {
                const vals = cards.map((c, i) => [instanceId, c.id, i + 1]);
                await connection.query(
                    'INSERT INTO item_instance_cards (instance_id, card_id, slot) VALUES ?',
                    [vals]
                );
            }
        }

        const [helmetInst, armorInst, meleeInst, rangedInst] = instanceIds;
        await connection.query(
            `INSERT INTO player_inventory
                (playerId, helmet, armor, melee, ranged,
                 helmet_instance, armor_instance, melee_instance, ranged_instance)
             VALUES (?, 1, 2, 1, 2, ?, ?, ?, ?)`,
            [userId, helmetInst, armorInst, meleeInst, rangedInst]
        );

        await connection.commit();
        return { success: true, userId, message: 'Sikeres regisztráció' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a regisztráció során' };
    } finally {
        connection.release();
    }
}

async function loginAdmin(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'A felhasználónév nem létezik' };
        }

        const admin = rows[0];

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return { success: false, message: 'Helytelen jelszó' };
        }

        return { success: true, adminId: admin.adminId, message: 'Sikeres bejelentkezés' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a bejelentkezés során' };
    }
}

async function selectleadboard() {
    const query = `
        SELECT u.name, COALESCE(SUM(pl.gold_amount), 0) AS score
        FROM user u
        JOIN player_inventory pi ON u.userId = pi.playerId
        LEFT JOIN player_loadout pl ON u.userId = pl.playerId AND pl.gold_amount IS NOT NULL
        GROUP BY u.userId, u.name
        ORDER BY score DESC
        LIMIT 10
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

async function getUserRankAndScore(username) {
    const query = `
        SELECT u.name,
               COALESCE(SUM(pl.gold_amount), 0) AS score,
               (
                   SELECT COUNT(*) + 1
                   FROM (
                       SELECT SUM(pl2.gold_amount) AS g
                       FROM player_loadout pl2
                       WHERE pl2.gold_amount IS NOT NULL
                       GROUP BY pl2.playerId
                   ) AS totals
                   WHERE totals.g > COALESCE(SUM(pl.gold_amount), 0)
               ) AS \`rank\`
        FROM user u
        JOIN player_inventory pi ON u.userId = pi.playerId
        LEFT JOIN player_loadout pl ON u.userId = pl.playerId AND pl.gold_amount IS NOT NULL
        WHERE u.name = ?
        GROUP BY u.userId, u.name
    `;
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
}

async function getAllUsers() {
    const query = 'SELECT userId, name FROM user ORDER BY userId ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

//!Stash Queries

const STASH_LIMIT = 50;

async function getStash(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT s.stashId, s.instance_id, s.armor_id, s.weapon_id, s.misc_item_id,
                    a.name AS armor_name, a.type AS armor_type, a.img_path AS armor_img, a.price AS armor_price, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.type AS weapon_type, w.img_path AS weapon_img, w.price AS weapon_price, w.tier AS weapon_tier, w.attack_multiplier,
                    m.name AS misc_name, m.img_path AS misc_img, m.value AS misc_value,
                    GROUP_CONCAT(iic.card_id ORDER BY iic.slot) AS card_ids
             FROM player_stash s
             LEFT JOIN armors a ON s.armor_id = a.armorId
             LEFT JOIN weapons w ON s.weapon_id = w.weaponId
             LEFT JOIN misc_items m ON s.misc_item_id = m.itemId
             LEFT JOIN item_instance_cards iic ON s.instance_id = iic.instance_id
             WHERE s.playerId = ?
               AND (s.armor_id IS NOT NULL OR s.weapon_id IS NOT NULL OR s.misc_item_id IS NOT NULL)
             GROUP BY s.stashId`,
            [playerId]
        );
        const stash = rows.map((row) => {
            const cardIds = row.card_ids ? row.card_ids.split(',').map(Number) : [];
            const { card_ids, ...rest } = row;
            return { ...rest, cards: cardIds.map((id) => getCardById(id)).filter(Boolean) };
        });
        return { success: true, stash };
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
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [itemRows] = await connection.query(
            'SELECT instance_id FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (itemRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }
        const instanceId = itemRows[0].instance_id;

        const [result] = await connection.query(
            'DELETE FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (result.affectedRows === 0) {
            await connection.rollback();
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }

        if (instanceId) {
            await connection.query('DELETE FROM item_instances WHERE instanceId = ?', [instanceId]);
        }

        await connection.commit();
        return { success: true, message: 'Tárgy eltávolítva a stash-ből' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a tárgy eltávolítása során' };
    } finally {
        connection.release();
    }
}

async function getPlayerInventory(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT pi.helmet, pi.armor, pi.melee, pi.ranged,
                    pi.helmet_instance, pi.armor_instance, pi.melee_instance, pi.ranged_instance,
                    h.name AS helmet_name, h.img_path AS helmet_img, h.tier AS helmet_tier, h.defense_multiplier AS helmet_defense,
                    a.name AS armor_name, a.img_path AS armor_img, a.tier AS armor_tier, a.defense_multiplier AS armor_defense,
                    m.name AS melee_name, m.img_path AS melee_img, m.tier AS melee_tier, m.attack_multiplier AS melee_attack,
                    r.name AS ranged_name, r.img_path AS ranged_img, r.tier AS ranged_tier, r.attack_multiplier AS ranged_attack,
                    (SELECT GROUP_CONCAT(c.card_id ORDER BY c.slot) FROM item_instance_cards c WHERE c.instance_id = pi.helmet_instance) AS helmet_card_ids,
                    (SELECT GROUP_CONCAT(c.card_id ORDER BY c.slot) FROM item_instance_cards c WHERE c.instance_id = pi.armor_instance) AS armor_card_ids,
                    (SELECT GROUP_CONCAT(c.card_id ORDER BY c.slot) FROM item_instance_cards c WHERE c.instance_id = pi.melee_instance) AS melee_card_ids,
                    (SELECT GROUP_CONCAT(c.card_id ORDER BY c.slot) FROM item_instance_cards c WHERE c.instance_id = pi.ranged_instance) AS ranged_card_ids
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
        const row = rows[0];
        const inventory = {
            ...row,
            helmet_cards: row.helmet_card_ids
                ? row.helmet_card_ids
                      .split(',')
                      .map(Number)
                      .map((id) => getCardById(id))
                      .filter(Boolean)
                : [],
            armor_cards: row.armor_card_ids
                ? row.armor_card_ids
                      .split(',')
                      .map(Number)
                      .map((id) => getCardById(id))
                      .filter(Boolean)
                : [],
            melee_cards: row.melee_card_ids
                ? row.melee_card_ids
                      .split(',')
                      .map(Number)
                      .map((id) => getCardById(id))
                      .filter(Boolean)
                : [],
            ranged_cards: row.ranged_card_ids
                ? row.ranged_card_ids
                      .split(',')
                      .map(Number)
                      .map((id) => getCardById(id))
                      .filter(Boolean)
                : []
        };
        delete inventory.helmet_card_ids;
        delete inventory.armor_card_ids;
        delete inventory.melee_card_ids;
        delete inventory.ranged_card_ids;
        return { success: true, inventory };
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

        const [stashRows] = await connection.query(
            `SELECT * FROM player_stash WHERE stashId = ? AND playerId = ?`,
            [stashId, playerId]
        );
        if (stashRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }
        const stashItem = stashRows[0];

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

        const instanceCol = `${slot}_instance`;
        const [invRows] = await connection.query(
            `SELECT \`${slot}\` AS equippedId, \`${instanceCol}\` AS equippedInstanceId FROM player_inventory WHERE playerId = ?`,
            [playerId]
        );
        const currentEquippedId = invRows[0].equippedId;
        const currentEquippedInstanceId = invRows[0].equippedInstanceId;

        await connection.query(
            `UPDATE player_inventory SET \`${slot}\` = ?, \`${instanceCol}\` = ? WHERE playerId = ?`,
            [newItemId, stashItem.instance_id, playerId]
        );

        if (slot === 'helmet' || slot === 'armor') {
            await connection.query(
                `UPDATE player_stash SET armor_id = ?, weapon_id = NULL, misc_item_id = NULL, instance_id = ? WHERE stashId = ?`,
                [currentEquippedId, currentEquippedInstanceId, stashId]
            );
        } else {
            await connection.query(
                `UPDATE player_stash SET weapon_id = ?, armor_id = NULL, misc_item_id = NULL, instance_id = ? WHERE stashId = ?`,
                [currentEquippedId, currentEquippedInstanceId, stashId]
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
            `SELECT l.loadoutId, l.instance_id, l.armor_id, l.weapon_id, l.misc_item_id,
                    a.name AS armor_name, a.type AS armor_type, a.img_path AS armor_img, a.price AS armor_price, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.type AS weapon_type, w.img_path AS weapon_img, w.price AS weapon_price, w.tier AS weapon_tier, w.attack_multiplier,
                    m.name AS misc_name, m.img_path AS misc_img, m.value AS misc_value,
                    GROUP_CONCAT(iic.card_id ORDER BY iic.slot) AS card_ids
             FROM player_loadout l
             LEFT JOIN armors a ON l.armor_id = a.armorId
             LEFT JOIN weapons w ON l.weapon_id = w.weaponId
             LEFT JOIN misc_items m ON l.misc_item_id = m.itemId
             LEFT JOIN item_instance_cards iic ON l.instance_id = iic.instance_id
             WHERE l.playerId = ?
               AND (l.armor_id IS NOT NULL OR l.weapon_id IS NOT NULL OR l.misc_item_id IS NOT NULL)
             GROUP BY l.loadoutId`,
            [playerId]
        );
        const loadout = rows.map((row) => {
            const cardIds = row.card_ids ? row.card_ids.split(',').map(Number) : [];
            const { card_ids, ...rest } = row;
            return { ...rest, cards: cardIds.map((id) => getCardById(id)).filter(Boolean) };
        });
        return { success: true, loadout };
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

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count
                         FROM player_loadout
                         WHERE playerId = ?
                             AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= LOADOUT_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Inventory is full.' };
        }

        const [stashRows] = await connection.query(
            'SELECT * FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (stashRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in stash.' };
        }
        const stashItem = stashRows[0];

        await connection.query(
            'INSERT INTO player_loadout (playerId, armor_id, weapon_id, misc_item_id, instance_id) VALUES (?, ?, ?, ?, ?)',
            [
                playerId,
                stashItem.armor_id,
                stashItem.weapon_id,
                stashItem.misc_item_id,
                stashItem.instance_id
            ]
        );

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

        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const loadoutItem = loadoutRows[0];

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

        const instanceCol = `${slot}_instance`;
        const [invRows] = await connection.query(
            `SELECT \`${slot}\` AS equippedId, \`${instanceCol}\` AS equippedInstanceId FROM player_inventory WHERE playerId = ?`,
            [playerId]
        );
        const currentEquippedId = invRows[0].equippedId;
        const currentEquippedInstanceId = invRows[0].equippedInstanceId;

        await connection.query(
            `UPDATE player_inventory SET \`${slot}\` = ?, \`${instanceCol}\` = ? WHERE playerId = ?`,
            [newItemId, loadoutItem.instance_id, playerId]
        );

        if (slot === 'helmet' || slot === 'armor') {
            await connection.query(
                'UPDATE player_loadout SET armor_id = ?, weapon_id = NULL, misc_item_id = NULL, instance_id = ? WHERE loadoutId = ?',
                [currentEquippedId, currentEquippedInstanceId, loadoutId]
            );
        } else {
            await connection.query(
                'UPDATE player_loadout SET weapon_id = ?, armor_id = NULL, misc_item_id = NULL, instance_id = ? WHERE loadoutId = ?',
                [currentEquippedId, currentEquippedInstanceId, loadoutId]
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
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [itemRows] = await connection.query(
            'SELECT instance_id FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (itemRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const instanceId = itemRows[0].instance_id;

        const [result] = await connection.query(
            'DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (result.affectedRows === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }

        if (instanceId) {
            await connection.query('DELETE FROM item_instances WHERE instanceId = ?', [instanceId]);
        }

        await connection.commit();
        return { success: true, message: 'Item deleted from inventory.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error deleting item from inventory.' };
    } finally {
        connection.release();
    }
}

async function moveLoadoutToStash(playerId, loadoutId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count
                         FROM player_stash
                         WHERE playerId = ?
                             AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= STASH_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Stash is full.' };
        }

        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ?',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const loadoutItem = loadoutRows[0];

        await connection.query(
            'INSERT INTO player_stash (playerId, armor_id, weapon_id, misc_item_id, instance_id) VALUES (?, ?, ?, ?, ?)',
            [
                playerId,
                loadoutItem.armor_id,
                loadoutItem.weapon_id,
                loadoutItem.misc_item_id,
                loadoutItem.instance_id
            ]
        );

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

async function getTotalGold(playerId) {
    try {
        const [stashRows] = await pool.query(
            `SELECT COALESCE(SUM(gold), 0) AS gold FROM player_stash WHERE playerId = ? AND gold IS NOT NULL`,
            [playerId]
        );
        const [loadoutRows] = await pool.query(
            `SELECT COALESCE(SUM(gold_amount), 0) AS gold FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL`,
            [playerId]
        );
        return {
            success: true,
            gold: {
                stash: stashRows[0].gold,
                loadout: loadoutRows[0].gold
            }
        };
    } catch (error) {
        console.error('getTotalGold error:', error);
        return { success: false, message: 'Hiba történt az arany lekérése során' };
    }
}

async function addGoldToInventory(playerId, amount) {
    const normalizedAmount = parseInt(amount, 10);

    if (!Number.isInteger(normalizedAmount) || normalizedAmount <= 0) {
        return { success: false, message: 'Amount must be a positive whole number.' };
    }

    try {
        await pool.query('INSERT INTO player_loadout (playerId, gold_amount) VALUES (?, ?)', [
            playerId,
            normalizedAmount
        ]);
        return { success: true, message: 'Gold added to loadout.' };
    } catch (error) {
        return { success: false, message: 'Error adding gold to loadout.' };
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

        const [stashRows] = await connection.query(
            `SELECT stashId, gold FROM player_stash
             WHERE playerId = ? AND gold IS NOT NULL
             FOR UPDATE`,
            [playerId]
        );
        const stashGold = stashRows.reduce((sum, r) => sum + (r.gold || 0), 0);

        const [loadoutRows] = await connection.query(
            `SELECT loadoutId, gold_amount FROM player_loadout
             WHERE playerId = ? AND gold_amount IS NOT NULL
             FOR UPDATE`,
            [playerId]
        );
        const loadoutGold = loadoutRows.reduce((sum, r) => sum + (r.gold_amount || 0), 0);

        const sourceTotal = from === 'stash' ? stashGold : loadoutGold;
        if (sourceTotal < normalizedAmount) {
            await connection.rollback();
            return { success: false, message: 'Not enough gold in source storage.' };
        }

        if (from === 'stash') {
            let remaining = normalizedAmount;
            for (const row of stashRows) {
                if (remaining <= 0) break;
                const deduct = Math.min(row.gold, remaining);
                remaining -= deduct;
                const newAmount = row.gold - deduct;
                if (newAmount === 0) {
                    await connection.query('DELETE FROM player_stash WHERE stashId = ?', [
                        row.stashId
                    ]);
                } else {
                    await connection.query('UPDATE player_stash SET gold = ? WHERE stashId = ?', [
                        newAmount,
                        row.stashId
                    ]);
                }
            }
            await connection.query(
                'INSERT INTO player_loadout (playerId, gold_amount) VALUES (?, ?)',
                [playerId, normalizedAmount]
            );
        } else {
            let remaining = normalizedAmount;
            for (const row of loadoutRows) {
                if (remaining <= 0) break;
                const deduct = Math.min(row.gold_amount, remaining);
                remaining -= deduct;
                const newAmount = row.gold_amount - deduct;
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
            await connection.query('INSERT INTO player_stash (playerId, gold) VALUES (?, ?)', [
                playerId,
                normalizedAmount
            ]);
        }

        await connection.commit();
        return {
            success: true,
            message: 'Gold transferred successfully.',
            gold: {
                stash:
                    from === 'stash' ? stashGold - normalizedAmount : stashGold + normalizedAmount,
                loadout:
                    from === 'loadout'
                        ? loadoutGold - normalizedAmount
                        : loadoutGold + normalizedAmount
            }
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error transferring gold.' };
    } finally {
        connection.release();
    }
}

// Admin Queries
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

        // Collect all instance IDs owned by this player before deleting rows
        const [stashInstances] = await connection.execute(
            'SELECT instance_id FROM player_stash WHERE playerId = ? AND instance_id IS NOT NULL',
            [userId]
        );
        const [loadoutInstances] = await connection.execute(
            'SELECT instance_id FROM player_loadout WHERE playerId = ? AND instance_id IS NOT NULL',
            [userId]
        );
        const [invInstances] = await connection.execute(
            `SELECT helmet_instance, armor_instance, melee_instance, ranged_instance
             FROM player_inventory WHERE playerId = ?`,
            [userId]
        );

        // Delete all storage rows first
        await connection.execute('DELETE FROM player_stash WHERE playerId = ?', [userId]);
        await connection.execute('DELETE FROM player_loadout WHERE playerId = ?', [userId]);
        await connection.execute('DELETE FROM player_inventory WHERE playerId = ?', [userId]);

        // Delete all item instances (CASCADE will remove item_instance_cards automatically)
        const instanceIds = [
            ...stashInstances.map((r) => r.instance_id),
            ...loadoutInstances.map((r) => r.instance_id),
            ...invInstances.flatMap((r) => [
                r.helmet_instance,
                r.armor_instance,
                r.melee_instance,
                r.ranged_instance
            ])
        ].filter(Boolean);

        if (instanceIds.length > 0) {
            await connection.execute(
                `DELETE FROM item_instances WHERE instanceId IN (${instanceIds.map(() => '?').join(',')})`,
                instanceIds
            );
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

async function removeUserItems(userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Collect all instance IDs owned by this player
        const [stashRows] = await connection.execute(
            'SELECT instance_id FROM player_stash WHERE playerId = ? AND instance_id IS NOT NULL',
            [userId]
        );
        const [loadoutRows] = await connection.execute(
            'SELECT instance_id FROM player_loadout WHERE playerId = ? AND instance_id IS NOT NULL',
            [userId]
        );
        const [invRows] = await connection.execute(
            `SELECT helmet_instance, armor_instance, melee_instance, ranged_instance
             FROM player_inventory WHERE playerId = ?`,
            [userId]
        );

        // Delete item rows from stash and loadout (keep gold rows)
        await connection.execute(
            `DELETE FROM player_stash WHERE playerId = ? AND instance_id IS NOT NULL`,
            [userId]
        );
        await connection.execute(
            `DELETE FROM player_loadout WHERE playerId = ? AND instance_id IS NOT NULL`,
            [userId]
        );

        // Clear equipped slots in player_inventory
        await connection.execute(
            `UPDATE player_inventory
             SET helmet = NULL, armor = NULL, melee = NULL, ranged = NULL,
                 helmet_instance = NULL, armor_instance = NULL,
                 melee_instance = NULL, ranged_instance = NULL
             WHERE playerId = ?`,
            [userId]
        );

        // Delete all item_instances (CASCADE removes item_instance_cards)
        const instanceIds = [
            ...stashRows.map((r) => r.instance_id),
            ...loadoutRows.map((r) => r.instance_id),
            ...invRows.flatMap((r) => [
                r.helmet_instance,
                r.armor_instance,
                r.melee_instance,
                r.ranged_instance
            ])
        ].filter(Boolean);

        if (instanceIds.length > 0) {
            await connection.execute(
                `DELETE FROM item_instances WHERE instanceId IN (${instanceIds.map(() => '?').join(',')})`,
                instanceIds
            );
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function updateUserGold(userId, amount) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Remove all existing gold rows for this player from stash
        await connection.execute(
            `DELETE FROM player_stash WHERE playerId = ? AND gold IS NOT NULL AND armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL AND instance_id IS NULL`,
            [userId]
        );

        if (amount > 0) {
            await connection.execute(`INSERT INTO player_stash (playerId, gold) VALUES (?, ?)`, [
                userId,
                amount
            ]);
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserInventory(userId) {
    const query = `
        SELECT
            u.userId,
            u.name as username,
            pi.helmet as helmet_id,
            h.name as helmet_name,
            h.img_path as helmet_img,
            h.tier as helmet_tier,
            pi.armor as armor_id,
            a.name as armor_name,
            a.img_path as armor_img,
            a.tier as armor_tier,
            pi.melee as melee_id,
            m.name as melee_name,
            m.img_path as melee_img,
            m.tier as melee_tier,
            pi.ranged as ranged_id,
            r.name as ranged_name,
            r.img_path as ranged_img,
            r.tier as ranged_tier,
            COALESCE((
                SELECT SUM(ps.gold) FROM player_stash ps
                WHERE ps.playerId = u.userId AND ps.gold IS NOT NULL
                  AND ps.armor_id IS NULL AND ps.weapon_id IS NULL
                  AND ps.misc_item_id IS NULL AND ps.instance_id IS NULL
            ), 0) AS gold
        FROM user u
        JOIN player_inventory pi ON u.userId = pi.playerId
        LEFT JOIN armors h ON pi.helmet = h.armorId
        LEFT JOIN armors a ON pi.armor = a.armorId
        LEFT JOIN weapons m ON pi.melee = m.weaponId
        LEFT JOIN weapons r ON pi.ranged = r.weaponId
        WHERE u.userId = ?
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
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

        await connection.execute(
            `UPDATE player_inventory SET helmet = ?, armor = ?, melee = ?, ranged = ? WHERE playerId = ?`,
            [
                inventoryData.helmet,
                inventoryData.armor,
                inventoryData.melee,
                inventoryData.ranged,
                userId
            ]
        );

        await connection.execute(
            `DELETE FROM player_stash
             WHERE playerId = ? AND armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL`,
            [userId]
        );

        if (inventoryData.gold > 0) {
            await connection.execute(`INSERT INTO player_stash (playerId, gold) VALUES (?, ?)`, [
                userId,
                inventoryData.gold
            ]);
        }

        await connection.commit();
        return { affectedRows: 1 };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

//dungeonloot algorithm
async function upgradeWeakestGearDB(weakestSlot, playerId) {
    const query = `
        UPDATE player_inventory 
        SET ? = ? + 1
        WHERE playerId = ?
    `;
    const [result] = await pool.execute(query, [weakestSlot, weakestSlot, playerId]);
    return result;
}

//loot fetches
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
            `SELECT itemId AS id, name, img_path
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
             ORDER BY RAND()
             LIMIT ?`,
            [safeLimit]
        );

        return rows;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// itemSubtype: 'Melee'|'Ranged'|'Helmet'|'Armor' for card assignment (omit for misc)
async function insertIntoLoadout(playerId, type, itemId, itemSubtype, tier) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let instanceId = null;
        if (type !== 'misc') {
            const [result] = await connection.query(
                'INSERT INTO item_instances (item_type, item_ref_id) VALUES (?, ?)',
                [type, itemId]
            );
            instanceId = result.insertId;

            if (itemSubtype && tier != null) {
                const cards = pickCardsForItem(itemSubtype, tier);
                if (cards.length > 0) {
                    const values = cards.map((card, i) => [instanceId, card.id, i + 1]);
                    await connection.query(
                        'INSERT INTO item_instance_cards (instance_id, card_id, slot) VALUES ?',
                        [values]
                    );
                }
            }
        }

        let query;
        let params;
        if (type === 'weapon') {
            query = `INSERT INTO player_loadout (playerId, weapon_id, instance_id) VALUES (?, ?, ?)`;
            params = [playerId, itemId, instanceId];
        } else if (type === 'armor') {
            query = `INSERT INTO player_loadout (playerId, armor_id, instance_id) VALUES (?, ?, ?)`;
            params = [playerId, itemId, instanceId];
        } else if (type === 'misc') {
            query = `INSERT INTO player_loadout (playerId, misc_item_id) VALUES (?, ?)`;
            params = [playerId, itemId];
        } else {
            await connection.rollback();
            return { success: false, message: 'Invalid item type.' };
        }

        await connection.query(query, params);
        await connection.commit();
        return { success: true, message: 'Item inserted into loadout.', instanceId };
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return { success: false, message: 'Database error while inserting loot.' };
    } finally {
        connection.release();
    }
}

async function purchaseItemToLoadout(playerId, itemId, category, price) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            'SELECT COUNT(*) AS count FROM player_loadout WHERE playerId = ? AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)',
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
                'SELECT weaponId AS id, price, tier, type FROM weapons WHERE weaponId = ?',
                [itemId]
            );
            itemRow = rows[0];
        } else {
            const [rows] = await connection.query(
                'SELECT armorId AS id, price, tier, type FROM armors WHERE armorId = ?',
                [itemId]
            );
            itemRow = rows[0];
        }

        if (!itemRow) {
            await connection.rollback();
            return { success: false, message: 'Item not found.' };
        }

        const actualPrice = itemRow.price;

        if (totalGold < actualPrice) {
            await connection.rollback();
            return {
                success: false,
                message: `Not enough gold. Need ${actualPrice}, have ${totalGold}.`
            };
        }

        let remaining = actualPrice;
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

        const [instanceResult] = await connection.query(
            'INSERT INTO item_instances (item_type, item_ref_id) VALUES (?, ?)',
            [category, itemId]
        );
        const instanceId = instanceResult.insertId;

        const cards = pickCardsForItem(itemRow.type, itemRow.tier);
        if (cards.length > 0) {
            const cardValues = cards.map((card, i) => [instanceId, card.id, i + 1]);
            await connection.query(
                'INSERT INTO item_instance_cards (instance_id, card_id, slot) VALUES ?',
                [cardValues]
            );
        }

        if (category === 'weapon') {
            await connection.query(
                'INSERT INTO player_loadout (playerId, weapon_id, instance_id) VALUES (?, ?, ?)',
                [playerId, itemId, instanceId]
            );
        } else {
            await connection.query(
                'INSERT INTO player_loadout (playerId, armor_id, instance_id) VALUES (?, ?, ?)',
                [playerId, itemId, instanceId]
            );
        }

        await connection.commit();
        return { success: true, remainingGold: totalGold - actualPrice };
    } catch (error) {
        await connection.rollback();
        console.error('purchaseItemToLoadout error:', error);
        return { success: false, message: 'Database error during purchase.' };
    } finally {
        connection.release();
    }
}

async function getItemBaseInfo(itemId, category) {
    try {
        let query;
        if (category === 'weapon') {
            query = 'SELECT price, tier, type FROM weapons WHERE weaponId = ?';
        } else if (category === 'armor') {
            query = 'SELECT price, tier, type FROM armors WHERE armorId = ?';
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

//!Combat Deck Query
async function getPlayerCombatDeckCardIds(playerId) {
    const query = `
        SELECT iic.card_id
         FROM player_inventory pi
         JOIN item_instance_cards iic
           ON iic.instance_id IN (
               pi.helmet_instance,
               pi.armor_instance,
               pi.melee_instance,
               pi.ranged_instance
           )
         WHERE pi.playerId = ?
         `;
    const [rows] = await pool.execute(query, [playerId]);
    return rows;
}

async function getPlayerCombatDeck(playerId) {
    try {
        const rows = await getPlayerCombatDeckCardIds(playerId);
        if (rows.length === 0) {
            return { success: false, message: 'Játékos nem található' };
        }
        const deck = rows.map((row) => getCardById(row.card_id)).filter(Boolean);
        return { success: true, deck };
    } catch (error) {
        return { success: false, message: 'Hiba történt a kártyapakli lekérése során' };
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
    getTotalGold,
    addGoldToInventory,
    transferGoldBetweenStorage,
    getUserInventory,
    getAllUsers,
    getAllArmors,
    getAllWeapons,
    updateUserInventory,
    removeUserItems,
    updateUserGold,
    deleteUser,
    upgradeWeakestGearDB,
    fetchWeaponByTier,
    fetchArmorByTier,
    fetchRandomMisc,
    getRandomShopItems,
    insertIntoLoadout,
    purchaseItemToLoadout,
    getItemBaseInfo,
    getPlayerCombatDeckCardIds,
    getPlayerCombatDeck
};
