const crypto = require('crypto');

// Server-side dungeon state — holds the map, player position, and HP for one dungeon run.
// The entire game state lives here so the client can't cheat by modifying local variables.
class DungeonSession {
    constructor(dungeonName, dungeonLevel = 1) {
        this.sessionToken = crypto.randomUUID(); // unique token to link client requests to this session
        this.dungeonName = dungeonName;
        this.dungeonLevel = dungeonLevel;
        this.playerX = 5; // start at center of 9×9 grid
        this.playerY = 5;
        this.currentHP = 100;
        this.map = {}; // key: "x,y" → { exists, roomType, visited }
        this.visitedRooms = new Set(); // tracks which rooms the player has entered
        this.shopStock = {}; // key: "x,y" → array of shop items (cached per shop room)
        this.roomLoot = {}; // key: "x,y" → generated loot state for that room
        this.bounds = { minX: 1, maxX: 9, minY: 1, maxY: 9, adaptiveSize: 9 };

        this.generateMap(); // auto-generate on construction
    }

    // ───── Map generation (mirrors original client-side algorithm) ─────

    // Random-walk map generation on a 9×9 grid.
    // Starts at (5,5), picks random directions, places rooms until totalRooms is reached.
    // Higher dungeonLevel = more rooms (formula: random(1-3) + level + 4).
    generateMap() {
        const grid = {};
        const totalRooms = Math.floor(Math.random() * 3 + 1) + this.dungeonLevel + 4;
        let roomCount = 1;
        let currentX = 5;
        let currentY = 5;

        // Place the starting room at center
        grid[`${currentX},${currentY}`] = { exists: true, roomType: 'start', visited: true };
        this.visitedRooms.add(`${currentX},${currentY}`);

        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 }, // right
            { dx: 0, dy: 1 }, // down
            { dx: -1, dy: 0 } // left
        ];

        // Random walk: pick a random direction each iteration.
        // If the neighbor cell is empty, place a room there.
        // 40% chance to move the "cursor" to the new cell — this creates branching paths
        // instead of a straight line. Without it, rooms would cluster around the start.
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
                // 40% chance to follow the walk — creates branching, organic layouts
                if (Math.random() < 0.4) {
                    currentX = newX;
                    currentY = newY;
                }
            }
        }

        // ─── Exit room = furthest from start ───
        // Manhattan distance (|x-5| + |y-5|) measures how far a room is from center.
        // The room with the highest distance becomes the level exit ('out'),
        // so the player always has to explore most of the map to find it.
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

        // ─── Assign 1 shop to a random unassigned room ───
        const unassigned = Object.keys(grid).filter(
            (k) => k !== '5,5' && k !== exitKey && !grid[k].roomType
        );
        this._shuffle(unassigned);
        if (unassigned.length > 0) {
            grid[unassigned.shift()].roomType = 'shop';
        }

        // ─── Fill the rest with combat / event / loot in round-robin order ───
        const types = ['combat', 'event', 'loot', 'combat'];
        let typeIdx = 0;
        for (const key of unassigned) {
            if (!grid[key].roomType) {
                grid[key].roomType = types[typeIdx % types.length];
                typeIdx++;
            }
        }

        this.map = grid;
        this._computeBounds();
    }

    // ───── Movement ─────

    // Validate and execute a move. Returns null if the move is illegal.
    // This is the core anti-cheat: the server decides if a room exists,
    // so clients can't teleport or walk through walls.
    movePlayer(dx, dy) {
        // Reject diagonal or multi-cell moves — only up/down/left/right
        if (Math.abs(dx) + Math.abs(dy) !== 1) return null;

        const newX = this.playerX + dx;
        const newY = this.playerY + dy;
        const key = `${newX},${newY}`;

        // Reject if the target cell doesn't exist in the map
        if (!this.map[key] || !this.map[key].exists) return null;

        this.playerX = newX;
        this.playerY = newY;
        this.map[key].visited = true;
        this.visitedRooms.add(key);

        return {
            position: { x: this.playerX, y: this.playerY },
            roomType: this.map[key].roomType,
            doors: this._getAdjacentDoors(),
            visited: this.visitedRooms.has(key)
        };
    }

    // ───── Helpers ─────

    // Check which of the 4 neighbors have rooms — tells the client where to show doors
    _getAdjacentDoors() {
        return {
            up: this._roomExists(this.playerX, this.playerY - 1),
            right: this._roomExists(this.playerX + 1, this.playerY),
            down: this._roomExists(this.playerX, this.playerY + 1),
            left: this._roomExists(this.playerX - 1, this.playerY)
        };
    }

    // Returns true if a room exists at (x,y)
    _roomExists(x, y) {
        const key = `${x},${y}`;
        return !!(this.map[key] && this.map[key].exists);
    }

    // Calculate the bounding box of all rooms so the client can hide empty cells.
    // adaptiveSize = the larger dimension, used to scale cell sizes in the UI.
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

    // Fisher-Yates shuffle , In theory, this shuffle is better than `.sort(() => Math.random() - 0.5)` because it guarantees a uniformly distributed random order, whereas `.sort(() => Math.random() - 0.5)` does not guarantee this and in some cases can produce biased and not truly random results.
    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ───── Serialisation ─────
    // express-session stores objects as plain JSON, which means:
    //   1. Class prototype (methods) are lost — just a plain object remains
    //   2. Set objects become empty objects {} instead of arrays
    // toJSON() converts to a safe plain object (Set → Array).
    // fromJSON() rebuilds the full class instance (Array → Set, restores prototype).

    // Convert to a plain object safe for JSON.stringify
    toJSON() {
        return {
            sessionToken: this.sessionToken,
            dungeonName: this.dungeonName,
            dungeonLevel: this.dungeonLevel,
            playerX: this.playerX,
            playerY: this.playerY,
            currentHP: this.currentHP,
            map: this.map,
            visitedRooms: Array.from(this.visitedRooms), // Set → Array for JSON
            shopStock: this.shopStock,
            roomLoot: this.roomLoot,
            bounds: this.bounds
        };
    }

    // Reconstruct a DungeonSession from plain JSON data.
    // Object.create(prototype) gives us a proper instance without calling the constructor
    // (which would run generateMap() again and overwrite the saved map).
    static fromJSON(data) {
        const d = Object.create(DungeonSession.prototype);
        d.sessionToken = data.sessionToken;
        d.dungeonName = data.dungeonName;
        d.dungeonLevel = data.dungeonLevel;
        d.playerX = data.playerX;
        d.playerY = data.playerY;
        d.currentHP = data.currentHP;
        d.map = data.map;
        d.visitedRooms = new Set(data.visitedRooms); // Array → Set
        d.shopStock = data.shopStock || {};
        d.roomLoot = data.roomLoot || {};
        d.bounds = data.bounds;
        return d;
    }

    // ───── State snapshot sent to client ─────

    // Returns everything the client needs to render the current level.
    // SECURITY: only reveals roomType for visited rooms (fog of war).
    // Unvisited rooms are sent as {exists: true} so the client can draw walls/doors,
    // but the cheater can't see what type they are until they step on them.
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
            currentHP: this.currentHP
        };
    }
}

module.exports = DungeonSession;
