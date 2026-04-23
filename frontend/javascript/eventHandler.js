const DEFAULT_GOLD_IMG = '../textures/items/coing.png';
const DEFAULT_LOOT_IMG = '../textures/misc/placeholderloot.png';
const LOOT_POPUP_ID = 'loot-popup';
const EVENT_DIALOGUE_POPUP_ID = 'event-dialogue-popup';
const TRADE_EVENT_OVERLAY_ID = 'event-trade-overlay';
const EVENT_TEXT_MAX_LENGTH = 280;

const eventUiState = {
    isChoicePending: false
};

function sanitizeEventText(value, fallbackText) {
    const source = typeof value === 'string' ? value : fallbackText;
    return source.replace(/\s+/g, ' ').trim().slice(0, EVENT_TEXT_MAX_LENGTH);
}

function removeEventPopupById(elementId) {
    const existing = document.getElementById(elementId);
    if (existing) {
        if (
            elementId === EVENT_DIALOGUE_POPUP_ID ||
            elementId === LOOT_POPUP_ID ||
            elementId === TRADE_EVENT_OVERLAY_ID
        ) {
            setEventChoicePending(false);
        }
        existing.remove();
    }
}

function setEventChoicePending(isPending) {
    eventUiState.isChoicePending = Boolean(isPending);
}

function closeEventPopup(popup) {
    setEventChoicePending(false);
    popup.remove();

    if (typeof window.syncLootPickupButton === 'function') {
        const currentRoom = document.querySelector('#map .cell[data-current="true"]');
        window.syncLootPickupButton(currentRoom);
    }
}

function closeTradeEventOverlay() {
    removeEventPopupById(TRADE_EVENT_OVERLAY_ID);
}

function eventLootPopup(lootEvent) {
    if (!lootEvent || lootEvent.success === false) return;

    removeEventPopupById(LOOT_POPUP_ID);
    setEventChoicePending(true);

    if (typeof window.syncLootPickupButton === 'function') {
        const currentRoom = document.querySelector('#map .cell[data-current="true"]');
        window.syncLootPickupButton(currentRoom);
    }

    const popup = document.createElement('div');
    popup.id = LOOT_POPUP_ID;
    popup.className = 'lootPopup';

    const title = document.createElement('h3');
    title.className = 'lootPopupTitle';
    title.textContent = lootEvent.inventoryFull ? 'Inventory Full' : 'Loot Gained';
    popup.appendChild(title);

    const content = document.createElement('div');
    content.className = 'lootPopupContent';

    const flavorText = sanitizeEventText(lootEvent.description || lootEvent.message, '');
    if (flavorText) {
        const flavor = document.createElement('p');
        flavor.className = 'lootPopupFlavor';
        flavor.textContent = flavorText;
        content.appendChild(flavor);
    }

    if (lootEvent.item) {
        const itemRow = document.createElement('div');
        itemRow.className = 'lootPopupRow';

        const itemImg = document.createElement('img');
        itemImg.className = 'lootPopupImg';
        itemImg.src = lootEvent.item.img_path || lootEvent.item.img || DEFAULT_LOOT_IMG;
        itemImg.alt = lootEvent.item.name || 'Item';
        itemImg.onerror = () => {
            itemImg.onerror = null;
            itemImg.src = DEFAULT_LOOT_IMG;
        };

        const itemText = document.createElement('span');
        itemText.className = 'lootPopupText';
        itemText.textContent = lootEvent.item.name || 'Unknown item';

        itemRow.appendChild(itemImg);
        itemRow.appendChild(itemText);
        content.appendChild(itemRow);
    }

    const goldAmount = Number(lootEvent.gold || 0);
    if (goldAmount > 0) {
        const goldRow = document.createElement('div');
        goldRow.className = 'lootPopupRow';

        const goldImg = document.createElement('img');
        goldImg.className = 'lootPopupImg';
        goldImg.src = lootEvent.goldImgPath || DEFAULT_GOLD_IMG;
        goldImg.alt = 'Gold';
        goldImg.onerror = () => {
            goldImg.onerror = null;
            goldImg.src = DEFAULT_GOLD_IMG;
        };

        const goldText = document.createElement('span');
        goldText.className = 'lootPopupText';
        goldText.textContent = `+${goldAmount} gold`;

        goldRow.appendChild(goldImg);
        goldRow.appendChild(goldText);
        content.appendChild(goldRow);
    }

    const footer = document.createElement('div');
    footer.className = 'eventDialogueFooter';

    if (lootEvent.storedInRoom) {
        const pickupBtn = document.createElement('button');
        pickupBtn.type = 'button';
        pickupBtn.className = 'eventDialogueButton primary';
        pickupBtn.textContent = 'Pick Up Item';
        pickupBtn.addEventListener('click', async () => {
            pickupBtn.disabled = true;
            try {
                const sessionToken = sessionStorage.getItem('dungeonSessionToken');
                const result = await postFetch('/api/dungeon/pickup-room-loot', { sessionToken });
                if (result && result.success && !result.inventoryFull) {
                    const currentRoom = document.querySelector('#map .cell[data-current="true"]');
                    if (currentRoom) {
                        currentRoom.dataset.hasStoredLoot = result.storedInRoom ? 'true' : 'false';
                    }
                    closeEventPopup(popup);
                } else {
                    pickupBtn.disabled = false;
                    const currentRoom = document.querySelector('#map .cell[data-current="true"]');
                    if (currentRoom) {
                        currentRoom.dataset.hasStoredLoot = result?.storedInRoom ? 'true' : 'false';
                    }
                    const msg = popup.querySelector('.lootPickupStatus');
                    if (msg) msg.textContent = 'Still full — free a slot first.';
                }
            } catch {
                pickupBtn.disabled = false;
            }
        });

        const statusMsg = document.createElement('p');
        statusMsg.className = 'lootPickupStatus lootPopupFlavor';
        statusMsg.textContent = 'Free a slot in your loadout to pick this up.';
        content.appendChild(statusMsg);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'eventDialogueButton';
        closeBtn.textContent = 'Leave For Now';
        closeBtn.addEventListener('click', () => closeEventPopup(popup));

        footer.appendChild(pickupBtn);
        footer.appendChild(closeBtn);
    } else {
        const continueBtn = document.createElement('button');
        continueBtn.type = 'button';
        continueBtn.className = 'eventDialogueButton primary';
        continueBtn.textContent = 'Continue';
        continueBtn.addEventListener('click', () => closeEventPopup(popup));
        footer.appendChild(continueBtn);
    }

    popup.appendChild(content);
    popup.appendChild(footer);
    document.body.appendChild(popup);
}

