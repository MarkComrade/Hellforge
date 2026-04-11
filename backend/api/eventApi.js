const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const {
    generateAndInsertLoot,
    getBaseTier,
    normalizeDungeonKey
} = require('../services/lootAlgorithm.js');
const fs = require('fs/promises');
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
        const dungeon = getDungeonFromSession(request);
        if (!dungeon) {
            return response.status(200).json({ success: false, message: 'Not in a dungeon.' });
        }

        const roomKey = dungeon.playerX + ',' + dungeon.playerY;
        const currentRoom = dungeon.map[roomKey];
        if (!currentRoom || currentRoom.roomType !== 'shop') {
            return response.status(200).json({ success: false, message: 'Not in a shop room.' });
        }

        // Return cached stock if this shop room was already visited
        if (dungeon.shopStock[roomKey]) {
            return response.status(200).json({
                success: true,
                items: dungeon.shopStock[roomKey]
            });
        }

        let rawCount = Number.parseInt(request.query.count, 10);
        let count = 5;
        if (Number.isInteger(rawCount) && rawCount > 0) {
            count = rawCount;
        }

        const items = await database.getRandomShopItems(count);

        const dungeonKey = normalizeDungeonKey(dungeon.dungeonName);
        let dungeonTier = getBaseTier(dungeonKey, dungeon.dungeonLevel);

        for (let i = 0; i < items.length; i++) {
            let tierDiff = items[i].tier - dungeonTier;
            if (tierDiff < -3) tierDiff = -3;
            if (tierDiff > 3) tierDiff = 3;

            let randomMarkup = 0.8 + Math.random() * 0.4;
            let tierMultiplier = 1 + tierDiff * 0.25;
            let finalMultiplier = tierMultiplier * randomMarkup;

            items[i].adjustedPrice = Math.round(items[i].price * finalMultiplier);
            if (items[i].adjustedPrice < 1) {
                items[i].adjustedPrice = 1;
            }
        }

        // Cache the generated stock in the dungeon session
        dungeon.shopStock[roomKey] = items;
        request.session.dungeonData = dungeon.toJSON();

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
    const { itemId, category, adjustedPrice } = request.body;
    const playerId = request.session?.userId;

    if (!playerId) {
        return response.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (!itemId || !category || adjustedPrice == null) {
        return response
            .status(400)
            .json({
                success: false,
                message: 'Missing required fields: itemId, category, adjustedPrice.'
            });
    }

    if (category !== 'weapon' && category !== 'armor') {
        return response.status(400).json({ success: false, message: 'Invalid item category.' });
    }

    let parsedPrice = Number(adjustedPrice);
    if (!Number.isInteger(parsedPrice) || parsedPrice < 1) {
        return response.status(400).json({ success: false, message: 'Invalid price value.' });
    }

    try {
        const itemInfo = await database.getItemBaseInfo(itemId, category);
        if (!itemInfo) {
            return response.status(200).json({ success: false, message: 'Item not found.' });
        }

        const dungeon = getDungeonFromSession(request);

        // Check if item was already bought from this shop
        if (dungeon) {
            const roomKey = dungeon.playerX + ',' + dungeon.playerY;
            let stock = dungeon.shopStock[roomKey];
            if (stock) {
                for (let i = 0; i < stock.length; i++) {
                    if (
                        String(stock[i].itemId) === String(itemId) &&
                        stock[i].category === category &&
                        stock[i].sold
                    ) {
                        return response
                            .status(200)
                            .json({ success: false, message: 'Item already purchased.' });
                    }
                }
            }
        }

        let serverPrice = itemInfo.price;

        if (dungeon) {
            const dungeonKey = normalizeDungeonKey(dungeon.dungeonName);
            const dungeonTier = getBaseTier(dungeonKey, dungeon.dungeonLevel);
            let tierDiff = itemInfo.tier - dungeonTier;
            if (tierDiff < -3) tierDiff = -3;
            if (tierDiff > 3) tierDiff = 3;

            let maxMultiplier = (1 + tierDiff * 0.25) * 1.2;
            let maxAllowedPrice = Math.round(itemInfo.price * maxMultiplier);

            if (parsedPrice > maxAllowedPrice) {
                parsedPrice = maxAllowedPrice;
            }
            serverPrice = parsedPrice;
        }

        const result = await database.purchaseItemToLoadout(
            playerId,
            itemId,
            category,
            serverPrice
        );

        if (!result.success) {
            return response.status(200).json({ success: false, message: result.message });
        }

        // Mark item as sold in cached shop stock
        if (dungeon) {
            const roomKey = dungeon.playerX + ',' + dungeon.playerY;
            if (dungeon.shopStock[roomKey]) {
                let stock = dungeon.shopStock[roomKey];
                for (let i = 0; i < stock.length; i++) {
                    if (
                        String(stock[i].itemId) === String(itemId) &&
                        stock[i].category === category
                    ) {
                        stock[i].sold = true;
                        break;
                    }
                }
                request.session.dungeonData = dungeon.toJSON();
            }
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

router.post('/sell-item', async (request, response) => {
    const playerId = request.session?.userId;

    if (!playerId) {
        return response.status(200).json({ success: false, message: 'Not authenticated.' });
    }

    const { loadoutId } = request.body;
    if (!loadoutId) {
        return response.status(200).json({
            success: false,
            message: 'Missing required field: loadoutId.'
        });
    }

    const dungeon = getDungeonFromSession(request);
    if (!dungeon) {
        return response.status(200).json({
            success: false,
            message: 'You must be in a dungeon to sell items.'
        });
    }

    const currentKey = dungeon.playerX + ',' + dungeon.playerY;
    const currentRoom = dungeon.map[currentKey];
    if (!currentRoom || currentRoom.roomType !== 'shop') {
        return response.status(200).json({
            success: false,
            message: 'You must be in a shop room to sell items.'
        });
    }

    try {
        const result = await database.sellItemFromLoadout(playerId, loadoutId);

        if (!result.success) {
            return response.status(200).json({ success: false, message: result.message });
        }

        return response.status(200).json({
            success: true,
            message: result.message,
            soldFor: result.soldFor,
            itemName: result.itemName,
            remainingGold: result.remainingGold
        });
    } catch (error) {
        console.error('Sell-item error:', error);
        return response.status(500).json({
            success: false,
            message: 'Server error during sale.'
        });
    }
});

module.exports = router;
