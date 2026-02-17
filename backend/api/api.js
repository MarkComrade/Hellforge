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
router.get('/leaderboard', async (request, response) => {
    console.log('Leaderboard endpoint called'); // Debug
    try {
        const username = request.query.username; // Get username from query params
        const top10 = await database.selectleadboard();
        console.log('Top 10 results:', top10); // Debug

        let userData = null;
        if (username) {
            userData = await database.getUserRankAndScore(username);
            console.log('User data:', userData); // Debug
        }

        response.status(200).json({
            message: 'leadboardadatoklekerve',
            top10: top10,
            user: userData
        });
    } catch (error) {
        console.error('Leaderboard error:', error); // Debug
        response.status(500).json({
            message: 'leadboardadatok nem sikerult lekerni',
            error: error.message
        });
    }
});

module.exports = router;
