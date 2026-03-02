const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//!Endpoints:

//?GET /api/inventory/stash/:playerId - Stash lekérése
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

//?GET /api/inventory/stash/count/:playerId - Stash tárgyak száma
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

//?POST /api/inventory/stash/addArmor - Páncél hozzáadása a stash-hez
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

//?POST /api/inventory/stash/addWeapon - Fegyver hozzáadása a stash-hez
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

//?POST /api/inventory/stash/addMisc - Misc tárgy hozzáadása a stash-hez
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

//?DELETE /api/inventory/stash/remove - Tárgy eltávolítása a stash-ből
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

//?GET /api/inventory/equipment/:playerId - Felszerelés lekérése
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

//?POST /api/inventory/stash/swap - Felszerelés cseréje stash tárggyal
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

module.exports = router;
