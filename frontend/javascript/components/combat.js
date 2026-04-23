let selectedCardIndex = null;
let selectedEnemyIndex = null;
let combatToken = null;
let combatState = null;
let isCombatBusy = false;

const FALLBACK_SPRITE = '../textures/characters/enemy_cultist.png';
const PLAYER_SPRITE = '../textures/characters/player.png';
const NAV_IDS = ['navigateUp', 'navigateRight', 'navigateDown', 'navigateLeft'];
const COMBAT_ELEMENT_IDS = ['combat-log', 'combat-player', 'combat-enemies', 'combat-cards'];
const BLOCKED_ICON_IDS = ['openSettings', 'openInventory', 'abandonDungeon'];

const SCATTER_POSITIONS = [
    [{ top: '28vh', right: '24vw' }],
    [
        { top: '16vh', right: '18vw' },
        { top: '46vh', right: '28vw' }
    ],
    [
        { top: '12vh', right: '20vw' },
        { top: '44vh', right: '30vw' },
        { top: '28vh', right: '14vw' }
    ],
    [
        { top: '10vh', right: '16vw' },
        { top: '34vh', right: '28vw' },
        { top: '14vh', right: '32vw' },
        { top: '40vh', right: '14vw' }
    ],
    [
        { top: '8vh', right: '15vw' },
        { top: '28vh', right: '30vw' },
        { top: '48vh', right: '20vw' },
        { top: '16vh', right: '24vw' },
        { top: '38vh', right: '14vw' }
    ]
];

function startCombat(token, initialState) {
    selectedCardIndex = null;
    selectedEnemyIndex = null;
    combatToken = token;
    combatState = initialState;
    isCombatBusy = false;
    enterCombatMode();
    renderCombat();
}

function enterCombatMode() {
    document.body.classList.add('in-combat');

    const topRight = document.querySelector('#ui .top-right');
    if (topRight) topRight.style.display = 'none';

    NAV_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.style.pointerEvents = 'none';
    });

    BLOCKED_ICON_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.classList.add('ui-combat-blocked');
    });
}

function exitCombatMode() {
    document.body.classList.remove('in-combat');

    const topRight = document.querySelector('#ui .top-right');
    if (topRight) topRight.style.display = '';

    NAV_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.style.pointerEvents = '';
    });

    BLOCKED_ICON_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.classList.remove('ui-combat-blocked');
    });

    const bottomRight = document.querySelector('#ui .bottom-right');
    if (bottomRight) bottomRight.innerHTML = '';
}

function renderCombat() {
    clearCombatElements();

    document.body.appendChild(createCombatLog());
    document.body.appendChild(createPlayerSection());
    document.body.appendChild(createEnemySection());
    document.body.appendChild(createCardSection());

    if (typeof setHP === 'function') setHP(combatState.player.hp);

    fillBottomRightControls();

    if (combatState.isResolved) showResultOverlay();
}

function createCombatLog() {
    const container = document.createElement('div');
    container.id = 'combat-log';

    (combatState.combatLog || []).forEach((entry) => {
        const line = document.createElement('p');
        line.className = 'combat-log-entry log-' + (entry.type || 'system');
        line.textContent = entry.message;
        container.appendChild(line);
    });

    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
    return container;
}

function addLogMessage(message, type) {
    const container = document.getElementById('combat-log');
    if (!container) return;
    const line = document.createElement('p');
    line.className = 'combat-log-entry log-' + (type || 'system');
    line.textContent = message;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
}

function createPlayerSection() {
    const section = document.createElement('div');
    section.id = 'combat-player';

    const spriteBox = document.createElement('div');
    spriteBox.className = 'combat-sprite-box';
    const sprite = document.createElement('img');
    sprite.className = 'combat-character-sprite player-sprite';
    sprite.src = PLAYER_SPRITE;
    sprite.alt = 'Player';
    sprite.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_SPRITE;
    };
    spriteBox.appendChild(sprite);
    section.appendChild(spriteBox);

    const infoBox = document.createElement('div');
    infoBox.className = 'combat-character-info';

    if (combatState.player.block > 0) {
        const blockBadge = document.createElement('div');
        blockBadge.className = 'combat-block-badge';
        blockBadge.textContent = '\uD83D\uDEE1\uFE0F ' + combatState.player.block;
        infoBox.appendChild(blockBadge);
    }

    infoBox.appendChild(createStatusRow(combatState.player.statuses));
    section.appendChild(infoBox);

    return section;
}

