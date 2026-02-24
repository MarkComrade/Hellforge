const express = require('express');
const router = express.Router();
const DungeonSession = require('../models/DungeonSession.js');

// Valid dungeon names — reject anything not in this list
const VALID_DUNGEONS = ['Laboratory', 'Crypt', 'Labyrinth', 'Gates of Hell'];

// Simple per-session rate limiter for moves (prevents speedhack scripts)
const MOVE_COOLDOWN_MS = 150; // minimum ms between moves
const lastMoveTime = new Map(); // sessionId → timestamp

// ───── Middleware ─────
// These functions run BEFORE the actual route handler.
// Express calls them in order: requireSession → requireDungeon → route handler.
// If any middleware calls res.status().json() it stops the chain (the route never runs).

// Like requireSession but allows guests — if no session identity exists,
// automatically assign a guest identity so unauthenticated users can play.
function allowGuest(req, res, next) {
    if (!req.session.userName) {
        req.session.userName = 'Guest';
        req.session.isLoggedIn = false;
    }
    next();
}

// Reconstructs the DungeonSession object from the session store and attaches it to req.dungeon.
// express-session stores data as plain JSON, so we lose the class prototype and Set objects.
// fromJSON() rebuilds the full DungeonSession instance (restores Sets, prototype methods, etc.).
// The sessionToken check prevents one browser tab from controlling another tab's dungeon.
function requireDungeon(req, res, next) {
    if (!req.session.dungeonData) {
        return res.status(400).json({ success: false, message: 'No active dungeon' });
    }
    // Deserialize: plain JSON → DungeonSession instance with working methods
    const dungeon = DungeonSession.fromJSON(req.session.dungeonData);
    // SECURITY: token is mandatory — without this check a request missing sessionToken
    // would skip validation entirely, letting anyone control the dungeon
    const token = req.body.sessionToken || req.query.sessionToken;
    if (!token || token !== dungeon.sessionToken) {
        return res.status(403).json({ success: false, message: 'Invalid session token' });
    }
    req.dungeon = dungeon; // attach so the route handler can use it
    next();
}

// Persist the dungeon state back into the session after any change.
// toJSON() converts Sets back to Arrays so express-session can serialize it.
function saveDungeon(req) {
    req.session.dungeonData = req.dungeon.toJSON();
}

// ───── Endpoints ─────

// Creates a fresh dungeon — generates the map server-side and sends it to the client
router.post('/start', allowGuest, (req, res) => {
    try {
        const { dungeonName } = req.body;
        // SECURITY: only allow known dungeon names — prevents injection of arbitrary strings
        if (!dungeonName || !VALID_DUNGEONS.includes(dungeonName)) {
            return res.status(400).json({ success: false, message: 'Invalid dungeon name' });
        }
        // The constructor generates the map automatically (random walk algorithm)
        const dungeon = new DungeonSession(dungeonName);
        req.dungeon = dungeon;
        saveDungeon(req);

        // Send map, position, doors, bounds, etc. to the client
        res.json(dungeon.getClientState());
    } catch (error) {
        console.error('Dungeon start error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Move the player one cell — dx/dy must be a cardinal direction (e.g. dx=1,dy=0 = right)
// movePlayer() returns null if the target cell doesn't exist (wall), preventing cheating
router.post('/move', allowGuest, requireDungeon, (req, res) => {
    try {
        const { dx, dy } = req.body;
        if (dx === undefined || dy === undefined) {
            return res.status(400).json({ success: false, message: 'Missing dx/dy' });
        }

        // SECURITY: strict integer validation — reject NaN, floats, huge values
        const ndx = Number(dx);
        const ndy = Number(dy);
        if (!Number.isInteger(ndx) || !Number.isInteger(ndy)) {
            return res.status(400).json({ success: false, message: 'dx/dy must be integers' });
        }

        // SECURITY: rate limit — prevent automated scripts from traversing instantly
        const sessionId = req.sessionID;
        const now = Date.now();
        if (lastMoveTime.has(sessionId) && now - lastMoveTime.get(sessionId) < MOVE_COOLDOWN_MS) {
            return res.status(429).json({ success: false, message: 'Moving too fast' });
        }
        lastMoveTime.set(sessionId, now);

        // Server validates: only cardinal moves, only to existing rooms
        const result = req.dungeon.movePlayer(ndx, ndy);
        if (!result) {
            return res.json({ success: false, message: 'Invalid move' });
        }

        saveDungeon(req);
        // Spread result into response (position, roomType, doors, visited)
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Move error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Advance to the next dungeon level — only allowed when standing on the exit ('out') room.
// This is the anti-cheat gate: clients can't skip levels because the server checks position.
router.post('/next-level', allowGuest, requireDungeon, (req, res) => {
    try {
        const dungeon = req.dungeon;
        // Build the map key from current coords to look up what room the player is in
        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[currentKey];

        // Reject if player isn't on the exit room — prevents skipping via modified requests
        if (!currentRoom || currentRoom.roomType !== 'out') {
            return res.status(400).json({ success: false, message: 'Not on exit room' });
        }

        // Generate a brand-new map for the next level.
        // We create a fresh DungeonSession (which runs generateMap() in its constructor),
        // then copy over the session token and HP so the run feels continuous.
        const nextLevel = new DungeonSession(dungeon.dungeonName, dungeon.dungeonLevel + 1);
        nextLevel.sessionToken = dungeon.sessionToken; // keep the same token across levels
        nextLevel.currentHP = dungeon.currentHP; // carry over the player's HP

        req.dungeon = nextLevel;
        saveDungeon(req);

        res.json(nextLevel.getClientState());
    } catch (error) {
        console.error('Next level error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Leave the dungeon — only allowed from the exit room
router.post('/exit', allowGuest, requireDungeon, (req, res) => {
    try {
        const dungeon = req.dungeon;
        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[currentKey];

        if (!currentRoom || currentRoom.roomType !== 'out') {
            return res.status(400).json({ success: false, message: 'Not on exit room' });
        }

        // Wipe dungeon data from the session so the player can start a new run
        delete req.session.dungeonData;
        res.json({ success: true, message: 'Dungeon exited' });
    } catch (error) {
        console.error('Exit error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Abandon — quit the dungeon from any room (no exit-room check)
router.post('/abandon', allowGuest, requireDungeon, (req, res) => {
    try {
        delete req.session.dungeonData;
        res.json({ success: true, message: 'Dungeon abandoned' });
    } catch (error) {
        console.error('Abandon error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Returns the full dungeon state — useful for reconnecting or debugging
router.get('/state', allowGuest, requireDungeon, (req, res) => {
    try {
        res.json(req.dungeon.getClientState());
    } catch (error) {
        console.error('State error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
