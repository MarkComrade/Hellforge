const express = require('express');
const router = express.Router();
const database = require('../sql/queries/inventoryQueries.js');
const { requireLogin } = require('./middleware');

// All inventory endpoints require an active login — the playerId is always
// taken from the session so no client can touch another player's data.
router.use(requireLogin);

//!Endpoints:

router.get('/stash', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    try {
        const result = await database.getStash(playerId);
        response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/stash/count', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    try {
        const count = await database.getStashCount(playerId);
        response.status(200).json({ success: true, count, limit: 50 });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.delete('/stash/remove', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    const { stashId } = request.body;
    if (!stashId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.removeFromStash(stashId, playerId);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/equipment', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    try {
        const result = await database.getPlayerInventory(playerId);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/swap', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    const { stashId, slot } = request.body;
    if (!stashId || !slot) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.swapEquipment(playerId, stashId, slot);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/loadout', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    try {
        const result = await database.getLoadout(playerId);
        response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/moveToInventory', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    const { stashId } = request.body;
    if (!stashId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.moveStashToLoadout(playerId, stashId);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/loadout/swap', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    const { loadoutId, slot } = request.body;
    if (!loadoutId || !slot) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.swapLoadoutEquipment(playerId, loadoutId, slot);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.delete('/loadout/remove', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    const { loadoutId } = request.body;
    if (!loadoutId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.deleteFromLoadout(playerId, loadoutId);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/loadout/moveToStash', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    const { loadoutId } = request.body;
    if (!loadoutId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.moveLoadoutToStash(playerId, loadoutId);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/gold', async (request, response) => {
    const playerId = parseInt(request.session.userId, 10);
    try {
        const result = await database.getTotalGold(playerId);
        response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/gold/transfer', async (request, response) => {
    const parsedPlayerId = parseInt(request.session.userId, 10);
    const { from, amount } = request.body;
    const parsedAmount = parseInt(amount, 10);

    if (!from || !Number.isInteger(parsedPlayerId) || parsedPlayerId <= 0) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
        return response
            .status(400)
            .json({ success: false, message: 'Az összeg pozitív egész szám kell legyen' });
    }

    if (from !== 'stash' && from !== 'loadout') {
        return response.status(400).json({ success: false, message: 'Érvénytelen forrás tároló' });
    }

    try {
        const result = await database.transferGoldBetweenStorage(
            parsedPlayerId,
            from,
            parsedAmount
        );
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

module.exports = router;
