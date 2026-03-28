const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const { generateAndInsertLoot } = require('../services/lootAlgorithm.js');
const fs = require('fs/promises');
const DungeonSession = require('../models/DungeonSession.js');
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

function getDungeonFromSession(request) {
    if (!request.session?.dungeonData) {
        return null;
    }

    return DungeonSession.fromJSON(request.session.dungeonData);
}

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    console.log('SQL teszt végpont meghívva');
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
router.get('/lootAlgorithm/:playerId', async (request, response) => {
    const playerId = parseInt(request.params.playerId);
    try {
        const dungeon = getDungeonFromSession(request);
        const loot = await generateAndInsertLoot(
            playerId,
            dungeon.dungeonName,
            dungeon.dungeonLevel
        );
        response.status(200).json({
            success: true,
            loot: loot
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
