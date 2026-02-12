const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3939,
    user: 'root',
    password: 'falafel',
    database: 'hellforge_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
async function selectall() {
    const query = 'SELECT * FROM user;';
    const [rows] = await pool.execute(query);
    return rows;
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

//!Export
module.exports = {
    pool,
    selectall,
    selectleadboard,
    getUserRankAndScore
};
