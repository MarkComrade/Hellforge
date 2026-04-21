const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { getCardById, pickCardsForItem } = require('../services/cardPool.js');

const SALT_ROUNDS = 12;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!Gap-finding utility — finds the smallest available ID in a table
async function findNextAvailableId(tableName, columnName, connection = null) {
    const db = connection || pool;
    const forUpdate = connection ? 'FOR UPDATE' : '';

    const [all] = await db.query(
        `SELECT \`${columnName}\` FROM \`${tableName}\` ORDER BY \`${columnName}\` ASC ${forUpdate}`
    );

    if (all.length === 0) return 1;

    let expected = 1;
    for (const row of all) {
        if (row[columnName] > expected) {
            return expected;
        }
        expected = row[columnName] + 1;
    }

    return expected;
}

async function createItemInstance(connection, itemType, itemId, cards = []) {
    if (itemType === 'misc') {
        return null;
    }

    const instanceId = await findNextAvailableId('item_instances', 'instanceId', connection);
    await connection.query(
        'INSERT INTO item_instances (instanceId, item_type, item_ref_id) VALUES (?, ?, ?)',
        [instanceId, itemType, itemId]
    );

    for (let i = 0; i < cards.length; i++) {
        const cardId = Number(cards[i]?.id ?? cards[i]);
        if (!Number.isInteger(cardId) || cardId <= 0) {
            throw new Error(`Invalid card id at index ${i}`);
        }
        const cardRowId = await findNextAvailableId('item_instance_cards', 'id', connection);
        await connection.query(
            'INSERT INTO item_instance_cards (id, instance_id, card_id, slot) VALUES (?, ?, ?, ?)',
            [cardRowId, instanceId, cardId, i + 1]
        );
    }

    return instanceId;
}

//!SQL Queries

//!Login Query

async function loginUser(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'A felhasználónév nem létezik' };
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { success: false, message: 'Helytelen jelszó' };
        }

        return { success: true, userId: user.userId, message: 'Sikeres bejelentkezés' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a bejelentkezés során' };
    }
}

async function registerUser(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE name = ?', [username]);

        if (rows.length > 0) {
            return { success: false, message: 'A felhasználónév már létezik' };
        }

        if (password.length < 5) {
            return {
                success: false,
                message: 'A jelszónak legalább 5 karakter hosszúnak kell lennie'
            };
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const userId = await findNextAvailableId('user', 'userId', connection);
            await connection.query('INSERT INTO user (userId, name, password) VALUES (?, ?, ?)', [
                userId,
                username,
                hashedPassword
            ]);

            const starterGear = [
                { slot: 'helmet', armor_id: 1, weapon_id: null },
                { slot: 'armor', armor_id: 2, weapon_id: null },
                { slot: 'melee', armor_id: null, weapon_id: 1 },
                { slot: 'ranged', armor_id: null, weapon_id: 2 }
            ];

            for (const gear of starterGear) {
                const sourceType = gear.armor_id ? 'armor' : 'weapon';
                const sourceId = gear.armor_id || gear.weapon_id;
                const subType =
                    gear.slot === 'helmet'
                        ? 'Helmet'
                        : gear.slot === 'armor'
                          ? 'Armor'
                          : gear.slot === 'melee'
                            ? 'Melee'
                            : 'Ranged';
                const starterCards = pickCardsForItem(subType, 1);
                const instanceId = await createItemInstance(
                    connection,
                    sourceType,
                    sourceId,
                    starterCards
                );

                const loadoutId = await findNextAvailableId(
                    'player_loadout',
                    'loadoutId',
                    connection
                );
                await connection.query(
                    'INSERT INTO player_loadout (loadoutId, playerId, armor_id, weapon_id, equipped, slot, instance_id) VALUES (?, ?, ?, ?, 1, ?, ?)',
                    [loadoutId, userId, gear.armor_id, gear.weapon_id, gear.slot, instanceId]
                );
            }

            await connection.commit();
            return { success: true, userId, message: 'Sikeres regisztráció' };
        } catch (error) {
            await connection.rollback();
            return { success: false, message: 'Hiba történt a regisztráció során' };
        } finally {
            connection.release();
        }
    } catch (error) {
        return { success: false, message: 'Hiba történt a regisztráció során' };
    }
}

