function exitDungeon(outcome, stats, penaltyInfo) {
    isInGame = false;
    let body = document.getElementsByTagName('body');
    clearBody();
    body[0].style.backgroundImage = "url('../menuImages/exitdungeon.png')";
    body[0].style.backgroundSize = 'cover';

    generateBootStrapGrid(1, 1, 12, 'exitDungeonMenu');
    let row = document.querySelector('.exitDungeonMenu');
    row.parentElement.style.justifyContent = 'center';
    let exitDungeonDiv = document.createElement('div');
    exitDungeonDiv.setAttribute('class', 'exitDungeonDiv');
    row.appendChild(exitDungeonDiv);

    let exitMessage = document.createElement('h2');
    exitMessage.setAttribute('class', 'menuText');
    exitMessage.style.marginTop = '5vh';
    exitMessage.style.textAlign = 'center';

    if (outcome === 'defeated') {
        exitMessage.textContent =
            'You have been slain. Your loadout has been stripped and your gear reset.';
    } else if (outcome === 'abandoned') {
        exitMessage.textContent = 'You have fled the dungeon — but cowardice has a price.';
    } else {
        exitMessage.textContent = 'You have escaped the dungeon';
    }

    exitDungeonDiv.appendChild(exitMessage);

    if (outcome === 'abandoned' && penaltyInfo) {
        const penaltyElement = document.createElement('p');
        penaltyElement.setAttribute('class', 'menuText');
        penaltyElement.style.marginTop = '1vh';
        penaltyElement.style.color = '#e05050';
        const parts = [];
        if (penaltyInfo.lostGold > 0) parts.push(`Lost ${penaltyInfo.lostGold} gold`);
        if (penaltyInfo.lostItems && penaltyInfo.lostItems.length > 0) {
            parts.push(`Lost ${penaltyInfo.lostItems.length} item(s) from your loadout`);
        }
        if (penaltyInfo.cardCursed) parts.push('A random card was cursed');
        penaltyElement.textContent =
            parts.length > 0 ? parts.join(' · ') : 'No items or gold to lose.';
        exitDungeonDiv.appendChild(penaltyElement);
    }

    let statistics = document.createElement('p');
    statistics.setAttribute('class', 'menuText');
    statistics.style.marginTop = '3vh';

    if (stats) {
        const lines = [
            `Enemies killed: ${stats.enemiesKilled ?? 0}`,
            `Floors cleared: ${stats.floorsCleared ?? 0}`,
            `Gold collected: ${stats.goldCollected ?? 0}`
        ];
        statistics.innerHTML = 'Run Statistics:<br>' + lines.join('<br>');
    } else {
        statistics.textContent = 'Statistics: —';
    }

    exitDungeonDiv.appendChild(statistics);

    generateBackToMenu();
    let backToMenu = document.querySelector('.backToMenu');
    backToMenu.setAttribute('value', 'Continue');
}
