async function fetchShopItems() {
    const shopItemCount = 5;
    try {
        const payload = await getMethodFetch(`/api/events/shop-items?count=${shopItemCount}`);
        if (!payload?.success || !Array.isArray(payload.items)) {
            return [];
        }
        return payload.items;
    } catch (error) {
        console.log('Shop items fetch failed:', error.message);
        return [];
    }
}

function createFrontendLootPopup(lootEvent) {
    const defaultGoldImg = '../textures/items/coing.png';
    const defaultLootImg = '../textures/misc/placeholderloot.png';
    const lootPopupId = 'loot-popup';

    if (!lootEvent || lootEvent.success === false) {
        return;
    }

    const existing = document.getElementById(lootPopupId);
    if (existing) {
        existing.remove();
    }

    const popup = document.createElement('div');
    popup.id = lootPopupId;
    popup.className = 'lootPopup';

    const title = document.createElement('h3');
    title.className = 'lootPopupTitle';
    title.textContent = 'Loot Gained';
    popup.appendChild(title);

    const content = document.createElement('div');
    content.className = 'lootPopupContent';

    if (lootEvent.item) {
        const itemRow = document.createElement('div');
        itemRow.className = 'lootPopupRow';

        const itemImg = document.createElement('img');
        itemImg.className = 'lootPopupImg';
        itemImg.src = lootEvent.item.img_path || lootEvent.item.img || defaultLootImg;
        itemImg.alt = lootEvent.item.name || 'Item';
        itemImg.onerror = () => {
            itemImg.onerror = null;
            itemImg.src = defaultLootImg;
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
        goldImg.src = lootEvent.goldImgPath || defaultGoldImg;
        goldImg.alt = 'Gold';
        goldImg.onerror = () => {
            goldImg.onerror = null;
            goldImg.src = defaultGoldImg;
        };

        const goldText = document.createElement('span');
        goldText.className = 'lootPopupText';
        goldText.textContent = `+${goldAmount} gold`;

        goldRow.appendChild(goldImg);
        goldRow.appendChild(goldText);
        content.appendChild(goldRow);
    }

    popup.appendChild(content);
    document.body.appendChild(popup);

    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 3200);
}

async function outRoom(room, dungeonLevel) {
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
        exitButton.addEventListener('click', async () => {
            try {
                await postFetch('/api/dungeon/exit', {
                    sessionToken: sessionStorage.getItem('dungeonSessionToken')
                });
                exitDungeon();
            } catch (error) {
                console.log('Exit failed:', error.message);
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
                    newLevelFromServer(sessionStorage.getItem('currentDungeon'), result, 100);
                }
            } catch (error) {
                console.log('Next level failed:', error.message);
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
        console.log('Shop items fetch failed:', error.message);
        return [];
    }
}

function createTraderPanel() {
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
    text.textContent = 'Fresh stock for brave souls. Pick your poison.';

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
        lines.price.textContent = `Price: ${item.price ?? '—'} gold`;

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

        const price = document.createElement('span');
        price.className = 'shopSlotValue';
        price.textContent = `${item.price ?? 0} gold`;

        slot.append(img, name, price);

        slot.addEventListener('click', () => {
            if (slot.disabled) return;
            activeSlot?.classList.remove('isSelected');
            activeSlot = slot;
            slot.classList.add('isSelected');
            onSelect(item);
        });

        grid.appendChild(slot);
    });

    function markSold(itemId) {
        const slot = grid.querySelector(`.shopSlot[data-item-id="${itemId}"]`);
        if (!slot) return;
        slot.disabled = true;
        slot.classList.remove('isSelected');
        slot.classList.add('isSold');
        if (activeSlot === slot) activeSlot = null;
    }

    return { grid, markSold };
}

function createPromptPanel() {
    const panel = document.createElement('div');
    panel.className = 'shopPrompt';

    const promptText = document.createElement('p');
    promptText.className = 'shopPromptText';
    promptText.textContent = 'Select an item slot to inspect and buy.';

    const actions = document.createElement('div');
    actions.className = 'shopPromptActions';

    const buyButton = document.createElement('button');
    buyButton.className = 'shopPromptButton';
    buyButton.textContent = 'Buy';
    buyButton.disabled = true;

    const statusText = document.createElement('p');
    statusText.className = 'shopStatusText';

    actions.appendChild(buyButton);
    panel.append(promptText, actions, statusText);

    function setItem(item) {
        promptText.textContent = item
            ? `Buy ${item.name} for ${item.price ?? 0} gold?`
            : 'Select an item slot to inspect and buy.';
        statusText.textContent = '';
        statusText.className = 'shopStatusText';
        buyButton.disabled = !item;
    }

    function setStatus(message, type = '') {
        statusText.textContent = message;
        statusText.className = ['shopStatusText', type ? `shopStatus--${type}` : '']
            .filter(Boolean)
            .join(' ');
    }

    return { panel, promptText, buyButton, statusText, setItem, setStatus };
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
                price: selectedItem.price
            });

            if (result?.success) {
                setStatus(`Purchased! Gold remaining: ${result.remainingGold}`, 'success');
                markSold(String(selectedItem.itemId));
                selectedItem = null;
                setItem(null);
                updateStats(null);
            } else {
                setStatus(result?.message || 'Purchase failed.', 'error');
                buyButton.disabled = false;
            }
        } catch (error) {
            console.error('Buy failed:', error);
            setStatus('Could not complete purchase. Try again.', 'error');
            buyButton.disabled = false;
        }
    });

    shopPanel.append(grid, statsPanel, promptPanel);
}
