//Ingame menu handling

function openInventory() {
    let body = document.getElementsByTagName('body')[0];

    const playerInventory = document.createElement('div');
    playerInventory.setAttribute('class', 'playerInventory');

    const inventoryOverlay = document.createElement('div');
    inventoryOverlay.setAttribute('class', 'inventoryOverlay');

    for (let i = 0; i < 2; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'inventoryRow');
        inventoryOverlay.appendChild(row);
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('class', 'inventoryCell');
            row.appendChild(cell);
        }
    }

    let closeButton = document.createElement('input');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('value', 'Close Inventory');
    closeButton.setAttribute('class', 'menuButton');
    closeButton.addEventListener('click', () => {
        inventoryOverlay.remove();
    });

    inventoryOverlay.appendChild(closeButton);
    body.appendChild(inventoryOverlay);
}

function openSettings() {
    let body = document.getElementsByTagName('body')[0];
    const settingsOverlay = document.createElement('div');
    settingsOverlay.setAttribute('class', 'settingsOverlay');

    const volumeLabel = Object.assign(document.createElement('label'), {
        htmlFor: 'settingsVolume',
        innerHTML: 'Music volume:',
        className: 'menuText'
    });

    const volumeSlider = Object.assign(document.createElement('input'), {
        type: 'range',
        id: 'settingsVolume',
        min: '0',
        max: '100',
        value: audio ? Math.round(audio.volume * 100).toString() : '10',
        className: 'volumeSlider'
    });

    volumeSlider.addEventListener('input', (e) => {
        if (audio) audio.volume = e.target.value / 100;
    });

    const closeButton = Object.assign(document.createElement('input'), {
        type: 'button',
        value: 'Close Settings',
        className: 'menuButton'
    });

    closeButton.addEventListener('click', () => {
        settingsOverlay.remove();
    });

    settingsOverlay.appendChild(volumeLabel);
    settingsOverlay.appendChild(volumeSlider);
    settingsOverlay.appendChild(closeButton);
    body.appendChild(settingsOverlay);
}

function abandonDungeon() {
    if (confirm('Are you sure you want to abandon the dungeon? Your progress will not be saved.')) {
        let abandoned = true;
        exitDungeon(abandoned);
    }
}
