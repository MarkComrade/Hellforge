const bcrypt = require('bcrypt');
const { pickCardsForItem } = require('../../services/cardPool.js');
const { pool } = require('../core/connection.js');
const { findNextAvailableId } = require('../core/idHelpers.js');
const { createItemInstance } = require('../core/itemInstanceHelpers.js');

const SALT_ROUNDS = 12;

async function selectall() {
    const [rows] = await pool.query('SELECT * FROM user');
    return rows;
}

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

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const userId = await findNextAvailableId('user', 'userId', connection);
            await connection.query('INSERT INTO user (userId, name, password) VALUES (?, ?, ?)', [
                userId,
                username,
                hashedPassword
            ]);

            const starterGear = [
                { slot: 'helmet', armor_id: 1, weapon_id: null },
                { slot: 'armor', armor_id: 2, weapon_id: null },
                { slot: 'melee', armor_id: null, weapon_id: 1 },
                { slot: 'ranged', armor_id: null, weapon_id: 2 }
            ];

            for (const gear of starterGear) {
                const sourceType = gear.armor_id ? 'armor' : 'weapon';
                const sourceId = gear.armor_id || gear.weapon_id;
                const subType =
                    gear.slot === 'helmet'
                        ? 'Helmet'
                        : gear.slot === 'armor'
                          ? 'Armor'
                          : gear.slot === 'melee'
                            ? 'Melee'
                            : 'Ranged';
                const starterCards = pickCardsForItem(subType, 1);
                const instanceId = await createItemInstance(
                    connection,
                    sourceType,
                    sourceId,
                    starterCards
                );

                const loadoutId = await findNextAvailableId(
                    'player_loadout',
                    'loadoutId',
                    connection
                );
                await connection.query(
                    'INSERT INTO player_loadout (loadoutId, playerId, armor_id, weapon_id, equipped, slot, instance_id) VALUES (?, ?, ?, ?, 1, ?, ?)',
                    [loadoutId, userId, gear.armor_id, gear.weapon_id, gear.slot, instanceId]
                );
            }

            await connection.commit();
            return { success: true, userId, message: 'Sikeres regisztráció' };
        } catch (error) {
            await connection.rollback();
            return { success: false, message: 'Hiba történt a regisztráció során' };
        } finally {
            connection.release();
        }
    } catch (error) {
        return { success: false, message: 'Hiba történt a regisztráció során' };
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
        SELECT u.name,
               COALESCE(SUM(pl.gold_amount), 0) + COALESCE(SUM(ps.gold), 0) AS score
        FROM user u
        LEFT JOIN player_loadout pl ON u.userId = pl.playerId AND pl.gold_amount IS NOT NULL
        LEFT JOIN player_stash ps ON u.userId = ps.playerId
            AND ps.armor_id IS NULL AND ps.weapon_id IS NULL AND ps.misc_item_id IS NULL
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
               COALESCE(SUM(pl.gold_amount), 0) + COALESCE(SUM(ps.gold), 0) AS score,
               (
                   SELECT COUNT(*) + 1
                   FROM (
                       SELECT u2.userId,
                              COALESCE(SUM(pl2.gold_amount), 0) + COALESCE(SUM(ps2.gold), 0) AS g
                       FROM user u2
                       LEFT JOIN player_loadout pl2 ON u2.userId = pl2.playerId AND pl2.gold_amount IS NOT NULL
                       LEFT JOIN player_stash ps2 ON u2.userId = ps2.playerId
                           AND ps2.armor_id IS NULL AND ps2.weapon_id IS NULL AND ps2.misc_item_id IS NULL
                       GROUP BY u2.userId
                   ) AS totals
                   WHERE totals.g > COALESCE(SUM(pl.gold_amount), 0) + COALESCE(SUM(ps.gold), 0)
               ) AS \`rank\`
        FROM user u
        LEFT JOIN player_loadout pl ON u.userId = pl.playerId AND pl.gold_amount IS NOT NULL
        LEFT JOIN player_stash ps ON u.userId = ps.playerId
            AND ps.armor_id IS NULL AND ps.weapon_id IS NULL AND ps.misc_item_id IS NULL
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

module.exports = {
    selectall,
    loginUser,
    registerUser,
    loginAdmin,
    selectleadboard,
    getUserRankAndScore,
    getAllUsers
};
