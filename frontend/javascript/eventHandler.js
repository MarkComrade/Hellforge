const DEFAULT_GOLD_IMG = '../textures/items/coing.png';
const DEFAULT_LOOT_IMG = '../textures/misc/placeholderloot.png';
const LOOT_POPUP_ID = 'loot-popup';
const EVENT_DIALOGUE_POPUP_ID = 'event-dialogue-popup';
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
        if (elementId === EVENT_DIALOGUE_POPUP_ID || elementId === LOOT_POPUP_ID) {
            setEventChoicePending(false);
        }
        existing.remove();
    }
}

function setEventChoicePending(isPending) {
    eventUiState.isChoicePending = Boolean(isPending);
}

function eventLootPopup(lootEvent) {
    if (!lootEvent || lootEvent.success === false) {
        return;
    }

    removeEventPopupById(LOOT_POPUP_ID);
    setEventChoicePending(true);

    const popup = document.createElement('div');
    popup.id = LOOT_POPUP_ID;
    popup.className = 'lootPopup';

    const title = document.createElement('h3');
    title.className = 'lootPopupTitle';
    title.textContent = 'Loot Gained';
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

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'eventDialogueButton primary';
    button.textContent = 'Continue';
    button.addEventListener('click', () => {
        setEventChoicePending(false);
        popup.remove();
    });
    footer.appendChild(button);

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
                setEventChoicePending(false);
                popup.remove();
            });
            footer.appendChild(button);
        });
    } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'eventDialogueButton primary';
        button.textContent = 'Continue';
        button.addEventListener('click', () => {
            setEventChoicePending(false);
            popup.remove();
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

    createDialoguePopup(eventPayload);
}

window.createFrontendLootPopup = eventLootPopup;
window.eventLootPopup = eventLootPopup;
window.createFrontendEvent = createFrontendEvent;
window.isEventChoicePending = () => eventUiState.isChoicePending;
