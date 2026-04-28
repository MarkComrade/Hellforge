const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const database = require('../sql/queries/authUserQueries.js');
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

const upload = multer({ storage: storage });

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // max 20 attempts per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later.' }
});

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,15}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,15}$/;

function validateCredentials(username, password) {
    if (typeof username !== 'string' || !USERNAME_REGEX.test(username)) {
        return 'Username must be 3–15 characters: letters, numbers, or underscores only.';
    }
    if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
        return 'Password must be 6–15 characters and include at least one letter and one number.';
    }
    return null;
}

//!Endpoints:

router.post('/loginUser', authLimiter, async (request, response) => {
    const { username, password } = request.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
        return response.status(400).json({ success: false, message: validationError });
    }
    try {
        const result = await database.loginUser(username, password);

        if (result.success) {
            request.session.isLoggedIn = true;
            request.session.userId = result.userId;
            request.session.userName = username;
        }
        response.json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'server error' });
    }
});

router.post('/registerUser', authLimiter, async (request, response) => {
    const { username, password } = request.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
        return response.status(400).json({ success: false, message: validationError });
    }
    try {
        const result = await database.registerUser(username, password);
        if (result.success) {
            request.session.isLoggedIn = true;
            request.session.userId = result.userId;
            request.session.userName = username;
        }
        response.json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'server error' });
    }
});

router.post('/logout', (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            response.status(500).json({ success: false, message: 'server error' });
        } else {
            response.json({ success: true, message: 'successful logout' });
        }
    });
});

router.post('/guest', (request, response) => {
    request.session.isLoggedIn = false;
    request.session.userName = 'Guest';
    response.json({ success: true, userName: 'Guest' });
});

router.post('/loginAdmin', authLimiter, async (request, response) => {
    const { username, password } = request.body;
    try {
        const result = await database.loginAdmin(username, password);
        if (result.success) {
            request.session.isLoggedIn = true;
            request.session.isAdmin = true;
            request.session.adminId = result.userId;
            request.session.adminName = username;
        }
        response.json(result);
    } catch (error) {
        response.status(500).json({ success: false, message: 'server error' });
    }
});

router.get('/session', (request, response) => {
    if (request.session.isLoggedIn) {
        response.json({
            isLoggedIn: true,
            isAdmin: request.session.isAdmin || false,
            userId: request.session.userId,
            userName: request.session.userName
        });
    } else {
        response.json({
            isLoggedIn: false,
            isAdmin: false,
            userName: request.session.userName || ''
        });
    }
});

module.exports = router;
