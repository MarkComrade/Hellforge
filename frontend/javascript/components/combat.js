// combat.js — Combat overlay component.
// startCombat(combatToken, initialState) is called by roomGeneration.js
// when the server confirms the player entered a combat room.

const COMBAT_OVERLAY_ID = 'combat-overlay';

function startCombat(combatToken, initialState) {
    renderCombat(combatToken, initialState);
}

function renderCombat(token, state) {
    removeCombatOverlay();

    const overlay = document.createElement('div');
    overlay.id = COMBAT_OVERLAY_ID;
    overlay.className = 'settingsOverlay';
    overlay.style.cssText =
        'flex-direction:column; gap:1vh; justify-content:flex-start; padding:2vh; overflow-y:auto;';

    overlay.appendChild(
        buildHpPanel(
            state.enemy.archetype || 'Enemy',
            state.enemy.hp,
            state.enemy.maxHp,
            state.enemy.block,
            state.enemy.statuses
        )
    );
    overlay.appendChild(
        buildHpPanel(
            'You',
            state.player.hp,
            state.player.maxHp,
            state.player.block,
            state.player.statuses
        )
    );

    const turnInfo = document.createElement('p');
    turnInfo.style.cssText = 'color:#ccc; font-size:1.4vh; margin:0;';
    turnInfo.textContent =
        `Turn ${state.turnNumber} \u2022 Cards: ${state.cardsPlayedThisTurn}/${state.maxCardsThisTurn}` +
        ` \u2022 Draw: ${state.drawPileCount}  Discard: ${state.discardPileCount}`;
    overlay.appendChild(turnInfo);

    overlay.appendChild(buildHand(token, state));

    overlay.appendChild(buildEquipmentPanel(state.equipment));

    const endTurnBtn = document.createElement('button');
    endTurnBtn.className = 'menuButton';
    endTurnBtn.textContent = 'End Turn';
    endTurnBtn.disabled = state.isResolved || state.turnOwner !== 'player';
    endTurnBtn.addEventListener('click', () => onEndTurn(token));
    overlay.appendChild(endTurnBtn);

    overlay.appendChild(buildLog(state.combatLog));

    if (state.isResolved) {
        overlay.appendChild(buildResolutionPanel(token, state));
    }

    document.body.appendChild(overlay);
}

// ── HP bar ────────────────────────────────────────────────────────────────────

function buildHpPanel(label, hp, maxHp, block, statuses) {
    const panel = document.createElement('div');
    panel.style.cssText =
        'display:flex; flex-direction:column; align-items:center; gap:0.5vh; width:60vw;';

    const title = document.createElement('span');
    title.style.cssText = 'color:#e8e8e8; font-size:1.8vh;';
    const statusText =
        statuses && statuses.length
            ? ' [' +
              statuses
                  .map((s) => s.type + (s.stacks != null ? ':' + s.stacks : ':' + s.turns + 't'))
                  .join(', ') +
              ']'
            : '';
    title.textContent = label + statusText;
    panel.appendChild(title);

    const barWrap = document.createElement('div');
    barWrap.style.cssText =
        'width:100%; background:#333; height:2.5vh; border-radius:4px; position:relative;';
    const pct = maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100))) : 0;

    const bar = document.createElement('div');
    bar.style.cssText = `width:${pct}%; background:#c0392b; height:100%; border-radius:4px; transition:width 0.3s;`;

    const barLabel = document.createElement('span');
    barLabel.style.cssText =
        'position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);' +
        ' color:#fff; font-size:1.4vh;';
    barLabel.textContent = `${hp} / ${maxHp}${block > 0 ? '  \uD83D\uDEE1\uFE0F' + block : ''}`;

    barWrap.appendChild(bar);
    barWrap.appendChild(barLabel);
    panel.appendChild(barWrap);
    return panel;
}

// ── Equipment panel ───────────────────────────────────────────────────────────

function buildEquipmentPanel(equipment) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:60vw;';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menuButton';
    toggleBtn.style.cssText = 'font-size:1.2vh; padding:0.6vh 1.5vh; margin-bottom:0.5vh;';
    toggleBtn.textContent = 'Equipment Cards ▼';

    const panel = document.createElement('div');
    panel.className = 'combatEquipPanel';
    panel.style.display = 'none';

    const slots = [
        { label: 'Melee', data: equipment && equipment.melee },
        { label: 'Ranged', data: equipment && equipment.ranged },
        { label: 'Helmet', data: equipment && equipment.helmet },
        { label: 'Armor', data: equipment && equipment.armor }
    ];

    slots.forEach(({ label, data }) => {
        if (!data || (!data.name && (!data.cards || data.cards.length === 0))) return;

        const slot = document.createElement('div');
        slot.className = 'combatEquipSlot';

        const slotLabel = document.createElement('span');
        slotLabel.className = 'combatEquipSlotLabel';
        slotLabel.textContent = label;
        slot.appendChild(slotLabel);

        if (data.name) {
            const slotName = document.createElement('span');
            slotName.className = 'combatEquipSlotName';
            slotName.textContent = data.name;
            slot.appendChild(slotName);
        }

        const cardRow = document.createElement('div');
        cardRow.className = 'combatEquipCardRow';
        (data.cards || []).forEach((card) => {
            const cardEl = document.createElement('span');
            cardEl.className = 'combatEquipCard';
            const effects = formatEffects(card.effects);
            cardEl.innerHTML = `<strong>${card.name}</strong> T${card.tier}${effects ? ' · ' + effects : ''}`;
            cardRow.appendChild(cardEl);
        });
        slot.appendChild(cardRow);

        panel.appendChild(slot);
    });

    toggleBtn.addEventListener('click', () => {
        const open = panel.style.display !== 'none';
        panel.style.display = open ? 'none' : 'flex';
        toggleBtn.textContent = open ? 'Equipment Cards ▼' : 'Equipment Cards ▲';
    });

    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(panel);
    return wrapper;
}

