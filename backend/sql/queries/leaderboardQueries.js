const { pool } = require('../core/connection.js');

async function selectLeaderboard() {
    const query = `
        SELECT u.name,
               COALESCE(ps.total, 0) AS score
        FROM user u
        LEFT JOIN (
            SELECT playerId, SUM(gold) AS total
            FROM player_stash
            WHERE armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
            GROUP BY playerId
        ) AS ps ON u.userId = ps.playerId
        ORDER BY score DESC
        LIMIT 10
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

async function getUserRankAndScore(username) {
    const query = `
        SELECT u.name,
               COALESCE(ps.total, 0) AS score,
               (
                   SELECT COUNT(*) + 1
                   FROM (
                       SELECT u2.userId,
                              COALESCE(sg2.total, 0) AS g
                       FROM user u2
                       LEFT JOIN (
                           SELECT playerId, SUM(gold) AS total
                           FROM player_stash
                           WHERE armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
                           GROUP BY playerId
                       ) AS sg2 ON u2.userId = sg2.playerId
                   ) AS totals
                   WHERE totals.g > COALESCE(ps.total, 0)
               ) AS \`rank\`
        FROM user u
        LEFT JOIN (
            SELECT playerId, SUM(gold) AS total
            FROM player_stash
            WHERE armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
            GROUP BY playerId
        ) AS ps ON u.userId = ps.playerId
        WHERE u.name = ?
    `;
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
}

module.exports = { selectLeaderboard, getUserRankAndScore };
