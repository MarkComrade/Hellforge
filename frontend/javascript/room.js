function newGame(dungeon) {
    // Clear body
    let body = document.getElementsByTagName('body');
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
}
function isAdjacent(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
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
                document.querySelector(
                    `#map .cell[data-row="${y}"][data-col="${x}"]`
                ).dataset.current = 'false';
                x = newX;
                y = newY;
                console.log('Went ' + dir.name);
                let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
                data.dataset.visited = 'true';
                data.dataset.current = 'true';
                console.log(`a szoba típusa: ${data.dataset.roomType}`);
            } else {
                console.log('No room available');
            }
            console.log(`Current position: (${x}, ${y})`);
        });
    });
}
