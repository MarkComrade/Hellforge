const { getCardById } = require('../../services/cardPool.js');
const { pool } = require('../core/connection.js');
const { findNextAvailableId } = require('../core/idHelpers.js');
const { getCardsByInstanceIds } = require('../core/itemInstanceHelpers.js');

const STASH_LIMIT = 50;
const LOADOUT_LIMIT = 10;

async function getStash(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT s.stashId, s.armor_id, s.weapon_id, s.misc_item_id, s.instance_id,
                    a.name AS armor_name, a.type AS armor_type, a.img_path AS armor_img, a.price AS armor_price, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.type AS weapon_type, w.img_path AS weapon_img, w.price AS weapon_price, w.tier AS weapon_tier, w.attack_multiplier,
                    m.name AS misc_name, m.img_path AS misc_img, m.value AS misc_value
             FROM player_stash s
             LEFT JOIN armors a ON s.armor_id = a.armorId
             LEFT JOIN weapons w ON s.weapon_id = w.weaponId
             LEFT JOIN misc_items m ON s.misc_item_id = m.itemId
             WHERE s.playerId = ?
               AND (s.armor_id IS NOT NULL OR s.weapon_id IS NOT NULL OR s.misc_item_id IS NOT NULL)`,
            [playerId]
        );

        const instanceIds = rows
            .map((row) => row.instance_id)
            .filter((id) => Number.isInteger(id) && id > 0);
        const cardsByInstance = await getCardsByInstanceIds(instanceIds);

        const stash = rows.map((row) => ({
            ...row,
            cards: row.misc_item_id ? [] : cardsByInstance[row.instance_id] || []
        }));

        return { success: true, stash };
    } catch (error) {
        return { success: false, message: 'Hiba történt a stash lekérése során' };
    }
}

async function getStashCount(playerId) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count
         FROM player_stash
         WHERE playerId = ?
           AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
        [playerId]
    );
    return rows[0].count;
}

async function addArmorToStash(playerId, armorId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count FROM player_stash WHERE playerId = ?
               AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= STASH_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'A stash megtelt! Maximum 50 tárgy tárolható.' };
        }

        const stashId = await findNextAvailableId('player_stash', 'stashId', connection);
        await connection.query(
            'INSERT INTO player_stash (stashId, playerId, armor_id) VALUES (?, ?, ?)',
            [stashId, playerId, armorId]
        );

        await connection.commit();
        return { success: true, message: 'Páncél hozzáadva a stash-hez' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a páncél hozzáadása során' };
    } finally {
        connection.release();
    }
}

async function addWeaponToStash(playerId, weaponId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count FROM player_stash WHERE playerId = ?
               AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= STASH_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'A stash megtelt! Maximum 50 tárgy tárolható.' };
        }

        const stashId = await findNextAvailableId('player_stash', 'stashId', connection);
        await connection.query(
            'INSERT INTO player_stash (stashId, playerId, weapon_id) VALUES (?, ?, ?)',
            [stashId, playerId, weaponId]
        );

        await connection.commit();
        return { success: true, message: 'Fegyver hozzáadva a stash-hez' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a fegyver hozzáadása során' };
    } finally {
        connection.release();
    }
}

async function addMiscToStash(playerId, miscItemId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count FROM player_stash WHERE playerId = ?
               AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= STASH_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'A stash megtelt! Maximum 50 tárgy tárolható.' };
        }

        const stashId = await findNextAvailableId('player_stash', 'stashId', connection);
        await connection.query(
            'INSERT INTO player_stash (stashId, playerId, misc_item_id) VALUES (?, ?, ?)',
            [stashId, playerId, miscItemId]
        );

        await connection.commit();
        return { success: true, message: 'Tárgy hozzáadva a stash-hez' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a tárgy hozzáadása során' };
    } finally {
        connection.release();
    }
}

async function removeFromStash(stashId, playerId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            'SELECT instance_id FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (rows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }

        const instanceId = rows[0].instance_id;

        await connection.query('DELETE FROM player_stash WHERE stashId = ? AND playerId = ?', [
            stashId,
            playerId
        ]);

        if (instanceId) {
            await connection.query('DELETE FROM item_instances WHERE instanceId = ?', [instanceId]);
        }

        await connection.commit();
        return { success: true, message: 'Tárgy eltávolítva a stash-ből' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a tárgy eltávolítása során' };
    } finally {
        connection.release();
    }
}

async function getPlayerInventory(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT l.slot, l.armor_id, l.weapon_id, l.instance_id,
                    a.name AS armor_name, a.img_path AS armor_img, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.img_path AS weapon_img, w.tier AS weapon_tier, w.attack_multiplier
             FROM player_loadout l
             LEFT JOIN armors a ON l.armor_id = a.armorId
             LEFT JOIN weapons w ON l.weapon_id = w.weaponId
             WHERE l.playerId = ? AND l.equipped = 1`,
            [playerId]
        );
        if (rows.length === 0) {
            return { success: false, message: 'Játékos nem található' };
        }

        const instanceIds = rows.map((r) => r.instance_id).filter((id) => id != null);
        const cardsByInstance = {};
        if (instanceIds.length > 0) {
            const [cardRows] = await pool.query(
                'SELECT id AS card_row_id, instance_id, card_id, slot AS card_slot FROM item_instance_cards WHERE instance_id IN (?) ORDER BY slot',
                [instanceIds]
            );
            for (const c of cardRows) {
                if (!cardsByInstance[c.instance_id]) cardsByInstance[c.instance_id] = [];
                cardsByInstance[c.instance_id].push({
                    card_row_id: c.card_row_id,
                    card_id: c.card_id,
                    card_slot: c.card_slot
                });
            }
        }

        const inventory = {};
        for (const row of rows) {
            const cards = (cardsByInstance[row.instance_id] || [])
                .map(({ card_row_id, card_id, card_slot }) => {
                    const cardData = getCardById(card_id);
                    if (!cardData) return null;
                    return { ...cardData, card_row_id, card_slot };
                })
                .filter(Boolean);

            if (row.slot === 'helmet') {
                inventory.helmet = row.armor_id;
                inventory.helmet_name = row.armor_name;
                inventory.helmet_img = row.armor_img;
                inventory.helmet_tier = row.armor_tier;
                inventory.helmet_defense = row.defense_multiplier;
                inventory.helmet_instance_id = row.instance_id;
                inventory.helmet_cards = cards;
            } else if (row.slot === 'armor') {
                inventory.armor = row.armor_id;
                inventory.armor_name = row.armor_name;
                inventory.armor_img = row.armor_img;
                inventory.armor_tier = row.armor_tier;
                inventory.armor_defense = row.defense_multiplier;
                inventory.armor_instance_id = row.instance_id;
                inventory.armor_cards = cards;
            } else if (row.slot === 'melee') {
                inventory.melee = row.weapon_id;
                inventory.melee_name = row.weapon_name;
                inventory.melee_img = row.weapon_img;
                inventory.melee_tier = row.weapon_tier;
                inventory.melee_attack = row.attack_multiplier;
                inventory.melee_instance_id = row.instance_id;
                inventory.melee_cards = cards;
            } else if (row.slot === 'ranged') {
                inventory.ranged = row.weapon_id;
                inventory.ranged_name = row.weapon_name;
                inventory.ranged_img = row.weapon_img;
                inventory.ranged_tier = row.weapon_tier;
                inventory.ranged_attack = row.attack_multiplier;
                inventory.ranged_instance_id = row.instance_id;
                inventory.ranged_cards = cards;
            }
        }

        return { success: true, inventory };
    } catch (error) {
        return { success: false, message: 'Hiba történt a felszerelés lekérése során' };
    }
}