function createEnemySection() {
    const section = document.createElement('div');
    section.id = 'combat-enemies';

    const enemies = combatState.enemies || [];
    const positionGroup =
        SCATTER_POSITIONS[Math.min(enemies.length, SCATTER_POSITIONS.length) - 1] ||
        SCATTER_POSITIONS[0];

    enemies.forEach((enemy, enemyPositionIndex) => {
        const panel = createEnemyPanel(enemy);
        const position =
            positionGroup[enemyPositionIndex] || positionGroup[positionGroup.length - 1];
        panel.style.top = position.top;
        panel.style.right = position.right;
        section.appendChild(panel);
    });

    return section;
}

function createEnemyPanel(enemy) {
    const isDead = enemy.hp <= 0;

    const panel = document.createElement('div');
    panel.className = 'combat-enemy' + (isDead ? ' enemy-dead' : '');
    if (selectedEnemyIndex === enemy.index) panel.classList.add('enemy-selected');
    panel.setAttribute('data-enemy-idx', enemy.index);

    panel.addEventListener('click', () => {
        if (isDead || combatState.isResolved || isCombatBusy) return;
        if (selectedCardIndex !== null) {
            const selectedCard = (combatState.hand || [])[selectedCardIndex];
            const targetType = selectedCard ? selectedCard.targetType || 'single' : 'single';
            if (targetType !== 'single') return;
        }
        selectedEnemyIndex = selectedEnemyIndex === enemy.index ? null : enemy.index;
        updateEnemyHighlights();
    });

    const spriteBox = document.createElement('div');
    spriteBox.className = 'combat-sprite-box';
    const sprite = document.createElement('img');
    sprite.className = 'combat-character-sprite enemy-sprite';
    sprite.src = enemy.img_path || FALLBACK_SPRITE;
    sprite.alt = enemy.archetype || 'Enemy';
    sprite.onerror = function () {
        this.onerror = null;
        this.src = FALLBACK_SPRITE;
    };
    spriteBox.appendChild(sprite);

    if (isDead) {
        const skull = document.createElement('div');
        skull.className = 'combat-skull';
        skull.textContent = '\u2620\uFE0F';
        spriteBox.appendChild(skull);
    }

    panel.appendChild(spriteBox);

    const infoBox = document.createElement('div');
    infoBox.className = 'combat-character-info';

    const nameLabel = document.createElement('div');
    nameLabel.className = 'combat-enemy-name';
    nameLabel.textContent = enemy.archetype || 'Enemy';
    infoBox.appendChild(nameLabel);

    infoBox.appendChild(createHealthBar(enemy.hp, enemy.maxHp, enemy.block));
    infoBox.appendChild(createStatusRow(enemy.statuses));

    panel.appendChild(infoBox);

    return panel;
}

function updateEnemyHighlights() {
    document.querySelectorAll('.combat-enemy[data-enemy-idx]').forEach((element) => {
        const enemyIndex = Number(element.getAttribute('data-enemy-idx'));
        element.classList.toggle('enemy-selected', enemyIndex === selectedEnemyIndex);
    });
}

function createHealthBar(currentHealth, maxHealth, block) {
    const wrapper = document.createElement('div');
    wrapper.className = 'combat-hp-wrapper';

    const track = document.createElement('div');
    track.className = 'combat-hp-track';

    const healthPercentage =
        maxHealth > 0
            ? Math.max(0, Math.min(100, Math.round((currentHealth / maxHealth) * 100)))
            : 0;
    const fill = document.createElement('div');
    fill.className = 'combat-hp-fill';
    fill.style.width = healthPercentage + '%';
    track.appendChild(fill);

    const text = document.createElement('div');
    text.className = 'combat-hp-text';
    const displayHealth = currentHealth > 0 ? Math.max(1, Math.round(currentHealth)) : 0;
    const displayMaxHealth = Math.max(1, Math.round(maxHealth));
    text.textContent = displayHealth + ' / ' + displayMaxHealth;
    track.appendChild(text);

    wrapper.appendChild(track);

    if (block > 0) {
        const badge = document.createElement('div');
        badge.className = 'combat-block-badge';
        badge.textContent = '\uD83D\uDEE1\uFE0F ' + block;
        wrapper.appendChild(badge);
    }

    return wrapper;
}

