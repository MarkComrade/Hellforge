//Tool to generate bootstrap grid
function generateBootStrapGrid(row, col, col_md_value, className) {
    let contDiv = document.createElement('div');
    contDiv.setAttribute('class', 'container-fluid');

    for (let i = 0; i < row; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'row');
        contDiv.appendChild(rowDiv);

        for (let j = 0; j < col; j++) {
            let colDiv = document.createElement('div');
            let classes = [
                `col-sm-${col_md_value}`,
                `col-md-${col_md_value}`,
                'd-flex',
                'justify-content-center'
            ];
            if (className) {
                classes.push(className);
            }
            colDiv.setAttribute('class', classes.join(' '));
            rowDiv.appendChild(colDiv);
        }
    }

    /*
    ! May require further functionality
    */

    document.body.appendChild(contDiv);
    return contDiv;
}

function clearBody() {
    const toastContainer = document.querySelector('.hellToastContainer');
    const body = document.body;
    body.replaceChildren();
    if (toastContainer) {
        body.appendChild(toastContainer);
    }
}

function generateBackToMenu() {
    generateBootStrapGrid(1, 1, 12, 'backToMenu');

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Menu');
    backButton.setAttribute('class', 'menuButton');

    backButton.addEventListener('click', Menu);

    let backToMenu = document.querySelector('.backToMenu');
    backToMenu.appendChild(backButton);
}
function generateBackToAdminTools() {
    generateBootStrapGrid(1, 1, 12, 'backToAdminTools');

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Admin Tools');
    backButton.setAttribute('class', 'menuButton');

    backButton.addEventListener('click', Admin);

    let backToAdminTools = document.querySelector('.backToAdminTools');
    backToAdminTools.appendChild(backButton);
}

function formatCardEffectsForDisplay(effects) {
    if (!effects || typeof effects !== 'object') {
        return 'No effects';
    }

    const LABELS = {
        damage: (v) => `Damage: ${v}`,
        block: (v) => `Block: ${v} — absorbs damage this turn`,
        bleed: (v) => `Bleed: ${v}/turn — stacks`,
        scorch: (v) => `Scorch: ${v}/turn — stacks`,
        extraPlays: (v) => `Extra Plays: +${v}`,
        strength: (v) => `Strength: +${v} — flat damage increase`,
        backfire: (v) => `Self Damage: ${v}`,
        healing: (v) => `Heal: ${v} HP`,
        regen: (v) => `Regen: ${v} HP/turn — stacks`,
        cleanse: () => `Cleanse — removes negative effects`,
        deflect: (v) =>
            `Deflect: ${v?.pct ?? v}% for ${v?.turns ?? 1} turn${(v?.turns ?? 1) > 1 ? 's' : ''} — reflects damage taken`,
        lifesteal: (v) =>
            `Lifesteal: ${v?.pct ?? v}% for ${v?.turns ?? 1} turn${(v?.turns ?? 1) > 1 ? 's' : ''}`,
        vulnerable: (v) =>
            `Vulnerable: ${v?.pct ?? v}% for ${v?.turns ?? 1} turn${(v?.turns ?? 1) > 1 ? 's' : ''} — target takes more damage`
    };

    return Object.entries(effects)
        .map(([key, value]) => (LABELS[key] ? LABELS[key](value) : `${key}: ${value}`))
        .join('\n');
}

function closeItemCardsPopup() {
    const existingPopup = document.querySelector('.itemCardsPopupBackdrop');
    if (existingPopup) {
        existingPopup.remove();
    }
}

