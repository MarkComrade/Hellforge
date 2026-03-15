const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});
//sadsaasd
//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});
router.get('/getAllUsers', async (request, response) => {
    try {
        const result = await database.getAllUsers();
        response.status(200).json({
            message: 'A Users successfully retrieved.',
            results: result
        });
    } catch (error) {
        response.status(500).json({
            message: 'this endpoint is not working.'
        });
    }
});
// TODO: In the future, this should add user to ban list instead of hard delete
router.post('/deleteUser/:userId', async (request, response) => {
    try {
        const userId = request.params.userId;

        if (!userId) {
            return response.status(400).json({
                message: 'User ID is required.',
                success: false
            });
        }

        // Get username first for deletion (database.deleteUser expects username)
        const inventory = await database.getUserInventory(userId);
        if (!inventory) {
            return response.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        const result = await database.deleteUser(inventory.username);
        response.status(200).json({
            message: 'User successfully deleted.',
            success: true,
            results: result
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error deleting user: ' + error.message,
            success: false
        });
    }
});

router.get('/getUserInventory/:userId', async (request, response) => {
    try {
        const userId = request.params.userId;
        const inventory = await database.getUserInventory(userId);

        if (!inventory) {
            return response.status(404).json({
                message: 'User or inventory not found.'
            });
        }

        response.status(200).json({
            message: 'Inventory successfully retrieved.',
            inventory: inventory
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error retrieving inventory.',
            error: error.message
        });
    }
});

router.get('/getAllArmors', async (request, response) => {
    try {
        const armors = await database.getAllArmors();
        response.status(200).json({
            message: 'Armors successfully retrieved.',
            armors: armors
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error retrieving armors.',
            error: error.message
        });
    }
});

router.get('/getAllWeapons', async (request, response) => {
    try {
        const weapons = await database.getAllWeapons();
        response.status(200).json({
            message: 'Weapons successfully retrieved.',
            weapons: weapons
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error retrieving weapons.',
            error: error.message
        });
    }
});

router.post('/updateUserInventory/:userId', upload.none(), async (request, response) => {
    try {
        const userId = request.params.userId;
        const { gold, helmet, armor, melee, ranged } = request.body;

        // Validate input
        if (gold === undefined || !helmet || !armor || !melee || !ranged) {
            return response.status(400).json({
                message: 'All inventory fields are required.'
            });
        }

        await database.updateUserInventory(userId, {
            gold: parseInt(gold),
            helmet: parseInt(helmet),
            armor: parseInt(armor),
            melee: parseInt(melee),
            ranged: parseInt(ranged)
        });

        response.status(200).json({
            message: 'Inventory successfully updated.',
            success: true
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error updating inventory.',
            error: error.message
        });
    }
});

module.exports = router;
