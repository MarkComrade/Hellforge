//!Module-ok importálása
require('dotenv').config(); //?npm install dotenv
const { pool } = require('./sql/core/connection.js'); //?Adatbázis kapcsolat
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const helmet = require('helmet'); //?npm install helmet
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set.');
}

const ip = process.env.SERVER_IP || '127.0.0.1';
const port = parseInt(process.env.SERVER_PORT) || 3000;

app.use(express.json()); //?Middleware JSON
app.use(helmet({ contentSecurityPolicy: false })); //?Security headers
app.set('trust proxy', 1); //?Middleware Proxy

//!Session beállítása:
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'strict'
        }
    })
);

//!Routing
//?Főoldal:
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

//!API endpoints
app.use('/', router);
const login = require('./api/loginAuthApi.js');
app.use('/api/loginAuthApi', login);
const adminActions = require('./api/adminActions.js');
app.use('/api/adminActions', adminActions);
const inventory = require('./api/inventoryHandlerApi.js');
app.use('/api/inventory', inventory);
const dungeon = require('./api/dungeonApi.js');
app.use('/api/dungeon', dungeon);
const combat = require('./api/combatApi.js');
app.use('/api/combat', combat);
const events = require('./api/eventApi.js');
app.use('/api/events', events);
const leaderboard = require('./api/leaderboardApi.js');
app.use('/api/leaderboard', leaderboard);

//!Database connection with retry logic
async function connectWithRetry(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('successfully connected to the database');
            return;
        } catch (err) {
            console.log(`Database connection attempt ${i + 1}/${retries}...`);
            if (i === retries - 1) {
                console.error('Error connecting to the database:', err);
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

//!start the server after successful database connection
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
connectWithRetry().then(() => {
    app.listen(port, ip, () => {
        console.log(`Server is running at http://${ip}:${port}`);
    });
});
