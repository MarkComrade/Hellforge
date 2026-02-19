function newGame(dungeon) {
    sessionStorage.setItem('currentDungeon', dungeon);
    let body = document.getElementsByTagName('body');
    switch (dungeon) {
        case 'Laboratory':
            body[0].style.backgroundImage = "url('../textures/rooms/room_laboratory.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundAttachment = 'fixed';
            body[0].style.backgroundColor = '#000000';
            break;
        case 'Crypt':
            body[0].style.backgroundImage = "url('../textures/rooms/room_crypt.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundAttachment = 'fixed';
            body[0].style.backgroundColor = '#000000';
            break;
        case 'Labyrinth':
            body[0].style.backgroundImage = "url('../textures/rooms/room_labyrinth.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundAttachment = 'fixed';
            body[0].style.backgroundColor = '#000000';
            break;
        case 'Gates of Hell':
            body[0].style.backgroundImage = "url('../textures/rooms/room_hell.png')";
            body[0].style.backgroundSize = '98vw 95vh';
            body[0].style.backgroundRepeat = 'no-repeat';
            body[0].style.backgroundPosition = 'center';
            body[0].style.backgroundAttachment = 'fixed';
            body[0].style.backgroundColor = '#000000';
            break;
    }

    // Request dungeon generation from server instead of client-side
    postFetch('/api/dungeon/start', { dungeonName: dungeon })
        .then((data) => {
            if (!data.success) {
                console.log('Failed to start dungeon:', data.message);
                return;
            }
            sessionStorage.setItem('dungeonSessionToken', data.sessionToken);
            newLevelFromServer(dungeon, data, data.currentHP);
        })
        .catch((error) => {
            console.log('Dungeon start failed:', error.message);
        });
}

// Build the level UI from server-provided map data (replaces old newLevel)
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

    // 9x9 grid (same DOM structure as before)
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

    // Render map layout + player position from server data
    renderMap(serverData.map, serverData.bounds);
    renderPlayerPosition(serverData.position);

    const dungeonLevel = serverData.dungeonLevel;

    navigateToRoom(serverData.position.x, serverData.position.y, dungeonLevel);
    createUI(dungeonLevel);
    renderDoors(serverData.doors, dungeon);
    setHP(currentHP);
}