function createDialoguePopup(eventPayload) {
    removeEventPopupById(EVENT_DIALOGUE_POPUP_ID);
    setEventChoicePending(true);

    const popup = document.createElement('div');
    popup.id = EVENT_DIALOGUE_POPUP_ID;
    popup.className = 'eventDialoguePopup';

    const header = document.createElement('div');
    header.className = 'eventDialogueHeader';

    const title = document.createElement('h3');
    title.className = 'eventDialogueTitle';
    title.textContent = sanitizeEventText(eventPayload.title, 'Dungeon Event');

    const badge = document.createElement('span');
    badge.className = 'eventDialogueBadge';
    badge.textContent = sanitizeEventText(eventPayload.type || 'event', 'event').toUpperCase();

    header.appendChild(title);
    header.appendChild(badge);

    const body = document.createElement('p');
    body.className = 'eventDialogueBody';
    body.textContent = sanitizeEventText(
        eventPayload.description,
        eventPayload.message || 'The air around you turns heavy for a brief moment.'
    );

    const footer = document.createElement('div');
    footer.className = 'eventDialogueFooter';

    const choices = Array.isArray(eventPayload.choices) ? eventPayload.choices : [];
    if (choices.length > 0) {
        choices.slice(0, 2).forEach((choiceText, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = index === 0 ? 'eventDialogueButton primary' : 'eventDialogueButton';
            button.textContent = sanitizeEventText(choiceText, 'Continue');
            button.addEventListener('click', () => {
                closeEventPopup(popup);
            });
            footer.appendChild(button);
        });
    } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'eventDialogueButton primary';
        button.textContent = 'Continue';
        button.addEventListener('click', () => {
            closeEventPopup(popup);
        });
        footer.appendChild(button);
    }

    popup.appendChild(header);
    popup.appendChild(body);
    popup.appendChild(footer);
    document.body.appendChild(popup);
}

