const express = require('express');
const router = express.Router();
const database = require('../sql/queries/inventoryQueries.js');
const { requireLogin } = require('./middleware');

// All inventory endpoints require an active login — the playerId is always
// taken from the session so no client can touch another player's data.
router.use(requireLogin);

router.get('/stash', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    try {
        const result = await database.getStash(playerId);
        res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/stash/count', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    try {
        const count = await database.getStashCount(playerId);
        res.status(200).json({ success: true, count, limit: 50 });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/stash/remove', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    const { stashId } = req.body;
    if (!stashId) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    try {
        const result = await database.removeFromStash(stashId, playerId);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/equipment', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    try {
        const result = await database.getPlayerInventory(playerId);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/stash/swap', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    const { stashId, slot } = req.body;
    if (!stashId || !slot) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    try {
        const result = await database.swapEquipment(playerId, stashId, slot);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/loadout', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    try {
        const result = await database.getLoadout(playerId);
        res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/stash/moveToInventory', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    const { stashId } = req.body;
    if (!stashId) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    try {
        const result = await database.moveStashToLoadout(playerId, stashId);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/loadout/swap', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    const { loadoutId, slot } = req.body;
    if (!loadoutId || !slot) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    try {
        const result = await database.swapLoadoutEquipment(playerId, loadoutId, slot);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/loadout/remove', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    const { loadoutId } = req.body;
    if (!loadoutId) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    try {
        const result = await database.deleteFromLoadout(playerId, loadoutId);
        res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/loadout/moveToStash', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    const { loadoutId } = req.body;
    if (!loadoutId) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }
    try {
        const result = await database.moveLoadoutToStash(playerId, loadoutId);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/gold', async (req, res) => {
    const playerId = parseInt(req.session.userId, 10);
    try {
        const result = await database.getTotalGold(playerId);
        res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/gold/transfer', async (req, res) => {
    const parsedPlayerId = parseInt(req.session.userId, 10);
    const { from, amount } = req.body;
    const parsedAmount = parseInt(amount, 10);

    if (!from || !Number.isInteger(parsedPlayerId) || parsedPlayerId <= 0) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
        return res
            .status(400)
            .json({ success: false, message: 'Amount must be a positive integer' });
    }

    if (from !== 'stash' && from !== 'loadout') {
        return res.status(400).json({ success: false, message: 'Invalid source storage' });
    }

    try {
        const result = await database.transferGoldBetweenStorage(
            parsedPlayerId,
            from,
            parsedAmount
        );
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
