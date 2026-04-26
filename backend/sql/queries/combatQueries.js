const { getCardById } = require('../../services/cardPool.js');
const { pool } = require('../core/connection.js');

async function getPlayerCombatDeckCardIds(playerId) {
    const query = `
        SELECT iic.card_id
         FROM player_loadout pl
         JOIN item_instance_cards iic
           ON iic.instance_id = pl.instance_id
         WHERE pl.playerId = ? AND pl.equipped = 1 AND pl.instance_id IS NOT NULL
         `;
    const [rows] = await pool.execute(query, [playerId]);
    return rows;
}

async function getPlayerCombatDeck(playerId) {
    try {
        const rows = await getPlayerCombatDeckCardIds(playerId);
        if (rows.length === 0) {
            return { success: false, message: 'Player not found' };
        }
        const deck = rows.map((row) => getCardById(row.card_id)).filter(Boolean);
        return { success: true, deck };
    } catch (error) {
        return { success: false, message: 'An error occurred while fetching the combat deck' };
    }
}

module.exports = {
    getPlayerCombatDeckCardIds,
    getPlayerCombatDeck
};