async function swapEquipment(playerId, stashId, slot) {
    const validSlots = ['helmet', 'armor', 'melee', 'ranged'];
    if (!validSlots.includes(slot)) {
        return { success: false, message: 'Érvénytelen slot' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [stashRows] = await connection.query(
            `SELECT * FROM player_stash WHERE stashId = ? AND playerId = ?`,
            [stashId, playerId]
        );
        if (stashRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }
        const stashItem = stashRows[0];

        let newItemId;
        if (slot === 'helmet' || slot === 'armor') {
            newItemId = stashItem.armor_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'Ez a tárgy nem páncél' };
            }
        } else {
            newItemId = stashItem.weapon_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'Ez a tárgy nem fegyver' };
            }
        }

        const isArmorSlot = slot === 'helmet' || slot === 'armor';
        const itemColumn = isArmorSlot ? 'armor_id' : 'weapon_id';

        const [equippedRows] = await connection.query(
            'SELECT loadoutId, armor_id, weapon_id, instance_id FROM player_loadout WHERE playerId = ? AND equipped = 1 AND slot = ?',
            [playerId, slot]
        );
        if (equippedRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Felszerelés slot nem található' };
        }
        const currentEquippedId = equippedRows[0][itemColumn];
        const equippedInstanceId = equippedRows[0].instance_id || null;
        const incomingInstanceId = stashItem.instance_id || null;

        await connection.query(
            `UPDATE player_loadout SET \`${itemColumn}\` = ?, instance_id = ? WHERE loadoutId = ?`,
            [newItemId, incomingInstanceId, equippedRows[0].loadoutId]
        );

        if (isArmorSlot) {
            await connection.query(
                `UPDATE player_stash SET armor_id = ?, weapon_id = NULL, misc_item_id = NULL, instance_id = ? WHERE stashId = ?`,
                [currentEquippedId, equippedInstanceId, stashId]
            );
        } else {
            await connection.query(
                `UPDATE player_stash SET weapon_id = ?, armor_id = NULL, misc_item_id = NULL, instance_id = ? WHERE stashId = ?`,
                [currentEquippedId, equippedInstanceId, stashId]
            );
        }

        await connection.commit();
        return { success: true, message: 'Felszerelés cserélve' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Hiba történt a csere során' };
    } finally {
        connection.release();
    }
}

