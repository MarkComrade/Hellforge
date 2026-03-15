//!Module-ok importálása
require('dotenv').config(); //?npm install dotenv
const { pool } = require('./sql/database.js'); //?Adatbázis kapcsolat
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

const ip = process.env.SERVER_IP || '127.0.0.1';
const port = parseInt(process.env.SERVER_PORT) || 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy

//!Session beállítása:
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
);

//!Routing
//?Főoldal:
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

//!API endpoints
app.use('/', router);
const endpoints = require('./api/api.js');
app.use('/api', endpoints);
const login = require('./api/loginAuthApi.js');
app.use('/api/loginAuthApi', login);
const adminActions = require('./api/adminActions.js');
app.use('/api/adminActions', adminActions);
const inventory = require('./api/inventoryHandlerApi.js');
app.use('/api/inventory', inventory);
const dungeon = require('./api/dungeonApi.js'); // server-authoritative dungeon routes (start, move, exit, etc.)
app.use('/api/dungeon', dungeon);
const events = require('./api/eventApi.js');
app.use('/api/events', events);

//!Szerver futtatása
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});
//!Database test

//!Database connection with retry logic
async function connectWithRetry(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('Sikeres adatbázis kapcsolat!');
            return;
        } catch (err) {
            console.log(`Adatbázis kapcsolat próbálkozás ${i + 1}/${retries}...`);
            if (i === retries - 1) {
                console.error('Hiba az adatbázis kapcsolat során:', err);
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

connectWithRetry();