async function loginAdmin(username, password) {
    try {
        const [rows] = await pool.query('SELECT * FROM admin WHERE name = ?', [username]);

        if (rows.length === 0) {
            return { success: false, message: 'A felhasználónév nem létezik' };
        }

        const admin = rows[0];

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return { success: false, message: 'Helytelen jelszó' };
        }

        return { success: true, adminId: admin.adminId, message: 'Sikeres bejelentkezés' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a bejelentkezés során' };
    }
}

async function selectleadboard() {
    const query = `
        SELECT u.name,
               COALESCE(SUM(pl.gold_amount), 0) + COALESCE(SUM(ps.gold), 0) AS score
        FROM user u
        LEFT JOIN player_loadout pl ON u.userId = pl.playerId AND pl.gold_amount IS NOT NULL
        LEFT JOIN player_stash ps ON u.userId = ps.playerId
            AND ps.armor_id IS NULL AND ps.weapon_id IS NULL AND ps.misc_item_id IS NULL
        GROUP BY u.userId, u.name
        ORDER BY score DESC
        LIMIT 10
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

async function getUserRankAndScore(username) {
    const query = `
        SELECT u.name,
               COALESCE(SUM(pl.gold_amount), 0) + COALESCE(SUM(ps.gold), 0) AS score,
               (
                   SELECT COUNT(*) + 1
                   FROM (
                       SELECT u2.userId,
                              COALESCE(SUM(pl2.gold_amount), 0) + COALESCE(SUM(ps2.gold), 0) AS g
                       FROM user u2
                       LEFT JOIN player_loadout pl2 ON u2.userId = pl2.playerId AND pl2.gold_amount IS NOT NULL
                       LEFT JOIN player_stash ps2 ON u2.userId = ps2.playerId
                           AND ps2.armor_id IS NULL AND ps2.weapon_id IS NULL AND ps2.misc_item_id IS NULL
                       GROUP BY u2.userId
                   ) AS totals
                   WHERE totals.g > COALESCE(SUM(pl.gold_amount), 0) + COALESCE(SUM(ps.gold), 0)
               ) AS \`rank\`
        FROM user u
        LEFT JOIN player_loadout pl ON u.userId = pl.playerId AND pl.gold_amount IS NOT NULL
        LEFT JOIN player_stash ps ON u.userId = ps.playerId
            AND ps.armor_id IS NULL AND ps.weapon_id IS NULL AND ps.misc_item_id IS NULL
        WHERE u.name = ?
        GROUP BY u.userId, u.name
    `;
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
}