async function getLoadout(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT l.loadoutId, l.armor_id, l.weapon_id, l.misc_item_id, l.instance_id,
                    a.name AS armor_name, a.type AS armor_type, a.img_path AS armor_img, a.price AS armor_price, a.tier AS armor_tier, a.defense_multiplier,
                    w.name AS weapon_name, w.type AS weapon_type, w.img_path AS weapon_img, w.price AS weapon_price, w.tier AS weapon_tier, w.attack_multiplier,
                    m.name AS misc_name, m.img_path AS misc_img, m.value AS misc_value
             FROM player_loadout l
             LEFT JOIN armors a ON l.armor_id = a.armorId
             LEFT JOIN weapons w ON l.weapon_id = w.weaponId
             LEFT JOIN misc_items m ON l.misc_item_id = m.itemId
             WHERE l.playerId = ? AND l.equipped = 0
               AND (l.armor_id IS NOT NULL OR l.weapon_id IS NOT NULL OR l.misc_item_id IS NOT NULL)`,
            [playerId]
        );

        const instanceIds = rows
            .map((row) => row.instance_id)
            .filter((id) => Number.isInteger(id) && id > 0);
        const cardsByInstance = await getCardsByInstanceIds(instanceIds);

        const loadout = rows.map((row) => ({
            ...row,
            cards: row.misc_item_id ? [] : cardsByInstance[row.instance_id] || []
        }));

        return { success: true, loadout };
    } catch (error) {
        return { success: false, message: 'Hiba történt a loadout lekérése során' };
    }
}

async function getEquippedGearTiers(playerId) {
    const [rows] = await pool.query(
        `SELECT a.tier AS armor_tier, w.tier AS weapon_tier
         FROM player_loadout l
         LEFT JOIN armors a ON l.armor_id = a.armorId
         LEFT JOIN weapons w ON l.weapon_id = w.weaponId
         WHERE l.playerId = ? AND l.equipped = 1
           AND (l.armor_id IS NOT NULL OR l.weapon_id IS NOT NULL)`,
        [playerId]
    );
    return rows;
}

async function getLoadoutCount(playerId) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS count
         FROM player_loadout
         WHERE playerId = ? AND equipped = 0
           AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
        [playerId]
    );
    return rows[0].count;
}

async function moveStashToLoadout(playerId, stashId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count
             FROM player_loadout
             WHERE playerId = ? AND equipped = 0
               AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= LOADOUT_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Inventory is full.' };
        }

        const [stashRows] = await connection.query(
            'SELECT * FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (stashRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in stash.' };
        }
        const stashItem = stashRows[0];

        const loadoutId = await findNextAvailableId('player_loadout', 'loadoutId', connection);
        await connection.query(
            'INSERT INTO player_loadout (loadoutId, playerId, armor_id, weapon_id, misc_item_id, instance_id) VALUES (?, ?, ?, ?, ?, ?)',
            [
                loadoutId,
                playerId,
                stashItem.armor_id,
                stashItem.weapon_id,
                stashItem.misc_item_id,
                stashItem.instance_id || null
            ]
        );

        await connection.query('DELETE FROM player_stash WHERE stashId = ? AND playerId = ?', [
            stashId,
            playerId
        ]);

        await connection.commit();
        return { success: true, message: 'Item moved to inventory.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error moving item to inventory.' };
    } finally {
        connection.release();
    }
}

async function swapLoadoutEquipment(playerId, loadoutId, slot) {
    const validSlots = ['helmet', 'armor', 'melee', 'ranged'];
    if (!validSlots.includes(slot)) {
        return { success: false, message: 'Érvénytelen slot' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ? AND equipped = 0',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const loadoutItem = loadoutRows[0];

        const isArmorSlot = slot === 'helmet' || slot === 'armor';
        const itemColumn = isArmorSlot ? 'armor_id' : 'weapon_id';

        let newItemId;
        if (isArmorSlot) {
            newItemId = loadoutItem.armor_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'This item is not armor.' };
            }
        } else {
            newItemId = loadoutItem.weapon_id;
            if (!newItemId) {
                await connection.rollback();
                return { success: false, message: 'This item is not a weapon.' };
            }
        }

        const [equippedRows] = await connection.query(
            'SELECT loadoutId, armor_id, weapon_id, instance_id FROM player_loadout WHERE playerId = ? AND equipped = 1 AND slot = ?',
            [playerId, slot]
        );
        if (equippedRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Equipped slot not found.' };
        }
        const currentEquippedId = equippedRows[0][itemColumn];
        const equippedInstanceId = equippedRows[0].instance_id || null;
        const incomingInstanceId = loadoutItem.instance_id || null;

        await connection.query(
            `UPDATE player_loadout SET \`${itemColumn}\` = ?, instance_id = ? WHERE loadoutId = ?`,
            [newItemId, incomingInstanceId, equippedRows[0].loadoutId]
        );

        if (isArmorSlot) {
            await connection.query(
                'UPDATE player_loadout SET armor_id = ?, weapon_id = NULL, misc_item_id = NULL, instance_id = ? WHERE loadoutId = ?',
                [currentEquippedId, equippedInstanceId, loadoutId]
            );
        } else {
            await connection.query(
                'UPDATE player_loadout SET weapon_id = ?, armor_id = NULL, misc_item_id = NULL, instance_id = ? WHERE loadoutId = ?',
                [currentEquippedId, equippedInstanceId, loadoutId]
            );
        }

        await connection.commit();
        return { success: true, message: 'Equipment swapped from inventory.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error swapping equipment.' };
    } finally {
        connection.release();
    }
}