function createFrontendEvent(eventPayload) {
    if (!eventPayload || eventPayload.success === false) {
        return;
    }

    if (eventPayload.type === 'loot') {
        const lootPayload = eventPayload.loot || eventPayload;
        if (!lootPayload || lootPayload.success === false) {
            return;
        }
        eventLootPopup(lootPayload);
        return;
    }

    if (eventPayload.type === 'trade') {
        createTradeEventOverlay(eventPayload);
        return;
    }

    createDialoguePopup(eventPayload);
}

async function outRoom(room, dungeon, dungeonLevel) {
    const trapdoorTextures = {
        Laboratory: '../textures/rooms/trapdoor_laboratory.png',
        Crypt: '../textures/rooms/trapdoor_crypt.png',
        Labyrinth: '../textures/rooms/trapdoor_labyrinth.png',
        'Gates of Hell': '../textures/rooms/trapdoor_hell.png'
    };

    let trapdoor = document.createElement('img');
    trapdoor.src = trapdoorTextures[dungeon];
    trapdoor.id = 'trapDoor';
    room.appendChild(trapdoor);

    trapdoor.addEventListener('click', () => {
        let exitButton = document.createElement('button');
        exitButton.id = 'exitButton';
        exitButton.className = 'menuButton';
        exitButton.textContent = 'Exit the dungeon';
        document.body.appendChild(exitButton);
        exitButton.addEventListener('click', async () => {
            try {
                await postFetch('/api/dungeon/exit', {
                    sessionToken: sessionStorage.getItem('dungeonSessionToken')
                });
                exitDungeon();
            } catch (error) {
                toast('Failed to exit dungeon', 'error');
                console.error('Exit failed:', error.message);
            }
        });

        let continueButton = document.createElement('button');
        continueButton.id = 'continueButton';
        continueButton.className = 'menuButton';
        continueButton.textContent = 'Continue dungeon';
        document.body.appendChild(continueButton);
        continueButton.addEventListener('click', async () => {
            try {
                const result = await postFetch('/api/dungeon/next-level', {
                    sessionToken: sessionStorage.getItem('dungeonSessionToken')
                });
                if (result.success) {
                    dungeonLevel = result.dungeonLevel;
                    document.getElementById('level-number').textContent = dungeonLevel;
                    toast(`Descending deeper... Level ${dungeonLevel}`, 'info', 2500);
                    newLevelFromServer(sessionStorage.getItem('currentDungeon'), result, 100);
                }
            } catch (error) {
                toast('Failed to advance to next level', 'error');
                console.error('Next level failed:', error.message);
            }
        });
    });
}

async function fetchShopItems() {
    const shopItemCount = 5;
    try {
        const payload = await getMethodFetch(`/api/events/shop-items?count=${shopItemCount}`);
        if (!payload?.success || !Array.isArray(payload.items)) {
            return [];
        }
        return payload.items;
    } catch (error) {
        toast('Failed to load shop items', 'error');
        console.error('Shop items fetch failed:', error.message);
        return [];
    }
}

function createTraderPanel(traderLine = 'Fresh stock for brave souls. Pick your poison.') {
    const panel = document.createElement('div');
    panel.className = 'shopTraderPanel';

    const img = document.createElement('img');
    img.src = '../textures/UI/trader.png';
    img.className = 'shopTraderImage';
    img.alt = 'Dungeon trader';
    img.onerror = () => {
        img.onerror = null;
        img.src = '../textures/misc/placeholder.png';
    };

    const text = document.createElement('p');
    text.className = 'shopTraderText';
    text.textContent = traderLine;

    panel.append(img, text);
    return panel;
}

