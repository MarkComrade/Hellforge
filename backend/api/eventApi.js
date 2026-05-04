const express = require('express');
const router = express.Router();
const { requireLogin } = require('./middleware');
const database = {
    ...require('../sql/queries/authUserQueries.js'),
    ...require('../sql/queries/shopQueries.js')
};
const { withAdjustedPrice, getMaxAllowedPrice } = require('../services/pricing.js');
const DungeonSession = require('../models/DungeonSession.js');

function getDungeonFromSession(req) {
    if (!req.session?.dungeonData) {
        return null;
    }
    return DungeonSession.fromJSON(req.session.dungeonData);
}

router.get('/shop-items', requireLogin, async (req, res) => {
    try {
        const dungeon = getDungeonFromSession(req);
        if (!dungeon) {
            return res.status(400).json({ success: false, message: 'Not in a dungeon.' });
        }

        const roomKey = `${dungeon.playerX},${dungeon.playerY}`;
        const currentRoom = dungeon.map[roomKey];
        if (!currentRoom || currentRoom.roomType !== 'shop') {
            return res.status(400).json({ success: false, message: 'Not in a shop room.' });
        }

        if (dungeon.shopStock[roomKey]) {
            return res.status(200).json({ success: true, items: dungeon.shopStock[roomKey] });
        }

        let rawCount = Number.parseInt(req.query.count, 10);
        let count = 5;
        if (Number.isInteger(rawCount) && rawCount > 0 && rawCount <= 10) {
            count = rawCount;
        }

        const items = await database.getRandomShopItems(count);
        const pricedItems = items.map((item) =>
            withAdjustedPrice(item, dungeon.dungeonName, dungeon.dungeonLevel)
        );

        dungeon.shopStock[roomKey] = pricedItems;
        req.session.dungeonData = dungeon.toJSON();

        res.status(200).json({ success: true, items: pricedItems });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch shop items.' });
    }
});

router.post('/buy-item', requireLogin, async (req, res) => {
    const { itemId, category, adjustedPrice } = req.body;

    const parsedItemId = Number.parseInt(itemId, 10);
    if (!Number.isInteger(parsedItemId) || parsedItemId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid itemId.' });
    }

    if (!category || adjustedPrice == null) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: itemId, category, adjustedPrice.'
        });
    }

    if (category !== 'weapon' && category !== 'armor') {
        return res.status(400).json({ success: false, message: 'Invalid item category.' });
    }

    let parsedPrice = Number(adjustedPrice);
    if (!Number.isInteger(parsedPrice) || parsedPrice < 1) {
        return res.status(400).json({ success: false, message: 'Invalid price value.' });
    }

    const dungeon = getDungeonFromSession(req);
    if (!dungeon) {
        return res
            .status(400)
            .json({ success: false, message: 'You must be in a dungeon to purchase items.' });
    }

    const roomKey = `${dungeon.playerX},${dungeon.playerY}`;
    const currentRoom = dungeon.map[roomKey];
    const isShopRoom = currentRoom?.roomType === 'shop';
    const isTradeRoom =
        currentRoom?.roomType === 'event' &&
        Array.isArray(dungeon.shopStock[roomKey]) &&
        dungeon.shopStock[roomKey].length > 0;

    if (!isShopRoom && !isTradeRoom) {
        return res.status(400).json({
            success: false,
            message: 'You must be in a shop or trade event room to purchase items.'
        });
    }

    let stockItem = null;
    const stock = dungeon.shopStock[roomKey];
    if (stock) {
        for (const entry of stock) {
            if (String(entry.itemId) === String(parsedItemId) && entry.category === category) {
                stockItem = entry;
                break;
            }
        }
    }

    if (!stockItem) {
        return res
            .status(404)
            .json({ success: false, message: 'Item not available in this shop.' });
    }

    if (stockItem?.sold) {
        return res.status(409).json({ success: false, message: 'Item already purchased.' });
    }

    try {
        const itemInfo = await database.getItemBaseInfo(parsedItemId, category);
        if (!itemInfo) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        if (stockItem) {
            parsedPrice = Number(stockItem.adjustedPrice ?? stockItem.price ?? parsedPrice);
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

        if (stockItem) {
            stockItem.sold = true;
            req.session.dungeonData = dungeon.toJSON();
        }

        const result = await database.purchaseItemToLoadout(
            req.session.userId,
            parsedItemId,
            category,
            parsedPrice
        );

        if (!result.success) {
            if (stockItem) {
                stockItem.sold = false;
                req.session.dungeonData = dungeon.toJSON();
            }
            return res.status(400).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: 'Purchase successful.',
            remainingGold: result.remainingGold
        });
    } catch (error) {
        console.error('Buy-item error:', error);
        return res.status(500).json({ success: false, message: 'Server error during purchase.' });
    }
});

router.post('/sell-item', requireLogin, async (req, res) => {
    const { loadoutId } = req.body;
    const parsedLoadoutId = Number.parseInt(loadoutId, 10);
    if (!Number.isInteger(parsedLoadoutId) || parsedLoadoutId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid loadoutId.' });
    }

    const dungeon = getDungeonFromSession(req);
    if (!dungeon) {
        return res
            .status(400)
            .json({ success: false, message: 'You must be in a dungeon to sell items.' });
    }

    const roomKey = `${dungeon.playerX},${dungeon.playerY}`;
    const currentRoom = dungeon.map[roomKey];
    if (!currentRoom || currentRoom.roomType !== 'shop') {
        return res
            .status(400)
            .json({ success: false, message: 'You must be in a shop room to sell items.' });
    }

    try {
        const result = await database.sellItemFromLoadout(req.session.userId, parsedLoadoutId);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            soldFor: result.soldFor,
            itemName: result.itemName,
            remainingGold: result.remainingGold
        });
    } catch (error) {
        console.error('Sell-item error:', error);
        return res.status(500).json({ success: false, message: 'Server error during sale.' });
    }
});

module.exports = router;
