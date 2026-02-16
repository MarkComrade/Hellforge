//Start game
async function StartGame() {
    clearBody();

    //Title
    generateBootStrapGrid(1, 1, 12);
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle startGameMenu');
    menuTitle.style = 'font-size: 12vh;';
    menuTitle.textContent = 'Select dungeon';
    document.querySelector('.col-md-12').appendChild(menuTitle);

    generateBootStrapGrid(1, 4, 3, 'dungeonImagesRow');
    const dungeonOptions = document.querySelectorAll('.dungeonImagesRow');
    const dungeons = ['Laboratory', 'Crypt', 'Labyrinth', 'Gates of Hell'];

    dungeons.forEach((dungeon, i) => {
        let dungeonImg = document.createElement('img');
        dungeonImg.setAttribute(
            'src',
            `../menuImages/${dungeon.toLowerCase().replaceAll(' ', '')}.jpg`
        );
        dungeonImg.setAttribute('class', 'dungeonImage img-fluid');

        dungeonOptions[i].appendChild(dungeonImg);
    });

    generateBootStrapGrid(1, 4, 3, 'dungeonButtonsRow');
    const dungeonButtonsOptions = document.querySelectorAll('.dungeonButtonsRow');

    dungeons.forEach((dungeon, i) => {
        let dungeonButton = document.createElement('input');
        dungeonButton.setAttribute('type', 'button');
        dungeonButton.setAttribute('value', dungeon);
        dungeonButton.setAttribute('class', 'menuButton');

        dungeonButton.addEventListener('click', () => {
            newGame(dungeon);
        });

        dungeonButtonsOptions[i].appendChild(dungeonButton);
    });

    generateBootStrapGrid(1, 2, 6, 'menuButtonsRow');

    const menuButtons = document.querySelector('.menuButtonsRow');
    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Menu');
    backButton.setAttribute('class', 'menuButton');
    backButton.addEventListener('click', Menu);

    let homeButton = document.createElement('input');
    homeButton.setAttribute('type', 'button');
    homeButton.setAttribute('value', 'Home');
    homeButton.setAttribute('class', 'menuButton');

    backButton.addEventListener('click', () => {
        Menu();
    });
    homeButton.addEventListener('click', () => {
        Home();
    });

    menuButtons.appendChild(backButton);
    menuButtons.nextSibling.appendChild(homeButton);
}