function createStatsDisplay() {
    const panel = document.createElement('div');
    panel.className = 'shopStats';

    const title = document.createElement('h3');
    title.className = 'shopStatsTitle';
    title.textContent = 'Item Stats';

    const description = document.createElement('p');
    description.className = 'shopStatsDescription';

    const numbers = document.createElement('div');
    numbers.className = 'shopStatsNumbers';

    const lines = {};
    ['type', 'tier', 'price', 'primary'].forEach((key) => {
        const span = document.createElement('span');
        numbers.appendChild(span);
        lines[key] = span;
    });

    panel.append(title, description, numbers);

    function update(item) {
        if (!item) {
            description.textContent = 'Select an item slot to inspect.';
            lines.type.textContent = 'Type: —';
            lines.tier.textContent = 'Tier: —';
            lines.price.textContent = 'Price: —';
            lines.primary.textContent = 'Primary Stat: —';
            return;
        }

        const categoryLabel = item.category === 'weapon' ? 'Weapon' : 'Armor';
        description.textContent = `${categoryLabel} · ${item.type || '—'} · Tier ${item.tier ?? '—'}`;
        lines.type.textContent = `Type: ${item.type || '—'}`;
        lines.tier.textContent = `Tier: ${item.tier ?? '—'}`;

        let displayPrice = item.adjustedPrice !== undefined ? item.adjustedPrice : item.price;
        lines.price.textContent = `Price: ${displayPrice ?? '—'} gold`;

        if (item.category === 'weapon') {
            lines.primary.textContent = `Attack Multiplier: ×${item.attack_multiplier ?? '—'}`;
        } else {
            lines.primary.textContent = `Defense Multiplier: ×${item.defense_multiplier ?? '—'}`;
        }
    }

    update(null);
    return { panel, update };
}

function createShopGrid(items, onSelect) {
    const FALLBACK_IMG = '../textures/misc/placeholderloot.png';

    const grid = document.createElement('div');
    grid.className = 'shopGrid';

    let activeSlot = null;

    items.forEach((item) => {
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'shopSlot';
        slot.dataset.itemId = String(item.itemId ?? 'unknown');
        slot.dataset.category = item.category ?? '';

        const img = document.createElement('img');
        img.className = 'shopSlotImage';
        img.src = item.img_path || FALLBACK_IMG;
        img.alt = item.name || 'Item';
        img.onerror = () => {
            img.onerror = null;
            img.src = FALLBACK_IMG;
        };

        const name = document.createElement('span');
        name.className = 'shopSlotName';
        name.textContent = item.name || 'Unknown';

        let displayPrice =
            item.adjustedPrice !== undefined ? item.adjustedPrice : (item.price ?? 0);

        const price = document.createElement('span');
        price.className = 'shopSlotValue';
        price.textContent = `${displayPrice} gold`;

        slot.append(img, name, price);

        if (item.sold) {
            slot.disabled = true;
            slot.classList.add('isSold');
        }

        slot.addEventListener('click', () => {
            if (slot.disabled) return;
            activeSlot?.classList.remove('isSelected');
            activeSlot = slot;
            slot.classList.add('isSelected');
            onSelect(item);
        });

        grid.appendChild(slot);
    });

    function markSold(itemId, category) {
        const slot = grid.querySelector(
            `.shopSlot[data-item-id="${itemId}"][data-category="${category}"]`
        );
        if (!slot) return;
        slot.disabled = true;
        slot.classList.remove('isSelected');
        slot.classList.add('isSold');
        if (activeSlot === slot) activeSlot = null;
    }

    return { grid, markSold };
}

function createPromptPanel(options = {}) {
    const { idleText = 'Select an item slot to inspect and buy.', buttonText = 'Buy' } = options;

    const panel = document.createElement('div');
    panel.className = 'shopPrompt';

    const promptText = document.createElement('p');
    promptText.className = 'shopPromptText';
    promptText.textContent = idleText;

    const actions = document.createElement('div');
    actions.className = 'shopPromptActions';

    const buyButton = document.createElement('button');
    buyButton.className = 'shopPromptButton';
    buyButton.textContent = buttonText;
    buyButton.disabled = true;

    const statusText = document.createElement('p');
    statusText.className = 'shopStatusText';

    actions.appendChild(buyButton);
    panel.append(promptText, actions, statusText);

    function setItem(item) {
        if (item) {
            let displayPrice =
                item.adjustedPrice !== undefined ? item.adjustedPrice : (item.price ?? 0);
            promptText.textContent = `Buy ${item.name} for ${displayPrice} gold?`;
        } else {
            promptText.textContent = idleText;
        }
        statusText.textContent = '';
        statusText.className = 'shopStatusText';
        buyButton.disabled = !item;
    }

    function setStatus(message, type) {
        statusText.textContent = message;
        if (type) {
            statusText.className = `shopStatusText shopStatus--${type}`;
        } else {
            statusText.className = 'shopStatusText';
        }
    }

    return { panel, promptText, buyButton, statusText, actions, setItem, setStatus };
}

