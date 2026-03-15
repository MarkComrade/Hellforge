const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//!Endpoints:

router.get('/stash/:playerId', async (request, response) => {
    const playerId = parseInt(request.params.playerId);
    if (!playerId) {
        return response
            .status(400)
            .json({ success: false, message: 'Érvénytelen játékos azonosító' });
    }
    try {
        const result = await database.getStash(playerId);
        response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/stash/count/:playerId', async (request, response) => {
    const playerId = parseInt(request.params.playerId);
    if (!playerId) {
        return response
            .status(400)
            .json({ success: false, message: 'Érvénytelen játékos azonosító' });
    }
    try {
        const count = await database.getStashCount(playerId);
        response.status(200).json({ success: true, count, limit: 60 });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/addArmor', async (request, response) => {
    const { playerId, armorId } = request.body;
    if (!playerId || !armorId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.addArmorToStash(playerId, armorId);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/addWeapon', async (request, response) => {
    const { playerId, weaponId } = request.body;
    if (!playerId || !weaponId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.addWeaponToStash(playerId, weaponId);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/addMisc', async (request, response) => {
    const { playerId, miscItemId } = request.body;
    if (!playerId || !miscItemId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.addMiscToStash(playerId, miscItemId);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.delete('/stash/remove', async (request, response) => {
    const { stashId, playerId } = request.body;
    if (!stashId || !playerId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.removeFromStash(stashId, playerId);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/equipment/:playerId', async (request, response) => {
    const playerId = parseInt(request.params.playerId);
    if (!playerId) {
        return response
            .status(400)
            .json({ success: false, message: 'Érvénytelen játékos azonosító' });
    }
    try {
        const result = await database.getPlayerInventory(playerId);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/swap', async (request, response) => {
    const { playerId, stashId, slot } = request.body;
    if (!playerId || !stashId || !slot) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.swapEquipment(playerId, stashId, slot);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.get('/loadout/:playerId', async (request, response) => {
    const playerId = parseInt(request.params.playerId);
    if (!playerId) {
        return response
            .status(400)
            .json({ success: false, message: 'Érvénytelen játékos azonosító' });
    }
    try {
        const result = await database.getLoadout(playerId);
        response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

router.post('/stash/moveToInventory', async (request, response) => {
    const { playerId, stashId } = request.body;
    if (!playerId || !stashId) {
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
    const { playerId, loadoutId, slot } = request.body;
    if (!playerId || !loadoutId || !slot) {
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
    const { playerId, loadoutId } = request.body;
    if (!playerId || !loadoutId) {
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
    const { playerId, loadoutId } = request.body;
    if (!playerId || !loadoutId) {
        return response.status(400).json({ success: false, message: 'Hiányzó paraméterek' });
    }
    try {
        const result = await database.moveLoadoutToStash(playerId, loadoutId);
        response.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'Szerver hiba' });
    }
});

module.exports = router;
