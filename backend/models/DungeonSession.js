const crypto = require('crypto');

class DungeonSession {
    constructor(dungeonName, dungeonLevel = 21) {
        this.sessionToken = crypto.randomUUID();
        this.dungeonName = dungeonName;
        this.dungeonLevel = dungeonLevel;
        this.playerX = 5;
        this.playerY = 5;
        this.maxHP = 100;
        this.currentHP = 100;
        this.map = {};
        this.visitedRooms = new Set();
        this.shopStock = {};
        this.roomLoot = {};
        this.bounds = { minX: 1, maxX: 9, minY: 1, maxY: 9, adaptiveSize: 9 };
        this.stats = { enemiesKilled: 0, floorsCleared: 0, goldCollected: 0 };

        this.generateMap();
    }

    generateMap() {
        const grid = {};
        const totalRooms =
            Math.floor(Math.random() * 3 + 1) + Math.floor(this.dungeonLevel / 3) + 4;
        let roomCount = 1;
        let currentX = 5;
        let currentY = 5;

        grid[`${currentX},${currentY}`] = { exists: true, roomType: 'start', visited: true };
        this.visitedRooms.add(`${currentX},${currentY}`);

        const directions = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }
        ];

        while (roomCount < totalRooms) {
            const dir = directions[Math.floor(Math.random() * 4)];
            const newX = currentX + dir.dx;
            const newY = currentY + dir.dy;

            if (newX >= 1 && newX <= 9 && newY >= 1 && newY <= 9) {
                const key = `${newX},${newY}`;
                if (!grid[key]) {
                    grid[key] = { exists: true, roomType: null, visited: false };
                    roomCount++;
                }
                if (Math.random() < 0.4) {
                    currentX = newX;
                    currentY = newY;
                }
            }
        }

        let maxDist = 0;
        let exitKey = null;
        for (const key of Object.keys(grid)) {
            if (key === '5,5') continue;
            const [x, y] = key.split(',').map(Number);
            const dist = Math.abs(x - 5) + Math.abs(y - 5);
            if (dist > maxDist) {
                maxDist = dist;
                exitKey = key;
            }
        }
        if (exitKey) grid[exitKey].roomType = 'out';

        const unassigned = Object.keys(grid).filter(
            (k) => k !== '5,5' && k !== exitKey && !grid[k].roomType
        );
        this._shuffle(unassigned);
        if (unassigned.length > 0) {
            grid[unassigned.shift()].roomType = 'shop';
        }

        let typeIdx = 0;
        for (const key of unassigned) {
            if (!grid[key].roomType) {
                let roll = Math.random();
                if (roll < 0.6) {
                    grid[key].roomType = 'combat';
                } else if (roll < 0.8) {
                    grid[key].roomType = 'event';
                } else {
                    grid[key].roomType = 'loot';
                }
                grid[key].cleared = false;
                typeIdx++;
            }
        }

        this.map = grid;
        this._computeBounds();
    }

    movePlayer(dx, dy) {
        if (Math.abs(dx) + Math.abs(dy) !== 1) return null;

        const newX = this.playerX + dx;
        const newY = this.playerY + dy;
        const key = `${newX},${newY}`;

        if (!this.map[key] || !this.map[key].exists) return null;

        this.playerX = newX;
        this.playerY = newY;
        this.map[key].visited = true;
        this.visitedRooms.add(key);

        return {
            position: { x: this.playerX, y: this.playerY },
            roomType: this.map[key].roomType,
            doors: this._getAdjacentDoors(),
            visited: this.visitedRooms.has(key),
            cleared: this.map[key].cleared === true
        };
    }

    _getAdjacentDoors() {
        return {
            up: this._roomExists(this.playerX, this.playerY - 1),
            right: this._roomExists(this.playerX + 1, this.playerY),
            down: this._roomExists(this.playerX, this.playerY + 1),
            left: this._roomExists(this.playerX - 1, this.playerY)
        };
    }

    _roomExists(x, y) {
        const key = `${x},${y}`;
        return !!(this.map[key] && this.map[key].exists);
    }

    _computeBounds() {
        let minX = 9,
            maxX = 1,
            minY = 9,
            maxY = 1;
        for (const key of Object.keys(this.map)) {
            const [x, y] = key.split(',').map(Number);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
        const adaptiveSize = Math.max(maxX - minX + 1, maxY - minY + 1);
        this.bounds = { minX, maxX, minY, maxY, adaptiveSize };
    }

    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    toJSON() {
        return {
            sessionToken: this.sessionToken,
            dungeonName: this.dungeonName,
            dungeonLevel: this.dungeonLevel,
            playerX: this.playerX,
            playerY: this.playerY,
            currentHP: this.currentHP,
            maxHP: this.maxHP,
            map: this.map,
            visitedRooms: Array.from(this.visitedRooms),
            shopStock: this.shopStock,
            roomLoot: this.roomLoot,
            bounds: this.bounds,
            stats: this.stats
        };
    }

    static fromJSON(data) {
        const d = Object.create(DungeonSession.prototype);
        d.sessionToken = data.sessionToken;
        d.dungeonName = data.dungeonName;
        d.dungeonLevel = data.dungeonLevel;
        d.playerX = data.playerX;
        d.playerY = data.playerY;
        d.currentHP = data.currentHP;
        d.maxHP = data.maxHP ?? 100;
        d.map = data.map;
        d.visitedRooms = new Set(data.visitedRooms);
        d.shopStock = data.shopStock || {};
        d.roomLoot = data.roomLoot || {};
        d.bounds = data.bounds;
        d.stats = data.stats || { enemiesKilled: 0, floorsCleared: 0, goldCollected: 0 };
        return d;
    }

    getClientState() {
        const fogMap = {};
        for (const [key, room] of Object.entries(this.map)) {
            if (room.visited) {
                fogMap[key] = { exists: true, roomType: room.roomType, visited: true };
            } else {
                fogMap[key] = { exists: true, visited: false };
            }
        }

        return {
            success: true,
            sessionToken: this.sessionToken,
            dungeonLevel: this.dungeonLevel,
            position: { x: this.playerX, y: this.playerY },
            map: fogMap,
            bounds: this.bounds,
            doors: this._getAdjacentDoors(),
            currentHP: this.currentHP,
            maxHP: this.maxHP,
            stats: this.stats
        };
    }
}

module.exports = DungeonSession;
