function newGame(dungeon) {
    // Clear body
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    let container = document.createElement('div');
    container.setAttribute('class', 'container-fluid');
    container.setAttribute('id', 'map');
    body[0].appendChild(container);

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
            cell.style.width = '25px';
            cell.style.height = '25px';
            cell.style.border = '1px solid green';
            div.appendChild(cell);
        }
        container.appendChild(div);
    }

    // start
    let startX = 5;
    let startY = 5;
    let start = document.querySelector(`#map .cell[data-row="${startY}"][data-col="${startX}"]`);
    start.dataset.room = true;
    start.dataset.visited = true;

    //generate room lenght
    let roomsToGenerate = Math.floor(Math.random() * 3 + 1) + 5;
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

    navigateToRoom(startX, startY);
}

function checkCell(x, y) {
    if (x > 0 && x < 10 && y > 0 && y < 10) {
        let cell = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
        return cell && cell.dataset.room === 'true';
    }
    return false;
}

function navigateToRoom(x, y) {
    let body = document.getElementsByTagName('body')[0];

    let navigateUp = document.createElement('span');
    navigateUp.setAttribute('id', 'navigateUp');
    body.appendChild(navigateUp);

    navigateUp.addEventListener('click', function () {
        if (checkCell(x, y - 1) === true) {
            console.log('Went Up');

            y -= 1;
            let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
            data.dataset.visited = 'true';
        } else {
            console.log('No room available');
        }

        console.log(`Current position: (${x}, ${y})`);
    });

    let navigateRight = document.createElement('span');
    navigateRight.setAttribute('id', 'navigateRight');
    body.appendChild(navigateRight);
    navigateRight.addEventListener('click', function () {
        if (checkCell(x + 1, y) === true) {
            console.log('Went right');
            x += 1;
            let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
            data.dataset.visited = 'true';
        } else {
            console.log('No room available');
        }

        console.log(`Current position: (${x}, ${y})`);
    });

    let navigateDown = document.createElement('span');
    navigateDown.setAttribute('id', 'navigateDown');
    body.appendChild(navigateDown);
    navigateDown.addEventListener('click', function () {
        if (checkCell(x, y + 1) === true) {
            console.log('Went down');
            y += 1;
            let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
            data.dataset.visited = 'true';
        } else {
            console.log('No room available');
        }

        console.log(`Current position: (${x}, ${y})`);
    });

    let navigateLeft = document.createElement('span');
    navigateLeft.setAttribute('id', 'navigateLeft');
    body.appendChild(navigateLeft);
    navigateLeft.addEventListener('click', function () {
        if (checkCell(x - 1, y) === true) {
            console.log('Went left');
            x -= 1;
            let data = document.querySelector(`#map .cell[data-row="${y}"][data-col="${x}"]`);
            data.dataset.visited = 'true';
        } else {
            console.log('No room available');
        }

        console.log(`Current position: (${x}, ${y})`);
    });
}
