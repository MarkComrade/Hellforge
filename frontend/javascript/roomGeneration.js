// roomGeneration.js — Map rendering, navigation, and room event handling.
// these functions only render what the server sends.
// Uses postFetch from getPostFetch.js (check load order).

// Apply the server's map onto the 9×9 DOM grid.
// Each cell is matched by col,row to the server's "x,y" keys.
// Cells outside the bounding box are hidden; visible cells are scaled to fit.
function renderMap(mapData, bounds) {
    const container = document.getElementById('map');
    if (!container) return;

    const { minX, maxX, minY, maxY, adaptiveSize } = bounds;

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

        // cutOutMap logic — hide cells outside bounds
        if (col < minX || col > maxX || row < minY || row > maxY) {
            cell.style.display = 'none';
        } else {
            cell.style.width = 23 / adaptiveSize + 'vh';
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
        Laboratory: '../textures/rooms/door_laboratory.png',
        Crypt: '../textures/rooms/door_crypt.png',
        Labyrinth: '../textures/rooms/door_labyrinth.png',
        'Gates of Hell': '../textures/rooms/door_hell.png'
    };
    const doorTexture = doorTextures[dungeon] || '../textures/rooms/door_hell.png';

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

// Set up navigation — sends move requests to server
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

                //console.log(`Current position: (${result.position.x}, ${result.position.y})`);

                // Handle room events with server-validated data
                const cell = document.querySelector('#map .cell[data-current="true"]');
                if (cell && result.roomType) {
                    cell.dataset.roomType = result.roomType;
                    roomEventHandler(cell, dungeonLevel, result);
                }
            } catch (error) {
                console.log('Move failed:', error.message);
            }
        });
    });
}

// Room event handler — uses server-provided roomType instead of client DOM data
function roomEventHandler(room, dungeonLevel, result) {
    // Use server-provided roomType if available, fall back to DOM (for start room)
    const roomType = result.roomType || room.dataset.roomType;

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

    if (roomType !== 'shop') {
        const shopOverlay = document.getElementById('shop-overlay');
        if (shopOverlay) shopOverlay.remove();
    }

    switch (roomType) {
        case 'start':
            break;
        case 'combat':
            //combatStart();
            break;
        case 'loot':
            createFrontendLootPopup(result.Event);
            break;
        case 'shop':
            renderShop();
            break;
        case 'event':
            createFrontendEvent(result.Event);
            break;
        case 'out':
            outRoom(room, dungeonLevel);
            break;
    }
}
