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

                generateDoors(window.currentDungeon);
                roomEventHandler(data, dungeonLevel);
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
                    isInGame = false;
                    //exitDungeon();
                    Menu();
                });

                let continueButton = document.createElement('button');
                continueButton.id = 'continueButton';
                continueButton.className = 'menuButton';
                continueButton.textContent = 'Continue dungeon';
                document.body.appendChild(continueButton);
                continueButton.addEventListener('click', () => {
                    dungeonLevel++;
                    document.getElementById('level-number').textContent = dungeonLevel;
                    newLevel(window.currentDungeon, dungeonLevel, 100);
                });
            });
            break;
    }
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
    box.innerHTML = `
        <div id="level-number" class="level-number">${dungeonLevel}</div>
        <div class="level-text">Level</div>
    `;

    parent.appendChild(box);
}
function createTopRight(parent) {
    const box = document.createElement('div');
    box.className = 'ui-box top-right';
    // ide kell majd js meg csak egyenlore kiirtam valamit hogy lassuk hogy nez ki
    box.innerHTML = `
        <img src="../textures/UI/settings-UI.png" class="ui-icon" title="Inventory id='openInventory">
        <img src="../textures/UI/inventory-UI.png" class="ui-icon" title="Settings id='openSettings">
    `;
    /*
    document.getElementById('openInventory').addEventListener('click', function () {
        openInventory();
    });

    document.getElementById('openSettings').addEventListener('click', function () {
        openSettings();
    });*/

    parent.appendChild(box);
}

function openInventory() {
    //TODO
}

function openSettings() {
    //TODO
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
