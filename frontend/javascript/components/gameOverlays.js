function openSettings() {
    if (document.getElementById('combat-scene')) return;
    let body = document.getElementsByTagName('body')[0];
    const settingsOverlay = document.createElement('div');
    settingsOverlay.setAttribute('class', 'settingsOverlay');

    const volumeLabel = Object.assign(document.createElement('label'), {
        htmlFor: 'settingsVolume',
        innerHTML: 'Music volume:',
        className: 'menuText'
    });

    const volumeSlider = Object.assign(document.createElement('input'), {
        type: 'range',
        id: 'settingsVolume',
        min: '0',
        max: '100',
        value: audio ? Math.round(audio.volume * 100).toString() : '10',
        className: 'volumeSlider'
    });

    volumeSlider.addEventListener('input', (e) => {
        if (audio) audio.volume = e.target.value / 100;
    });

    const closeButton = Object.assign(document.createElement('input'), {
        type: 'button',
        value: 'Close Settings',
        className: 'menuButton'
    });

    closeButton.addEventListener('click', () => {
        settingsOverlay.remove();
    });

    settingsOverlay.appendChild(volumeLabel);
    settingsOverlay.appendChild(volumeSlider);
    settingsOverlay.appendChild(closeButton);
    body.appendChild(settingsOverlay);
}

// Abandon the dungeon — notifies the server to clear dungeon session, then shows exit screen
async function abandonDungeon() {
    if (document.getElementById('combat-scene')) return;
    showAbandonConfirm(async () => {
        let stats = null;
        let penalty = null;
        try {
            const result = await postFetch('/api/dungeon/abandon', {
                sessionToken: sessionStorage.getItem('dungeonSessionToken')
            });
            if (result) {
                stats = result.stats || null;
                penalty = result.penalty || null;
            }
        } catch (error) {
            toast('Failed to abandon dungeon', 'error');
            console.error('Abandon failed:', error.message);
        }
        exitDungeon('abandoned', stats, penalty);
    });
}

function showAbandonConfirm(onConfirm) {
    const backdrop = document.createElement('div');
    backdrop.className = 'abandonBackdrop';

    const popup = document.createElement('div');
    popup.className = 'eventDialoguePopup';

    const header = document.createElement('div');
    header.className = 'eventDialogueHeader';

    const title = document.createElement('h3');
    title.className = 'eventDialogueTitle';
    title.textContent = 'Abandon Dungeon';

    const badge = document.createElement('span');
    badge.className = 'eventDialogueBadge';
    badge.textContent = 'WARNING';

    const confirmed = await areYouSure(
        'You are about to flee this accursed place. Your current run will be lost and you will leave empty-handed. Are you certain?',
        'Abandon Dungeon',
        'Stay and Fight',
        'Flee'
    );

    if (!confirmed) return;

    try {
        await postFetch('/api/dungeon/abandon', {
            sessionToken: sessionStorage.getItem('dungeonSessionToken')
        });
    } catch (error) {
        toast('Failed to abandon dungeon', 'error');
        console.error('Abandon failed:', error.message);
    }
    exitDungeon(true);
}
function areYouSure(dialogue, title, refuse, approve) {
    return new Promise((resolve) => {
        const backdrop = document.createElement('div');
        backdrop.className = 'abandonBackdrop';

        const popup = document.createElement('div');
        popup.className = 'eventDialoguePopup';

        const header = document.createElement('div');
        header.className = 'eventDialogueHeader';

        const titleElement = document.createElement('h3');
        titleElement.className = 'eventDialogueTitle';
        titleElement.textContent = title;

        const badge = document.createElement('span');
        badge.className = 'eventDialogueBadge';
        badge.textContent = 'WARNING';

        header.appendChild(titleElement);
        header.appendChild(badge);

        const body = document.createElement('p');
        body.className = 'eventDialogueBody';
        body.textContent = dialogue;

        const footer = document.createElement('div');
        footer.className = 'eventDialogueFooter';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'eventDialogueButton';
        cancelBtn.textContent = refuse;
        cancelBtn.addEventListener('click', () => {
            backdrop.remove();
            resolve(false);
        });

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'eventDialogueButton primary abandonConfirmBtn';
        confirmBtn.textContent = approve;
        confirmBtn.addEventListener('click', () => {
            backdrop.remove();
            resolve(true);
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
        popup.appendChild(header);
        popup.appendChild(body);
        popup.appendChild(footer);
        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);
    }); // end Promise
}