function createTradeEventOverlay(tradeEvent) {
    removeEventPopupById(TRADE_EVENT_OVERLAY_ID);
    setEventChoicePending(true);

    const tradeItems = Array.isArray(tradeEvent?.items) ? tradeEvent.items.slice(0, 1) : [];

    const overlay = document.createElement('section');
    overlay.id = TRADE_EVENT_OVERLAY_ID;
    overlay.className = 'shopOverlay';

    const traderPanel = createTraderPanel(
        sanitizeEventText(
            tradeEvent?.merchantLine,
            tradeEvent?.description || 'The merchant offers one item at a favorable price.'
        )
    );
    overlay.appendChild(traderPanel);

    const shopPanel = document.createElement('div');
    shopPanel.className = 'shopPanel';

    const shopTitle = document.createElement('h2');
    shopTitle.className = 'shopTitle';
    shopTitle.textContent = sanitizeEventText(tradeEvent?.title, 'Traveling Merchant');
    shopPanel.appendChild(shopTitle);

    const closeButton = document.createElement('button');
    closeButton.className = 'shopCloseButton';
    closeButton.textContent = '✕';
    closeButton.setAttribute('aria-label', 'Close trade offer');
    closeButton.addEventListener('click', closeTradeEventOverlay);
    shopPanel.appendChild(closeButton);

    const intro = document.createElement('p');
    intro.className = 'shopStatsDescription';
    intro.textContent = 'One discounted item. Once you leave, the deal is gone.';
    shopPanel.appendChild(intro);

    overlay.appendChild(shopPanel);
    document.body.appendChild(overlay);

    if (tradeItems.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'shopEmpty';
        emptyMsg.textContent = 'The trader reaches into the satchel, then shrugs. Nothing left.';
        shopPanel.appendChild(emptyMsg);
        return;
    }

    const { panel: statsPanel, update: updateStats } = createStatsDisplay();
    const {
        panel: promptPanel,
        buyButton,
        actions,
        setItem,
        setStatus
    } = createPromptPanel({
        idleText: 'Inspect the offer before you decide.'
    });

    const leaveButton = document.createElement('button');
    leaveButton.type = 'button';
    leaveButton.className = 'shopPromptButton';
    leaveButton.textContent = 'Leave';
    leaveButton.addEventListener('click', closeTradeEventOverlay);
    actions.appendChild(leaveButton);

    let selectedItem = null;

    const { grid, markSold } = createShopGrid(tradeItems, (item) => {
        selectedItem = item;
        setItem(item);
        updateStats(item);
    });

    buyButton.addEventListener('click', async () => {
        if (!selectedItem) return;

        buyButton.disabled = true;
        setStatus('Processing...', '');

        try {
            const result = await postFetch('/api/events/buy-item', {
                itemId: selectedItem.itemId,
                category: selectedItem.category,
                adjustedPrice:
                    selectedItem.adjustedPrice !== undefined
                        ? selectedItem.adjustedPrice
                        : selectedItem.price
            });

            if (result && result.success) {
                setStatus(`Purchased! Gold remaining: ${result.remainingGold}`, 'success');
                markSold(String(selectedItem.itemId), selectedItem.category);
                selectedItem = null;
                setItem(null);
                updateStats(null);
                return;
            }

            const errorMsg = result && result.message ? result.message : 'Purchase failed.';
            setStatus(errorMsg, 'error');
            buyButton.disabled = false;
        } catch (error) {
            console.error('Trade purchase failed:', error);
            setStatus('Could not complete purchase. Try again.', 'error');
            buyButton.disabled = false;
        }
    });

    shopPanel.append(grid, statsPanel, promptPanel);
}