function createStatusRow(statuses) {
    const row = document.createElement('div');
    row.className = 'combat-statuses';
    if (!statuses || !statuses.length) return row;

    statuses.forEach((status) => {
        const badge = document.createElement('div');
        badge.className = 'combat-status-badge';

        const icon = document.createElement('img');
        icon.src = getStatusIcon(status.type);
        icon.alt = status.type;
        icon.onerror = function () {
            this.onerror = null;
            this.src = '../textures/misc/defaultportrait.png';
        };
        badge.appendChild(icon);

        const label = document.createElement('span');
        label.textContent = status.stacks != null ? status.stacks : status.turns + 't';
        badge.appendChild(label);

        row.appendChild(badge);
    });
    return row;
}

function getStatusIcon(type) {
    if (type === 'bleed') return '../textures/misc/status_blood.png';
    if (type === 'scorch') return '../textures/misc/status_burn.png';
    return '../textures/misc/defaultportrait.png';
}

function createCardSection() {
    const section = document.createElement('div');
    section.id = 'combat-cards';

    const hand = combatState.hand || [];
    const canPlayCards =
        !combatState.isResolved &&
        combatState.turnOwner === 'player' &&
        combatState.cardsPlayedThisTurn < combatState.maxCardsThisTurn;

    const row = document.createElement('div');
    row.className = 'combat-cards-row';

    hand.forEach((card, cardIndex) => {
        const cardElement = createCardElement(card, cardIndex, canPlayCards);
        row.appendChild(cardElement);
    });

    section.appendChild(row);

    const confirmButton = document.createElement('button');
    confirmButton.className = 'combat-btn combat-btn-confirm';
    confirmButton.textContent = 'Play Card';
    confirmButton.disabled = !canPlayCards;
    confirmButton.addEventListener('click', playSelectedCard);
    section.appendChild(confirmButton);

    return section;
}

function createCardElement(card, cardIndex, canPlayCards) {
    const cardElement = document.createElement('div');
    cardElement.className = 'combat-card combat-card-enter';
    cardElement.style.animationDelay = cardIndex * 0.07 + 's';
    if (!canPlayCards) cardElement.classList.add('card-disabled');
    if (selectedCardIndex === cardIndex) cardElement.classList.add('card-selected');

    // Tier badge — circular, sits on top edge
    const tierBadge = document.createElement('div');
    tierBadge.className = 'combat-card-tier-badge tier-' + (card.tier || 1);
    tierBadge.textContent = card.tier || '?';
    cardElement.appendChild(tierBadge);

    // Inner wrapper
    const inner = document.createElement('div');
    inner.className = 'combat-card-inner';

    // Card name
    const nameElement = document.createElement('div');
    nameElement.className = 'combat-card-name';
    nameElement.textContent = card.name;
    inner.appendChild(nameElement);

    // Image box
    const imgBox = document.createElement('div');
    imgBox.className = 'combat-card-img-box';
    const img = document.createElement('img');
    img.src = card.source_item_img || '../textures/misc/placeholderloot.png';
    img.alt = card.name;
    img.onerror = function () {
        this.onerror = null;
        this.src = '../textures/misc/placeholderloot.png';
    };
    imgBox.appendChild(img);
    inner.appendChild(imgBox);

    // Effects description box
    const descBox = document.createElement('div');
    descBox.className = 'combat-card-desc-box';
    descBox.textContent = formatCardEffects(card.effects);
    inner.appendChild(descBox);

    // Footer: type | target | exhaust
    const footer = document.createElement('div');
    footer.className = 'combat-card-footer';

    const typeEl = document.createElement('span');
    typeEl.className = 'combat-card-type';
    typeEl.textContent = card.type;
    footer.appendChild(typeEl);

    const targetEl = document.createElement('span');
    targetEl.className = 'combat-card-target';
    targetEl.textContent = getTargetLabel(card);
    footer.appendChild(targetEl);

    if (card.exhaust) {
        const exhaustEl = document.createElement('span');
        exhaustEl.className = 'combat-card-exhaust';
        exhaustEl.textContent = 'Exhaust';
        footer.appendChild(exhaustEl);
    }

    inner.appendChild(footer);
    cardElement.appendChild(inner);

    if (canPlayCards) {
        cardElement.addEventListener('click', () => {
            if (isCombatBusy) return;
            selectedCardIndex = selectedCardIndex === cardIndex ? null : cardIndex;
            if (selectedCardIndex !== null) {
                const selectedCard = (combatState.hand || [])[selectedCardIndex];
                const targetType = selectedCard ? selectedCard.targetType || 'single' : 'single';
                if (targetType !== 'single') {
                    selectedEnemyIndex = null;
                    updateEnemyHighlights();
                }
            }
            updateCardHighlights();
        });
    }

    return cardElement;
}

