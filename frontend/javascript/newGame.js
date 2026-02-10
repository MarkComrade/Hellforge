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
    let dungeonLevel = 1;
    let currentHP = 100;
    newLevel(dungeon, dungeonLevel, currentHP);
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
        div.setAttribute('class', 'row g-0');
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
    //let roomsToGenerate = Math.floor(Math.random() * 3 + 1 + dungeonLevel / 2 + 4);
    roomsToGenerate = 20;
    roomsToGenerate = Math.min(roomsToGenerate, 20);

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

    navigateToRoom(startX, startY, dungeonLevel);
    cutOutMap();
    createUI(dungeonLevel);
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

function createUI(dungeonLevel) {
    const body = document.body;

    const ui = document.createElement('div');
    ui.id = 'ui';
    body.appendChild(ui);

    createTopLeft(ui, dungeonLevel);
    createTopRight(ui);
    createBottomLeft(ui);
    createBottomRight(ui);
}
function createTopLeft(parent, dungeonLevel) {
    const box = document.createElement('div');
    box.className = 'ui-box top-left';
    // ide kell majd js meg csak egyenlore kiirtam valamit hogy lassuk hogy nez ki
    let levelNumber = dungeonLevel;
    if (dungeonLevel > 19) {
        levelNumber = 'HELL';
    }
    box.innerHTML = `
        <div id="level-number" class="level-number">${levelNumber}</div>
        <div class="level-text">Level</div>
    `;

    parent.appendChild(box);
}
function createTopRight(parent) {
    const box = document.createElement('div');
    box.className = 'ui-box top-right';
    box.innerHTML = `
        <img src="../textures/UI/settings-UI.png" class="ui-icon" title="Inventory" id="openSettings">
        <img src="../textures/UI/inventory-UI.png" class="ui-icon" title="Settings" id="openInventory">
        <img src="../textures/UI/abandon.png" class="ui-icon" title="Abandon" id="abandonDungeon">
    `;

    parent.appendChild(box);

    document.getElementById('openInventory').addEventListener('click', () => {
        openInventory();
    });
    document.getElementById('openSettings').addEventListener('click', () => {
        openSettings();
    });

    document.getElementById('abandonDungeon').addEventListener('click', () => {
        abandonDungeon();
    });
}

function createBottomRight(parent) {
    const box = document.createElement('div');
    box.className = 'ui-box bottom-right';

    parent.appendChild(box);
}
function createBottomLeft(parent) {
    const box = document.createElement('div');
    box.setAttribute('class', 'ui-box bottom-left');
    box.setAttribute('id', 'hpBox');

    /* felső sor */
    const hpTop = document.createElement('div');
    hpTop.setAttribute('class', 'hp-top');

    const hpLabel = document.createElement('div');
    hpLabel.setAttribute('class', 'hp-label');
    hpLabel.textContent = 'HP';

    const hpText = document.createElement('div');
    hpText.setAttribute('class', 'hp-text');

    const hpValue = document.createElement('span');
    hpValue.setAttribute('id', 'hpValue');
    hpValue.textContent = '100';

    const hpMaxText = document.createTextNode(' / 100');

    hpText.appendChild(hpValue);
    hpText.appendChild(hpMaxText);

    hpTop.appendChild(hpLabel);
    hpTop.appendChild(hpText);

    /* HP bar */
    const hpBar = document.createElement('div');
    hpBar.setAttribute('class', 'hp-bar');

    const hpFill = document.createElement('div');
    hpFill.setAttribute('class', 'hp-fill');
    hpFill.setAttribute('id', 'hpFill');

    hpBar.appendChild(hpFill);

    /* összerakás */
    box.appendChild(hpTop);
    box.appendChild(hpBar);

    parent.appendChild(box);
}
function setHP(currentHP) {
    const maxHP = 100;

    const hpFill = document.getElementById('hpFill');
    const hpValue = document.getElementById('hpValue');
    // Százalékos HP számítás nem lehet kisebb 0-nál és nagyobb mint a maxHP
    const percent = Math.max(0, Math.min(currentHP, maxHP));

    hpFill.style.width = percent + '%';
    hpValue.textContent = percent;

    // Színváltás alacsony HP-nál
    if (percent <= 30) {
        hpFill.style.background = 'linear-gradient(to right, #ff3333, #ff7777)';
    } else if (percent <= 50) {
        hpFill.style.background = 'linear-gradient(to right, #ffaa00, #ffdd55)';
    } else {
        hpFill.style.background = 'linear-gradient(to right, #00ff66, #55ff99)';
    }
}
