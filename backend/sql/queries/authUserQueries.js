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
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,15}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,15}$/;

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
                let subType;
                if (gear.slot === 'helmet') subType = 'Helmet';
                else if (gear.slot === 'armor') subType = 'Armor';
                else if (gear.slot === 'melee') subType = 'Melee';
                else subType = 'Ranged';
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

async function getAllUsers() {
    const query = 'SELECT userId, name FROM user ORDER BY userId ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

module.exports = {
    loginUser,
    registerUser,
    loginAdmin,
    getAllUsers
};
