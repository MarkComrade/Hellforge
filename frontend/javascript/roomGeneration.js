<<<<<<< HEAD
//map functions — server-authoritative, client is renderer only
=======
//--- Fetch utility ---
const postFetch = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('hiba ' + response.statusText + ' (' + response.status + ')');
        }
        return await response.json();
    } catch (error) {
        throw new Error('hiba: ' + error.message);
    }
};

//--- Map rendering functions (server-authoritative, client is renderer only) ---
>>>>>>> main

// Render the map grid from server-provided data
function renderMap(mapData, bounds) {
    const container = document.getElementById('map');
    if (!container) return;

    const { minX, maxX, minY, maxY, adaptiveSize } = bounds;

<<<<<<< HEAD
    // Get all cells in the grid
=======
>>>>>>> main
    let allCells = container.querySelectorAll('.cell');
    allCells.forEach((cell) => {
        const col = parseInt(cell.dataset.col);
        const row = parseInt(cell.dataset.row);
        const key = `${col},${row}`;

        if (mapData[key] && mapData[key].exists) {
            cell.dataset.room = 'true';
            cell.dataset.visited = mapData[key].visited ? 'true' : 'false';
            if (mapData[key].roomType) {
                cell.dataset.roomType = mapData[key].roomType;
            }
        } else {
            cell.dataset.room = 'false';
        }

<<<<<<< HEAD
        // cutOutMap logic — hide cells outside bounds
=======
        // cutOutMap — hide cells outside bounds
>>>>>>> main
        if (col < minX || col > maxX || row < minY || row > maxY) {
            cell.style.display = 'none';
        } else {
            cell.style.width = 23 / adaptiveSize + 'vh';
<<<<<<< HEAD
=======

>>>>>>> main
            cell.style.height = 23 / adaptiveSize + 'vh';
        }
    });
}

// Render player position on the map
function renderPlayerPosition(pos) {
    document
        .querySelectorAll('#map .cell[data-current="true"]')
        .forEach((c) => (c.dataset.current = 'false'));
    const cell = document.querySelector(`#map .cell[data-row="${pos.y}"][data-col="${pos.x}"]`);
    if (cell) {
        cell.dataset.current = 'true';
        cell.dataset.visited = 'true';
    }
}

// Render doors based on server-provided adjacency data
function renderDoors(doors, dungeon) {
    const doorTextures = {
<<<<<<< HEAD
        Laboratory: '../textures/rooms/door_laboratory.png',
=======
        Laboratory: '../textures/rooms/door_lab.png',
>>>>>>> main
        Crypt: '../textures/rooms/door_crypt.png',
        Labyrinth: '../textures/rooms/door_labyrinth.png',
        'Gates of Hell': '../textures/rooms/door_hell.png'
    };
<<<<<<< HEAD

    const doorTexture = doorTextures[dungeon];
=======
    const doorTexture = doorTextures[dungeon] || '../textures/rooms/door_hell.png';

>>>>>>> main
    const currentCell = document.querySelector('#map .cell[data-current="true"]');
    if (!currentCell) return;

    // Remove old doors
    currentCell
        .querySelectorAll('img.doorUp, img.doorRight, img.doorDown, img.doorLeft')
        .forEach((img) => img.remove());

    if (doors.up) appendDoor(currentCell, doorTexture, 'doorUp');
    if (doors.right) appendDoor(currentCell, doorTexture, 'doorRight');
    if (doors.down) appendDoor(currentCell, doorTexture, 'doorDown');
    if (doors.left) appendDoor(currentCell, doorTexture, 'doorLeft');
}

function appendDoor(cell, src, className) {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add(className);
    cell.appendChild(img);
}

<<<<<<< HEAD
// Set up navigation — sends move requests to server
=======
// Set up navigation — sends move requests to server instead of checking DOM
>>>>>>> main
function navigateToRoom(startX, startY, dungeonLevel) {
    let body = document.getElementsByTagName('body')[0];
    const dungeon = sessionStorage.getItem('currentDungeon');
    const sessionToken = sessionStorage.getItem('dungeonSessionToken');

    const directions = [
        { name: 'Up', dx: 0, dy: -1 },
        { name: 'Right', dx: 1, dy: 0 },
        { name: 'Down', dx: 0, dy: 1 },
        { name: 'Left', dx: -1, dy: 0 }
    ];

    directions.forEach((dir) => {
        let span = document.createElement('span');
        span.setAttribute('id', 'navigate' + dir.name);
        body.appendChild(span);
        span.addEventListener('click', async function () {
            try {
                const result = await postFetch('/api/dungeon/move', {
                    dx: dir.dx,
                    dy: dir.dy,
                    sessionToken: sessionToken
                });

                if (!result.success) {
                    console.log('No room available');
                    return;
                }

                // Remove old doors from previous cell
                const prevCell = document.querySelector('#map .cell[data-current="true"]');
                if (prevCell) {
                    prevCell.dataset.current = 'false';
                    prevCell
                        .querySelectorAll('img.doorUp, img.doorRight, img.doorDown, img.doorLeft')
                        .forEach((img) => img.remove());
                }

                // Update position from server response
                renderPlayerPosition(result.position);
                renderDoors(result.doors, dungeon);

<<<<<<< HEAD
=======
<<<<<<<< HEAD:frontend/javascript/room.js
>>>>>>> main
                console.log(`Current position: (${result.position.x}, ${result.position.y})`);

                // Handle room events with server-validated data
                const cell = document.querySelector('#map .cell[data-current="true"]');
                if (cell && result.roomType) {
                    cell.dataset.roomType = result.roomType;
                    roomEventHandler(cell, dungeonLevel, result.roomType);
                }
            } catch (error) {
                console.log('Move failed:', error.message);
<<<<<<< HEAD
=======
========
                generateDoors(sessionStorage.getItem('currentDungeon'));
                roomEventHandler(data, dungeonLevel);
            } else {
                console.log('No room available');
>>>>>>>> main:frontend/javascript/roomGeneration.js
>>>>>>> main
            }
        });
    });
}
<<<<<<< HEAD

