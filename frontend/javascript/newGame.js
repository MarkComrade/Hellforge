function newGame(dungeon) {
    let body = document.getElementsByTagName('body');
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
    dungeonLevel = 1;
    let currentHP = 100;
    newLevel(dungeon, 4 + dungeonLevel, currentHP);
}
function newLevel(dungeon, dungeonLevel, currentHP) {
    // Clear body
    let body = document.getElementsByTagName('body');
    body[0].style.height = '100vh';
    body[0].innerHTML = '';
    let mapContainer = document.createElement('div');
    mapContainer.setAttribute('id', 'mapContainer');
    mapContainer.setAttribute('class', 'mapContainer');
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
    let roomsToGenerate = Math.floor(Math.random() * 3 + 1) + dungeonLevel + 4;
    console.log('Rooms to generate:', roomsToGenerate);

    // active rooms list
    let activeRooms = [{ x: startX, y: startY }];

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
    createUI();
    generateDoors(dungeon);
    setHP(currentHP);
}
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
