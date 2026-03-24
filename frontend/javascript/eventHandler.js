const DEFAULT_GOLD_IMG = '../textures/items/coing.png';
const DEFAULT_LOOT_IMG = '../textures/misc/placeholderloot.png';
const LOOT_POPUP_ID = 'loot-popup';

function createFrontendLootPopup(lootEvent) {
    if (!lootEvent || lootEvent.success === false) {
        return;
    }

    const existing = document.getElementById(LOOT_POPUP_ID);
    if (existing) {
        existing.remove();
    }

    const popup = document.createElement('div');
    popup.id = LOOT_POPUP_ID;
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

    popup.appendChild(content);
    document.body.appendChild(popup);

    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 3200);
}
