const express = require('express');
const router = express.Router();
const database = require('../sql/queries/authUserQueries.js');

router.get('/', async (request, response) => {
    console.log('Leaderboard endpoint called');
    try {
        const username = request.query.username;
        const top10 = await database.selectleadboard();

        let userData = null;
        if (username) {
            userData = await database.getUserRankAndScore(username);
        }

        response.status(200).json({
            message: 'leadboardadatoklekerve',
            top10: top10,
            user: userData
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        response.status(500).json({
            message: 'leadboardadatok nem sikerult lekerni',
            error: error.message
        });
    }
});

module.exports = router;
