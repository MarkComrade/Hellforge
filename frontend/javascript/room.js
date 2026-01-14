function newGame(dungeon) {
    // Clear body
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';
    let mapContainer = document.createElement('div');
    mapContainer.setAttribute('id', 'mapContainer');
    mapContainer.setAttribute('class', 'mapContainer');

    switch (dungeon) {
        case 'Laboratory':
            body[0].style.backgroundImage = "url('../textures/rooms/room_lab.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundColor = '#000000';
            break;
        case 'Crypt':
            body[0].style.backgroundImage = "url('../textures/rooms/room_crypt.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundColor = '#000000';
            break;
        case 'Labyrinth':
            body[0].style.backgroundImage = "url('../textures/rooms/room_labyrinth.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundColor = '#000000';
            break;
        case 'Gates of Hell':
            body[0].style.backgroundImage = "url('../textures/rooms/room_hell.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundColor = '#000000';
            break;
    }

    body[0].appendChild(mapContainer);

    let container = document.createElement('div');

    container.setAttribute('id', 'map');
    mapContainer.appendChild(container);

    // 9x9 grid
    for (let i = 0; i < 9; i++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'row');
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('class', 'cell');
            cell.dataset.row = i + 1;
            cell.dataset.col = j + 1;
            cell.dataset.room = false;
            cell.dataset.visited = false;

            div.appendChild(cell);
        }
        container.appendChild(div);
    }

    // start
    isInGame = true;

    let startX = 5;
    let startY = 5;
    let start = document.querySelector(`#map .cell[data-row="${startY}"][data-col="${startX}"]`);
    start.dataset.current = 'true';
    start.dataset.room = true;
    start.dataset.visited = true;
    start.dataset.roomType = 'start';

    //generate room lenght
    let roomsToGenerate = Math.floor(Math.random() * 3 + 1) + 5;
    console.log('Rooms to generate:', roomsToGenerate);

    // active rooms list
    let activeRooms = [{ x: startX, y: startY }];
    let roomTypes = ['combat', 'event', 'loot'];

    while (activeRooms.length < roomsToGenerate) {
        // choose random active room
        let current = activeRooms[Math.floor(Math.random() * activeRooms.length)];

        // 4 directions
        let directions = [
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 }
        ];

        // random direction
        let dir = directions[Math.floor(Math.random() * directions.length)];
        //
        if (setCell(dir.x, dir.y)) {
            activeRooms.push({ x: dir.x, y: dir.y });
        }
    }

    console.log('aktiv szvabaszam', activeRooms.length);

    // set cell as room
    function setCell(x, y) {
        if (x > 0 && x < 10 && y > 0 && y < 10) {
            let cell = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
            if (cell && cell.dataset.room === 'false' && Math.random() < 0.4) {
                cell.dataset.room = 'true';

                return true;
            }
        }
        return false;
    }

    // active room cells to array
    let roomCells = activeRooms.map((r) =>
        document.querySelector(`#map .cell[data-row="${r.y}"][data-col="${r.x}"]`)
    );

    // start room cut out
    roomCells = roomCells.filter((c) => c.dataset.roomType !== 'start');

    // furthest room from start to outroom
    let maxDistance = 0;
    let outMax = roomCells[0];
    for (let i = 0; i < roomCells.length; i++) {
        // Manhattan distance calculation
        let distance =
            Math.abs(roomCells[i].dataset.col - startX) +
            Math.abs(roomCells[i].dataset.row - startY);

        if (distance > maxDistance) {
            maxDistance = distance;
            outMax = roomCells[i];
        }
    }
    // cut out outroom
    let outRoom = outMax;
    roomCells = roomCells.filter((c) => c !== outRoom);
    outRoom.dataset.roomType = 'out';

    // 1 shop
    let shopRoom = roomCells.pop();
    shopRoom.dataset.roomType = 'shop';

    // other randomtypes
    let randomTypes = ['combat', 'combat', 'combat', 'combat', 'event', 'loot'];

    roomCells.forEach((cell) => {
        cell.dataset.roomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    });

    navigateToRoom(startX, startY);
    cutOutMap();
    generateDoors(dungeon);
}

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
    console.log('minX:', minX, 'maxX:', maxX, 'minY:', minY, 'maxY:', maxY);
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
function navigateToRoom(x, y) {
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
                console.log('menés ' + dir.name);
                let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
                data.dataset.visited = 'true';
                data.dataset.current = 'true';
                console.log(`a szoba típusa: ${data.dataset.roomType}`);

                data.querySelectorAll(
                    'img.doorUp, img.doorRight, img.doorDown, img.doorLeft'
                ).forEach((img) => img.remove());
                if (window.currentDungeon) {
                    generateDoors(window.currentDungeon);
                } else {
                    generateDoors();
                }
            } else {
                console.log('No room available');
            }
            console.log(`Current position: (${x}, ${y})`);
        });
    });
}

function generateDoors(dungeon) {
    const doorTextures = {
        Laboratory: '../textures/rooms/door_lab.png',
        Crypt: '../textures/rooms/door_crypt.png',
        Labyrinth: '../textures/rooms/door_labyrinth.png',
        'Gates of Hell': '../textures/rooms/door_hell.png'
    };
    const doorTexture = doorTextures[dungeon] || '../textures/rooms/door_hell.png';

    const currentPosition = document.querySelector('#map .cell[data-current="true"]');
    const x = parseInt(currentPosition.dataset.col);
    const y = parseInt(currentPosition.dataset.row);

    // Up
    if (checkCell(x, y - 1)) {
        console.log('door up');
        const doorUp = document.createElement('img');
        doorUp.src = doorTexture;
        doorUp.classList.add('doorUp');
        currentPosition.appendChild(doorUp);
    }
    // Right
    if (checkCell(x + 1, y)) {
        console.log('door right');
        const doorRight = document.createElement('img');
        doorRight.src = doorTexture;
        doorRight.classList.add('doorRight');
        currentPosition.appendChild(doorRight);
    }
    // Down
    if (checkCell(x, y + 1)) {
        console.log('door down');
        const doorDown = document.createElement('img');
        doorDown.src = doorTexture;
        doorDown.classList.add('doorDown');
        currentPosition.appendChild(doorDown);
    }
    // Left
    if (checkCell(x - 1, y)) {
        console.log('door left');
        const doorLeft = document.createElement('img');
        doorLeft.src = doorTexture;
        doorLeft.classList.add('doorLeft');
        currentPosition.appendChild(doorLeft);
    }
}
