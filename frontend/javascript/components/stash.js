function parseStashGold(value) {
    const amount = parseInt(value, 10);
    if (!Number.isFinite(amount) || amount < 0) {
        return 0;
    }
    return amount;
}

function mapStashGold(gold) {
    return {
        stashGold: Math.max(0, parseStashGold(gold.stash)),
        loadoutGold: Math.max(0, parseStashGold(gold.loadout))
    };
}

async function fetchStashGold(playerId) {
    try {
        const result = await getMethodFetch(`/api/inventory/gold/${playerId}`);
        if (result.success && result.gold) {
            return mapStashGold(result.gold);
        }
    } catch (error) {
        console.error('Failed to load gold balances:', error);
    }

    return {
        stashGold: 0,
        loadoutGold: 0
    };
}

async function createStashGoldPanel(playerId) {
    let goldState = await fetchStashGold(playerId);

    const panel = document.createElement('div');
    panel.setAttribute('class', 'goldTransferPanel');

    const currentGoldLabel = document.createElement('span');
    currentGoldLabel.setAttribute('class', 'stashCount goldTransferCurrentGold');
    panel.appendChild(currentGoldLabel);

    const controlsRow = document.createElement('div');
    controlsRow.setAttribute('class', 'goldTransferControls');

    const amountSlider = document.createElement('input');
    amountSlider.setAttribute('class', 'goldTransferAmountSlider');
    amountSlider.setAttribute('type', 'range');
    amountSlider.setAttribute('min', '0');
    amountSlider.value = '0';

    const transferAmountLabel = document.createElement('span');
    transferAmountLabel.setAttribute('class', 'stashCount goldTransferAmountLabel');

    const transferButton = document.createElement('button');
    transferButton.setAttribute('class', 'stashEquipBtn');
    transferButton.textContent = 'Move to Loadout';

    controlsRow.appendChild(amountSlider);
    controlsRow.appendChild(transferAmountLabel);
    controlsRow.appendChild(transferButton);
    panel.appendChild(controlsRow);

    const refreshGoldControls = () => {
        const availableGold = Math.max(0, goldState.stashGold);
        amountSlider.max = String(Math.max(1, availableGold));

        let transferAmount = parseStashGold(amountSlider.value);
        if (transferAmount > availableGold) {
            transferAmount = availableGold;
        }

        amountSlider.value = String(transferAmount);
        amountSlider.title =
            availableGold > 0
                ? `Transfer ${transferAmount} gold to loadout`
                : 'No stash gold available to transfer';
        transferAmountLabel.textContent = `${transferAmount} gold`;
        transferButton.disabled = availableGold === 0;

        currentGoldLabel.textContent = `Stash Gold: ${goldState.stashGold}`;
    };

    amountSlider.addEventListener('input', () => {
        amountSlider.title = `Transfer ${amountSlider.value} gold to loadout`;
        transferAmountLabel.textContent = `${amountSlider.value} gold`;
    });

    transferButton.addEventListener('click', async () => {
        const transferAmount = parseStashGold(amountSlider.value);
        if (transferAmount <= 0) {
            return;
        }
        if (transferAmount > goldState.stashGold) {
            alert('Not enough gold in stash.');
            refreshGoldControls();
            return;
        }

        transferButton.disabled = true;
        try {
            const result = await postFetch('/api/inventory/gold/transfer', {
                playerId: playerId,
                from: 'stash',
                amount: transferAmount
            });

            if (result.success && result.gold) {
                goldState = mapStashGold(result.gold);
            } else {
                alert(result.message || 'Failed to transfer gold.');
                goldState = await fetchStashGold(playerId);
            }
        } catch (error) {
            alert('Failed to transfer gold.');
            goldState = await fetchStashGold(playerId);
        } finally {
            amountSlider.value = '0';
            transferButton.disabled = false;
            refreshGoldControls();
        }
    });

    refreshGoldControls();
    return panel;
}

async function openStash() {
    const body = document.body;

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

    const goldTransferPanel = await createStashGoldPanel(playerId);
    stashOverlay.appendChild(goldTransferPanel);

    const grid = document.createElement('div');
    grid.setAttribute('class', 'stashGrid');
    stashOverlay.appendChild(grid);

    body.appendChild(stashOverlay);

    await renderStashContent(playerId, grid, countText);
}

