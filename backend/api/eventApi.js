const express = require('express');
const router = express.Router();
const { requireLogin } = require('./middleware');
const database = {
    ...require('../sql/queries/authUserQueries.js'),
    ...require('../sql/queries/shopQueries.js')
};
const { generateAndInsertLoot } = require('../services/lootAlgorithm.js');
const { withAdjustedPrice, getMaxAllowedPrice } = require('../services/pricing.js');
const fs = require('fs/promises');
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
router.get('/shop-items', requireLogin, async (request, response) => {
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

        const pricedItems = items.map((item) =>
            withAdjustedPrice(item, dungeon.dungeonName, dungeon.dungeonLevel)
        );

        // Cache the generated stock in the dungeon session
        dungeon.shopStock[roomKey] = pricedItems;
        request.session.dungeonData = dungeon.toJSON();

        response.status(200).json({
            success: true,
            items: pricedItems
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'Failed to fetch shop items.'
        });
    }
});

router.post('/buy-item', requireLogin, async (request, response) => {
    const { itemId, category, adjustedPrice } = request.body;
    const playerId = request.session?.userId;

    if (!playerId) {
        return response.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    if (!itemId || !category || adjustedPrice == null) {
        return response.status(400).json({
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

    const dungeon = getDungeonFromSession(request);
    if (!dungeon) {
        return response.status(400).json({ success: false, message: 'You must be in a dungeon to purchase items.' });
    }
    const shopKey = dungeon.playerX + ',' + dungeon.playerY;
    const shopRoom = dungeon.map[shopKey];
    if (!shopRoom || shopRoom.roomType !== 'shop') {
        return response.status(400).json({ success: false, message: 'You must be in a shop room to purchase items.' });
    }

    try {
        const itemInfo = await database.getItemBaseInfo(itemId, category);
        if (!itemInfo) {
            return response.status(200).json({ success: false, message: 'Item not found.' });
        }

        // dungeon is already resolved above

        // Check if item was already bought from this room stock and lock the price to the cached offer.
        {
            const roomKey = dungeon.playerX + ',' + dungeon.playerY;
            let stock = dungeon.shopStock[roomKey];
            if (stock) {
                let matchedStockItem = null;
                for (let i = 0; i < stock.length; i++) {
                    if (
                        String(stock[i].itemId) === String(itemId) &&
                        stock[i].category === category
                    ) {
                        matchedStockItem = stock[i];
                        break;
                    }
                }

                if (matchedStockItem) {
                    if (matchedStockItem.sold) {
                        return response
                            .status(200)
                            .json({ success: false, message: 'Item already purchased.' });
                    }

                    parsedPrice = Number(
                        matchedStockItem.adjustedPrice ?? matchedStockItem.price ?? parsedPrice
                    );
                }
            }
        }

        const maxAllowedPrice = getMaxAllowedPrice(
            itemInfo.price,
            itemInfo.tier,
            dungeon.dungeonName,
            dungeon.dungeonLevel
        );
        if (parsedPrice > maxAllowedPrice) {
            parsedPrice = maxAllowedPrice;
        }
        const serverPrice = parsedPrice;

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
        {
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

router.post('/sell-item', requireLogin, async (request, response) => {
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
