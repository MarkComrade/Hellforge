function parseLoadoutGold(value) {
    const amount = parseInt(value, 10);
    if (!Number.isFinite(amount) || amount < 0) {
        return 0;
    }
    return amount;
}

function mapLoadoutGold(gold) {
    return {
        stashGold: Math.max(0, parseLoadoutGold(gold.stash)),
        loadoutGold: Math.max(0, parseLoadoutGold(gold.loadout))
    };
}

async function fetchLoadoutGold(playerId) {
    try {
        const result = await getMethodFetch(`/api/inventory/gold/${playerId}`);
        if (result.success && result.gold) {
            return mapLoadoutGold(result.gold);
        }
    } catch (error) {
        console.error('Failed to load gold balances:', error);
    }

    return {
        stashGold: 0,
        loadoutGold: 0
    };
}

async function createLoadoutGoldPanel(playerId) {
    let goldState = await fetchLoadoutGold(playerId);

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
    transferButton.textContent = 'Move to Stash';

    controlsRow.appendChild(amountSlider);
    controlsRow.appendChild(transferAmountLabel);
    controlsRow.appendChild(transferButton);
    panel.appendChild(controlsRow);

    const refreshGoldControls = () => {
        const availableGold = Math.max(0, goldState.loadoutGold);
        const blockedInGame = typeof isInGame !== 'undefined' && isInGame;
        amountSlider.max = String(Math.max(1, availableGold));

        controlsRow.style.display = blockedInGame ? 'none' : 'flex';

        let transferAmount = parseLoadoutGold(amountSlider.value);
        if (transferAmount > availableGold) {
            transferAmount = availableGold;
        }

        amountSlider.value = String(transferAmount);
        amountSlider.title =
            availableGold > 0
                ? `Transfer ${transferAmount} gold to stash`
                : 'No loadout gold available to transfer';
        transferAmountLabel.textContent = `${transferAmount} gold`;
        transferButton.disabled = availableGold === 0 || blockedInGame;

        currentGoldLabel.textContent = `Loadout Gold: ${goldState.loadoutGold}`;
    };

    amountSlider.addEventListener('input', () => {
        amountSlider.title = `Transfer ${amountSlider.value} gold to stash`;
        transferAmountLabel.textContent = `${amountSlider.value} gold`;
    });

    transferButton.addEventListener('click', async () => {
        if (typeof isInGame !== 'undefined' && isInGame) {
            alert('You cannot move gold to stash while in game.');
            refreshGoldControls();
            return;
        }

        const transferAmount = parseLoadoutGold(amountSlider.value);
        if (transferAmount <= 0) {
            return;
        }
        if (transferAmount > goldState.loadoutGold) {
            alert('Not enough gold in loadout.');
            refreshGoldControls();
            return;
        }

        transferButton.disabled = true;
        try {
            const result = await postFetch('/api/inventory/gold/transfer', {
                playerId: playerId,
                from: 'loadout',
                amount: transferAmount
            });

            if (result.success && result.gold) {
                goldState = mapLoadoutGold(result.gold);
            } else {
                alert(result.message || 'Failed to transfer gold.');
                goldState = await fetchLoadoutGold(playerId);
            }
        } catch (error) {
            alert('Failed to transfer gold.');
            goldState = await fetchLoadoutGold(playerId);
        } finally {
            amountSlider.value = '0';
            transferButton.disabled = false;
            refreshGoldControls();
        }
    });

    refreshGoldControls();
    return panel;
}