function showItemCardsPopup(itemName, cards) {
    closeItemCardsPopup();

    const cardList = Array.isArray(cards) ? cards : [];
    const backdrop = document.createElement('div');
    backdrop.setAttribute('class', 'itemCardsPopupBackdrop');

    const popup = document.createElement('div');
    popup.setAttribute('class', 'itemCardsPopup eventDialoguePopup');

    const header = document.createElement('div');
    header.setAttribute('class', 'eventDialogueHeader');

    const title = document.createElement('h3');
    title.setAttribute('class', 'eventDialogueTitle');
    title.textContent = `${itemName} - Cards`;
    header.appendChild(title);

    const badge = document.createElement('span');
    badge.setAttribute('class', 'eventDialogueBadge');
    badge.textContent = `${cardList.length} Cards`;
    header.appendChild(badge);

    popup.appendChild(header);

    const body = document.createElement('div');
    body.setAttribute('class', 'itemCardsPopupBody');

    if (cardList.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.setAttribute('class', 'eventDialogueBody');
        emptyState.textContent = 'No cards are bound to this item.';
        body.appendChild(emptyState);
    } else {
        cardList.forEach((card) => {
            const cardRow = document.createElement('button');
            cardRow.setAttribute('type', 'button');
            cardRow.setAttribute('class', 'itemCardRow');

            // ── Left column: identity ──
            const left = document.createElement('div');
            left.setAttribute('class', 'itemCardRowLeft');

            const cardTitle = document.createElement('span');
            cardTitle.setAttribute('class', 'itemCardRowTitle');
            cardTitle.textContent = card.name;
            left.appendChild(cardTitle);

            const cardMeta = document.createElement('span');
            cardMeta.setAttribute('class', 'itemCardRowMeta');
            cardMeta.textContent = `Tier ${card.tier} · ${card.type}`;
            left.appendChild(cardMeta);

            const targetLabel = card.targetType
                ? `Target: ${card.targetType}` +
                  (card.affectedTargets > 1 ? ` (${card.affectedTargets})` : '')
                : 'Target: single';
            const cardTarget = document.createElement('span');
            cardTarget.setAttribute('class', 'itemCardRowMeta');
            cardTarget.textContent = targetLabel;
            left.appendChild(cardTarget);

            const cardExhaust = document.createElement('span');
            cardExhaust.setAttribute('class', 'itemCardRowMeta');
            cardExhaust.textContent = card.exhaust ? 'Exhaust: Yes' : 'Exhaust: No';
            left.appendChild(cardExhaust);

            cardRow.appendChild(left);

            // ── Right column: effects ──
            const right = document.createElement('div');
            right.setAttribute('class', 'itemCardRowRight');

            const effectLines = formatCardEffectsForDisplay(card.effects).split('\n');
            effectLines.forEach((line) => {
                const el = document.createElement('span');
                el.setAttribute('class', 'itemCardRowEffect');
                el.textContent = line;
                right.appendChild(el);
            });

            cardRow.appendChild(right);

            cardRow.addEventListener('click', closeItemCardsPopup);
            body.appendChild(cardRow);
        });
    }

    popup.appendChild(body);
    backdrop.appendChild(popup);
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', closeItemCardsPopup);
    popup.addEventListener('click', closeItemCardsPopup);
}
function toast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.hellToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.className = 'hellToastContainer';
        document.body.appendChild(container);
    }

    if (container.children.length >= 3) return;

    const typeLabels = { error: 'Error', success: 'Success', info: 'Info', warning: 'Warning' };

    const toastEl = document.createElement('div');
    toastEl.className = `hellToast hellToast-${type}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    const header = document.createElement('div');
    header.className = 'hellToastHeader';

    const badge = document.createElement('span');
    badge.className = 'hellToastBadge';
    badge.textContent = typeLabels[type] ?? type.toUpperCase();

    const body = document.createElement('p');
    body.className = 'hellToastBody';
    body.textContent = message;

    header.appendChild(badge);
    toastEl.appendChild(header);
    toastEl.appendChild(body);
    container.appendChild(toastEl);

    const removeToast = () => {
        toastEl.classList.add('hellToast-hide');
        toastEl.addEventListener('animationend', () => toastEl.remove(), { once: true });
    };
    setTimeout(removeToast, duration);
}
