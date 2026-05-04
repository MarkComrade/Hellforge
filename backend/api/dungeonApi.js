const express = require('express');
const router = express.Router();
const { requireLogin } = require('./middleware');
const DungeonSession = require('../models/DungeonSession.js');
const { resolveDungeonRoomLoot } = require('../services/lootAlgorithm.js');
const { eventManager, CURSED_TRAP_CARD_POOL } = require('../services/eventGeneration.js');
const {
    getEquippedGearTiers,
    applyAbandonPenalty,
    curseRandomItemCard,
    clearLoadoutAndResetGear
} = require('../sql/queries/inventoryQueries.js');

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

    const rows = await getEquippedGearTiers(playerId);

    const qualifyingPieces = rows.filter((row) => {
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

const GOLD_IMG_PATH = '../textures/items/coin.png';

function requireDungeon(req, res, next) {
    if (!req.session.dungeonData) {
        return res.status(400).json({ success: false, message: 'No active dungeon' });
    }
    const dungeon = DungeonSession.fromJSON(req.session.dungeonData);
    const token = req.body.sessionToken || req.query.sessionToken;
    if (!token || token !== dungeon.sessionToken) {
        return res.status(403).json({ success: false, message: 'Invalid session token' });
    }
    req.dungeon = dungeon;
    next();
}

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

router.post('/start', requireLogin, async (req, res) => {
    try {
        const { dungeonName } = req.body;
        if (!dungeonName || !VALID_DUNGEONS.includes(dungeonName)) {
            return res.status(400).json({ success: false, message: 'Invalid dungeon name' });
        }
        const gearCheck = await checkGearRequirement(req.session.userId, dungeonName);
        if (!gearCheck.allowed) {
            return res.status(403).json({ success: false, message: gearCheck.message });
        }

        const dungeon = new DungeonSession(dungeonName);
        req.dungeon = dungeon;
        saveDungeon(req);

        res.json(dungeon.getClientState());
    } catch (error) {
        console.error('Dungeon start error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/move', requireLogin, requireDungeon, async (req, res) => {
    try {
        const { dx, dy } = req.body;
        if (dx === undefined || dy === undefined) {
            return res.status(400).json({ success: false, message: 'Missing dx/dy' });
        }

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
            (result.roomType === 'loot' || result.roomType === 'combat') &&
            Number.isInteger(playerId) &&
            playerId > 0 &&
            req.dungeon.roomLoot?.[targetKey] &&
            req.dungeon.roomLoot[targetKey].itemCollected === false
        ) {
            Event = await resolveDungeonRoomLoot(req.dungeon, targetKey, playerId);
            enrichEvent(Event);
        }

        saveDungeon(req);
        res.json({ success: true, ...result, Event });
    } catch (error) {
        console.error('Move error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/next-level', requireLogin, requireDungeon, (req, res) => {
    try {
        const dungeon = req.dungeon;
        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[currentKey];

        if (!currentRoom || currentRoom.roomType !== 'out') {
            return res.status(400).json({ success: false, message: 'Not on exit room' });
        }

        const nextLevel = new DungeonSession(dungeon.dungeonName, dungeon.dungeonLevel + 1);
        nextLevel.sessionToken = dungeon.sessionToken;
        nextLevel.currentHP = nextLevel.maxHP;

        nextLevel.stats = {
            enemiesKilled: dungeon.stats?.enemiesKilled || 0,
            floorsCleared: (dungeon.stats?.floorsCleared || 0) + 1,
            goldCollected: dungeon.stats?.goldCollected || 0
        };

        req.dungeon = nextLevel;
        saveDungeon(req);

        res.json(nextLevel.getClientState());
    } catch (error) {
        console.error('Next level error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/exit', requireLogin, requireDungeon, (req, res) => {
    try {
        const dungeon = req.dungeon;
        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[currentKey];

        if (!currentRoom || currentRoom.roomType !== 'out') {
            return res.status(400).json({ success: false, message: 'Not on exit room' });
        }

        const stats = dungeon.stats || { enemiesKilled: 0, floorsCleared: 0, goldCollected: 0 };
        delete req.session.dungeonData;
        res.json({ success: true, message: 'Dungeon exited', stats });
    } catch (error) {
        console.error('Exit error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/abandon', requireLogin, requireDungeon, async (req, res) => {
    try {
        const playerId = Number(req.session.userId);
        const stats = req.dungeon.stats || { enemiesKilled: 0, floorsCleared: 0, goldCollected: 0 };

        const penalty = await applyAbandonPenalty(playerId);
        await curseRandomItemCard(playerId, CURSED_TRAP_CARD_POOL);

        delete req.session.dungeonData;
        res.json({
            success: true,
            message: 'Dungeon abandoned',
            stats,
            penalty: {
                lostGold: penalty.lostGold || 0,
                lostItems: penalty.lostItems || [],
                cardCursed: true
            }
        });
    } catch (error) {
        console.error('Abandon error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/state', requireLogin, requireDungeon, (req, res) => {
    try {
        res.json(req.dungeon.getClientState());
    } catch (error) {
        console.error('State error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/pickup-room-loot', requireLogin, requireDungeon, async (req, res) => {
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

router.post('/forfeit', async (req, res) => {
    try {
        if (!req.session.dungeonData) {
            return res.json({ success: false, message: 'No active dungeon to forfeit' });
        }

        const playerId = Number(req.session.userId);

        const stats = req.session.dungeonData?.stats || {
            enemiesKilled: 0,
            floorsCleared: 0,
            goldCollected: 0
        };

        const penaltyResult = await clearLoadoutAndResetGear(playerId);
        if (!penaltyResult.success) {
            console.error(
                'forfeit: clearLoadoutAndResetGear failed for player',
                playerId,
                penaltyResult.message
            );
        }

        delete req.session.dungeonData;
        delete req.session.combatData;
        delete req.session.combatToken;

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Forfeit error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