async function renderShop() {
    const OVERLAY_ID = 'shop-overlay';
    document.getElementById(OVERLAY_ID)?.remove();

    const overlay = document.createElement('section');
    overlay.id = OVERLAY_ID;
    overlay.className = 'shopOverlay';

    const traderPanel = createTraderPanel();
    overlay.appendChild(traderPanel);

    const shopPanel = document.createElement('div');
    shopPanel.className = 'shopPanel';

    const shopTitle = document.createElement('h2');
    shopTitle.className = 'shopTitle';
    shopTitle.textContent = 'Trader Stock';
    shopPanel.appendChild(shopTitle);

    const closeButton = document.createElement('button');
    closeButton.className = 'shopCloseButton';
    closeButton.textContent = '✕';
    closeButton.setAttribute('aria-label', 'Close shop');
    closeButton.addEventListener('click', () => overlay.remove());
    shopPanel.appendChild(closeButton);

    const loadingText = document.createElement('p');
    loadingText.className = 'shopLoading';
    loadingText.textContent = 'Loading wares...';
    shopPanel.appendChild(loadingText);

    overlay.appendChild(shopPanel);
    document.body.appendChild(overlay);

    const shopItems = await fetchShopItems();
    loadingText.remove();

    if (shopItems.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'shopEmpty';
        emptyMsg.textContent = 'The trader has nothing in stock right now. Come back later.';
        shopPanel.appendChild(emptyMsg);
        return;
    }

    const { panel: statsPanel, update: updateStats } = createStatsDisplay();
    const { panel: promptPanel, buyButton, setItem, setStatus } = createPromptPanel();

    let selectedItem = null;

    const { grid, markSold } = createShopGrid(shopItems, (item) => {
        selectedItem = item;
        setItem(item);
        updateStats(item);
    });

    buyButton.addEventListener('click', async () => {
        if (!selectedItem) return;

        buyButton.disabled = true;
        setStatus('Processing...', '');

        try {
            const result = await postFetch('/api/events/buy-item', {
                itemId: selectedItem.itemId,
                category: selectedItem.category,
                adjustedPrice:
                    selectedItem.adjustedPrice !== undefined
                        ? selectedItem.adjustedPrice
                        : selectedItem.price
            });

            if (result && result.success) {
                setStatus(`Purchased! Gold remaining: ${result.remainingGold}`, 'success');
                markSold(String(selectedItem.itemId), selectedItem.category);
                selectedItem = null;
                setItem(null);
                updateStats(null);
                // Refresh sell section with the newly bought item in loadout
                refreshSellSection();
            } else {
                let errorMsg = result && result.message ? result.message : 'Purchase failed.';
                setStatus(errorMsg, 'error');
                buyButton.disabled = false;
            }
        } catch (error) {
            console.error('Buy failed:', error);
            setStatus('Could not complete purchase. Try again.', 'error');
            buyButton.disabled = false;
        }
    });

    shopPanel.append(grid, statsPanel, promptPanel);

    // Sell section — fetch player's loadout and render sell UI
    async function refreshSellSection() {
        let existingSell = shopPanel.querySelector('.shopSellSection');
        if (existingSell) existingSell.remove();

        let loadoutItems = await fetchLoadoutForSelling();
        if (loadoutItems.length > 0) {
            const sellSection = createSellGrid(loadoutItems, (remainingGold) => {
                setStatus(`Gold remaining: ${remainingGold}`, 'success');
            });
            shopPanel.appendChild(sellSection);
        }
    }

    await refreshSellSection();
}

async function fetchLoadoutForSelling() {
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (!session || !session.isLoggedIn || !session.userId) {
            return [];
        }
        const result = await getMethodFetch(`/api/inventory/loadout/${session.userId}`);
        if (result && result.success) {
            return result.loadout;
        }
        return [];
    } catch (error) {
        toast('Failed to load your items for selling', 'error');
        console.error('Failed to fetch loadout for selling:', error.message);
        return [];
    }
}

