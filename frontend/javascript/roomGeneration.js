//map functions
function checkCell(x, y) {
    if (x > 0 && x < 10 && y > 0 && y < 10) {
        let cell = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
        return cell && cell.dataset.room === 'true';
    }
    return false;
}
function cutOutMap() {
    let cells = document.querySelectorAll('#map .cell[data-room="true"]');
    let minX = 10,
        maxX = 0,
        minY = 10,
        maxY = 0;
    cells.forEach((cell) => {
        let x = parseInt(cell.dataset.col);
        let y = parseInt(cell.dataset.row);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    });
    let allCells = document.querySelectorAll('#map .cell');

    let adaptiveSize = Math.max(maxX - minX + 1, maxY - minY + 1);
    allCells.forEach((cell) => {
        if (
            cell.dataset.col < minX ||
            cell.dataset.col > maxX ||
            cell.dataset.row < minY ||
            cell.dataset.row > maxY
        ) {
            cell.style.display = 'none';
        } else {
            cell.style.width = 23 / adaptiveSize + 'vh';

            cell.style.height = 23 / adaptiveSize + 'vh';
        }
    });
}
function navigateToRoom(x, y, dungeonLevel) {
    let body = document.getElementsByTagName('body')[0];
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
        span.addEventListener('click', function () {
            const newX = x + dir.dx;
            const newY = y + dir.dy;
            if (checkCell(newX, newY) === true) {
                const prevCell = document.querySelector(
                    `#map .cell[data-row="${y}"][data-col="${x}"]`
                );
                prevCell.dataset.current = 'false';
                prevCell
                    .querySelectorAll('img.doorUp, img.doorRight, img.doorDown, img.doorLeft')
                    .forEach((img) => img.remove());

                x = newX;
                y = newY;

                let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
                data.dataset.visited = 'true';
                data.dataset.current = 'true';

                data.querySelectorAll(
                    'img.doorUp, img.doorRight, img.doorDown, img.doorLeft'
                ).forEach((img) => img.remove());

                generateDoors(sessionStorage.getItem('currentDungeon'));
                roomEventHandler(data, dungeonLevel);
            } else {
                console.log('No room available');
            }
            console.log(`Current position: (${x}, ${y})`);
        });
    });
}
function generateDoors(dungeon) {
    console.log(dungeon);
    const doorTextures = {
        Laboratory: '../textures/rooms/door_lab.png',
        Crypt: '../textures/rooms/door_crypt.png',
        Labyrinth: '../textures/rooms/door_labyrinth.png',
        'Gates of Hell': '../textures/rooms/door_hell.png'
    };

    const doorTexture = doorTextures[dungeon];

    const currentPosition = document.querySelector('#map .cell[data-current="true"]');
    const x = parseInt(currentPosition.dataset.col);
    const y = parseInt(currentPosition.dataset.row);

    // Up
    if (checkCell(x, y - 1)) {
        const doorUp = document.createElement('img');
        doorUp.src = doorTexture;
        doorUp.classList.add('doorUp');
        currentPosition.appendChild(doorUp);
    }
    // Right
    if (checkCell(x + 1, y)) {
        const doorRight = document.createElement('img');
        doorRight.src = doorTexture;
        doorRight.classList.add('doorRight');
        currentPosition.appendChild(doorRight);
    }
    // Down
    if (checkCell(x, y + 1)) {
        const doorDown = document.createElement('img');
        doorDown.src = doorTexture;
        doorDown.classList.add('doorDown');
        currentPosition.appendChild(doorDown);
    }
    // Left
    if (checkCell(x - 1, y)) {
        const doorLeft = document.createElement('img');
        doorLeft.src = doorTexture;
        doorLeft.classList.add('doorLeft');
        currentPosition.appendChild(doorLeft);
    }
}

function roomEventHandler(room, dungeonLevel) {
    //TODO
    if (room.dataset.roomType !== 'out') {
        let trapdoor = document.getElementById('trapDoor');
        let exitButton = document.getElementById('exitButton');
        let continueButton = document.getElementById('continueButton');
        if (trapdoor || exitButton || continueButton) {
            trapdoor.remove();
            exitButton.remove();
            continueButton.remove();
        }
    }

    console.log(`Entered room type: ${room.dataset.roomType}`);

    switch (room.dataset.roomType) {
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
                exitButton.addEventListener('click', () => {
                    exitDungeon();
                });

                let continueButton = document.createElement('button');
                continueButton.id = 'continueButton';
                continueButton.className = 'menuButton';
                continueButton.textContent = 'Continue dungeon';
                document.body.appendChild(continueButton);
                continueButton.addEventListener('click', () => {
                    dungeonLevel++;
                    document.getElementById('level-number').textContent = dungeonLevel;
                    newLevel(sessionStorage.getItem('currentDungeon'), dungeonLevel, 100);
                });
            });
            break;
    }
}
