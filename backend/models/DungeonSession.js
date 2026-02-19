const crypto = require('crypto');

class DungeonSession {
    constructor(dungeonName, dungeonLevel) {
        this.dungeonName = dungeonName;
        this.dungeonLevel = dungeonLevel;
        this.sessionToken = crypto.randomUUID();
        this.map = this.createEmptyMap();
        this.playerPos = { x: 5, y: 5 };
        this.visitedRooms = new Set();
        this.activeRooms = [];
        this.generateMap();
    }

    // Create empty 9x9 grid (indices 1-9, matching original logic)
    createEmptyMap() {
        const map = {};
        for (let y = 1; y <= 9; y++) {
            for (let x = 1; x <= 9; x++) {
                map[`${x},${y}`] = {
                    exists: false,
                    roomType: null,
                    visited: false
                };
            }
        }
        return map;
    }

    // Port of setCell from newGame.js — same bounds and 0.4 probability
    setCell(x, y) {
        if (x > 0 && x < 10 && y > 0 && y < 10) {
            const key = `${x},${y}`;
            if (this.map[key] && !this.map[key].exists && Math.random() < 0.4) {
                this.map[key].exists = true;
                return true;
            }
        }
        return false;
    }

    // Port of checkCell from roomGeneration.js
    checkCell(x, y) {
        if (x > 0 && x < 10 && y > 0 && y < 10) {
            const key = `${x},${y}`;
            return this.map[key] && this.map[key].exists;
        }
        return false;
    }

    // Port of the map generation logic from newLevel() in newGame.js
    generateMap() {
        // Start room
        const startX = 5;
        const startY = 5;
        const startKey = `${startX},${startY}`;
        this.map[startKey].exists = true;
        this.map[startKey].roomType = 'start';
        this.map[startKey].visited = true;

        this.playerPos = { x: startX, y: startY };
        this.visitedRooms.add(startKey);

        // Generate room count — same formula as newGame.js
        let roomsToGenerate = Math.floor(Math.random() * 3 + 1) + this.dungeonLevel + 4;

        // Active rooms list for random walk expansion
        this.activeRooms = [{ x: startX, y: startY }];

        while (this.activeRooms.length < roomsToGenerate) {
            // Choose random active room
            let current = this.activeRooms[Math.floor(Math.random() * this.activeRooms.length)];

            // 4 directions
            let directions = [
                { x: current.x - 1, y: current.y },
                { x: current.x + 1, y: current.y },
                { x: current.x, y: current.y - 1 },
                { x: current.x, y: current.y + 1 }
            ];

            // Random direction
            let dir = directions[Math.floor(Math.random() * directions.length)];

            if (this.setCell(dir.x, dir.y)) {
                this.activeRooms.push({ x: dir.x, y: dir.y });
            }
        }

        // Assign room types — same logic as newGame.js
        // Get all room cells except start
        let roomCells = this.activeRooms.filter((r) => !(r.x === startX && r.y === startY));

        // Find furthest room from start (Manhattan distance) for 'out' room
        let maxDistance = 0;
        let outIndex = 0;
        for (let i = 0; i < roomCells.length; i++) {
            let distance = Math.abs(roomCells[i].x - startX) + Math.abs(roomCells[i].y - startY);
            if (distance > maxDistance) {
                maxDistance = distance;
                outIndex = i;
            }
        }

        // Set out room
        const outRoom = roomCells[outIndex];
        this.map[`${outRoom.x},${outRoom.y}`].roomType = 'out';
        roomCells.splice(outIndex, 1);

        // 1 shop room (last in the array, matching .pop() behavior)
        if (roomCells.length > 0) {
            const shopRoom = roomCells.pop();
            this.map[`${shopRoom.x},${shopRoom.y}`].roomType = 'shop';
        }

        // Other rooms get random types — same distribution as newGame.js
        const randomTypes = ['combat', 'combat', 'combat', 'combat', 'event', 'loot'];
        roomCells.forEach((cell) => {
            this.map[`${cell.x},${cell.y}`].roomType =
                randomTypes[Math.floor(Math.random() * randomTypes.length)];
        });
    }

