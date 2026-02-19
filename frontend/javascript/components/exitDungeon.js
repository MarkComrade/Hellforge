function exitDungeon(abandoned) {
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

    if (abandoned === true) {
        exitMessage.textContent = 'You have escaped the dungeon, but at what cost?';
        //Implement punishment for abandoning the dungeon prematurely (e.g. lose gold, lose character level, etc.)
    } else {
        exitMessage.textContent = 'You have escaped the dungeon';
    }

    exitDungeonDiv.appendChild(exitMessage);

    let statistics = document.createElement('p');
    statistics.setAttribute('class', 'menuText');
    statistics.style.marginTop = '5vh';
    statistics.textContent = 'Statistics:';
    exitDungeonDiv.appendChild(statistics);

    generateBackToMenu();
    let backToMenu = document.querySelector('.backToMenu');
    backToMenu.setAttribute('value', 'Continue');
}
