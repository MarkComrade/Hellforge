const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { error } = require('console');

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
router.get('/lootAlgorithm', async (request, response) => {
    const dungeon = req.dungeon;
    const dungonlevel = dungeon.dungeonLevel;
    const loot = database.lootAlgorithm(dungonlevel);
    response.status(200).json({
        message: 'Loot algorithm endpoint működik.',
        loot: loot
    });
    response.status(500).json({
        message: 'Loot algorithm endpoint nem működik.',
        error: error.message
    });
});

module.exports = router;