async function openInventory() {
    const shopOverlay = document.getElementById('shop-overlay');
    if (shopOverlay) {
        alert('Close the shop before opening your inventory.');
        return;
    }

    if (typeof isEventChoicePending === 'function' && isEventChoicePending()) {
        alert('Dismiss the current event before opening your inventory.');
        return;
    }

    const body = document.body;

    let playerId;
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (!session.isLoggedIn || !session.userId) {
            alert('You must be logged in to view your inventory.');
            return;
        }
        playerId = session.userId;
    } catch (error) {
        alert('Could not retrieve session.');
        return;
    }

    const inventoryOverlay = document.createElement('div');
    inventoryOverlay.setAttribute('class', 'inventoryOverlay');

    const header = document.createElement('div');
    header.setAttribute('class', 'stashHeader');

    const title = document.createElement('span');
    title.setAttribute('class', 'stashTitle');
    title.textContent = 'Inventory';
    header.appendChild(title);

    const closeButton = document.createElement('input');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('value', 'Close Inventory');
    closeButton.setAttribute('class', 'menuButton');
    closeButton.addEventListener('click', () => {
        inventoryOverlay.remove();
        if (!isInGame && document.querySelector('.homeMenu')) {
            Home();
        }
    });
    header.appendChild(closeButton);

    inventoryOverlay.appendChild(header);

    const goldTransferPanel = await createLoadoutGoldPanel(playerId);
    inventoryOverlay.appendChild(goldTransferPanel);

    const equippedTitle = document.createElement('span');
    equippedTitle.setAttribute('class', 'stashTitle inventorySectionTitle');
    equippedTitle.textContent = 'Equipped';
    inventoryOverlay.appendChild(equippedTitle);

    const equippedGrid = document.createElement('div');
    equippedGrid.setAttribute('class', 'stashGrid');
    inventoryOverlay.appendChild(equippedGrid);

    const loadoutTitle = document.createElement('span');
    loadoutTitle.setAttribute('class', 'stashTitle inventorySectionTitle loadoutSectionTitle');
    loadoutTitle.textContent = 'Carried Items';
    inventoryOverlay.appendChild(loadoutTitle);

    const loadoutCount = document.createElement('span');
    loadoutCount.setAttribute('class', 'stashCount');
    loadoutCount.textContent = '';
    inventoryOverlay.appendChild(loadoutCount);

    const loadoutGrid = document.createElement('div');
    loadoutGrid.setAttribute('class', 'stashGrid');
    inventoryOverlay.appendChild(loadoutGrid);

    body.appendChild(inventoryOverlay);

    await renderInventoryContent(playerId, equippedGrid, loadoutGrid, loadoutCount);
}

