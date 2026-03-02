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

async function openStash() {
    const body = document.body;

    // Get current player session
    let playerId;
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (!session.isLoggedIn || !session.userId) {
            alert('You must be logged in to view your stash.');
            return;
        }
        playerId = session.userId;
    } catch (error) {
        alert('Could not retrieve session.');
        return;
    }

    clearBody();

    const stashOverlay = document.createElement('div');
    stashOverlay.setAttribute('class', 'stashOverlay');

    // Header
    const header = document.createElement('div');
    header.setAttribute('class', 'stashHeader');

    const title = document.createElement('span');
    title.setAttribute('class', 'stashTitle');
    title.textContent = 'Stash';
    header.appendChild(title);

    const countText = document.createElement('span');
    countText.setAttribute('class', 'stashCount');
    countText.textContent = 'Loading...';
    header.appendChild(countText);

    const closeButton = document.createElement('input');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('value', 'Close');
    closeButton.setAttribute('class', 'menuButton');
    closeButton.addEventListener('click', () => Home());
    header.appendChild(closeButton);

    stashOverlay.appendChild(header);

    // Grid container
    const grid = document.createElement('div');
    grid.setAttribute('class', 'stashGrid');
    stashOverlay.appendChild(grid);

    body.appendChild(stashOverlay);

    // Fetch and render
    await renderStashContent(playerId, grid, countText);
}

async function renderStashContent(playerId, grid, countText) {
    const STASH_LIMIT = 50;
    grid.innerHTML = '';

    // Fetch stash items
    let stashItems = [];
    try {
        const result = await getMethodFetch(`/api/inventory/stash/${playerId}`);
        if (result.success) {
            stashItems = result.stash;
        }
    } catch (error) {
        console.error('Failed to load stash:', error);
    }

    countText.textContent = `${stashItems.length} / ${STASH_LIMIT}`;

    // Render filled slots
    stashItems.forEach((item) => {
        const slot = document.createElement('div');
        slot.setAttribute('class', 'stashSlot filled');

        let imgSrc = '';
        let itemName = '';
        let itemType = '';
        let equipSlot = null;

        if (item.armor_id) {
            imgSrc = item.armor_img;
            itemName = item.armor_name;
            itemType = item.armor_type;
            // armor_type is 'Helmet' or 'Armor'
            equipSlot = item.armor_type === 'Helmet' ? 'helmet' : 'armor';
        } else if (item.weapon_id) {
            imgSrc = item.weapon_img;
            itemName = item.weapon_name;
            itemType = item.weapon_type;
            // weapon_type is 'Melee' or 'Ranged'
            equipSlot = item.weapon_type === 'Melee' ? 'melee' : 'ranged';
        } else if (item.misc_item_id) {
            imgSrc = item.misc_img;
            itemName = item.misc_name;
            itemType = 'Misc';
        }

        const img = document.createElement('img');
        img.setAttribute('src', imgSrc);
        img.setAttribute('class', 'stashSlotImg');
        img.setAttribute('alt', itemName);
        slot.appendChild(img);

        const name = document.createElement('span');
        name.setAttribute('class', 'stashSlotName');
        name.textContent = itemName;
        slot.appendChild(name);

        // Tooltip on click
        slot.addEventListener('click', () => {
            // Remove any existing tooltip
            const existingTooltip = grid.querySelector('.stashTooltip');
            if (existingTooltip) existingTooltip.remove();

            const tooltip = document.createElement('div');
            tooltip.setAttribute('class', 'stashTooltip');

            const tName = document.createElement('span');
            tName.setAttribute('class', 'tooltipName');
            tName.textContent = itemName;
            tooltip.appendChild(tName);

            const tType = document.createElement('span');
            tType.setAttribute('class', 'tooltipDetail');
            tType.textContent = `Type: ${itemType}`;
            tooltip.appendChild(tType);

            if (item.armor_id) {
                const tStat = document.createElement('span');
                tStat.setAttribute('class', 'tooltipDetail');
                tStat.textContent = `Defense: x${item.defense_multiplier}`;
                tooltip.appendChild(tStat);
            } else if (item.weapon_id) {
                const tStat = document.createElement('span');
                tStat.setAttribute('class', 'tooltipDetail');
                tStat.textContent = `Attack: x${item.attack_multiplier}`;
                tooltip.appendChild(tStat);
            } else if (item.misc_item_id) {
                const tStat = document.createElement('span');
                tStat.setAttribute('class', 'tooltipDetail');
                tStat.textContent = `Value: ${item.misc_value} gold`;
                tooltip.appendChild(tStat);
            }

            const btnRow = document.createElement('div');
            btnRow.setAttribute('class', 'stashTooltipBtnRow');

            // Equip button (only for armors/weapons)
            if (equipSlot) {
                const equipBtn = document.createElement('button');
                equipBtn.setAttribute('class', 'stashEquipBtn');
                equipBtn.textContent = `Equip (${equipSlot})`;
                equipBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        const result = await postFetch('/api/inventory/stash/swap', {
                            playerId: playerId,
                            stashId: item.stashId,
                            slot: equipSlot
                        });
                        if (result.success) {
                            await renderStashContent(playerId, grid, countText);
                        } else {
                            alert(result.message || 'Failed to equip item.');
                        }
                    } catch (err) {
                        alert('Error equipping item.');
                    }
                });
                btnRow.appendChild(equipBtn);
            }

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.setAttribute('class', 'stashDeleteBtn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!confirm(`Delete ${itemName}? This cannot be undone.`)) return;
                try {
                    const result = await deleteFetch('/api/inventory/stash/remove', {
                        stashId: item.stashId,
                        playerId: playerId
                    });
                    if (result.success) {
                        await renderStashContent(playerId, grid, countText);
                    } else {
                        alert(result.message || 'Failed to delete item.');
                    }
                } catch (err) {
                    alert('Error deleting item.');
                }
            });
            btnRow.appendChild(deleteBtn);

            tooltip.appendChild(btnRow);

            // Close tooltip when clicking outside
            const closeTooltipHandler = (e) => {
                if (!tooltip.contains(e.target) && !slot.contains(e.target)) {
                    tooltip.remove();
                    document.removeEventListener('click', closeTooltipHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeTooltipHandler), 0);

            slot.appendChild(tooltip);
        });

        grid.appendChild(slot);
    });

    // Render empty slots
    const emptyCount = STASH_LIMIT - stashItems.length;
    for (let i = 0; i < emptyCount; i++) {
        const slot = document.createElement('div');
        slot.setAttribute('class', 'stashSlot empty');
        grid.appendChild(slot);
    }

    // Empty message
    const existingMsg = grid.parentElement.querySelector('.stashEmpty');
    if (existingMsg) existingMsg.remove();

    if (stashItems.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.setAttribute('class', 'stashEmpty');
        emptyMsg.textContent = 'Your stash is empty.';
        grid.parentElement.insertBefore(emptyMsg, grid.nextSibling);
    }
}

function abandonDungeon() {
    if (confirm('Are you sure you want to abandon the dungeon? Your progress will not be saved.')) {
        let abandoned = true;
        exitDungeon(abandoned);
    }
}
