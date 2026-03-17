require('../sql/database');
const {
    fetchWeaponByTier,
    fetchArmorByTier,
    fetchRandomMisc,
    insertIntoLoadout,
    upgradeWeakestGearDB,
    getLoadout
} = require('../sql/database.js');
const types = {
    crypt: 1,
    labyrinth: 2,
    laboratory: 3,
    gates_of_hell: 4
};
function normalizeDungeonKey(dungeonName) {
    return String(dungeonName || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

function getBaseTier(dungeon, level) {
    const dungeonDifficulty = types[dungeon] ?? 1;
    const parsedLevel = Number(level);
    const safeLevel = Number.isFinite(parsedLevel) ? parsedLevel : 1;
    const levelFactor = safeLevel / 20;

    let tier = Math.floor(dungeonDifficulty + levelFactor * 3);

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

        return {
            success: true,
            message: 'Loot added to loadout.',
            dungeon,
            level,
            tier: loot.tier,
            type: loot.item.type,
            item: loot.item.item
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Loot pipeline error.' };
    }
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

//dungein tipus kulonbseg
//altag gearhez kepest pluisz minusz loot rng
//hardcap dungeonokon
//leggyengebb item upgrade
//loot table szintenkent
//varja a dungeon szintet tipust es player idt
//visszaadja a lootot es a leggyengebb itemet amire upgradeelni lehetne
//
async function lootAlgorithm(dungeonLevel, playerId, dungeonName) {
    // Implementation for loot algorithm
    console.log(
        `Running loot algorithm for dungeon level ${dungeonLevel}, player ID ${playerId}, dungeon name ${dungeonName}`
    );
}

module.exports = {
    generateAndInsertLoot
};
