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

//!Szerver futtatása
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});
//!Database test
pool.query('SELECT 1')
    .then(() => {
        console.log('Sikeres adatbázis kapcsolat!');
    })
    .catch((err) => {
        console.error('Hiba az adatbázis kapcsolat során:', err);
        process.exit(1);
    });
