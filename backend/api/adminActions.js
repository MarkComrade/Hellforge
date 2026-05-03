const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { getAllUsers } = require('../sql/queries/authUserQueries.js');
const {
    deleteUser,
    getUserInventory,
    getAllArmors,
    getAllWeapons,
    updateUserInventory
} = require('../sql/queries/adminQueries.js');
const { getTotalGold, adminSetStashGold } = require('../sql/queries/inventoryQueries.js');
const { requireAdmin } = require('./middleware');

// All admin endpoints require an active admin session.
router.use(requireAdmin);

// TODO: In the future, this should add user to ban list instead of hard delete
router.post('/deleteUser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        const inventory = await getUserInventory(userId);
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        await deleteUser(inventory.username);
        res.status(200).json({ success: true, message: 'User successfully deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user.' });
    }
});

router.get('/getAllUsers', async (req, res) => {
    try {
        const result = await getAllUsers();
        res.status(200).json({ success: true, results: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving users.' });
    }
});

router.get('/getUserGold/:userId', async (req, res) => {
    try {
        const result = await getTotalGold(req.params.userId);
        if (!result.success) {
            return res.status(500).json({ success: false, message: result.message });
        }
        res.status(200).json({ success: true, stashGold: result.gold.stash });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving gold.' });
    }
});

router.post('/setUserStashGold/:userId', async (req, res) => {
    try {
        const { gold } = req.body;
        if (gold === undefined || gold === null || gold === '') {
            return res.status(400).json({ success: false, message: 'Gold value is required.' });
        }
        const result = await adminSetStashGold(req.params.userId, gold);
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error setting gold.' });
    }
});

router.get('/getUserInventory/:userId', async (req, res) => {
    try {
        const inventory = await getUserInventory(req.params.userId);
        if (!inventory) {
            return res
                .status(404)
                .json({ success: false, message: 'User or inventory not found.' });
        }
        res.status(200).json({ success: true, inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving inventory.' });
    }
});

router.get('/getAllArmors', async (req, res) => {
    try {
        const armors = await getAllArmors();
        res.status(200).json({ success: true, armors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving armors.' });
    }
});

router.get('/getAllWeapons', async (req, res) => {
    try {
        const weapons = await getAllWeapons();
        res.status(200).json({ success: true, weapons });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving weapons.' });
    }
});

router.post('/updateUserInventory/:userId', upload.none(), async (req, res) => {
    try {
        const { helmet, armor, melee, ranged } = req.body || {};
        if (!helmet || !armor || !melee || !ranged) {
            return res
                .status(400)
                .json({ success: false, message: 'All inventory fields are required.' });
        }
        const parsed = {
            helmet: parseInt(helmet),
            armor: parseInt(armor),
            melee: parseInt(melee),
            ranged: parseInt(ranged)
        };
        if (Object.values(parsed).some(isNaN)) {
            return res
                .status(400)
                .json({ success: false, message: 'All inventory fields must be valid integers.' });
        }
        await updateUserInventory(req.params.userId, parsed);
        res.status(200).json({ success: true, message: 'Inventory successfully updated.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating inventory.' });
    }
});

module.exports = router;
