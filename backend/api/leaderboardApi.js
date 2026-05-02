const express = require('express');
const router = express.Router();
const database = require('../sql/queries/leaderboardQueries.js');

router.get('/', async (req, res) => {
    try {
        const username = req.query.username;
        const top10 = await database.selectLeaderboard();

        let userData = null;
        if (username) {
            userData = await database.getUserRankAndScore(username);
        }

        res.status(200).json({ success: true, top10, user: userData });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve leaderboard.' });
    }
});

module.exports = router;
