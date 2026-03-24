require('../sql/database');
const {
    fetchWeaponByTier,
    fetchArmorByTier,
    fetchRandomMisc,
    insertIntoLoadout,
    upgradeWeakestGearDB,
    getLoadout,
    addGoldToInventory
} = require('../sql/database.js');
const types = {
    crypt: 1,
    labyrinth: 2,
    laboratory: 3,
    gates_of_hell: 4
};
const GOLD_IMG_PATH = '../textures/items/coing.png';
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

async function generateAndInsertLoot(playerId, dungeon, level) {
    try {
        const loot = await generateLoot(dungeon, level);

        if (!loot.item.success) {
            return { success: false, message: 'Loot generation failed.' };
        }

        const dbResult = await insertIntoLoadout(playerId, loot.item.type, loot.item.item.id);

        if (!dbResult.success) {
            return dbResult;
        }

        const item = loot.item.item || null;
        const normalizedItem = item
            ? {
                  ...item,
                  img_path: item.img_path || item.img || null
              }
            : null;

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

    const baseGold = level * 50 + dungeonDifficulty * 200;

    const variance = baseGold * (Math.random() * 0.4 - 0.2);

    let gold = Math.floor(baseGold + variance);

    gold = Math.max(100, Math.min(gold, 10000));

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
                message: 'Item found! Gold reduced.',
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

module.exports = {
    generateAndInsertLoot,
    generateGoldReward,
    generateFinalLoot
};
