const bcrypt = require('bcrypt');
const { pickCardsForItem } = require('../../services/cardPool.js');
const { pool } = require('../core/connection.js');
const { findNextAvailableId } = require('../core/idHelpers.js');
const { createItemInstance } = require('../core/itemInstanceHelpers.js');

const SALT_ROUNDS = 12;
const MAX_PASSWORD_LENGTH = 15;
const MIN_PASSWORD_LENGTH = 6;
const MAX_USERNAME_LENGTH = 15;
const MIN_USERNAME_LENGTH = 3;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,128}$/;

async function selectall() {
    const [rows] = await pool.query('SELECT * FROM user');
    return rows;
}

async function loginUser(username, password) {
    try {
        if (!username || !password) {
            return { success: false, message: 'Missing username or password' };
        }
        if (typeof password !== 'string' || password.length > MAX_PASSWORD_LENGTH) {
            return { success: false, message: 'Incorrect password' };
        }
        const [rows] = await pool.query('SELECT * FROM user WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'Username does not exist' };
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { success: false, message: 'Incorrect password' };
        }

        return { success: true, userId: user.userId, message: 'Successful login' };
    } catch (error) {
        return { success: false, message: 'An error occurred during login' };
    }
}

async function registerUser(username, password) {
    try {
        if (!username || !password) {
            return { success: false, message: 'Missing username or password' };
        }
        if (typeof username !== 'string' || !USERNAME_REGEX.test(username)) {
            return {
                success: false,
                message: `Username must be ${MIN_USERNAME_LENGTH}–${MAX_USERNAME_LENGTH} characters: letters, numbers, or underscores only.`
            };
        }
        if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
            return {
                success: false,
                message: `Password must be ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters and include at least one letter and one number.`
            };
        }
        const [rows] = await pool.query('SELECT * FROM user WHERE name = ?', [username]);

        if (rows.length > 0) {
            return { success: false, message: 'User already exists' };
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
            return { success: true, userId, message: 'Successful registration' };
        } catch (error) {
            await connection.rollback();
            return { success: false, message: 'An error occurred during registration' };
        } finally {
            connection.release();
        }
    } catch (error) {
        return { success: false, message: 'An error occurred during registration' };
    }
}

async function loginAdmin(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'Username does not exist' };
        }

        const admin = rows[0];

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return { success: false, message: 'Incorrect password' };
        }

        return { success: true, adminId: admin.adminId, message: 'Successful login' };
    } catch (error) {
        return { success: false, message: 'An error occurred during login' };
    }
}

async function selectleadboard() {
    const query = `
        SELECT u.name,
               COALESCE(loadout_gold.total, 0) + COALESCE(stash_gold.total, 0) AS score
        FROM user u
        LEFT JOIN (
            SELECT playerId, SUM(gold_amount) AS total
            FROM player_loadout
            WHERE gold_amount IS NOT NULL
            GROUP BY playerId
        ) AS loadout_gold ON u.userId = loadout_gold.playerId
        LEFT JOIN (
            SELECT playerId, SUM(gold) AS total
            FROM player_stash
            WHERE armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
            GROUP BY playerId
        ) AS stash_gold ON u.userId = stash_gold.playerId
        ORDER BY score DESC
        LIMIT 10
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

async function getUserRankAndScore(username) {
    const query = `
        SELECT u.name,
               COALESCE(loadout_gold.total, 0) + COALESCE(stash_gold.total, 0) AS score,
               (
                   SELECT COUNT(*) + 1
                   FROM (
                       SELECT u2.userId,
                              COALESCE(lg2.total, 0) + COALESCE(sg2.total, 0) AS g
                       FROM user u2
                       LEFT JOIN (
                           SELECT playerId, SUM(gold_amount) AS total
                           FROM player_loadout
                           WHERE gold_amount IS NOT NULL
                           GROUP BY playerId
                       ) AS lg2 ON u2.userId = lg2.playerId
                       LEFT JOIN (
                           SELECT playerId, SUM(gold) AS total
                           FROM player_stash
                           WHERE armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
                           GROUP BY playerId
                       ) AS sg2 ON u2.userId = sg2.playerId
                   ) AS totals
                   WHERE totals.g > COALESCE(loadout_gold.total, 0) + COALESCE(stash_gold.total, 0)
               ) AS \`rank\`
        FROM user u
        LEFT JOIN (
            SELECT playerId, SUM(gold_amount) AS total
            FROM player_loadout
            WHERE gold_amount IS NOT NULL
            GROUP BY playerId
        ) AS loadout_gold ON u.userId = loadout_gold.playerId
        LEFT JOIN (
            SELECT playerId, SUM(gold) AS total
            FROM player_stash
            WHERE armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
            GROUP BY playerId
        ) AS stash_gold ON u.userId = stash_gold.playerId
        WHERE u.name = ?
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