function createSellGrid(loadoutItems, onSellComplete) {
    const FALLBACK_IMG = '../textures/misc/placeholderloot.png';

    const container = document.createElement('div');
    container.className = 'shopSellSection';

    const sellTitle = document.createElement('h3');
    sellTitle.className = 'shopStatsTitle';
    sellTitle.textContent = 'Sell Items From Loadout';
    container.appendChild(sellTitle);

    const sellDescription = document.createElement('p');
    sellDescription.className = 'shopTraderText';
    sellDescription.textContent = 'Items sell for 40-60% of their base value.';
    container.appendChild(sellDescription);

    const sellStatus = document.createElement('p');
    sellStatus.className = 'shopStatusText';
    container.appendChild(sellStatus);

    const sellGrid = document.createElement('div');
    sellGrid.className = 'shopGrid';
    container.appendChild(sellGrid);

    function renderItems(items) {
        sellGrid.innerHTML = '';

        if (items.length === 0) {
            container.remove();
            return;
        }

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let imageSource = FALLBACK_IMG;
            let itemName = 'Unknown';
            let basePrice = 0;

            if (item.armor_id) {
                imageSource = item.armor_img || FALLBACK_IMG;
                itemName = item.armor_name || 'Unknown Armor';
                basePrice = item.armor_price || 0;
            } else if (item.weapon_id) {
                imageSource = item.weapon_img || FALLBACK_IMG;
                itemName = item.weapon_name || 'Unknown Weapon';
                basePrice = item.weapon_price || 0;
            } else if (item.misc_item_id) {
                imageSource = item.misc_img || FALLBACK_IMG;
                itemName = item.misc_name || 'Unknown Item';
                basePrice = item.misc_value || 0;
            } else {
                continue;
            }

            let minSell = Math.max(1, Math.floor(basePrice * 0.4));
            let maxSell = Math.max(1, Math.floor(basePrice * 0.6));

            const slot = document.createElement('div');
            slot.className = 'shopSlot';

            const img = document.createElement('img');
            img.className = 'shopSlotImage';
            img.src = imageSource;
            img.alt = itemName;
            img.onerror = () => {
                img.onerror = null;
                img.src = FALLBACK_IMG;
            };

            const name = document.createElement('span');
            name.className = 'shopSlotName';
            name.textContent = itemName;

            const priceLabel = document.createElement('span');
            priceLabel.className = 'shopSlotPrice';
            if (minSell === maxSell) {
                priceLabel.textContent = `Sells for ${minSell} gold`;
            } else {
                priceLabel.textContent = `Sells for ${minSell}-${maxSell} gold`;
            }

            const sellButton = document.createElement('button');
            sellButton.className = 'shopPromptButton shopSellButton';
            sellButton.textContent = 'Sell';

            const capturedLoadoutId = item.loadoutId;
            sellButton.addEventListener('click', async () => {
                sellButton.disabled = true;
                sellButton.textContent = 'Selling...';

                try {
                    const result = await postFetch('/api/events/sell-item', {
                        loadoutId: capturedLoadoutId
                    });

                    if (result && result.success) {
                        sellStatus.textContent = `Sold ${result.itemName} for ${result.soldFor} gold. Gold: ${result.remainingGold}`;
                        sellStatus.className = 'shopStatusText shopStatus--success';
                        if (onSellComplete) {
                            onSellComplete(result.remainingGold);
                        }
                        let updatedLoadout = await fetchLoadoutForSelling();
                        renderItems(updatedLoadout);
                    } else {
                        let msg =
                            result && result.message ? result.message : 'Failed to sell item.';
                        sellStatus.textContent = msg;
                        sellStatus.className = 'shopStatusText shopStatus--error';
                        sellButton.disabled = false;
                        sellButton.textContent = 'Sell';
                    }
                } catch (error) {
                    sellStatus.textContent = 'Error selling item. Try again.';
                    sellStatus.className = 'shopStatusText shopStatus--error';
                    sellButton.disabled = false;
                    sellButton.textContent = 'Sell';
                }
            });

            slot.appendChild(img);
            slot.appendChild(name);
            slot.appendChild(priceLabel);
            slot.appendChild(sellButton);
            sellGrid.appendChild(slot);
        }
    }

    renderItems(loadoutItems);
    return container;
}

window.createFrontendLootPopup = eventLootPopup;
window.eventLootPopup = eventLootPopup;
window.createFrontendEvent = createFrontendEvent;
window.isEventChoicePending = () => eventUiState.isChoicePending;
window.closeTradeEventOverlay = closeTradeEventOverlay;
window.outRoom = outRoom;
window.renderShop = renderShop;
