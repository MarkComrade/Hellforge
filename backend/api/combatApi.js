'use strict';

const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const { CombatSession } = require('../models/CombatSession.js');
const DungeonSession = require('../models/DungeonSession.js');
const { generateEnemy, generateEnemyGroup, rollEnemyCount } = require('../services/enemyPool.js');
const { buildDeckFromEquipment, getCardById } = require('../services/cardPool.js');
const { resolveCard, endPlayerTurn } = require('../services/combatEngine.js');
const { generateFinalLoot } = require('../services/lootAlgorithm.js');
const { clearLoadoutAndResetGear } = require('../sql/queries/inventoryQueries.js');
const database = require('../sql/queries/inventoryQueries.js');
const { requireLogin } = require('./middleware');

function normalizeDungeonType(name) {
    return String(name || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

// ───── Middleware ─────

// requireLogin is imported from middleware.js

// Reconstructs CombatSession from the session store and validates the combat token.
function requireCombat(req, res, next) {
    if (!req.session.combatData) {
        return res.status(400).json({ success: false, message: 'No active combat' });
    }
    const token = req.body.combatToken || req.query.combatToken;
    if (!token || token !== req.session.combatToken) {
        return res.status(403).json({ success: false, message: 'Invalid combat token' });
    }
    req.combat = CombatSession.fromJSON(req.session.combatData);
    next();
}

function saveCombat(req) {
    req.session.combatData = req.combat.toJSON();
}

// ── POST /api/combat/start ────────────────────────────────────────────────────
// Requires an active dungeon session with the player standing on a combat room.
// Builds enemy + deck from DB equipment and initialises a fresh CombatSession.
router.post('/start', requireLogin, async (req, res) => {
    try {
        if (!req.session.dungeonData) {
            return res.status(400).json({ success: false, message: 'No active dungeon' });
        }

        // Validate dungeon session token — same security pattern as dungeonApi.js
        const dungeon = DungeonSession.fromJSON(req.session.dungeonData);
        const dToken = req.body.sessionToken;
        if (!dToken || dToken !== dungeon.sessionToken) {
            return res.status(403).json({ success: false, message: 'Invalid session token' });
        }

        const currentKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[currentKey];
        if (!currentRoom || currentRoom.roomType !== 'combat') {
            return res.status(400).json({ success: false, message: 'Not on a combat room' });
        }
        if (currentRoom.cleared) {
            return res
                .status(400)
                .json({ success: false, cleared: true, message: 'Room already cleared' });
        }

        const dungeonType = normalizeDungeonType(dungeon.dungeonName);
        const dungeonLevel = Number(dungeon.dungeonLevel) || 1;
        const playerId = Number(req.session.userId); // always valid — requireLogin guards this

        // Build equipment snapshot from DB (cards + attack multiplier for DoT formula)
        let equipmentSnapshot = {
            melee_cards: [],
            ranged_cards: [],
            helmet_cards: [],
            armor_cards: [],
            attackMultiplier: 5,
            meleeMultiplier: 1,
            rangedMultiplier: 1,
            defenseMultiplier: 1
        };
        const invResult = await database.getPlayerInventory(playerId);
        if (invResult.success && invResult.inventory) {
            const inv = invResult.inventory;
            const meleeAtk = Number(inv.melee_attack) || 1;
            const rangedAtk = Number(inv.ranged_attack) || 1;
            const helmetDef = Number(inv.helmet_defense) || 1;
            const armorDef = Number(inv.armor_defense) || 1;
            const tagCards = (cards, itemImg) =>
                (cards || []).map((c) => ({ ...c, source_item_img: itemImg || null }));
            equipmentSnapshot = {
                melee_cards: tagCards(inv.melee_cards, inv.melee_img),
                ranged_cards: tagCards(inv.ranged_cards, inv.ranged_img),
                helmet_cards: tagCards(inv.helmet_cards, inv.helmet_img),
                armor_cards: tagCards(inv.armor_cards, inv.armor_img),
                attackMultiplier: meleeAtk + rangedAtk,
                meleeMultiplier: meleeAtk,
                rangedMultiplier: rangedAtk,
                defenseMultiplier: (helmetDef + armorDef) / 2
            };
        }

        // Fall back to fixed starter cards (IDs 1-5) if player has no equipment
        const totalCards = ['melee_cards', 'ranged_cards', 'helmet_cards', 'armor_cards'].reduce(
            (n, k) => n + (equipmentSnapshot[k] || []).length,
            0
        );
        if (totalCards === 0) {
            equipmentSnapshot.melee_cards = [1, 2, 3, 4, 5]
                .map((id) => getCardById(id))
                .filter(Boolean);
        }

        const enemyCount = rollEnemyCount(dungeonType, dungeonLevel);
        const enemies = generateEnemyGroup(dungeonType, dungeonLevel, enemyCount);
        const deck = buildDeckFromEquipment(equipmentSnapshot);

        const combat = new CombatSession({
            dungeonType,
            dungeonLevel,
            playerMaxHp: Number(dungeon.currentHP) || 100,
            playerCurrentHp: Number(dungeon.currentHP) || 100,
            playerId,
            equipmentSnapshot
        });
        combat.setEnemies(enemies);
        combat.setDeckState({ drawPile: deck });
        combat.refillHand();

        const combatToken = crypto.randomUUID();
        req.session.combatToken = combatToken;
        req.combat = combat;
        saveCombat(req);

        res.json({ combatToken, state: combat.getClientState() });
    } catch (error) {
        console.error('Combat start error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ── GET /api/combat/state ─────────────────────────────────────────────────────
router.get('/state', requireLogin, requireCombat, (req, res) => {
    try {
        res.json(req.combat.getClientState());
    } catch (error) {
        console.error('Combat state error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ── POST /api/combat/play-card ────────────────────────────────────────────────
router.post('/play-card', requireLogin, requireCombat, (req, res) => {
    try {
        // SECURITY: cardIndex must be an integer 0–4 — reject anything else
        const cardIndex = Number(req.body.cardIndex);
        if (!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex > 4) {
            return res.status(400).json({ success: false, message: 'cardIndex must be 0–4' });
        }

        let targetIndex = 0;
        if (req.body.targetIndex !== undefined) {
            targetIndex = Number(req.body.targetIndex);
            if (
                !Number.isInteger(targetIndex) ||
                targetIndex < 0 ||
                targetIndex >= req.combat.enemies.length
            ) {
                return res.status(400).json({
                    success: false,
                    message: `targetIndex must be 0–${req.combat.enemies.length - 1}`
                });
            }
        }

        const result = resolveCard(req.combat, cardIndex, targetIndex);
        saveCombat(req);
        res.json({ ...result, state: req.combat.getClientState() });
    } catch (error) {
        console.error('Play card error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ── POST /api/combat/end-turn ─────────────────────────────────────────────────
router.post('/end-turn', requireLogin, requireCombat, (req, res) => {
    try {
        endPlayerTurn(req.combat);
        saveCombat(req);
        res.json({ state: req.combat.getClientState() });
    } catch (error) {
        console.error('End turn error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ── POST /api/combat/claim-reward ─────────────────────────────────────────────
// Only valid after winning (isResolved && !isGameOver). Grants loot, marks room
// cleared in the dungeon state, then wipes the combat session.
router.post('/claim-reward', requireLogin, requireCombat, async (req, res) => {
    try {
        const combat = req.combat;
        if (!combat.isResolved || combat.isGameOver) {
            return res.status(400).json({ success: false, message: 'Combat not won yet' });
        }
        if (combat.reward.granted) {
            return res.status(400).json({ success: false, message: 'Reward already claimed' });
        }

        const dungeonData = req.session.dungeonData;
        const dungeonType = normalizeDungeonType(dungeonData?.dungeonName);
        const dungeonLevel = Number(dungeonData?.dungeonLevel) || 1;
        const playerId = Number(req.session.userId);

        const loot = await generateFinalLoot(playerId, dungeonType, dungeonLevel);
        const reward = loot.success
            ? { gold: loot.gold || 0, item: loot.item || null }
            : { gold: 0, item: null };

        // Mark the combat room cleared so the dungeon knows not to re-trigger it
        if (dungeonData) {
            const key = `${dungeonData.playerX},${dungeonData.playerY}`;
            if (dungeonData.map[key]) dungeonData.map[key].cleared = true;

            if (!dungeonData.stats) {
                dungeonData.stats = { enemiesKilled: 0, floorsCleared: 0, goldCollected: 0 };
            }
            dungeonData.stats.enemiesKilled += combat.enemies.length;
            dungeonData.stats.goldCollected += reward.gold || 0;

            req.session.dungeonData = dungeonData;
        }

        delete req.session.combatData;
        delete req.session.combatToken;
        res.json({ reward });
    } catch (error) {
        console.error('Claim reward error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/death', requireLogin, requireCombat, async (req, res) => {
    try {
        const combat = req.combat;
        if (!combat.isGameOver) {
            return res.status(400).json({ success: false, message: 'Combat not over' });
        }

        const playerId = Number(req.session.userId);
        console.log(`[death] Processing death penalty for player ${playerId}`);

        const stats = req.session.dungeonData?.stats || {
            enemiesKilled: 0,
            floorsCleared: 0,
            goldCollected: 0
        };

        const penaltyResult = await clearLoadoutAndResetGear(playerId);
        if (!penaltyResult.success) {
            console.error(
                'clearLoadoutAndResetGear failed for player',
                playerId,
                penaltyResult.message
            );
        } else {
            console.log(`[death] Loadout cleared and gear reset for player ${playerId}`);
        }

        delete req.session.combatData;
        delete req.session.combatToken;
        delete req.session.dungeonData;

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Death endpoint error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