function updateCardHighlights() {
    document.querySelectorAll('#combat-cards .combat-card').forEach((element, cardIndex) => {
        element.classList.toggle('card-selected', cardIndex === selectedCardIndex);
    });
}

function fillBottomRightControls() {
    const box = document.querySelector('#ui .bottom-right');
    if (!box) return;

    const controls = document.createElement('div');
    controls.id = 'combat-controls';

    const endTurnButton = document.createElement('button');
    endTurnButton.className = 'combat-btn';
    endTurnButton.textContent = 'End Turn';
    endTurnButton.disabled = combatState.isResolved || combatState.turnOwner !== 'player';
    endTurnButton.addEventListener('click', endPlayerTurn);
    controls.appendChild(endTurnButton);

    const turnInfo = document.createElement('div');
    turnInfo.className = 'combat-turn-info';
    turnInfo.innerHTML =
        'Turn ' +
        combatState.turnNumber +
        '<br>' +
        'Cards: ' +
        combatState.cardsPlayedThisTurn +
        '/' +
        combatState.maxCardsThisTurn +
        '<br>' +
        'Draw: ' +
        combatState.drawPileCount +
        ' Disc: ' +
        combatState.discardPileCount;
    controls.appendChild(turnInfo);

    box.appendChild(controls);
}

function getTargetLabel(card) {
    if (card.targetType === 'self') return 'Self';
    if (card.targetType === 'all') return 'All Enemies';
    if (card.targetType === 'random') return 'Random \u00D7' + (card.affectedTargets || 1);
    return 'Select  Target';
}