// ── Hand ──────────────────────────────────────────────────────────────────────

function buildHand(token, state) {
    const container = document.createElement('div');
    container.style.cssText = 'display:flex; flex-wrap:wrap; gap:1vh; justify-content:center;';

    const canPlay =
        !state.isResolved &&
        state.turnOwner === 'player' &&
        state.cardsPlayedThisTurn < state.maxCardsThisTurn;

    (state.hand || []).forEach((card, idx) => {
        const btn = document.createElement('button');
        btn.className = 'menuButton';
        btn.disabled = !canPlay;
        btn.style.cssText =
            'font-size:1.2vh; padding:1vh; max-width:14vw; word-break:break-word; white-space:pre-wrap;';
        btn.textContent = `${card.name}\n[${card.type}]\n${formatEffects(card.effects)}`;
        btn.addEventListener('click', () => onPlayCard(token, idx));
        container.appendChild(btn);
    });

    return container;
}

function formatEffects(effects) {
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
    return parts.join(' ') || '—';
}

// ── Combat log ────────────────────────────────────────────────────────────────

function buildLog(entries) {
    const box = document.createElement('div');
    box.style.cssText =
        'width:60vw; height:18vh; overflow-y:auto; background:rgba(0,0,0,0.6);' +
        ' border:1px solid #555; padding:1vh; font-size:1.2vh;';
    (entries || [])
        .slice()
        .reverse()
        .forEach((entry) => {
            const line = document.createElement('p');
            line.style.cssText = 'margin:0 0 0.5vh; color:' + logColor(entry.type) + ';';
            line.textContent = entry.message;
            box.appendChild(line);
        });
    return box;
}

function logColor(type) {
    if (type === 'player') return '#7fc8f8';
    if (type === 'enemy') return '#f87171';
    if (type === 'status') return '#fbbf24';
    if (type === 'lifesteal') return '#34d399';
    return '#d1d5db';
}

// ── Resolution panel ──────────────────────────────────────────────────────────

function buildResolutionPanel(token, state) {
    const panel = document.createElement('div');
    panel.style.cssText =
        'display:flex; flex-direction:column; align-items:center; gap:1vh; margin-top:1vh;';

    if (state.isGameOver) {
        const msg = document.createElement('h2');
        msg.style.color = '#ef4444';
        msg.textContent = 'You Died';
        panel.appendChild(msg);

        const homeBtn = document.createElement('button');
        homeBtn.className = 'menuButton';
        homeBtn.textContent = 'Return to Menu';
        homeBtn.addEventListener('click', () => {
            removeCombatOverlay();
            if (typeof exitDungeon === 'function') exitDungeon(true);
        });
        panel.appendChild(homeBtn);
    } else {
        const msg = document.createElement('h2');
        msg.style.color = '#4ade80';
        msg.textContent = 'Victory!';
        panel.appendChild(msg);

        const rewardBtn = document.createElement('button');
        rewardBtn.className = 'menuButton';
        rewardBtn.textContent = 'Collect Reward';
        rewardBtn.addEventListener('click', () => onClaimReward(token, rewardBtn));
        panel.appendChild(rewardBtn);
    }

    return panel;
}

// ── Action handlers ───────────────────────────────────────────────────────────

async function onPlayCard(token, cardIndex) {
    try {
        const data = await postFetch('/api/combat/play-card', { combatToken: token, cardIndex });
        renderCombat(token, data.state);
    } catch (err) {
        console.error('Play card failed:', err.message);
    }
}

async function onEndTurn(token) {
    try {
        const data = await postFetch('/api/combat/end-turn', { combatToken: token });
        renderCombat(token, data.state);
    } catch (err) {
        console.error('End turn failed:', err.message);
    }
}

async function onClaimReward(token, btn) {
    btn.disabled = true;
    try {
        const data = await postFetch('/api/combat/claim-reward', { combatToken: token });
        removeCombatOverlay();
        showRewardPopup(data.reward);
    } catch (err) {
        console.error('Claim reward failed:', err.message);
        btn.disabled = false;
    }
}

// ── Reward popup ──────────────────────────────────────────────────────────────

function showRewardPopup(reward) {
    const popup = document.createElement('div');
    popup.className = 'settingsOverlay';
    popup.style.cssText = 'flex-direction:column; gap:1vh;';

    const title = document.createElement('h2');
    title.style.color = '#fbbf24';
    title.textContent = 'Reward';
    popup.appendChild(title);

    if (reward && reward.item) {
        const itemLine = document.createElement('p');
        itemLine.style.color = '#e8e8e8';
        itemLine.textContent = `Item: ${reward.item.name || 'Unknown item'}`;
        popup.appendChild(itemLine);
    }

    const goldLine = document.createElement('p');
    goldLine.style.color = '#fbbf24';
    goldLine.textContent = `Gold: ${(reward && reward.gold) || 0}`;
    popup.appendChild(goldLine);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'menuButton';
    closeBtn.textContent = 'Continue';
    closeBtn.addEventListener('click', () => popup.remove());
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);
}

function removeCombatOverlay() {
    const existing = document.getElementById(COMBAT_OVERLAY_ID);
    if (existing) existing.remove();
}