async function renderStashContent(playerId, grid, countText) {
    const STASH_LIMIT = 50;
    grid.innerHTML = '';

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

    stashItems.forEach((item) => {
        const slotElement = document.createElement('div');
        slotElement.setAttribute('class', 'stashSlot filled');

        let imageSource = '';
        let itemName = '';
        let itemType = '';
        let equipmentSlot = null;

        if (item.armor_id) {
            imageSource = item.armor_img;
            itemName = item.armor_name;
            itemType = item.armor_type;
            equipmentSlot = item.armor_type === 'Helmet' ? 'helmet' : 'armor';
        } else if (item.weapon_id) {
            imageSource = item.weapon_img;
            itemName = item.weapon_name;
            itemType = item.weapon_type;
            equipmentSlot = item.weapon_type === 'Melee' ? 'melee' : 'ranged';
        } else if (item.misc_item_id) {
            imageSource = item.misc_img;
            itemName = item.misc_name;
            itemType = 'Misc';
        }

        const itemImage = document.createElement('img');
        itemImage.setAttribute('src', imageSource);
        itemImage.setAttribute('class', 'stashSlotImg');
        itemImage.setAttribute('alt', itemName);
        slotElement.appendChild(itemImage);

        const nameLabel = document.createElement('span');
        nameLabel.setAttribute('class', 'stashSlotName');
        nameLabel.textContent = itemName;
        slotElement.appendChild(nameLabel);

        slotElement.addEventListener('click', () => {
            const existingTooltip = grid.querySelector('.stashTooltip');
            if (existingTooltip) existingTooltip.remove();

            const tooltip = document.createElement('div');
            tooltip.setAttribute('class', 'stashTooltip');

            const tooltipName = document.createElement('span');
            tooltipName.setAttribute('class', 'tooltipName');
            tooltipName.textContent = itemName;
            tooltip.appendChild(tooltipName);

            const tooltipType = document.createElement('span');
            tooltipType.setAttribute('class', 'tooltipDetail');
            tooltipType.textContent = `Type: ${itemType}`;
            tooltip.appendChild(tooltipType);

            if (item.armor_id) {
                const tooltipStat = document.createElement('span');
                tooltipStat.setAttribute('class', 'tooltipDetail');
                tooltipStat.textContent = `Defense: x${item.defense_multiplier}`;
                tooltip.appendChild(tooltipStat);
            } else if (item.weapon_id) {
                const tooltipStat = document.createElement('span');
                tooltipStat.setAttribute('class', 'tooltipDetail');
                tooltipStat.textContent = `Attack: x${item.attack_multiplier}`;
                tooltip.appendChild(tooltipStat);
            } else if (item.misc_item_id) {
                const tooltipStat = document.createElement('span');
                tooltipStat.setAttribute('class', 'tooltipDetail');
                tooltipStat.textContent = `Value: ${item.misc_value} gold`;
                tooltip.appendChild(tooltipStat);
            }

            const buttonRow = document.createElement('div');
            buttonRow.setAttribute('class', 'stashTooltipBtnRow');

            if (equipmentSlot) {
                const equipButton = document.createElement('button');
                equipButton.setAttribute('class', 'stashEquipBtn');
                equipButton.textContent = `Equip (${equipmentSlot})`;
                equipButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    try {
                        const result = await postFetch('/api/inventory/stash/swap', {
                            playerId: playerId,
                            stashId: item.stashId,
                            slot: equipmentSlot
                        });
                        if (result.success) {
                            await renderStashContent(playerId, grid, countText);
                        } else {
                            alert(result.message || 'Failed to equip item.');
                        }
                    } catch (error) {
                        alert('Error equipping item.');
                    }
                });
                buttonRow.appendChild(equipButton);

                const moveToInventoryButton = document.createElement('button');
                moveToInventoryButton.setAttribute('class', 'stashEquipBtn');
                moveToInventoryButton.textContent = 'Move to loadout';
                moveToInventoryButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    try {
                        const result = await postFetch('/api/inventory/stash/moveToInventory', {
                            playerId: playerId,
                            stashId: item.stashId
                        });
                        if (result.success) {
                            await renderStashContent(playerId, grid, countText);
                        } else {
                            alert(result.message || 'Failed to move item to inventory.');
                        }
                    } catch (error) {
                        alert('Error moving item to inventory.');
                    }
                });
                buttonRow.appendChild(moveToInventoryButton);
            }

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'stashDeleteBtn');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async (event) => {
                event.stopPropagation();
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
                } catch (error) {
                    alert('Error deleting item.');
                }
            });
            buttonRow.appendChild(deleteButton);

            tooltip.appendChild(buttonRow);

            const closeTooltipHandler = (event) => {
                if (!tooltip.contains(event.target) && !slotElement.contains(event.target)) {
                    tooltip.remove();
                    document.removeEventListener('click', closeTooltipHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', closeTooltipHandler), 0);

            slotElement.appendChild(tooltip);
        });

        grid.appendChild(slotElement);
    });

    const emptyCount = STASH_LIMIT - stashItems.length;
    for (let i = 0; i < emptyCount; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.setAttribute('class', 'stashSlot empty');
        grid.appendChild(emptySlot);
    }

    const existingMsg = grid.parentElement.querySelector('.stashEmpty');
    if (existingMsg) existingMsg.remove();

    if (stashItems.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.setAttribute('class', 'stashEmpty');
        emptyMsg.textContent = 'Your stash is empty.';
        grid.parentElement.insertBefore(emptyMsg, grid.nextSibling);
    }
}
