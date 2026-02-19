const express = require('express');
const router = express.Router();
const DungeonSession = require('../models/DungeonSession');

// Middleware: check if user has an active session
function requireSession(req, res, next) {
    if (!req.session || !req.session.userName) {
        return res.status(401).json({ success: false, message: 'Not logged in' });
    }
    next();
}

// Middleware: reconstruct DungeonSession from stored session data
function requireDungeon(req, res, next) {
    if (!req.session.dungeonData) {
        return res.status(400).json({ success: false, message: 'No active dungeon session' });
    }

    // Reconstruct the DungeonSession instance from serialized data
    req.dungeon = DungeonSession.fromJSON(req.session.dungeonData);

    // Validate session token if provided
    const token = req.body.sessionToken;
    if (token && token !== req.dungeon.sessionToken) {
        return res.status(403).json({ success: false, message: 'Invalid dungeon session token' });
    }
    next();
}

// Helper: persist dungeon state back to session
function saveDungeon(req) {
    req.session.dungeonData = req.dungeon.toJSON();
}

// POST /api/dungeon/start — Start a new dungeon run
router.post('/start', requireSession, (req, res) => {
    const { dungeonName } = req.body;
    const validDungeons = ['Laboratory', 'Crypt', 'Labyrinth', 'Gates of Hell'];

    if (!validDungeons.includes(dungeonName)) {
        return res.status(400).json({ success: false, message: 'Invalid dungeon name' });
    }

    const session = new DungeonSession(dungeonName, 1);

    // Store serialized dungeon in express session
    req.session.dungeonData = session.toJSON();

    res.json({
        success: true,
        sessionToken: session.sessionToken,
        dungeonName: session.dungeonName,
        dungeonLevel: session.dungeonLevel,
        map: session.getVisibleMap(),
        bounds: session.getMapBounds(),
        position: { ...session.playerPos },
        doors: session.getAdjacentDoors(),
        currentHP: 100
    });
});

// POST /api/dungeon/move — Move to an adjacent room
router.post('/move', requireSession, requireDungeon, (req, res) => {
    const { dx, dy } = req.body;
    const session = req.dungeon;

    const result = session.movePlayer(dx, dy);

    if (!result.success) {
        return res.status(400).json(result);
    }

    // Persist updated state
    saveDungeon(req);

    res.json(result);
});

// POST /api/dungeon/next-level — Descend to next level (only from 'out' room)
router.post('/next-level', requireSession, requireDungeon, (req, res) => {
    const session = req.dungeon;

    const result = session.nextLevel();

    if (!result.success) {
        return res.status(400).json(result);
    }

    // Persist updated state
    saveDungeon(req);

    res.json(result);
});

// POST /api/dungeon/exit — Exit dungeon (only from 'out' room)
router.post('/exit', requireSession, requireDungeon, (req, res) => {
    const session = req.dungeon;

    if (!session.canExit()) {
        return res.status(400).json({ success: false, message: 'Not at exit room' });
    }

    // Clear dungeon session
    delete req.session.dungeonData;

    res.json({
        success: true,
        message: 'Dungeon exited successfully',
        abandoned: false
    });
});

// POST /api/dungeon/abandon — Abandon dungeon from any room
router.post('/abandon', requireSession, requireDungeon, (req, res) => {
    delete req.session.dungeonData;

    res.json({
        success: true,
        message: 'Dungeon abandoned',
        abandoned: true
    });
});

// GET /api/dungeon/state — Get current dungeon state (for reconnection/page refresh)
router.get('/state', requireSession, (req, res) => {
    if (!req.session.dungeonData) {
        return res.json({ success: false, active: false });
    }

    const session = DungeonSession.fromJSON(req.session.dungeonData);

    res.json({
        success: true,
        active: true,
        sessionToken: session.sessionToken,
        dungeonName: session.dungeonName,
        dungeonLevel: session.dungeonLevel,
        map: session.getVisibleMap(),
        bounds: session.getMapBounds(),
        position: { ...session.playerPos },
        doors: session.getAdjacentDoors()
    });
});

module.exports = router;