function formatCardEffects(effects) {
    if (!effects) return '';
    const parts = [];
    if (effects.damage) parts.push('DMG ' + effects.damage);
    if (effects.block) parts.push('BLK ' + effects.block);
    if (effects.bleed) parts.push('BLD ' + effects.bleed);
    if (effects.scorch) parts.push('SCH ' + effects.scorch);
    if (effects.healing) parts.push('HEAL ' + effects.healing);
    if (effects.extraPlays) parts.push('+' + effects.extraPlays + ' play');
    if (effects.strength) parts.push('STR ' + effects.strength);
    if (effects.backfire) parts.push('SELF ' + effects.backfire);
    if (effects.vulnerable) parts.push('VULN ' + effects.vulnerable.pct + '%');
    if (effects.lifesteal) parts.push('LS ' + effects.lifesteal.pct + '%');
    return parts.join('  ') || '\u2014';
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playSelectedCard() {
    if (isCombatBusy) return;

    if (selectedCardIndex === null) {
        addLogMessage('Select a card first.', 'system');
        return;
    }

    const card = (combatState.hand || [])[selectedCardIndex];
    if (!card) return;

    const targetType = card.targetType || 'single';

    if (targetType === 'single') {
        const alive = (combatState.enemies || []).filter((e) => e.hp > 0);
        if (alive.length === 1) {
            selectedEnemyIndex = alive[0].index;
            updateEnemyHighlights();
        }

        if (selectedEnemyIndex === null || selectedEnemyIndex === undefined) {
            addLogMessage('Select an enemy target first.', 'system');
            return;
        }

        const target = (combatState.enemies || []).find((e) => e.index === selectedEnemyIndex);
        if (!target || target.hp <= 0) {
            addLogMessage('That enemy is dead. Pick another.', 'system');
            selectedEnemyIndex = null;
            updateEnemyHighlights();
            return;
        }
    }

    const requestBody = { combatToken: combatToken, cardIndex: selectedCardIndex };
    if (targetType === 'single') requestBody.targetIndex = selectedEnemyIndex;

    isCombatBusy = true;
    try {
        const data = await postFetch('/api/combat/play-card', requestBody);
        combatState = data.state;
        selectedCardIndex = null;
        selectedEnemyIndex = null;
        renderCombat();
    } catch (err) {
        console.error('Play card failed:', err.message);
        toast('Failed to play card', 'error');
        addLogMessage('Failed to play card.', 'system');
    } finally {
        isCombatBusy = false;
    }
}

async function endPlayerTurn() {
    if (isCombatBusy) return;
    isCombatBusy = true;

    try {
        const data = await postFetch('/api/combat/end-turn', { combatToken: combatToken });
        combatState = data.state;
        selectedCardIndex = null;
        selectedEnemyIndex = null;

        await showEnemyActions();

        renderCombat();
    } catch (err) {
        console.error('End turn failed:', err.message);
        toast('Failed to end turn', 'error');
    } finally {
        isCombatBusy = false;
    }
}

async function showEnemyActions() {
    const logElement = document.getElementById('combat-log');
    if (!logElement) return;

    const currentLines = logElement.querySelectorAll('.combat-log-entry').length;
    const allEntries = combatState.combatLog || [];
    const newEntries = allEntries.slice(currentLines);

    for (const entry of newEntries) {
        const line = document.createElement('p');
        line.className = 'combat-log-entry log-' + (entry.type || 'system');
        line.textContent = entry.message;
        logElement.appendChild(line);
        logElement.scrollTop = logElement.scrollHeight;
        if (entry.type === 'enemy' || entry.type === 'status') {
            await delay(380);
        }
    }
}

function showResultOverlay() {
    const existing = document.querySelector('.combat-result-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'combat-result-overlay';

    if (combatState.isGameOver) {
        overlay.classList.add('defeat-bg');

        const title = document.createElement('div');
        title.className = 'combat-result-title defeat';
        title.textContent = 'You Died';
        overlay.appendChild(title);

        const returnToMenuButton = document.createElement('button');
        returnToMenuButton.className = 'combat-btn';
        returnToMenuButton.textContent = 'Return to Menu';
        returnToMenuButton.addEventListener('click', () => {
            removeCombatOverlay();
            if (typeof exitDungeon === 'function') exitDungeon(true);
        });
        overlay.appendChild(returnToMenuButton);
    } else {
        overlay.classList.add('victory-bg');

        const title = document.createElement('div');
        title.className = 'combat-result-title victory';
        title.textContent = 'Victory!';
        overlay.appendChild(title);

        const collectRewardButton = document.createElement('button');
        collectRewardButton.className = 'combat-btn combat-btn-confirm';
        collectRewardButton.textContent = 'Collect Reward';
        collectRewardButton.addEventListener('click', () => claimReward(collectRewardButton));
        overlay.appendChild(collectRewardButton);
    }

    document.body.appendChild(overlay);
}

async function claimReward(triggerButton) {
    triggerButton.disabled = true;
    try {
        const data = await postFetch('/api/combat/claim-reward', { combatToken: combatToken });
        removeCombatOverlay();
        showRewardPopup(data.reward);
    } catch (err) {
        console.error('Claim reward failed:', err.message);
        toast('Failed to claim reward. Try again.', 'error');
        triggerButton.disabled = false;
    }
}

function showRewardPopup(reward) {
    const popup = document.createElement('div');
    popup.className = 'combat-result-overlay victory-bg';

    const title = document.createElement('div');
    title.className = 'combat-result-title victory';
    title.textContent = 'Reward';
    popup.appendChild(title);

    if (reward && reward.item) {
        const itemText = document.createElement('div');
        itemText.className = 'combat-reward-item';
        itemText.textContent = 'Item: ' + (reward.item.name || 'Unknown item');
        popup.appendChild(itemText);
    }

    const goldText = document.createElement('div');
    goldText.className = 'combat-reward-text';
    goldText.textContent = 'Gold: ' + ((reward && reward.gold) || 0);
    popup.appendChild(goldText);

    const closeButton = document.createElement('button');
    closeButton.className = 'combat-btn';
    closeButton.textContent = 'Continue';
    closeButton.addEventListener('click', () => popup.remove());
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}

function clearCombatElements() {
    COMBAT_ELEMENT_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    document.querySelectorAll('.combat-result-overlay').forEach((element) => element.remove());
    const controls = document.getElementById('combat-controls');
    if (controls) controls.remove();
}

function removeCombatOverlay() {
    clearCombatElements();
    exitCombatMode();
}
