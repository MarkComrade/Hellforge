const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const database = require('../sql/queries/authUserQueries.js');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
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
        return 'Password must be 3–15 characters and include at least one letter and one number.';
    }
    return null;
}

//!Endpoints:

router.post('/loginUser', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }
    try {
        const result = await database.loginUser(username, password);
        if (result.success) {
            req.session.isLoggedIn = true;
            req.session.userId = result.userId;
            req.session.userName = username;
        }
        res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/registerUser', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }
    try {
        const result = await database.registerUser(username, password);
        if (result.success) {
            req.session.isLoggedIn = true;
            req.session.userId = result.userId;
            req.session.userName = username;
        }
        res.status(result.success ? 200 : 409).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Server error' });
        } else {
            res.json({ success: true, message: 'Successful logout' });
        }
    });
});

router.post('/guest', (req, res) => {
    req.session.isLoggedIn = false;
    req.session.userName = 'Guest';
    res.json({ success: true, userName: 'Guest' });
});

router.post('/loginAdmin', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    const validationError = validateCredentials(username, password);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }
    try {
        const result = await database.loginAdmin(username, password);
        if (result.success) {
            req.session.isLoggedIn = true;
            req.session.isAdmin = true;
            req.session.adminId = result.adminId;
            req.session.adminName = username;
        }
        res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/session', (req, res) => {
    if (req.session.isLoggedIn) {
        res.json({
            isLoggedIn: true,
            isAdmin: req.session.isAdmin || false,
            userId: req.session.userId,
            userName: req.session.userName
        });
    } else {
        res.json({
            isLoggedIn: false,
            isAdmin: false,
            userName: req.session.userName || ''
        });
    }
});

module.exports = router;
