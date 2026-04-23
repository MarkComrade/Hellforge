// Dungeon background textures — maps dungeon name to its room background image
const DUNGEON_BACKGROUNDS = {
    Laboratory: "url('../textures/rooms/room_laboratory.png')",
    Crypt: "url('../textures/rooms/room_crypt.png')",
    Labyrinth: "url('../textures/rooms/room_labyrinth.png')",
    'Gates of Hell': "url('../textures/rooms/room_hell.png')"
};

// Start a new dungeon run — sets the background and asks the server to generate the map.
function newGame(dungeon) {
    // Block guests — server would reject anyway, but we show a message and skip the bg change

    sessionStorage.setItem('currentDungeon', dungeon);

    // Apply dungeon-specific background
    const bg = DUNGEON_BACKGROUNDS[dungeon];
    if (bg) {
        Object.assign(document.body.style, {
            backgroundImage: bg,
            backgroundSize: '98vw 95vh',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundColor: '#000000'
        });
    }

    // Ask the server to generate the dungeon map — all game state lives server-side.
    // The server returns: map layout, player position, door info, bounds, and a session token.
    postFetch('/api/dungeon/start', { dungeonName: dungeon })
        .then((data) => {
            if (!data.success) {
                toast('Failed to start dungeon: ' + (data.message || 'Unknown error'), 'error');
                return;
            }
            sessionStorage.setItem('dungeonSessionToken', data.sessionToken);
            toast('Entering ' + dungeon + '...', 'info', 2000);
            newLevelFromServer(dungeon, data, data.currentHP);
        })
        .catch((error) => {
            toast('Dungeon start failed', 'error');
            console.error('Dungeon start failed:', error.message);
        });
}

// Build the level UI from server-provided data.
// Creates the 9×9 DOM grid, then hands off to rendering functions in roomGeneration.js
// which stamp the server's map/position/doors onto the grid cells.
function newLevelFromServer(dungeon, serverData, currentHP) {
    let body = document.getElementsByTagName('body');
    body[0].style.height = '100vh';
    clearBody();

    let mapContainer = document.createElement('div');
    mapContainer.setAttribute('id', 'mapContainer');
    mapContainer.setAttribute('class', 'mapContainer');
    body[0].appendChild(mapContainer);
    let container = document.createElement('div');
    container.setAttribute('id', 'map');
    mapContainer.appendChild(container);

    // Build a 9×9 grid of empty cells — renderMap() will mark which ones are actual rooms
    for (let i = 0; i < 9; i++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'row g-0');
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('class', 'cell');
            cell.dataset.row = i + 1;
            cell.dataset.col = j + 1;
            cell.dataset.room = 'false';
            cell.dataset.visited = 'false';

            div.appendChild(cell);
        }
        container.appendChild(div);
    }

    isInGame = true;

    // Apply server state to the DOM — these functions live in roomGeneration.js
    renderMap(serverData.map, serverData.bounds);
    renderPlayerPosition(serverData.position);

    const dungeonLevel = serverData.dungeonLevel;

    navigateToRoom(serverData.position.x, serverData.position.y, dungeonLevel);
    createUI(dungeonLevel);
    renderDoors(serverData.doors, dungeon);
    setHP(currentHP);
}

// Build the 4-corner UI overlay (level indicator, buttons, HP bar)
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

    const levelBox = document.createElement('div');
    levelBox.className = 'level-number';
    if (dungeonLevel > 19) {
        levelNumber = 'HELL';
        levelBox.style.fontSize = '2.5vh';
        levelBox.style.justifyContent = 'center';
    } else {
        const levelText = document.createElement('div');
        levelText.className = 'level-text';
        levelText.textContent = 'Level';
        box.appendChild(levelText);
    }

    levelBox.textContent = levelNumber;
    levelBox.setAttribute('id', 'level-number');

    box.appendChild(levelBox);

    parent.appendChild(box);
}
// Top-right corner: settings, inventory, abandon buttons
function createTopRight(parent) {
    const box = document.createElement('div');
    box.className = 'ui-box top-right';
    box.innerHTML = `
        <img src="../textures/UI/settings-UI.png" class="ui-icon" title="Settings" id="openSettings">
        <img src="../textures/UI/inventory-UI.png" class="ui-icon" title="Inventory" id="openInventory">
        <img src="../textures/UI/abandon.png" class="ui-icon" title="Abandon" id="abandonDungeon">
    `;

    parent.appendChild(box);

    // openInventory, openSettings, abandonDungeon are defined in gameOverlays.js
    document.getElementById('openInventory').addEventListener('click', openInventory);
    document.getElementById('openSettings').addEventListener('click', openSettings);
    document.getElementById('abandonDungeon').addEventListener('click', abandonDungeon);
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
// Update the HP bar width and colour based on current HP
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

// Show an overlay telling the guest they need to log in to play.
// Auto-dismisses after 3 seconds or on click.

/*
function showGuestError() {
    const overlay = document.createElement('div');
    overlay.style.cssText =
        'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:10000;flex-direction:column;gap:2vh;';

    const msg = document.createElement('p');
    msg.textContent = 'You must be logged in to play!';
    msg.style.cssText =
        'color:rgb(220,40,40);font-size:3vw;text-align:center;font-family:inherit;text-shadow:-0.15vw -0.15vw 0 #000,0.15vw -0.15vw 0 #000,-0.15vw 0.15vw 0 #000,0.15vw 0.15vw 0 #000;';

    overlay.appendChild(msg);
    document.body.appendChild(overlay);

    // Dismiss on click or after 3 seconds
    const dismiss = () => overlay.remove();
    overlay.addEventListener('click', dismiss);
    setTimeout(dismiss, 3000);
}
*/
