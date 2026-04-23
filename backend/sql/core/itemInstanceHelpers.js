const { getCardById } = require('../../services/cardPool.js');
const { pool } = require('./connection.js');
const { findNextAvailableId } = require('./idHelpers.js');

async function createItemInstance(connection, itemType, itemId, cards = []) {
    if (itemType === 'misc') {
        return null;
    }

    const instanceId = await findNextAvailableId('item_instances', 'instanceId', connection);
    await connection.query(
        'INSERT INTO item_instances (instanceId, item_type, item_ref_id) VALUES (?, ?, ?)',
        [instanceId, itemType, itemId]
    );

    for (let i = 0; i < cards.length; i++) {
        const cardId = Number(cards[i]?.id ?? cards[i]);
        if (!Number.isInteger(cardId) || cardId <= 0) {
            throw new Error(`Invalid card id at index ${i}`);
        }
        const cardRowId = await findNextAvailableId('item_instance_cards', 'id', connection);
        await connection.query(
            'INSERT INTO item_instance_cards (id, instance_id, card_id, slot) VALUES (?, ?, ?, ?)',
            [cardRowId, instanceId, cardId, i + 1]
        );
    }

    return instanceId;
}

async function getCardsByInstanceIds(instanceIds) {
    if (!Array.isArray(instanceIds) || instanceIds.length === 0) {
        return {};
    }

    const [cardRows] = await pool.query(
        `SELECT instance_id, card_id
         FROM item_instance_cards
         WHERE instance_id IN (?)
         ORDER BY instance_id ASC, slot ASC`,
        [instanceIds]
    );

    const cardsByInstance = {};
    for (const row of cardRows) {
        if (!cardsByInstance[row.instance_id]) {
            cardsByInstance[row.instance_id] = [];
        }
        const card = getCardById(row.card_id);
        if (card) {
            cardsByInstance[row.instance_id].push(card);
        }
    }

    return cardsByInstance;
}

module.exports = {
    createItemInstance,
    getCardsByInstanceIds
};