    // Get doors (adjacent room availability) for the current position
    getAdjacentDoors() {
        const { x, y } = this.playerPos;
        return {
            up: this.checkCell(x, y - 1),
            right: this.checkCell(x + 1, y),
            down: this.checkCell(x, y + 1),
            left: this.checkCell(x - 1, y)
        };
    }

    // Get the visible map layout — only which cells exist, no roomType for unvisited
    getVisibleMap() {
        const visible = {};
        for (const [key, cell] of Object.entries(this.map)) {
            if (cell.exists) {
                visible[key] = {
                    exists: true,
                    visited: cell.visited,
                    // Only reveal roomType if visited
                    roomType: cell.visited ? cell.roomType : null
                };
            }
        }
        return visible;
    }

    // Get the map bounds for cutOutMap equivalent
    getMapBounds() {
        let minX = 10,
            maxX = 0,
            minY = 10,
            maxY = 0;
        for (const [key, cell] of Object.entries(this.map)) {
            if (cell.exists) {
                const [x, y] = key.split(',').map(Number);
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
        return { minX, maxX, minY, maxY, adaptiveSize: Math.max(maxX - minX + 1, maxY - minY + 1) };
    }

    // Validate and execute a move
    movePlayer(dx, dy) {
        // Only allow cardinal moves of exactly 1 cell
        if (!Number.isInteger(dx) || !Number.isInteger(dy)) {
            return { success: false, reason: 'Invalid move values' };
        }
        if (Math.abs(dx) + Math.abs(dy) !== 1) {
            return { success: false, reason: 'Invalid move direction' };
        }

        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;

        if (!this.checkCell(newX, newY)) {
            return { success: false, reason: 'No room available' };
        }

        // Move player
        this.playerPos = { x: newX, y: newY };
        const key = `${newX},${newY}`;
        const isNewRoom = !this.visitedRooms.has(key);
        this.visitedRooms.add(key);
        this.map[key].visited = true;

        const room = this.map[key];

        return {
            success: true,
            position: { ...this.playerPos },
            roomType: room.roomType,
            isNewRoom,
            doors: this.getAdjacentDoors()
        };
    }

    // Regenerate map for next level
    nextLevel() {
        const currentKey = `${this.playerPos.x},${this.playerPos.y}`;
        const currentRoom = this.map[currentKey];

        if (!currentRoom || currentRoom.roomType !== 'out') {
            return { success: false, reason: 'Not at exit room' };
        }

        this.dungeonLevel++;
        this.map = this.createEmptyMap();
        this.visitedRooms = new Set();
        this.activeRooms = [];
        this.generateMap();

        return {
            success: true,
            dungeonLevel: this.dungeonLevel,
            map: this.getVisibleMap(),
            bounds: this.getMapBounds(),
            position: { ...this.playerPos },
            doors: this.getAdjacentDoors()
        };
    }

    // Validate exit
    canExit() {
        const currentKey = `${this.playerPos.x},${this.playerPos.y}`;
        const currentRoom = this.map[currentKey];
        return currentRoom && currentRoom.roomType === 'out';
    }

    // Serialize to plain object for session storage
    toJSON() {
        return {
            dungeonName: this.dungeonName,
            dungeonLevel: this.dungeonLevel,
            sessionToken: this.sessionToken,
            map: this.map,
            playerPos: this.playerPos,
            visitedRooms: [...this.visitedRooms],
            activeRooms: this.activeRooms
        };
    }

    // Reconstruct from session-stored data
    static fromJSON(data) {
        const session = Object.create(DungeonSession.prototype);
        session.dungeonName = data.dungeonName;
        session.dungeonLevel = data.dungeonLevel;
        session.sessionToken = data.sessionToken;
        session.map = data.map;
        session.playerPos = data.playerPos;
        session.visitedRooms = new Set(data.visitedRooms);
        session.activeRooms = data.activeRooms;
        return session;
    }
}

module.exports = DungeonSession;
