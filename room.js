function newGame() {
    // Clear body
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    let container = document.createElement('div');
    container.setAttribute('class', 'container');
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
            cell.style.width = '50px';
            cell.style.height = '50px';
            cell.style.border = '1px solid green';
            div.appendChild(cell);
        }
        container.appendChild(div);
    }

    // start
    let startX = 5;
    let startY = 5;
    let start = document.querySelector(`#map .cell[data-row="${startX}"][data-col="${startY}"]`);
    start.dataset.room = true;
    start.style.backgroundColor = 'lightblue';
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

    // check if cell is a room
    function checkCell(x, y) {
        if (x > 0 && x < 10 && y > 0 && y < 10) {
            let cell = document.querySelector(`#map .cell[data-row="${x}"][data-col="${y}"]`);
            return cell && cell.dataset.room === 'true';
        }
        return false;
    }

    // set cell as room
    function setCell(x, y) {
        if (x > 0 && x < 10 && y > 0 && y < 10) {
            let cell = document.querySelector(`#map .cell[data-row="${x}"][data-col="${y}"]`);
            if (cell && cell.dataset.room === 'false' && Math.random() < 0.4) {
                cell.dataset.room = 'true';
                cell.style.backgroundColor = 'lightblue';
                return true;
            }
        }
        return false;
    }
}
