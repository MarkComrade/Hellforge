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
async function getAllUsers() {
    const query = 'SELECT userId, name FROM user ORDER BY userId ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

async function deleteUser(username) {
    const query = 'DELETE FROM user WHERE name = ?';
    const [result] = await pool.execute(query, [username]);
    return result;
}

async function getUserInventory(userId) {
    const query = `
        SELECT 
            u.userId,
            u.name as username,
            pi.gold,
            h.name as helmet_name,
            h.img_path as helmet_img,
            h.tier as helmet_tier,
            a.name as armor_name,
            a.img_path as armor_img,
            a.tier as armor_tier,
            m.name as melee_name,
            m.img_path as melee_img,
            m.tier as melee_tier,
            r.name as ranged_name,
            r.img_path as ranged_img,
            r.tier as ranged_tier
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

//!Export
module.exports = {
    pool,
    selectleadboard,
    getUserRankAndScore,
    loginUser,
    registerUser,
    loginAdmin,
    getAllUsers,
    deleteUser,
    getUserInventory
};