async function deleteFromLoadout(playerId, loadoutId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            `SELECT loadoutId, instance_id, armor_id, weapon_id, misc_item_id
             FROM player_loadout
             WHERE loadoutId = ? AND playerId = ? AND equipped = 0
             FOR UPDATE`,
            [loadoutId, playerId]
        );

        if (rows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }

        const row = rows[0];

        await connection.query(
            'DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ? AND equipped = 0',
            [loadoutId, playerId]
        );

        if (Number.isInteger(row.instance_id) && row.instance_id > 0) {
            await connection.query('DELETE FROM item_instance_cards WHERE instance_id = ?', [
                row.instance_id
            ]);
            await connection.query('DELETE FROM item_instances WHERE instanceId = ?', [
                row.instance_id
            ]);
        }

        await connection.commit();
        return {
            success: true,
            message: 'Item deleted from inventory.',
            deletedItem: {
                loadoutId: row.loadoutId,
                armor_id: row.armor_id,
                weapon_id: row.weapon_id,
                misc_item_id: row.misc_item_id,
                instance_id: row.instance_id || null
            }
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error deleting item from inventory.' };
    } finally {
        connection.release();
    }
}

async function deleteRandomNonEquippedItem(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT loadoutId, instance_id, armor_id, weapon_id, misc_item_id
             FROM player_loadout
             WHERE playerId = ? AND equipped = 0
               AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)
             ORDER BY RAND() LIMIT 1`,
            [playerId]
        );

        if (rows.length === 0) {
            return { success: false, message: 'No non-equipped inventory item to delete.' };
        }

        const row = rows[0];

        await pool.query('DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?', [
            row.loadoutId,
            playerId
        ]);

        if (row.instance_id) {
            await pool.query('DELETE FROM item_instances WHERE instanceId = ?', [row.instance_id]);
        }

        return {
            success: true,
            message: 'A random non-equipped item was destroyed.',
            deletedItem: {
                loadoutId: row.loadoutId,
                armor_id: row.armor_id,
                weapon_id: row.weapon_id,
                misc_item_id: row.misc_item_id
            }
        };
    } catch (error) {
        return { success: false, message: 'Error deleting random inventory item.' };
    }
}

async function curseRandomItemCard(playerId, cursedCardPool) {
    if (!Array.isArray(cursedCardPool) || cursedCardPool.length === 0) {
        return { success: false, message: 'No cursed card pool configured.' };
    }

    const validCursedIds = cursedCardPool
        .map((entry) => Number(entry?.id))
        .filter((id) => Number.isInteger(id) && id > 0);

    if (validCursedIds.length === 0) {
        return { success: false, message: 'No valid cursed card ids found.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            `SELECT iic.id AS cardRowId, iic.card_id AS oldCardId, iic.instance_id AS instanceId
             FROM item_instance_cards iic
             JOIN player_loadout pl ON pl.instance_id = iic.instance_id
             WHERE pl.playerId = ?
               AND iic.card_id NOT IN (${validCursedIds.map(() => '?').join(', ')})
             ORDER BY RAND()
             LIMIT 1
             FOR UPDATE`,
            [playerId, ...validCursedIds]
        );

        if (rows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'No item cards available to curse.' };
        }

        const target = rows[0];
        const cursedCardId = validCursedIds[Math.floor(Math.random() * validCursedIds.length)];

        await connection.query('UPDATE item_instance_cards SET card_id = ? WHERE id = ?', [
            cursedCardId,
            target.cardRowId
        ]);

        await connection.commit();
        return {
            success: true,
            message: 'A card was cursed.',
            cardSwap: {
                cardRowId: target.cardRowId,
                instanceId: target.instanceId,
                oldCardId: target.oldCardId,
                newCardId: cursedCardId
            }
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error cursing card.' };
    } finally {
        connection.release();
    }
}

async function applyGoldTrapLoss(playerId, amountToLose) {
    const normalizedAmount = Math.max(0, Math.floor(Number(amountToLose) || 0));

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [goldRows] = await connection.query(
            `SELECT loadoutId, gold_amount
             FROM player_loadout
             WHERE playerId = ? AND gold_amount IS NOT NULL
             FOR UPDATE`,
            [playerId]
        );

        const totalGold = goldRows.reduce((sum, row) => sum + Number(row.gold_amount || 0), 0);
        if (totalGold <= 0 || normalizedAmount <= 0) {
            await connection.rollback();
            return {
                success: false,
                message: 'No gold to remove.',
                lostGold: 0,
                remainingGold: totalGold
            };
        }

        let safeAmountToLose = normalizedAmount;
        if (safeAmountToLose < 1) {
            safeAmountToLose = 1;
        }
        if (safeAmountToLose > totalGold) {
            safeAmountToLose = totalGold;
        }

        let remainingLoss = safeAmountToLose;
        for (const row of goldRows) {
            if (remainingLoss <= 0) break;

            const rowGold = Number(row.gold_amount || 0);
            const deduct = Math.min(rowGold, remainingLoss);
            const newAmount = rowGold - deduct;
            remainingLoss -= deduct;

            if (newAmount === 0) {
                await connection.query('DELETE FROM player_loadout WHERE loadoutId = ?', [
                    row.loadoutId
                ]);
            } else {
                await connection.query(
                    'UPDATE player_loadout SET gold_amount = ? WHERE loadoutId = ?',
                    [newAmount, row.loadoutId]
                );
            }
        }

        const [remainingRows] = await connection.query(
            `SELECT COALESCE(SUM(gold_amount), 0) AS gold
             FROM player_loadout
             WHERE playerId = ? AND gold_amount IS NOT NULL`,
            [playerId]
        );

        await connection.commit();
        return {
            success: true,
            message: 'Gold removed by trap.',
            lostGold: safeAmountToLose,
            remainingGold: Number(remainingRows[0].gold || 0)
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error applying gold trap loss.' };
    } finally {
        connection.release();
    }
}

async function clearLoadoutAndResetGear(playerId) {
    const T1_CARDS = {
        helmet: [121, 122, 123, 124, 125],
        armor: [181, 182, 183, 184, 185],
        melee: [1, 2, 3, 4, 5],
        ranged: [61, 62, 63, 64, 65]
    };

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [nonEquipped] = await connection.query(
            `SELECT instance_id FROM player_loadout
             WHERE playerId = ? AND equipped = 0 AND instance_id IS NOT NULL`,
            [playerId]
        );

        await connection.query(`DELETE FROM player_loadout WHERE playerId = ? AND equipped = 0`, [
            playerId
        ]);

        for (const row of nonEquipped) {
            await connection.query(`DELETE FROM item_instance_cards WHERE instance_id = ?`, [
                row.instance_id
            ]);
            await connection.query(`DELETE FROM item_instances WHERE instanceId = ?`, [
                row.instance_id
            ]);
        }

        const [[helmetRow]] = await connection.query(
            `SELECT armorId FROM armors WHERE type = 'Helmet' AND tier = 1 ORDER BY armorId LIMIT 1`
        );
        const [[armorRow]] = await connection.query(
            `SELECT armorId FROM armors WHERE type = 'Armor' AND tier = 1 ORDER BY armorId LIMIT 1`
        );
        const [[meleeRow]] = await connection.query(
            `SELECT weaponId FROM weapons WHERE type = 'Melee' AND tier = 1 ORDER BY weaponId LIMIT 1`
        );
        const [[rangedRow]] = await connection.query(
            `SELECT weaponId FROM weapons WHERE type = 'Ranged' AND tier = 1 ORDER BY weaponId LIMIT 1`
        );

        const t1 = {
            helmet: { armor_id: helmetRow?.armorId ?? null, weapon_id: null },
            armor: { armor_id: armorRow?.armorId ?? null, weapon_id: null },
            melee: { armor_id: null, weapon_id: meleeRow?.weaponId ?? null },
            ranged: { armor_id: null, weapon_id: rangedRow?.weaponId ?? null }
        };

        const [equippedRows] = await connection.query(
            `SELECT loadoutId, slot, instance_id FROM player_loadout WHERE playerId = ? AND equipped = 1`,
            [playerId]
        );
        for (const row of equippedRows) {
            const slot = row.slot;
            const slotData = t1[slot];
            const cards = T1_CARDS[slot];
            if (!slotData || !cards) continue;

            await connection.query(
                `UPDATE player_loadout SET armor_id = ?, weapon_id = ? WHERE loadoutId = ?`,
                [slotData.armor_id, slotData.weapon_id, row.loadoutId]
            );

            if (row.instance_id) {
                const itemRefId = slotData.armor_id ?? slotData.weapon_id;
                const itemType = slot === 'helmet' || slot === 'armor' ? 'armor' : 'weapon';
                await connection.query(
                    `UPDATE item_instances SET item_type = ?, item_ref_id = ? WHERE instanceId = ?`,
                    [itemType, itemRefId, row.instance_id]
                );
                await connection.query(`DELETE FROM item_instance_cards WHERE instance_id = ?`, [
                    row.instance_id
                ]);
                for (let slotNum = 1; slotNum <= cards.length; slotNum++) {
                    const newId = await findNextAvailableId(
                        'item_instance_cards',
                        'id',
                        connection
                    );
                    await connection.query(
                        `INSERT INTO item_instance_cards (id, instance_id, card_id, slot) VALUES (?, ?, ?, ?)`,
                        [newId, row.instance_id, cards[slotNum - 1], slotNum]
                    );
                }
            }
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        console.error('clearLoadoutAndResetGear error:', error);
        return { success: false, message: 'Failed to reset loadout.' };
    } finally {
        connection.release();
    }
}

async function applyAbandonPenalty(playerId, goldLossPercent = 30, itemsToLose = 2) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [goldRows] = await connection.query(
            `SELECT loadoutId, gold_amount FROM player_loadout
             WHERE playerId = ? AND gold_amount IS NOT NULL FOR UPDATE`,
            [playerId]
        );
        const totalGold = goldRows.reduce((s, r) => s + Number(r.gold_amount || 0), 0);
        const goldToLose = Math.min(totalGold, Math.floor((totalGold * goldLossPercent) / 100));

        let remainingLoss = goldToLose;
        for (const row of goldRows) {
            if (remainingLoss <= 0) break;
            const rowGold = Number(row.gold_amount || 0);
            const deduct = Math.min(rowGold, remainingLoss);
            remainingLoss -= deduct;
            const newAmount = rowGold - deduct;
            if (newAmount === 0) {
                await connection.query(`DELETE FROM player_loadout WHERE loadoutId = ?`, [
                    row.loadoutId
                ]);
            } else {
                await connection.query(
                    `UPDATE player_loadout SET gold_amount = ? WHERE loadoutId = ?`,
                    [newAmount, row.loadoutId]
                );
            }
        }

        const lostItems = [];
        for (let i = 0; i < itemsToLose; i++) {
            const [rows] = await connection.query(
                `SELECT loadoutId, instance_id, armor_id, weapon_id, misc_item_id
                 FROM player_loadout
                 WHERE playerId = ? AND equipped = 0
                   AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)
                 ORDER BY RAND() LIMIT 1`,
                [playerId]
            );
            if (rows.length === 0) break;
            const row = rows[0];
            await connection.query(`DELETE FROM player_loadout WHERE loadoutId = ?`, [
                row.loadoutId
            ]);
            if (row.instance_id) {
                await connection.query(`DELETE FROM item_instance_cards WHERE instance_id = ?`, [
                    row.instance_id
                ]);
                await connection.query(`DELETE FROM item_instances WHERE instanceId = ?`, [
                    row.instance_id
                ]);
            }
            lostItems.push({
                armor_id: row.armor_id,
                weapon_id: row.weapon_id,
                misc_item_id: row.misc_item_id
            });
        }

        await connection.commit();
        return { success: true, lostGold: goldToLose, lostItems };
    } catch (error) {
        await connection.rollback();
        console.error('applyAbandonPenalty error:', error);
        return { success: false, lostGold: 0, lostItems: [] };
    } finally {
        connection.release();
    }
}

async function moveLoadoutToStash(playerId, loadoutId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            `SELECT COUNT(*) AS count
             FROM player_stash
             WHERE playerId = ?
               AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)`,
            [playerId]
        );
        if (Number(countRows[0].count) >= STASH_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Stash is full.' };
        }

        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ? AND equipped = 0',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in inventory.' };
        }
        const loadoutItem = loadoutRows[0];

        const stashId = await findNextAvailableId('player_stash', 'stashId', connection);
        await connection.query(
            'INSERT INTO player_stash (stashId, playerId, armor_id, weapon_id, misc_item_id, instance_id) VALUES (?, ?, ?, ?, ?, ?)',
            [
                stashId,
                playerId,
                loadoutItem.armor_id,
                loadoutItem.weapon_id,
                loadoutItem.misc_item_id,
                loadoutItem.instance_id || null
            ]
        );

        await connection.query('DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?', [
            loadoutId,
            playerId
        ]);

        await connection.commit();
        return { success: true, message: 'Item moved to stash.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error moving item to stash.' };
    } finally {
        connection.release();
    }
}

async function getTotalGold(playerId) {
    try {
        const [stashRows] = await pool.query(
            `SELECT COALESCE(SUM(gold), 0) AS gold FROM player_stash WHERE playerId = ? AND armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL`,
            [playerId]
        );
        const [loadoutRows] = await pool.query(
            `SELECT COALESCE(SUM(gold_amount), 0) AS gold FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL`,
            [playerId]
        );
        return {
            success: true,
            gold: {
                stash: stashRows[0].gold,
                loadout: loadoutRows[0].gold
            }
        };
    } catch (error) {
        console.error('getTotalGold error:', error);
        return { success: false, message: 'Hiba történt az arany lekérése során' };
    }
}

async function addGoldToInventory(playerId, amount) {
    const normalizedAmount = parseInt(amount, 10);

    if (!Number.isInteger(normalizedAmount) || normalizedAmount <= 0) {
        return { success: false, message: 'Amount must be a positive whole number.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            'SELECT loadoutId FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL FOR UPDATE',
            [playerId]
        );
        if (existing.length > 0) {
            await connection.query(
                'UPDATE player_loadout SET gold_amount = gold_amount + ? WHERE loadoutId = ?',
                [normalizedAmount, existing[0].loadoutId]
            );
        } else {
            const loadoutId = await findNextAvailableId('player_loadout', 'loadoutId', connection);
            await connection.query(
                'INSERT INTO player_loadout (loadoutId, playerId, gold_amount) VALUES (?, ?, ?)',
                [loadoutId, playerId, normalizedAmount]
            );
        }

        await connection.commit();
        return { success: true, message: 'Gold added to loadout.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error adding gold to loadout.' };
    } finally {
        connection.release();
    }
}

async function transferGoldBetweenStorage(playerId, from, amount) {
    const normalizedAmount = parseInt(amount, 10);

    if (from !== 'stash' && from !== 'loadout') {
        return { success: false, message: 'Invalid source storage.' };
    }

    if (!Number.isInteger(normalizedAmount) || normalizedAmount <= 0) {
        return { success: false, message: 'Amount must be a positive whole number.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [stashRows] = await connection.query(
            `SELECT stashId, gold FROM player_stash
             WHERE playerId = ? AND armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL
             FOR UPDATE`,
            [playerId]
        );
        const stashGold = stashRows.reduce((sum, r) => sum + (r.gold || 0), 0);

        const [loadoutRows] = await connection.query(
            `SELECT loadoutId, gold_amount FROM player_loadout
             WHERE playerId = ? AND gold_amount IS NOT NULL
             FOR UPDATE`,
            [playerId]
        );
        const loadoutGold = loadoutRows.reduce((sum, r) => sum + (r.gold_amount || 0), 0);

        const sourceTotal = from === 'stash' ? stashGold : loadoutGold;
        if (sourceTotal < normalizedAmount) {
            await connection.rollback();
            return { success: false, message: 'Not enough gold in source storage.' };
        }

        if (from === 'stash') {
            let remaining = normalizedAmount;
            for (const row of stashRows) {
                if (remaining <= 0) break;
                const deduct = Math.min(row.gold, remaining);
                remaining -= deduct;
                const newAmount = row.gold - deduct;
                if (newAmount === 0) {
                    await connection.query('DELETE FROM player_stash WHERE stashId = ?', [
                        row.stashId
                    ]);
                } else {
                    await connection.query('UPDATE player_stash SET gold = ? WHERE stashId = ?', [
                        newAmount,
                        row.stashId
                    ]);
                }
            }
            const newLoadoutId = await findNextAvailableId(
                'player_loadout',
                'loadoutId',
                connection
            );
            await connection.query(
                'INSERT INTO player_loadout (loadoutId, playerId, gold_amount) VALUES (?, ?, ?)',
                [newLoadoutId, playerId, normalizedAmount]
            );
        } else {
            let remaining = normalizedAmount;
            for (const row of loadoutRows) {
                if (remaining <= 0) break;
                const deduct = Math.min(row.gold_amount, remaining);
                remaining -= deduct;
                const newAmount = row.gold_amount - deduct;
                if (newAmount === 0) {
                    await connection.query('DELETE FROM player_loadout WHERE loadoutId = ?', [
                        row.loadoutId
                    ]);
                } else {
                    await connection.query(
                        'UPDATE player_loadout SET gold_amount = ? WHERE loadoutId = ?',
                        [newAmount, row.loadoutId]
                    );
                }
            }
            const newStashId = await findNextAvailableId('player_stash', 'stashId', connection);
            await connection.query(
                'INSERT INTO player_stash (stashId, playerId, gold) VALUES (?, ?, ?)',
                [newStashId, playerId, normalizedAmount]
            );
        }

        await connection.commit();
        return {
            success: true,
            message: 'Gold transferred successfully.',
            gold: {
                stash:
                    from === 'stash' ? stashGold - normalizedAmount : stashGold + normalizedAmount,
                loadout:
                    from === 'loadout'
                        ? loadoutGold - normalizedAmount
                        : loadoutGold + normalizedAmount
            }
        };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error transferring gold.' };
    } finally {
        connection.release();
    }
}

async function adminSetStashGold(userId, amount) {
    const normalizedAmount = parseInt(amount, 10);
    if (!Number.isInteger(normalizedAmount) || normalizedAmount < 0) {
        return { success: false, message: 'Amount must be a non-negative whole number.' };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            'SELECT stashId FROM player_stash WHERE playerId = ? AND armor_id IS NULL AND weapon_id IS NULL AND misc_item_id IS NULL FOR UPDATE',
            [userId]
        );

        if (existing.length > 0) {
            await connection.query('UPDATE player_stash SET gold = ? WHERE stashId = ?', [
                normalizedAmount,
                existing[0].stashId
            ]);
            for (let i = 1; i < existing.length; i++) {
                await connection.query('DELETE FROM player_stash WHERE stashId = ?', [
                    existing[i].stashId
                ]);
            }
        } else if (normalizedAmount > 0) {
            const newStashId = await findNextAvailableId('player_stash', 'stashId', connection);
            await connection.query(
                'INSERT INTO player_stash (stashId, playerId, gold) VALUES (?, ?, ?)',
                [newStashId, userId, normalizedAmount]
            );
        }

        await connection.commit();
        return { success: true, message: 'Stash gold updated.' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Error updating stash gold.' };
    } finally {
        connection.release();
    }
}

module.exports = {
    getStash,
    getStashCount,
    addArmorToStash,
    addWeaponToStash,
    addMiscToStash,
    removeFromStash,
    getPlayerInventory,
    swapEquipment,
    getLoadout,
    getLoadoutCount,
    moveStashToLoadout,
    swapLoadoutEquipment,
    deleteFromLoadout,
    deleteRandomNonEquippedItem,
    curseRandomItemCard,
    applyGoldTrapLoss,
    moveLoadoutToStash,
    getTotalGold,
    addGoldToInventory,
    transferGoldBetweenStorage,
    adminSetStashGold,
    getEquippedGearTiers,
    clearLoadoutAndResetGear,
    applyAbandonPenalty
};
