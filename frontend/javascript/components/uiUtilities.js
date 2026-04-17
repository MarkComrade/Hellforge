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

function buildCardsSection(cards) {
    const section = document.createElement('div');
    section.setAttribute('class', 'cardListSection');

    const header = document.createElement('span');
    header.setAttribute('class', 'cardListHeader');
    header.textContent = 'Cards';
    section.appendChild(header);

    if (!cards || cards.length === 0) {
        const empty = document.createElement('span');
        empty.setAttribute('class', 'cardTileDetail');
        empty.textContent = 'No cards';
        section.appendChild(empty);
        return section;
    }

    cards.forEach((card) => {
        const tile = document.createElement('div');
        tile.setAttribute('class', 'cardTile');

        const nameLine = document.createElement('span');
        nameLine.setAttribute('class', 'cardTileName');
        nameLine.textContent = card.name || 'Unknown';
        tile.appendChild(nameLine);

        const detailLine = document.createElement('span');
        detailLine.setAttribute('class', 'cardTileDetail');
        const effects = formatCardEffects(card.effects);
        const exhaustTag = card.exhaust ? ' · exhaust' : '';
        detailLine.textContent = `T${card.tier} · ${card.type}${exhaustTag}${effects ? ' · ' + effects : ''}`;
        tile.appendChild(detailLine);

        section.appendChild(tile);
    });

    return section;
}

function formatCardEffects(effects) {
    if (!effects) return '';
    const parts = [];
    if (effects.damage) parts.push(`DMG:${effects.damage}`);
    if (effects.block) parts.push(`BLK:${effects.block}`);
    if (effects.bleed) parts.push(`BLD:${effects.bleed}`);
    if (effects.scorch) parts.push(`SCH:${effects.scorch}`);
    if (effects.healing) parts.push(`HEAL:${effects.healing}`);
    if (effects.extraPlays) parts.push(`+${effects.extraPlays}play`);
    if (effects.strength) parts.push(`STR:${effects.strength}`);
    if (effects.backfire) parts.push(`SELF:${effects.backfire}`);
    if (effects.vulnerable) parts.push(`VULN:${effects.vulnerable.pct}%`);
    if (effects.lifesteal) parts.push(`LS:${effects.lifesteal.pct}%`);
    return parts.join(' ');
}