// Room event handler — uses server-provided roomType instead of client DOM data
function roomEventHandler(room, dungeonLevel, serverRoomType) {
    // Use server-provided roomType if available, fall back to DOM (for start room)
=======
<<<<<<<< HEAD:frontend/javascript/room.js
========
function generateDoors(dungeon) {
    console.log(dungeon);
    const doorTextures = {
        Laboratory: '../textures/rooms/door_laboratory.png',
        Crypt: '../textures/rooms/door_crypt.png',
        Labyrinth: '../textures/rooms/door_labyrinth.png',
        'Gates of Hell': '../textures/rooms/door_hell.png'
    };

    const doorTexture = doorTextures[dungeon];
>>>>>>>> main:frontend/javascript/roomGeneration.js

// Room event handler — uses server-provided roomType
function roomEventHandler(room, dungeonLevel, serverRoomType) {
>>>>>>> main
    const roomType = serverRoomType || room.dataset.roomType;

    if (roomType !== 'out') {
        let trapdoor = document.getElementById('trapDoor');
        let exitButton = document.getElementById('exitButton');
        let continueButton = document.getElementById('continueButton');
        if (trapdoor || exitButton || continueButton) {
            if (trapdoor) trapdoor.remove();
            if (exitButton) exitButton.remove();
            if (continueButton) continueButton.remove();
        }
    }

    console.log(`Entered room type: ${roomType}`);

    switch (roomType) {
        case 'start':
            console.log('Spawn room entered');
            break;
        case 'combat':
            console.log('Combat room entered');
            combatStart();
            break;
        case 'loot':
            console.log('Loot room entered');
            lootGained();
            break;
        case 'shop':
            console.log('Shop room entered');
            openShop();
            break;
        case 'event':
            console.log('Event room entered');
            triggerEvent();
            break;
        case 'out':
            let trapdoor = document.createElement('img');
            trapdoor.src = '../textures/rooms/trapdoor.png';
            trapdoor.id = 'trapDoor';
            room.appendChild(trapdoor);

            trapdoor.addEventListener('click', () => {
                let exitButton = document.createElement('button');
                exitButton.id = 'exitButton';
                exitButton.className = 'menuButton';
                exitButton.textContent = 'Exit the dungeon';
                document.body.appendChild(exitButton);
<<<<<<< HEAD
=======
<<<<<<<< HEAD:frontend/javascript/room.js
>>>>>>> main
                exitButton.addEventListener('click', async () => {
                    // Server validates exit is from 'out' room
                    try {
                        await postFetch('/api/dungeon/exit', {
                            sessionToken: sessionStorage.getItem('dungeonSessionToken')
                        });
<<<<<<< HEAD
                        exitDungeon();
                    } catch (error) {
                        console.log('Exit failed:', error.message);
                    }
=======
                        isInGame = false;
                        Menu();
                    } catch (error) {
                        console.log('Exit failed:', error.message);
                    }
========
                exitButton.addEventListener('click', () => {
                    exitDungeon();
>>>>>>>> main:frontend/javascript/roomGeneration.js
>>>>>>> main
                });

                let continueButton = document.createElement('button');
                continueButton.id = 'continueButton';
                continueButton.className = 'menuButton';
                continueButton.textContent = 'Continue dungeon';
                document.body.appendChild(continueButton);
<<<<<<< HEAD
=======
<<<<<<<< HEAD:frontend/javascript/room.js
>>>>>>> main
                continueButton.addEventListener('click', async () => {
                    // Server generates next level and validates we're at exit
                    try {
                        const result = await postFetch('/api/dungeon/next-level', {
                            sessionToken: sessionStorage.getItem('dungeonSessionToken')
                        });
                        if (result.success) {
                            dungeonLevel = result.dungeonLevel;
                            document.getElementById('level-number').textContent = dungeonLevel;
<<<<<<< HEAD
                            // Rebuild the level from server data
=======
>>>>>>> main
                            newLevelFromServer(
                                sessionStorage.getItem('currentDungeon'),
                                result,
                                100
                            );
                        }
                    } catch (error) {
                        console.log('Next level failed:', error.message);
                    }
<<<<<<< HEAD
=======
========
                continueButton.addEventListener('click', () => {
                    dungeonLevel++;
                    document.getElementById('level-number').textContent = dungeonLevel;
                    newLevel(sessionStorage.getItem('currentDungeon'), dungeonLevel, 100);
>>>>>>>> main:frontend/javascript/roomGeneration.js
>>>>>>> main
                });
            });
            break;
    }
}