async function getAllUsers() {
    const query = 'SELECT userId, name FROM user ORDER BY userId ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

//!Stash Queries

const STASH_LIMIT = 50;

async function getStash(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT s.stashId, s.armor_id, s.weapon_id, s.misc_item_id,
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
        return { success: true, stash: rows };
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
            return { success: false, message: 'A stash megtelt! Maximum 60 tárgy tárolható.' };
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
            return { success: false, message: 'A stash megtelt! Maximum 60 tárgy tárolható.' };
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
    try {
        const [result] = await pool.query(
            'DELETE FROM player_stash WHERE stashId = ? AND playerId = ?',
            [stashId, playerId]
        );
        if (result.affectedRows === 0) {
            return { success: false, message: 'A tárgy nem található a stash-ben' };
        }
        return { success: true, message: 'Tárgy eltávolítva a stash-ből' };
    } catch (error) {
        return { success: false, message: 'Hiba történt a tárgy eltávolítása során' };
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
                'SELECT instance_id, card_id FROM item_instance_cards WHERE instance_id IN (?)',
                [instanceIds]
            );
            for (const c of cardRows) {
                if (!cardsByInstance[c.instance_id]) cardsByInstance[c.instance_id] = [];
                cardsByInstance[c.instance_id].push(c.card_id);
            }
        }

        const inventory = {};
        for (const row of rows) {
            const cards = (cardsByInstance[row.instance_id] || [])
                .map((id) => getCardById(id))
                .filter(Boolean);

            if (row.slot === 'helmet') {
                inventory.helmet = row.armor_id;
                inventory.helmet_name = row.armor_name;
                inventory.helmet_img = row.armor_img;
                inventory.helmet_tier = row.armor_tier;
                inventory.helmet_defense = row.defense_multiplier;
                inventory.helmet_cards = cards;
            } else if (row.slot === 'armor') {
                inventory.armor = row.armor_id;
                inventory.armor_name = row.armor_name;
                inventory.armor_img = row.armor_img;
                inventory.armor_tier = row.armor_tier;
                inventory.armor_defense = row.defense_multiplier;
                inventory.armor_cards = cards;
            } else if (row.slot === 'melee') {
                inventory.melee = row.weapon_id;
                inventory.melee_name = row.weapon_name;
                inventory.melee_img = row.weapon_img;
                inventory.melee_tier = row.weapon_tier;
                inventory.melee_attack = row.attack_multiplier;
                inventory.melee_cards = cards;
            } else if (row.slot === 'ranged') {
                inventory.ranged = row.weapon_id;
                inventory.ranged_name = row.weapon_name;
                inventory.ranged_img = row.weapon_img;
                inventory.ranged_tier = row.weapon_tier;
                inventory.ranged_attack = row.attack_multiplier;
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

const LOADOUT_LIMIT = 10;

//!Loadout Queries

async function getLoadout(playerId) {
    try {
        const [rows] = await pool.query(
            `SELECT l.loadoutId, l.armor_id, l.weapon_id, l.misc_item_id,
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
        return { success: true, loadout: rows };
    } catch (error) {
        return { success: false, message: 'Hiba történt a loadout lekérése során' };
    }
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
    try {
        const [result] = await pool.query(
            'DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ? AND equipped = 0',
            [loadoutId, playerId]
        );
        if (result.affectedRows === 0) {
            return { success: false, message: 'Item not found in inventory.' };
        }
        return { success: true, message: 'Item deleted from inventory.' };
    } catch (error) {
        return { success: false, message: 'Error deleting item from inventory.' };
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
            // Update the first gold row to the exact new amount
            await connection.query('UPDATE player_stash SET gold = ? WHERE stashId = ?', [
                normalizedAmount,
                existing[0].stashId
            ]);
            // Remove any duplicate gold rows
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

// Admin Queries
async function deleteUser(username) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [userRows] = await connection.execute('SELECT userId FROM user WHERE name = ?', [
            username
        ]);

        if (userRows.length === 0) {
            throw new Error('User not found');
        }

        const userId = userRows[0].userId;

        await connection.execute('DELETE FROM player_stash WHERE playerId = ?', [userId]);
        await connection.execute('DELETE FROM player_loadout WHERE playerId = ?', [userId]);

        const [result] = await connection.execute('DELETE FROM user WHERE userId = ?', [userId]);

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function getUserInventory(userId) {
    const [userRows] = await pool.query('SELECT userId, name FROM user WHERE userId = ?', [userId]);
    if (userRows.length === 0) return null;

    const [rows] = await pool.query(
        `SELECT l.slot, l.armor_id, l.weapon_id,
                a.name AS armor_name, a.img_path AS armor_img, a.tier AS armor_tier,
                w.name AS weapon_name, w.img_path AS weapon_img, w.tier AS weapon_tier
         FROM player_loadout l
         LEFT JOIN armors a ON l.armor_id = a.armorId
         LEFT JOIN weapons w ON l.weapon_id = w.weaponId
         WHERE l.playerId = ? AND l.equipped = 1`,
        [userId]
    );

    const result = { userId: Number(userId), username: userRows[0].name };

    for (const row of rows) {
        if (row.slot === 'helmet') {
            result.helmet_id = row.armor_id;
            result.helmet_name = row.armor_name;
            result.helmet_img = row.armor_img;
            result.helmet_tier = row.armor_tier;
        } else if (row.slot === 'armor') {
            result.armor_id = row.armor_id;
            result.armor_name = row.armor_name;
            result.armor_img = row.armor_img;
            result.armor_tier = row.armor_tier;
        } else if (row.slot === 'melee') {
            result.melee_id = row.weapon_id;
            result.melee_name = row.weapon_name;
            result.melee_img = row.weapon_img;
            result.melee_tier = row.weapon_tier;
        } else if (row.slot === 'ranged') {
            result.ranged_id = row.weapon_id;
            result.ranged_name = row.weapon_name;
            result.ranged_img = row.weapon_img;
            result.ranged_tier = row.weapon_tier;
        }
    }

    return result;
}

async function getAllArmors() {
    const query = 'SELECT armorId, name, type, tier FROM armors ORDER BY type, tier ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

async function getAllWeapons() {
    const query = 'SELECT weaponId, name, type, tier FROM weapons ORDER BY type, tier ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

async function updateUserInventory(userId, inventoryData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(
            'UPDATE player_loadout SET armor_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
            [inventoryData.helmet, userId, 'helmet']
        );
        await connection.execute(
            'UPDATE player_loadout SET armor_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
            [inventoryData.armor, userId, 'armor']
        );
        await connection.execute(
            'UPDATE player_loadout SET weapon_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
            [inventoryData.melee, userId, 'melee']
        );
        await connection.execute(
            'UPDATE player_loadout SET weapon_id = ? WHERE playerId = ? AND equipped = 1 AND slot = ?',
            [inventoryData.ranged, userId, 'ranged']
        );

        await connection.execute(
            `DELETE FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL`,
            [userId]
        );

        await connection.commit();
        return { affectedRows: 4 };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

//dungeonloot algorithm
async function upgradeWeakestGearDB(weakestSlot, playerId) {
    const validSlots = ['helmet', 'armor', 'melee', 'ranged'];
    if (!validSlots.includes(weakestSlot)) {
        throw new Error(`Invalid slot: ${weakestSlot}`);
    }
    const isArmorSlot = weakestSlot === 'helmet' || weakestSlot === 'armor';
    const column = isArmorSlot ? 'armor_id' : 'weapon_id';
    const query = `UPDATE player_loadout SET \`${column}\` = \`${column}\` + 1 WHERE playerId = ? AND equipped = 1 AND slot = ?`;
    const [result] = await pool.execute(query, [playerId, weakestSlot]);
    return result;
}

//loot fetches
async function fetchWeaponByTier(tier) {
    try {
        const [rows] = await pool.query(
            `SELECT weaponId AS id, name, tier, img_path
             FROM weapons
             WHERE tier = ?
             ORDER BY RAND()
             LIMIT 1`,
            [tier]
        );

        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchArmorByTier(tier) {
    try {
        const [rows] = await pool.query(
            `SELECT armorId AS id, name, tier, img_path
             FROM armors
             WHERE tier = ?
             ORDER BY RAND()
             LIMIT 1`,
            [tier]
        );

        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchRandomMisc() {
    try {
        const [rows] = await pool.query(
            `SELECT itemId AS id, name, img_path, value
             FROM misc_items
             ORDER BY RAND()
             LIMIT 1`
        );

        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getRandomShopItems(limit = 5) {
    try {
        const parsedLimit = Number.parseInt(limit, 10);
        const safeLimit = Number.isInteger(parsedLimit)
            ? Math.min(Math.max(parsedLimit, 1), 12)
            : 5;

        const [rows] = await pool.query(
            `SELECT *
             FROM (
                SELECT
                    'weapon' AS category,
                    weaponId AS itemId,
                    type,
                    name,
                    img_path,
                    tier,
                    price,
                    attack_multiplier,
                    NULL AS defense_multiplier
                FROM weapons
 
                UNION ALL
 
                SELECT
                    'armor' AS category,
                    armorId AS itemId,
                    type,
                    name,
                    img_path,
                    tier,
                    price,
                    NULL AS attack_multiplier,
                    defense_multiplier
                FROM armors
             ) AS shop_items
             ORDER BY RAND()
             LIMIT ?`,
            [safeLimit]
        );

        return rows;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function insertIntoLoadout(playerId, type, itemId, cards = []) {
    try {
        let column;
        const itemDbType = type === 'weapon' ? 'weapon' : type === 'armor' ? 'armor' : 'misc';
        if (type === 'weapon') column = 'weapon_id';
        else if (type === 'armor') column = 'armor_id';
        else if (type === 'misc') column = 'misc_item_id';
        else return { success: false, message: 'Invalid item type.' };

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const instanceId = await createItemInstance(connection, itemDbType, itemId, cards);

            const loadoutId = await findNextAvailableId('player_loadout', 'loadoutId', connection);
            await connection.query(
                `INSERT INTO player_loadout (loadoutId, playerId, \`${column}\`, instance_id) VALUES (?, ?, ?, ?)`,
                [loadoutId, playerId, itemId, instanceId]
            );
            await connection.commit();
            return { success: true, message: 'Item inserted into loadout.' };
        } catch (error) {
            await connection.rollback();
            console.error('insertIntoLoadout error:', error);
            return { success: false, message: 'Database error while inserting loot.' };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database error while inserting loot.' };
    }
}

async function purchaseItemToLoadout(playerId, itemId, category, price) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [countRows] = await connection.query(
            'SELECT COUNT(*) AS count FROM player_loadout WHERE playerId = ? AND equipped = 0 AND (armor_id IS NOT NULL OR weapon_id IS NOT NULL OR misc_item_id IS NOT NULL)',
            [playerId]
        );
        if (Number(countRows[0].count) >= LOADOUT_LIMIT) {
            await connection.rollback();
            return { success: false, message: 'Loadout is full. Maximum 10 items allowed.' };
        }

        const [loadoutGoldRows] = await connection.query(
            'SELECT loadoutId, gold_amount FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL FOR UPDATE',
            [playerId]
        );
        const totalGold = loadoutGoldRows.reduce((sum, row) => sum + (row.gold_amount || 0), 0);

        let itemRow;
        if (category === 'weapon') {
            const [rows] = await connection.query(
                'SELECT weaponId AS id, type, tier, price FROM weapons WHERE weaponId = ?',
                [itemId]
            );
            itemRow = rows[0];
        } else {
            const [rows] = await connection.query(
                'SELECT armorId AS id, type, tier, price FROM armors WHERE armorId = ?',
                [itemId]
            );
            itemRow = rows[0];
        }

        if (!itemRow) {
            await connection.rollback();
            return { success: false, message: 'Item not found.' };
        }

        if (totalGold < price) {
            await connection.rollback();
            return {
                success: false,
                message: `Not enough gold. Need ${price}, have ${totalGold}.`
            };
        }

        let remaining = price;
        for (const row of loadoutGoldRows) {
            if (remaining <= 0) break;
            const deduct = Math.min(row.gold_amount, remaining);
            const newAmount = row.gold_amount - deduct;
            remaining -= deduct;

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

        if (category === 'weapon') {
            const generatedCards = pickCardsForItem(itemRow.type, Number(itemRow.tier));
            const instanceId = await createItemInstance(
                connection,
                'weapon',
                itemId,
                generatedCards
            );
            const newLoadoutId = await findNextAvailableId(
                'player_loadout',
                'loadoutId',
                connection
            );
            await connection.query(
                'INSERT INTO player_loadout (loadoutId, playerId, weapon_id, instance_id) VALUES (?, ?, ?, ?)',
                [newLoadoutId, playerId, itemId, instanceId]
            );
        } else {
            const generatedCards = pickCardsForItem(itemRow.type, Number(itemRow.tier));
            const instanceId = await createItemInstance(
                connection,
                'armor',
                itemId,
                generatedCards
            );
            const newLoadoutId = await findNextAvailableId(
                'player_loadout',
                'loadoutId',
                connection
            );
            await connection.query(
                'INSERT INTO player_loadout (loadoutId, playerId, armor_id, instance_id) VALUES (?, ?, ?, ?)',
                [newLoadoutId, playerId, itemId, instanceId]
            );
        }

        await connection.commit();
        return { success: true, remainingGold: totalGold - price };
    } catch (error) {
        await connection.rollback();
        console.error('purchaseItemToLoadout error:', error);
        return { success: false, message: 'Database error during purchase.' };
    } finally {
        connection.release();
    }
}

async function sellItemFromLoadout(playerId, loadoutId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [loadoutRows] = await connection.query(
            'SELECT * FROM player_loadout WHERE loadoutId = ? AND playerId = ? AND equipped = 0',
            [loadoutId, playerId]
        );
        if (loadoutRows.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Item not found in loadout.' };
        }
        const loadoutItem = loadoutRows[0];

        let sellPrice = 0;
        let itemName = 'Unknown';
        let basePrice = 0;

        if (loadoutItem.armor_id) {
            const [armorRows] = await connection.query(
                'SELECT name, price FROM armors WHERE armorId = ?',
                [loadoutItem.armor_id]
            );
            if (armorRows.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Armor data not found.' };
            }
            basePrice = armorRows[0].price;
            itemName = armorRows[0].name;
        } else if (loadoutItem.weapon_id) {
            const [weaponRows] = await connection.query(
                'SELECT name, price FROM weapons WHERE weaponId = ?',
                [loadoutItem.weapon_id]
            );
            if (weaponRows.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Weapon data not found.' };
            }
            basePrice = weaponRows[0].price;
            itemName = weaponRows[0].name;
        } else if (loadoutItem.misc_item_id) {
            const [miscRows] = await connection.query(
                'SELECT name, value FROM misc_items WHERE itemId = ?',
                [loadoutItem.misc_item_id]
            );
            if (miscRows.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Misc item data not found.' };
            }
            basePrice = miscRows[0].value;
            itemName = miscRows[0].name;
        } else {
            await connection.rollback();
            return { success: false, message: 'Loadout entry has no sellable item.' };
        }

        // Sell for 40-60% of base value
        let sellPercent = 40 + Math.floor(Math.random() * 21);
        sellPrice = Math.floor((basePrice * sellPercent) / 100);
        if (sellPrice < 1) {
            sellPrice = 1;
        }

        await connection.query('DELETE FROM player_loadout WHERE loadoutId = ? AND playerId = ?', [
            loadoutId,
            playerId
        ]);

        const newLoadoutId = await findNextAvailableId('player_loadout', 'loadoutId', connection);
        await connection.query(
            'INSERT INTO player_loadout (loadoutId, playerId, gold_amount) VALUES (?, ?, ?)',
            [newLoadoutId, playerId, sellPrice]
        );

        const [goldRows] = await connection.query(
            'SELECT COALESCE(SUM(gold_amount), 0) AS gold FROM player_loadout WHERE playerId = ? AND gold_amount IS NOT NULL',
            [playerId]
        );
        let newTotalGold = goldRows[0].gold;

        await connection.commit();
        return {
            success: true,
            message: `Sold ${itemName} for ${sellPrice} gold.`,
            soldFor: sellPrice,
            itemName: itemName,
            remainingGold: newTotalGold
        };
    } catch (error) {
        await connection.rollback();
        console.error('sellItemFromLoadout error:', error);
        return { success: false, message: 'Database error during sale.' };
    } finally {
        connection.release();
    }
}

async function getItemBaseInfo(itemId, category) {
    try {
        let query;
        if (category === 'weapon') {
            query = 'SELECT price, tier FROM weapons WHERE weaponId = ?';
        } else if (category === 'armor') {
            query = 'SELECT price, tier FROM armors WHERE armorId = ?';
        } else {
            return null;
        }

        const [rows] = await pool.query(query, [itemId]);
        return rows[0] || null;
    } catch (error) {
        console.error('getItemBaseInfo error:', error);
        return null;
    }
}

//!Combat Deck Query
async function getPlayerCombatDeckCardIds(playerId) {
    const query = `
        SELECT iic.card_id
         FROM player_loadout pl
         JOIN item_instance_cards iic
           ON iic.instance_id = pl.instance_id
         WHERE pl.playerId = ? AND pl.equipped = 1 AND pl.instance_id IS NOT NULL
         `;
    const [rows] = await pool.execute(query, [playerId]);
    return rows;
}

async function getPlayerCombatDeck(playerId) {
    try {
        const rows = await getPlayerCombatDeckCardIds(playerId);
        if (rows.length === 0) {
            return { success: false, message: 'Játékos nem található' };
        }
        const deck = rows.map((row) => getCardById(row.card_id)).filter(Boolean);
        return { success: true, deck };
    } catch (error) {
        return { success: false, message: 'Hiba történt a kártyapakli lekérése során' };
    }
}

//!Export
module.exports = {
    pool,
    findNextAvailableId,
    selectleadboard,
    getUserRankAndScore,
    loginUser,
    registerUser,
    loginAdmin,
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
    moveLoadoutToStash,
    swapLoadoutEquipment,
    deleteFromLoadout,
    getTotalGold,
    addGoldToInventory,
    transferGoldBetweenStorage,
    getUserInventory,
    getAllUsers,
    getAllArmors,
    getAllWeapons,
    updateUserInventory,
    deleteUser,
    adminSetStashGold,
    upgradeWeakestGearDB,
    fetchWeaponByTier,
    fetchArmorByTier,
    fetchRandomMisc,
    getRandomShopItems,
    insertIntoLoadout,
    purchaseItemToLoadout,
    getItemBaseInfo,
    getPlayerCombatDeckCardIds,
    getPlayerCombatDeck,
    sellItemFromLoadout,
    getItemBaseInfo
};
