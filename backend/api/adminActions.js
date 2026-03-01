const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
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
router.get('/getAllUsers', async (request, response) => {
    try {
        const result = await database.getAllUsers();
        response.status(200).json({
            message: 'A Users successfully retrieved.',
            results: result
        });
    } catch (error) {
        response.status(500).json({
            message: 'this endpoint is not working.'
        });
    }
});
router.get('/deleteUser', async (request, response) => {
    try {
        const result = await database.deleteUser();
        response.status(200).json({
            message: 'A User successfully deleted.',
            results: result
        });
    } catch (error) {
        response.status(500).json({
            message: 'this endpoint is not working.'
        });
    }
});

router.get('/getUserInventory/:userId', async (request, response) => {
    try {
        const userId = request.params.userId;
        const inventory = await database.getUserInventory(userId);

        if (!inventory) {
            return response.status(404).json({
                message: 'User or inventory not found.'
            });
        }

        response.status(200).json({
            message: 'Inventory successfully retrieved.',
            inventory: inventory
        });
    } catch (error) {
        response.status(500).json({
            message: 'Error retrieving inventory.',
            error: error.message
        });
    }
});

module.exports = router;
