const {
    fetchWeaponByTier,
    fetchArmorByTier,
    fetchRandomMisc,
    insertIntoLoadout,
    upgradeWeakestGearDB
} = require('../sql/queries/shopQueries.js');
const {
    getLoadout,
    getLoadoutCount,
    addGoldToInventory
} = require('../sql/queries/inventoryQueries.js');
const { pickCardsForItem } = require('../services/cardPool.js');
const types = {
    crypt: 1,
    labyrinth: 2,
    laboratory: 3,
    gates_of_hell: 4
};
const GOLD_IMG_PATH = '../textures/items/coin.png';

function normalizeDungeonKey(dungeonName) {
    return String(dungeonName || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

function getBaseTier(dungeon, level) {
    const dungeonDifficulty = types[dungeon];

    let tier = dungeonDifficulty + Math.floor(level / 10);

    return Math.min(Math.max(tier, 1), 6);
}
function rollTier(baseTier) {
    const roll = Math.random();

    if (roll < 0.6) return baseTier;
    if (roll < 0.8) return baseTier - 1;
    if (roll < 0.95) return baseTier + 1;
    if (roll < 0.99) return baseTier + 2;
    return baseTier + 3;
}
function clampTier(tier, dungeon) {
    const caps = {
        crypt: 3,
        labyrinth: 4,
        laboratory: 5,
        gates_of_hell: 6
    };

    const hardCap = caps[dungeon];

    if (Math.random() < 0.01) {
        return Math.min(tier, 6);
    }

    return Math.min(tier, hardCap);
}

async function getRandomItem(tier) {
    try {
        const parsedTier = Number(tier);
        const safeTier = Number.isFinite(parsedTier)
            ? Math.min(Math.max(Math.floor(parsedTier), 1), 6)
            : 1;
        const roll = Math.random();

        let type;
        let item;

        if (roll < 0.45) {
            type = 'weapon';
            item = await fetchWeaponByTier(safeTier);
        } else if (roll < 0.9) {
            type = 'armor';
            item = await fetchArmorByTier(safeTier);
        } else {
            type = 'misc';
            item = await fetchRandomMisc();
        }

        if (!item) {
            return { success: false, message: 'No item found for this tier.' };
        }

        return {
            success: true,
            type,
            item
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error generating loot.' };
    }
}
async function generateLoot(dungeon, level) {
    const dungeonKey = normalizeDungeonKey(dungeon);
    const baseTier = getBaseTier(dungeonKey, level);
    let rolledTier = rollTier(baseTier);
    rolledTier = clampTier(rolledTier, dungeonKey);
    if (!Number.isFinite(rolledTier)) {
        rolledTier = 1;
    }

    const item = await getRandomItem(rolledTier);

    return {
        dungeon,
        level,
        tier: rolledTier,
        item
    };
}

function normalizeLootItem(item) {
    if (!item) return null;
    return { ...item, img_path: item.img_path || item.img || null };
}

async function tryInsertLootItem(playerId, itemType, itemId, itemSubType, itemTier) {
    const count = await getLoadoutCount(playerId);
    if (Number(count) >= 10) {
        return { success: false, inventoryFull: true };
    }

    const cards = itemSubType && itemTier ? pickCardsForItem(itemSubType, Number(itemTier)) : [];

    const result = await insertIntoLoadout(playerId, itemType, itemId, cards);
    return result.success
        ? { success: true }
        : { ...result, inventoryFull: /full/i.test(String(result.message || '')) };
}

function buildLootPayload(roomState, overrides = {}) {
    return {
        success: true,
        type: roomState.type,
        message: roomState.message,
        gold: roomState.gold || 0,
        item: roomState.item || null,
        tier: roomState.tier ?? null,
        goldImgPath: GOLD_IMG_PATH,
        inventoryFull: Boolean(roomState.inventoryFull),
        storedInRoom: Boolean(roomState.storedInRoom),
        ...overrides
    };
}

async function generateAndInsertLoot(playerId, dungeon, level) {
    try {
        const loot = await generateLoot(dungeon, level);

        if (!loot.item.success) {
            return { success: false, message: 'Loot generation failed.' };
        }

        const itemSubType = loot.item.item?.type || null;
        const itemTier = loot.tier;

        const dbResult = await tryInsertLootItem(
            playerId,
            loot.item.type,
            loot.item.item.id,
            itemSubType,
            itemTier
        );

        if (!dbResult.success) {
            return {
                success: false,
                message: dbResult.message,
                inventoryFull: Boolean(dbResult.inventoryFull),
                item: normalizeLootItem(loot.item.item),
                tier: loot.tier,
                goldImgPath: GOLD_IMG_PATH
            };
        }

        const normalizedItem = normalizeLootItem(loot.item.item || null);

        const payload = {
            success: true,
            message: 'Loot added to loadout.',
            dungeon,
            level,
            tier: loot.tier,
            type: loot.item.type,
            item: normalizedItem,
            goldImgPath: GOLD_IMG_PATH
        };

        console.log('[LootPayload]', payload);

        return payload;
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Loot pipeline error.' };
    }
}

function shouldDropItem(dungeon, level) {
    const dungeonKey = normalizeDungeonKey(dungeon);
    const dungeonDifficulty = types[dungeonKey] || 1;

    const levelFactor = level / 20;
    const dungeonFactor = (dungeonDifficulty - 1) / 3;

    const curvedLevel = Math.pow(levelFactor, 1.8);

    let dropChance = 0.05 + curvedLevel * 0.65 + dungeonFactor * 0.25;

    dropChance = Math.min(Math.max(dropChance, 0.05), 0.95);

    return Math.random() < dropChance;
}

async function getAverageGearTier(playerId) {
    const result = await getLoadout(playerId);

    if (!result?.success) {
        throw new Error(result?.message || 'Failed to get loadout');
    }
    let avgGearTier = 0;
    let itemCount = 0;
    result.loadout.forEach((element) => {
        if (element.armor_tier != null) {
            avgGearTier += Number(element.armor_tier);
            itemCount++;
        }
        if (element.weapon_tier != null) {
            avgGearTier += Number(element.weapon_tier);
            itemCount++;
        }
    });

    if (itemCount > 0) {
        avgGearTier /= itemCount;
    }

    return avgGearTier;
}

function generateGoldReward(dungeon, level) {
    const dungeonKey = normalizeDungeonKey(dungeon);
    const dungeonDifficulty = types[dungeonKey] || 1;

    const dungeonMultiplier =
        {
            1: 0.35, // crypt
            2: 0.6, // labyrinth
            3: 0.85, // laboratory
            4: 1.0 // gates_of_hell
        }[dungeonDifficulty] ?? 1.0;

    const baseGold = (level * 25 + dungeonDifficulty * 100) * dungeonMultiplier;

    const variance = baseGold * (Math.random() * 0.4 - 0.2);

    let gold = Math.floor(baseGold + variance);

    gold = Math.max(10, Math.min(gold, 10000));

    return gold;
}

async function generateFinalLoot(playerId, dungeon, level) {
    try {
        const dropItem = shouldDropItem(dungeon, level);

        let gold;

        if (dropItem) {
            const lootResult = await generateAndInsertLoot(playerId, dungeon, level);

            if (!lootResult.success) {
                return { success: false, message: 'Item generation failed.' };
            }

            // Reduce gold heavily (10%–30%)
            const baseGold = generateGoldReward(dungeon, level);
            const reducedMultiplier = 0.1 + Math.random() * 0.2;
            gold = Math.floor(baseGold * reducedMultiplier);

            await addGoldToInventory(playerId, gold);

            return {
                success: true,
                type: 'item_drop',
                message: 'Item found and some gold.',
                gold,
                item: lootResult.item,
                tier: lootResult.tier,
                goldImgPath: GOLD_IMG_PATH
            };
        }

        gold = generateGoldReward(dungeon, level);
        await addGoldToInventory(playerId, gold);

        return {
            success: true,
            type: 'gold_only',
            message: 'Gold acquired.',
            gold,
            item: null,
            goldImgPath: GOLD_IMG_PATH
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Final loot pipeline error.' };
    }
}

async function resolveDungeonRoomLoot(dungeonSession, roomKey, playerId) {
    try {
        const existing = dungeonSession.roomLoot?.[roomKey];

        if (existing) {
            if (existing.type !== 'item_drop' || existing.itemCollected) return null;

            const insert = await tryInsertLootItem(
                playerId,
                existing.itemType,
                existing.itemId,
                existing.itemSubType,
                existing.tier
            );
            if (!insert.success) {
                existing.inventoryFull = Boolean(insert.inventoryFull);
                existing.storedInRoom = true;
                existing.message = 'Your inventory is still full. The item is waiting.';
                return buildLootPayload(existing, { gold: 0 });
            }

            existing.itemCollected = true;
            existing.inventoryFull = false;
            existing.storedInRoom = false;
            existing.message = 'You picked up the item left behind in this room.';
            return buildLootPayload(existing, { gold: 0 });
        }

        if (!shouldDropItem(dungeonSession.dungeonName, dungeonSession.dungeonLevel)) {
            const gold = generateGoldReward(
                dungeonSession.dungeonName,
                dungeonSession.dungeonLevel
            );
            await addGoldToInventory(playerId, gold);

            dungeonSession.roomLoot[roomKey] = {
                type: 'gold_only',
                gold,
                item: null,
                itemCollected: true,
                message: 'Gold acquired.',
                inventoryFull: false,
                storedInRoom: false
            };
            return buildLootPayload(dungeonSession.roomLoot[roomKey]);
        }

        const loot = await generateLoot(dungeonSession.dungeonName, dungeonSession.dungeonLevel);
        if (!loot.item.success) return { success: false, message: 'Item generation failed.' };

        const baseGold = generateGoldReward(
            dungeonSession.dungeonName,
            dungeonSession.dungeonLevel
        );
        const gold = Math.floor(baseGold * (0.1 + Math.random() * 0.2));
        await addGoldToInventory(playerId, gold);

        const roomState = {
            type: 'item_drop',
            gold,
            item: normalizeLootItem(loot.item.item),
            itemType: loot.item.type,
            itemSubType: loot.item.item?.type || null,
            itemId: loot.item.item.id,
            tier: loot.tier,
            itemCollected: false,
            message: 'Item found and some gold.',
            inventoryFull: false,
            storedInRoom: false
        };

        const insert = await tryInsertLootItem(
            playerId,
            roomState.itemType,
            roomState.itemId,
            roomState.itemSubType,
            roomState.tier
        );
        if (!insert.success) {
            roomState.inventoryFull = Boolean(insert.inventoryFull);
            roomState.storedInRoom = true;
            roomState.message = 'You found an item, but your inventory is full.';
            dungeonSession.roomLoot[roomKey] = roomState;
            return buildLootPayload(roomState);
        }

        roomState.itemCollected = true;
        dungeonSession.roomLoot[roomKey] = roomState;
        return buildLootPayload(roomState);
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Loot pipeline error.' };
    }
}

module.exports = {
    getBaseTier,
    normalizeDungeonKey,
    generateAndInsertLoot,
    generateGoldReward,
    generateFinalLoot,
    resolveDungeonRoomLoot
};