async function renderInventoryContent(playerId, equippedGrid, loadoutGrid, loadoutCount) {
    equippedGrid.innerHTML = '';
    loadoutGrid.innerHTML = '';

    let inventory = null;
    try {
        const result = await getMethodFetch(`/api/inventory/equipment/${playerId}`);
        if (result.success) {
            inventory = result.inventory;
        }
    } catch (error) {
        console.error('Failed to load inventory:', error);
        if (!inventory) return;
    }

    const slots = [
        {
            label: 'Helmet',
            name: inventory.helmet_name,
            img: inventory.helmet_img,
            stat: `Defense: x${inventory.helmet_defense}`,
            tier: inventory.helmet_tier,
            cards: inventory.helmet_cards || []
        },
        {
            label: 'Armor',
            name: inventory.armor_name,
            img: inventory.armor_img,
            stat: `Defense: x${inventory.armor_defense}`,
            tier: inventory.armor_tier,
            cards: inventory.armor_cards || []
        },
        {
            label: 'Melee',
            name: inventory.melee_name,
            img: inventory.melee_img,
            stat: `Attack: x${inventory.melee_attack}`,
            tier: inventory.melee_tier,
            cards: inventory.melee_cards || []
        },
        {
            label: 'Ranged',
            name: inventory.ranged_name,
            img: inventory.ranged_img,
            stat: `Attack: x${inventory.ranged_attack}`,
            tier: inventory.ranged_tier,
            cards: inventory.ranged_cards || []
        }
    ];

    slots.forEach((item) => {
        const slotElement = document.createElement('div');
        slotElement.setAttribute('class', 'stashSlot filled');

        const itemImage = document.createElement('img');
        itemImage.setAttribute('src', item.img);
        itemImage.setAttribute('class', 'stashSlotImg');
        itemImage.setAttribute('alt', item.name);
        slotElement.appendChild(itemImage);

        const nameLabel = document.createElement('span');
        nameLabel.setAttribute('class', 'stashSlotName');
        nameLabel.textContent = item.name;
        slotElement.appendChild(nameLabel);

        slotElement.addEventListener('click', () => {
            const existingTooltip = equippedGrid.querySelector('.stashTooltip');
            if (existingTooltip) existingTooltip.remove();

            const tooltip = document.createElement('div');
            tooltip.setAttribute('class', 'stashTooltip');

            const tooltipName = document.createElement('span');
            tooltipName.setAttribute('class', 'tooltipName');
            tooltipName.textContent = item.name;
            tooltip.appendChild(tooltipName);

            const tooltipType = document.createElement('span');
            tooltipType.setAttribute('class', 'tooltipDetail');
            tooltipType.textContent = `Slot: ${item.label}`;
            tooltip.appendChild(tooltipType);

            const tooltipStat = document.createElement('span');
            tooltipStat.setAttribute('class', 'tooltipDetail');
            tooltipStat.textContent = item.stat;
            tooltip.appendChild(tooltipStat);

            const tooltipTier = document.createElement('span');
            tooltipTier.setAttribute('class', 'tooltipDetail');
            tooltipTier.textContent = `Tier: ${item.tier}`;
            tooltip.appendChild(tooltipTier);

            const buttonRow = document.createElement('div');
            buttonRow.setAttribute('class', 'stashTooltipBtnRow');

            const cardsButton = document.createElement('button');
            cardsButton.setAttribute('class', 'stashEquipBtn');
            cardsButton.textContent = 'Cards';
            cardsButton.addEventListener('click', (event) => {
                event.stopPropagation();
                showItemCardsPopup(item.name, item.cards || []);
            });
            buttonRow.appendChild(cardsButton);

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

        equippedGrid.appendChild(slotElement);
    });

    const LOADOUT_LIMIT = 10;
    let loadoutItems = [];
    try {
        const result = await getMethodFetch(`/api/inventory/loadout/${playerId}`);
        if (result.success) {
            loadoutItems = result.loadout;
        }
    } catch (error) {
        console.error('Failed to load loadout:', error);
    }

    loadoutCount.textContent = `${loadoutItems.length} / ${LOADOUT_LIMIT}`;

    loadoutItems.forEach((item) => {
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
            const existingTooltip = loadoutGrid.querySelector('.stashTooltip');
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
                        const result = await postFetch('/api/inventory/loadout/swap', {
                            playerId: playerId,
                            loadoutId: item.loadoutId,
                            slot: equipmentSlot
                        });
                        if (result.success) {
                            await renderInventoryContent(
                                playerId,
                                equippedGrid,
                                loadoutGrid,
                                loadoutCount
                            );
                        } else {
                            alert(result.message || 'Failed to equip item.');
                        }
                    } catch (error) {
                        alert('Error equipping item.');
                    }
                });
                buttonRow.appendChild(equipButton);
            }

            if (!item.misc_item_id) {
                const cardsButton = document.createElement('button');
                cardsButton.setAttribute('class', 'stashEquipBtn');
                cardsButton.textContent = 'Cards';
                cardsButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    showItemCardsPopup(itemName, item.cards || []);
                });
                buttonRow.appendChild(cardsButton);
            }

            if (!isInGame) {
                const moveToStashButton = document.createElement('button');
                moveToStashButton.setAttribute('class', 'stashDeleteBtn');
                moveToStashButton.textContent = 'Move to Stash';
                moveToStashButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    try {
                        const result = await postFetch('/api/inventory/loadout/moveToStash', {
                            playerId: playerId,
                            loadoutId: item.loadoutId
                        });
                        if (result.success) {
                            await renderInventoryContent(
                                playerId,
                                equippedGrid,
                                loadoutGrid,
                                loadoutCount
                            );
                        } else {
                            alert(result.message || 'Failed to move item to stash.');
                        }
                    } catch (error) {
                        alert('Error moving item to stash.');
                    }
                });
                buttonRow.appendChild(moveToStashButton);
            }

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'stashDeleteBtn');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async (event) => {
                event.stopPropagation();
                if (!confirm(`Delete ${itemName}? This cannot be undone.`)) return;
                try {
                    const result = await deleteFetch('/api/inventory/loadout/remove', {
                        playerId: playerId,
                        loadoutId: item.loadoutId
                    });
                    if (result.success) {
                        await renderInventoryContent(
                            playerId,
                            equippedGrid,
                            loadoutGrid,
                            loadoutCount
                        );
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

        loadoutGrid.appendChild(slotElement);
    });

    const emptyCount = LOADOUT_LIMIT - loadoutItems.length;
    for (let i = 0; i < emptyCount; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.setAttribute('class', 'stashSlot empty');
        loadoutGrid.appendChild(emptySlot);
    }
}
