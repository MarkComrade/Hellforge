const express = require('express');
const router = express.Router();
const DungeonSession = require('../models/DungeonSession.js');
const { resolveDungeonRoomLoot } = require('../services/lootAlgorithm.js');
const { eventManager } = require('../services/eventGeneration.js');
const { getLoadout } = require('../sql/queries/inventoryQueries.js');

// Valid dungeon names — reject anything not in this list
const VALID_DUNGEONS = ['Laboratory', 'Crypt', 'Labyrinth', 'Gates of Hell'];

const DUNGEON_GEAR_REQUIREMENTS = {
    Crypt: { minTier: 1, requiredPieces: 0 },
    Labyrinth: { minTier: 2, requiredPieces: 2 },
    Laboratory: { minTier: 3, requiredPieces: 2 },
    'Gates of Hell': { minTier: 4, requiredPieces: 2 }
};

async function checkGearRequirement(playerId, dungeonName) {
    const req = DUNGEON_GEAR_REQUIREMENTS[dungeonName];
    if (!req || req.requiredPieces === 0) return { allowed: true };

    const result = await getLoadout(playerId);
    if (!result.success) return { allowed: false, message: 'Could not verify gear requirements.' };

    const qualifyingPieces = result.loadout.filter((row) => {
        const armorTier = Number(row.armor_tier);
        const weaponTier = Number(row.weapon_tier);
        return armorTier >= req.minTier || weaponTier >= req.minTier;
    }).length;

    if (qualifyingPieces < req.requiredPieces) {
        return {
            allowed: false,
            message: `You need at least ${req.requiredPieces} piece(s) of tier ${req.minTier}+ gear to enter ${dungeonName}.`
        };
    }
    return { allowed: true };
}

// Simple per-session rate limiter for moves (prevents speedhack scripts)
const MOVE_COOLDOWN_MS = 150; // minimum ms between moves
const lastMoveTime = new Map(); // sessionId → timestamp
const GOLD_IMG_PATH = '../textures/items/coing.png';
const MAX_DUNGEON_LEVEL = 20;

// ───── Middleware ─────
// These functions run BEFORE the actual route handler.
// Express calls them in order: requireSession → requireDungeon → route handler.
// If any middleware calls res.status().json() it stops the chain (the route never runs).

// Rejects unauthenticated requests — players must be logged in to use dungeon features.
function requireLogin(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ success: false, message: 'Login required' });
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

function enrichEvent(event) {
    if (!event || !event.success) return event;
    event.goldImgPath = event.goldImgPath || GOLD_IMG_PATH;
    if (event.item) {
        event.item.img_path = event.item.img_path || event.item.img || null;
    }
    return event;
}

// ───── Endpoints ─────

// Creates a fresh dungeon — generates the map server-side and sends it to the client
router.post('/start', requireLogin, async (req, res) => {
    try {
        const { dungeonName } = req.body;
        // SECURITY: only allow known dungeon names — prevents injection of arbitrary strings
        if (!dungeonName || !VALID_DUNGEONS.includes(dungeonName)) {
            return res.status(400).json({ success: false, message: 'Invalid dungeon name' });
        }

        const gearCheck = await checkGearRequirement(req.session.playerId, dungeonName);
        if (!gearCheck.allowed) {
            return res.status(403).json({ success: false, message: gearCheck.message });
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
router.post('/move', requireLogin, requireDungeon, async (req, res) => {
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

        const targetX = req.dungeon.playerX + ndx;
        const targetY = req.dungeon.playerY + ndy;
        const targetKey = `${targetX},${targetY}`;
        const targetRoom = req.dungeon.map[targetKey];
        const wasVisited = !!targetRoom?.visited;

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

        let Event = null;
        const playerId = Number(req.session.userId);
        if (!wasVisited) {
            if (result.roomType === 'loot') {
                if (Number.isInteger(playerId) && playerId > 0) {
                    Event = await resolveDungeonRoomLoot(req.dungeon, targetKey, playerId);
                } else {
                    Event = {
                        success: false,
                        message: 'Loot event skipped: no logged-in player.'
                    };
                }
            }

            if (result.roomType === 'event') {
                Event = await eventManager(req.dungeon, playerId);
            }

            enrichEvent(Event);
        } else if (
            result.roomType === 'loot' &&
            Number.isInteger(playerId) &&
            playerId > 0 &&
            req.dungeon.roomLoot?.[targetKey] &&
            req.dungeon.roomLoot[targetKey].itemCollected === false
        ) {
            Event = await resolveDungeonRoomLoot(req.dungeon, targetKey, playerId);
            enrichEvent(Event);
        }

        saveDungeon(req);
        // Spread result into response (position, roomType, doors, visited)
        res.json({ success: true, ...result, Event });
    } catch (error) {
        console.error('Move error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Advance to the next dungeon level — only allowed when standing on the exit ('out') room.
// This is the anti-cheat gate: clients can't skip levels because the server checks position.
router.post('/next-level', requireLogin, requireDungeon, (req, res) => {
    try {
        const dungeon = req.dungeon;
        // Build the map key from current coords to look up what room the player is in
        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[currentKey];

        // Reject if player isn't on the exit room — prevents skipping via modified requests
        if (!currentRoom || currentRoom.roomType !== 'out') {
            return res.status(400).json({ success: false, message: 'Not on exit room' });
        }

        if (dungeon.dungeonLevel >= MAX_DUNGEON_LEVEL) {
            return res.status(400).json({
                success: false,
                message: `Maximum dungeon level reached (${MAX_DUNGEON_LEVEL})`
            });
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
router.post('/exit', requireLogin, requireDungeon, (req, res) => {
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
router.post('/abandon', requireLogin, requireDungeon, (req, res) => {
    try {
        delete req.session.dungeonData;
        res.json({ success: true, message: 'Dungeon abandoned' });
    } catch (error) {
        console.error('Abandon error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Returns the full dungeon state — useful for reconnecting or debugging
router.get('/state', requireLogin, requireDungeon, (req, res) => {
    try {
        res.json(req.dungeon.getClientState());
    } catch (error) {
        console.error('State error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Attempt to pick up a stored room item (inventory was full at first visit).
// Must be standing on a loot room that has an uncollected item.
router.post('/pickup-room-loot', requireDungeon, async (req, res) => {
    try {
        const dungeon = req.dungeon;
        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const roomState = dungeon.roomLoot?.[currentKey];

        if (!roomState || roomState.type !== 'item_drop' || roomState.itemCollected) {
            return res.status(400).json({ success: false, message: 'No item to pick up here.' });
        }

        const playerId = Number(req.session.userId);
        if (!Number.isInteger(playerId) || playerId <= 0) {
            return res.status(401).json({ success: false, message: 'Not logged in.' });
        }

        const result = await resolveDungeonRoomLoot(dungeon, currentKey, playerId);
        saveDungeon(req);

        if (!result || !result.success) {
            return res.json({
                success: false,
                message: (result && result.message) || 'Pickup failed.'
            });
        }

        res.json(result);
    } catch (error) {
        console.error('Pickup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
