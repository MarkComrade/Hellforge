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
    const body = document.body;
    body.replaceChildren();
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

    return Object.entries(effects)
        .map(([key, value]) => {
            const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (char) => char.toUpperCase());
            if (value && typeof value === 'object') {
                const nested = Object.entries(value)
                    .map(([nestedKey, nestedValue]) => `${nestedKey}: ${nestedValue}`)
                    .join(', ');
                return `${label} (${nested})`;
            }
            return `${label}: ${value}`;
        })
        .join(' | ');
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

            const cardTitle = document.createElement('span');
            cardTitle.setAttribute('class', 'itemCardRowTitle');
            const exhaustSuffix = card.exhaust ? ' [Exhaust]' : '';
            cardTitle.textContent = `${card.name}${exhaustSuffix}`;
            cardRow.appendChild(cardTitle);

            const cardMeta = document.createElement('span');
            cardMeta.setAttribute('class', 'itemCardRowMeta');
            cardMeta.textContent = `Tier ${card.tier} ${card.type}`;
            cardRow.appendChild(cardMeta);

            const cardEffects = document.createElement('span');
            cardEffects.setAttribute('class', 'itemCardRowEffects');
            cardEffects.textContent = formatCardEffectsForDisplay(card.effects);
            cardRow.appendChild(cardEffects);

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
