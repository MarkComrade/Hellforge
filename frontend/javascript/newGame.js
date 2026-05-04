
const DUNGEON_BACKGROUNDS = {
    Laboratory: "url('../textures/rooms/room_laboratory.png')",
    Crypt: "url('../textures/rooms/room_crypt.png')",
    Labyrinth: "url('../textures/rooms/room_labyrinth.png')",
    'Gates of Hell': "url('../textures/rooms/room_hell.png')"
};


function newGame(dungeon) {
    

    sessionStorage.setItem('currentDungeon', dungeon);

    postFetch('/api/dungeon/start', { dungeonName: dungeon })
        .then((data) => {
            if (!data.success) {
                toast('Failed to start dungeon: ' + (data.message || 'Unknown error'), 'error');
                return;
            }
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

            sessionStorage.setItem('dungeonSessionToken', data.sessionToken);
            toast('Entering ' + dungeon + '...', 'info', 2000);
            newLevelFromServer(dungeon, data, data.currentHP);
        })
        .catch((error) => {
            toast(error.message || 'Failed to enter dungeon.', 'error');
            console.error('Dungeon start failed:', error.message);
        });
}




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

    
    renderMap(serverData.map, serverData.bounds);
    renderPlayerPosition(serverData.position);

    const dungeonLevel = serverData.dungeonLevel;

    navigateToRoom(serverData.position.x, serverData.position.y, dungeonLevel);
    createUI(dungeonLevel);
    renderDoors(serverData.doors, dungeon);
    setHP(currentHP);
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

function createTopRight(parent) {
    const box = document.createElement('div');
    box.className = 'ui-box top-right';
    box.innerHTML = `
        <img src="../textures/UI/settings-UI.png" class="ui-icon" title="Settings" id="openSettings">
        <img src="../textures/UI/inventory-UI.png" class="ui-icon" title="Inventory" id="openInventory">
        <img src="../textures/UI/abandon.png" class="ui-icon" title="Abandon" id="abandonDungeon">
    `;

    parent.appendChild(box);

    
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

    
    const hpBar = document.createElement('div');
    hpBar.setAttribute('class', 'hp-bar');

    const hpFill = document.createElement('div');
    hpFill.setAttribute('class', 'hp-fill');
    hpFill.setAttribute('id', 'hpFill');

    hpBar.appendChild(hpFill);

    
    box.appendChild(hpTop);
    box.appendChild(hpBar);

    parent.appendChild(box);
}

function setHP(currentHP) {
    const maxHP = 100;

    const hpFill = document.getElementById('hpFill');
    const hpValue = document.getElementById('hpValue');
    
    const percent = Math.round(Math.max(0, Math.min(currentHP, maxHP)));

    hpFill.style.width = percent + '%';
    hpValue.textContent = percent;

    
    if (percent <= 30) {
        hpFill.style.background = 'linear-gradient(to right, #ff3333, #ff7777)';
    } else if (percent <= 50) {
        hpFill.style.background = 'linear-gradient(to right, #ffaa00, #ffdd55)';
    } else {
        hpFill.style.background = 'linear-gradient(to right, #00ff66, #55ff99)';
    }
}



