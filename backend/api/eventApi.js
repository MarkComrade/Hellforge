const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const { generateAndInsertLoot } = require('../services/lootAlgorithm.js');
const DungeonSession = require('../models/DungeonSession.js');

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
        if (!dungeon) {
            return response.status(400).json({
                success: false,
                message: 'No active dungeon'
            });
        }

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

router.get('/shop-items', async (request, response) => {
    try {
        const count = Number.parseInt(request.query.count, 10) || 5;
        const { dungeonName, dungeonLevel } = request.query;
        const items = await database.getRandomShopItems(count);

        const dungeonTier =
            dungeonName && dungeonLevel ? getBaseTier(dungeonName, Number(dungeonLevel)) : null;

        for (let i = 0; i < items.length; i++) {
            if (dungeonTier !== null) {
                const tierDiff = items[i].tier - dungeonTier;
                const multiplier = 1 + Math.max(-3, Math.min(3, tierDiff)) * 0.2;
                items[i].adjustedPrice = Math.round(items[i].price * multiplier);
            } else {
                items[i].adjustedPrice = items[i].price;
            }
        }

        response.status(200).json({
            success: true,
            items
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Failed to fetch shop items.'
        });
    }
});

router.post('/buy-item', async (request, response) => {
    const { itemId, category, price, dungeonName, dungeonLevel } = request.body;
    const playerId = request.session?.userId;

    if (!playerId) {
        return response.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (!itemId || !category || price == null) {
        return response
            .status(400)
            .json({ success: false, message: 'Missing required fields: itemId, category, price.' });
    }

    if (!['weapon', 'armor'].includes(category)) {
        return response.status(400).json({ success: false, message: 'Invalid item category.' });
    }

    const parsedPrice = Number(price);
    if (!Number.isInteger(parsedPrice) || parsedPrice < 0) {
        return response.status(400).json({ success: false, message: 'Invalid price value.' });
    }

    try {
        let authorizedPrice = parsedPrice;

        if (dungeonName && dungeonLevel) {
            const dungeonTier = getBaseTier(dungeonName, Number(dungeonLevel));
            const itemInfo = await database.getItemBaseInfo(itemId, category);

            if (!itemInfo) {
                return response.status(400).json({ success: false, message: 'Item not found.' });
            }

            const tierDiff = itemInfo.tier - dungeonTier;
            const multiplier = 1 + Math.max(-3, Math.min(3, tierDiff)) * 0.2;
            authorizedPrice = Math.round(itemInfo.price * multiplier);
        }

        const result = await database.purchaseItemToLoadout(
            playerId,
            itemId,
            category,
            authorizedPrice
        );

        if (!result.success) {
            return response.status(400).json({ success: false, message: result.message });
        }

        return response.status(200).json({
            success: true,
            message: 'Purchase successful.',
            remainingGold: result.remainingGold
        });
    } catch (error) {
        console.error('Buy-item error:', error);
        return response
            .status(500)
            .json({ success: false, message: 'Server error during purchase.' });
    }
});
module.exports = router;
