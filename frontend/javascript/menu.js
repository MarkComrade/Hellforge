document.addEventListener('DOMContentLoaded', function () {
    checkOrientation();

    //Start music
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });
});

isLoggedIn = false;
userName = '';
userPassword = '';
let audio;

// Global flags for in-game orientation handling
window.isInGame = false;
window.isGamePaused = false;
window.addEventListener('resize', checkOrientation);

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

//Menu generation
function Menu() {
    loadScreen('menu');
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';
    body[0].style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
    body[0].style.backgroundSize = 'cover';

    //Title
    generateBootStrapGrid(1, 2, 8, 'topRow');
    const topRow = document.querySelectorAll('.topRow');
    topRow[1].setAttribute('class', 'col-sm-4 col-md-4 d-flex justify-content-center topRow');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle mainMenu');
    menuTitle.innerHTML = 'HellForge';
    let hellForgeLogo = document.createElement('img');
    hellForgeLogo.setAttribute('src', '../menuImages/hellforgeicon.png');
    hellForgeLogo.setAttribute('class', 'hellForgeLogo');
    document.querySelector('.topRow').appendChild(menuTitle);
    document.querySelector('.topRow').appendChild(hellForgeLogo);

    let loggedUser = document.createElement('p');
    loggedUser.setAttribute('class', 'menuText');
    if (isLoggedIn == true) {
        loggedUser.innerHTML = `Logged in as: ${userName}`;
    } else if (isLoggedIn == false && userName == '') {
        loggedUser.innerHTML = 'Not logged in';
    } else if (isLoggedIn == false && userName == 'Guest') {
        loggedUser.innerHTML = 'Logged in as: Guest';
    }
    document.querySelector('.topRow').nextSibling.appendChild(loggedUser);

    //Buttons
    const buttons = [
        { text: 'Login', onClick: Login },
        { text: 'Logout', onClick: Logout },
        { text: 'New Game', onClick: StartGame },
        { text: 'Leaderboard', onClick: LeaderBoard },
        { text: 'Admin', onClick: Admin },
        { text: 'Options', onClick: Options }
    ];

    generateBootStrapGrid(buttons.length, 1, 12, 'menuButtons');

    const columns = document.querySelectorAll('.container-fluid:last-child .col-md-12');

    // Add buttons
    buttons.forEach(({ text, onClick }, index) => {
        if (isLoggedIn == true || (isLoggedIn == false && userName == 'Guest')) {
            if (text != 'Login' && text != 'Logout') {
                let button = document.createElement('input');
                button.setAttribute('type', 'button');
                button.setAttribute('value', text);
                button.setAttribute('class', 'menuButton');
                button.setAttribute('style', 'margin-top:5vh;');
                button.addEventListener('click', onClick);
                columns[index].appendChild(button);
            } else if (text == 'Logout') {
                let button = document.createElement('input');
                button.setAttribute('type', 'button');
                button.setAttribute('value', text);
                button.setAttribute('class', 'logOutButton');
                button.addEventListener('click', onClick);
                document.querySelectorAll('.topRow')[1].appendChild(button);
            }
        } else {
            if (text == 'Login') {
                let button = document.createElement('input');
                button.setAttribute('type', 'button');
                button.setAttribute('value', text);
                button.setAttribute('class', 'menuButton');
                button.setAttribute('style', 'margin-top:15vh; font-size:10vh;');
                button.addEventListener('click', onClick);
                columns[index].appendChild(button);
            }
        }
    });
}

//Login menu
function Login() {
    loadScreen('login');
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    generateBootStrapGrid(1, 1, 12, 'loginMenu');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.innerHTML = 'Login';
    document.querySelector('.loginMenu').appendChild(menuTitle);

    generateBootStrapGrid(3, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('.loginFormContainer');

    const forms = [
        { label: 'Username:', type: 'text', id: 'usernameInput' },
        { label: 'Password:', type: 'password', id: 'passwordInput' },
        { label: 'Password again:', type: 'password', id: 'passwordConfirmationInput' }
    ];

    forms.forEach((form, i) => {
        const row = document.createElement('div');
        row.setAttribute('class', 'row');
        loginRows[i].appendChild(row);

        const labelCol = document.createElement('div');
        labelCol.setAttribute(
            'class',
            'col-sm-6 col-md-6 d-flex justify-content-end align-items-center'
        );
        const label = document.createElement('label');
        label.setAttribute('class', 'menuText');
        label.innerHTML = form.label;
        label.setAttribute('for', form.id);
        labelCol.appendChild(label);
        row.appendChild(labelCol);

        const inputCol = document.createElement('div');
        inputCol.setAttribute(
            'class',
            'col-sm-6 col-md-6 d-flex justify-content-start align-items-center'
        );
        const input = document.createElement('input');
        input.setAttribute('class', 'menuInput');
        input.setAttribute('type', form.type);
        input.setAttribute('id', form.id);
        inputCol.appendChild(input);
        row.appendChild(inputCol);
    });

    generateBootStrapGrid(1, 2, 6, 'loginButtonRow');
    let loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'button');
    loginButton.setAttribute('value', 'Login / Register');
    loginButton.setAttribute('class', 'menuButton');
    document.querySelector('.loginButtonRow').appendChild(loginButton);
    loginButton.addEventListener('click', function () {
        let username = document.querySelector('#usernameInput').value;
        let password = document.querySelector('#passwordInput').value;
        let passwordConfirmation = document.querySelector('#passwordConfirmationInput').value;

        if (username && password && password === passwordConfirmation) {
            userName = username;
            userPassword = password;
            isLoggedIn = true;
            Menu();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    let guestButton = document.createElement('input');
    guestButton.setAttribute('type', 'button');
    guestButton.setAttribute('value', 'Continue as Guest');
    guestButton.setAttribute('class', 'menuButton');
    document.querySelector('.loginButtonRow').nextSibling.appendChild(guestButton);
    guestButton.addEventListener('click', function () {
        isLoggedIn = false;
        userName = 'Guest';
        Menu();
    });

    generateBackToMenu();
}

function Logout() {
    if (isLoggedIn == true || (isLoggedIn == false && userName == 'Guest')) {
        isLoggedIn = false;
        userName = '';
        userPassword = '';
        Menu();
    }
}

//Start game
function StartGame() {
    loadScreen('menu');
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    //Title
    generateBootStrapGrid(1, 1, 12);
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle startGameMenu');
    menuTitle.style = 'font-size: 12vh;';
    menuTitle.innerHTML = 'Select dungeon';
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

function Home() {
    loadScreen('character');
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    document.body.style.backgroundImage = "url('../menuImages/home.jpg')";

    //TODO: Home screen content

    let gearLevel = 10; //placeholder values
    let gold = 250;

    generateBootStrapGrid(1, 1, 12, 'homeMenuRow');
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle homeMenu');
    menuTitle.style = 'font-size: 8vh;';
    menuTitle.innerHTML = 'Home';
    document.querySelector('.homeMenuRow').appendChild(menuTitle);

    generateBootStrapGrid(1, 2, 6, 'homeUI');

    let homeUI = document.querySelectorAll('.homeUI');
    homeUI[0].setAttribute(
        'class',
        'characterInfoDiv col-sm-3 col-md-3 d-flex flex-column align-items-center'
    );

    let userNameText = document.createElement('h2');
    userNameText.innerHTML = 'User:' + userName;
    userNameText.setAttribute('class', 'menuText');
    homeUI[0].appendChild(userNameText);

    let userImg = document.createElement('img');
    userImg.setAttribute('src', '../textures/misc/defaultportrait.png');
    userImg.setAttribute('class', 'characterImage img-fluid');
    homeUI[0].appendChild(userImg);

    //? Custom user image upload

    let characterInfo = document.createElement('h3');
    characterInfo.setAttribute('class', 'menuText');
    characterInfo.innerHTML = 'Character Level:' + gearLevel;
    homeUI[0].appendChild(characterInfo);

    //! Character level = overall gear level

    let goldAmount = document.createElement('h3');
    goldAmount.setAttribute('class', 'menuText');
    goldAmount.innerHTML = 'Gold:' + gold;
    homeUI[0].appendChild(goldAmount);

    let equipmentTitle = document.createElement('h2');
    equipmentTitle.setAttribute('class', 'menuText');
    equipmentTitle.innerHTML = 'Equipped gear:';
    homeUI[0].appendChild(equipmentTitle);

    let characterInfoDiv = document.querySelectorAll('.characterInfoDiv');

    let armourRow = document.createElement('div');
    armourRow.setAttribute('class', 'characterArmourRow');

    let weaponsRow = document.createElement('div');
    weaponsRow.setAttribute('class', 'characterWeaponsRow');

    const equipmentSlots = [
        { slot: 'Helmet', img: '../textures/items/armour/helmet_rusty.png', type: 'armour' },
        { slot: 'Armor', img: '../textures/items/armour/armour_rusty.png', type: 'armour' },
        { slot: 'Melee', img: '../textures/items/weapons/sword_rusty.png', type: 'weapon' },
        { slot: 'Ranged', img: '../textures/items/weapons/bow_rusty.png', type: 'weapon' }
    ];

    equipmentSlots.forEach(({ slot, img, type }) => {
        let slotDiv = document.createElement('div');
        slotDiv.setAttribute(
            'class',
            'equipmentSlot col-sm-6 col-md-6 d-flex flex-column align-items-center'
        );
        let slotImg = document.createElement('img');
        slotImg.setAttribute('src', img);
        slotImg.setAttribute('class', 'itemImage img-fluid');
        slotDiv.appendChild(slotImg);
        if (type === 'armour') {
            armourRow.appendChild(slotDiv);
        } else {
            weaponsRow.appendChild(slotDiv);
        }
    });

    characterInfoDiv[0].appendChild(armourRow);
    characterInfoDiv[0].appendChild(weaponsRow);

    homeUI[1].setAttribute(
        'class',
        'characterStashDiv col-sm-7 col-md-7 d-flex flex-column align-items-center'
    );

    equipmentSlots.forEach(({ slot, img }) => {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'equipmentRow');

        let leftBox = document.createElement('div');
        leftBox.setAttribute('class', 'equipmentLeft');

        let slotImg = document.createElement('img');
        slotImg.setAttribute('src', img);
        slotImg.setAttribute('class', 'itemImage');
        leftBox.appendChild(slotImg);

        let rightBox = document.createElement('div');
        rightBox.setAttribute('class', 'equipmentRight');

        rowDiv.appendChild(leftBox);
        rowDiv.appendChild(rightBox);
        homeUI[1].appendChild(rowDiv);
    });

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Dungeon Selection');
    backButton.setAttribute('class', 'menuButton');
    backButton.addEventListener('click', () => {
        document.body.style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
        StartGame();
    });

    generateBootStrapGrid(1, 1, 12, 'backToDungeonSelectRow');
    let backToDungeonSelectRow = document.querySelector('.backToDungeonSelectRow');
    backToDungeonSelectRow.appendChild(backButton);
}

function LeaderBoard() {
    loadScreen('leaderboard');
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    // Title
    generateBootStrapGrid(1, 1, 12);
    let leaderBoardTitle = document.createElement('div');
    leaderBoardTitle.setAttribute('class', 'menuTitle leaderMenu');
    leaderBoardTitle.innerHTML = 'LeaderBoard';
    document.querySelector('.col-md-12').appendChild(leaderBoardTitle);

    // Tesztadat generálás
    let loggedIn = true;
    let leaderboardData = [];
    for (let i = 1; i <= 20; i++) {
        leaderboardData.push({ name: `Player${i}`, score: Math.floor(Math.random() * 1000) });
    }

    // Rendezés (bubble sort)
    for (let i = 0; i < leaderboardData.length; i++) {
        for (let j = 0; j < leaderboardData.length - i - 1; j++) {
            if (leaderboardData[j].score < leaderboardData[j + 1].score) {
                let temp = leaderboardData[j];
                leaderboardData[j] = leaderboardData[j + 1];
                leaderboardData[j + 1] = temp;
            }
        }
    }

    // Simulált bejelentkezett user
    let userIndex = Math.floor(Math.random() * 20);
    let loggedUser = leaderboardData[userIndex];

    if (loggedIn) {
        let top9 = [];
        if (userIndex < 10) {
            top9 = leaderboardData.slice(0, 10);
            generatepiles(top9, loggedUser, true, userIndex);
        } else {
            top9 = leaderboardData.slice(0, 9);
            top9.push(loggedUser);
            generatepiles(top9, loggedUser, false, userIndex);
        }
    } else {
        generatepiles(leaderboardData.slice(0, 10), null, false, null);
    }

    // Érmehalmok generálása
    function generatepiles(top9, loggedUser) {
        const row = document.createElement('div');
        row.className = 'row justify-content-center';

        const container = document.createElement('div');
        container.className = 'leadboardContainer container-fluid';

        const maxScore = top9[0].score;
        const maxCoins = 150;

        top9.forEach((entry) => {
            // játékos "kártya"
            let entryDiv = document.createElement('div');
            entryDiv.className = 'playerCard text-center p-3 rounded col-sm-1 ';

            // név
            const nameDiv = document.createElement('div');
            nameDiv.className = 'playerName fw-bold  mt-1';
            nameDiv.innerText = entry.name;

            // pont
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'playerScore text-light';
            scoreDiv.innerText = `${entry.score}p`;

            // érme halom
            let coinStackRow = document.createElement('div');
            coinStackRow.className = 'coinStackRow d-flex flex-direction-row';
            const coinStack1 = document.createElement('div');
            coinStack1.className =
                'coinStack d-flex flex-column align-items-center justify-content-end position-relative';
            const coinStack2 = document.createElement('div');
            coinStack2.className =
                'coinStack d-flex flex-column align-items-center justify-content-end position-relative';
            const coinStack3 = document.createElement('div');
            coinStack3.className =
                'coinStack d-flex flex-column align-items-center justify-content-end position-relative';
            let coinStackPosition1 = 0;
            let coinStackPosition2 = 0;
            let coinStackPosition3 = 0;
            if (entry.score == 0) {
                const noCoinDiv = document.createElement('div');
                noCoinDiv.className = 'noCoins text-light small';
                noCoinDiv.innerText = 'No coins';
                coinStack2.appendChild(noCoinDiv);
            } else {
                const coinCount = Math.max(1, Math.round((entry.score / maxScore) * maxCoins));
                for (let c = 0; c < coinCount; c++) {
                    const whichStack = Math.floor(Math.random() * 7) + 1;

                    const coin = document.createElement('img');
                    coin.className = 'coin';
                    coin.src = '../textures/items/coing.png';

                    switch (whichStack) {
                        case 1:
                        case 2:
                            coin.style.bottom = `${coinStackPosition1 * 0.38}vh`;
                            coinStack1.appendChild(coin);
                            coinStackPosition1++;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            coin.style.bottom = `${coinStackPosition2 * 0.38}vh`;
                            coinStack2.appendChild(coin);
                            coinStackPosition2++;
                            break;
                        case 5:
                        case 6:
                            coin.style.bottom = `${coinStackPosition3 * 0.38}vh`;
                            coinStack3.appendChild(coin);
                            coinStackPosition3++;
                            break;
                    }

                    // animáció időzítése
                    setTimeout(() => {
                        coin.classList.add('coinVisible');
                    }, c * 80);
                }
            }

            // kiemelés, ha a bejelentkezett userről van szó
            if (loggedIn && entry.name === loggedUser.name) {
                nameDiv.classList.add('highlightedPlayer');
            }
            coinStackRow.appendChild(coinStack1);
            coinStackRow.appendChild(coinStack2);
            coinStackRow.appendChild(coinStack3);
            entryDiv.appendChild(coinStackRow);
            entryDiv.appendChild(nameDiv);
            entryDiv.appendChild(scoreDiv);
            row.appendChild(entryDiv);
            container.appendChild(row);

            document.body.appendChild(container);
        });
    }

    generateBackToMenu();
}

//Admin menu
function Admin() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    //Title
    generateBootStrapGrid(1, 1, 12);
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle adminMenu');
    menuTitle.innerHTML = 'Admin Login';
    document.querySelector('.col-md-12').appendChild(menuTitle);

    generateBackToMenu();
}

//Options menu
function Options() {
    loadScreen('settings');
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    // Music controls
    generateBootStrapGrid(1, 1, 12, 'optionsTitle');
    let optionsTitle = document.createElement('h1');
    optionsTitle.setAttribute('class', 'menuTitle optionsMenu');
    optionsTitle.innerHTML = 'Options';

    document.querySelector('.optionsTitle').appendChild(optionsTitle);

    generateBootStrapGrid(1, 3, 4, 'musicControls');

    const volumeLabel = Object.assign(document.createElement('label'), {
        htmlFor: 'volume',
        innerHTML: 'Music controls:',
        className: 'menuText'
    });

    const volume = Object.assign(document.createElement('input'), {
        type: 'range',
        id: 'volume',
        min: '0',
        max: '100',
        value: '10',
        className: 'volumeSlider'
    });

    volume.addEventListener('input', (e) => {
        if (audio) audio.volume = e.target.value / 100;
    });

    const disableMusic = Object.assign(document.createElement('input'), {
        type: 'button',
        value: 'Disable Music',
        id: 'disableMusic',
        className: 'menuButton'
    });

    disableMusic.addEventListener('click', () => {
        disableMusic.value =
            disableMusic.value === 'Disable Music' ? 'Enable Music' : 'Disable Music';
        disableMusic.value === 'Enable Music' ? stopAudio() : playMenuMusic();
    });

    document.querySelectorAll('.col-md-4')[0].appendChild(volumeLabel);
    document.querySelectorAll('.col-md-4')[1].appendChild(volume);
    document.querySelectorAll('.col-md-4')[2].appendChild(disableMusic);

    generateBackToMenu();
}

//Check the display size
function checkOrientation() {
    const body = document.getElementsByTagName('body');

    if (!window.matchMedia('(orientation: landscape)').matches) {
        // In-game orientation handling
        if (window.isInGame) {
            window.isGamePaused = true;
            if (!document.querySelector('.orientationWarning')) {
                let warning = document.createElement('div');
                warning.setAttribute('class', 'orientationWarning');
                warning.innerHTML =
                    'Please rotate your device to landscape mode or make the window fullscreen to continue.';
                warning.style.position = 'fixed';
                warning.style.inset = '0';
                warning.style.transform = 'none';
                warning.style.backgroundColor = 'rgba(0, 0, 0, 1)';
                body[0].appendChild(warning);
            }
            let inventoryOverlay = document.querySelector('.inventoryOverlay');
            if (inventoryOverlay) {
                inventoryOverlay.remove();
            }
            return false;
        } else {
            body[0].innerHTML = '';
            let warning = document.createElement('div');
            warning.setAttribute('class', 'orientationWarning');
            warning.innerHTML =
                'Please rotate your device to landscape mode or make the window fullscreen to continue.';
            warning.style.position = 'fixed';
            warning.style.inset = '0';
            warning.style.transform = 'none';
            body[0].appendChild(warning);
            return false;
        }
    } else {
        if (window.isInGame && window.isGamePaused) {
            window.isGamePaused = false;
            const warning = document.querySelector('.orientationWarning');
            if (warning) {
                warning.remove();
            }
        }
        const mainMenu = document.querySelector('.mainMenu');
        const optionsMenu = document.querySelector('.optionsMenu');
        const loginMenu = document.querySelector('.loginMenu');
        const leaderMenu = document.querySelector('.leaderMenu');
        const adminMenu = document.querySelector('.adminMenu');
        const startGameMenu = document.querySelector('.startGameMenu');
        const homeMenu = document.querySelector('.homeMenu');

        if (isInGame == false) {
            body[0].style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
            if (mainMenu) {
                Menu();
            } else if (optionsMenu) {
                Options();
            } else if (loginMenu) {
                Login();
            } else if (leaderMenu) {
                LeaderBoard();
            } else if (adminMenu) {
                Admin();
            } else if (startGameMenu) {
                StartGame();
            } else if (homeMenu) {
                Home();
            } else {
                Menu();
            }
        }
    }

    return true;
}

function exitDungeon(abandoned) {
    loadScreen('menu');
    isInGame = false;
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';
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
        exitMessage.innerHTML = 'You have escaped the dungeon, but at what cost?';
        //Implement punishment for abandoning the dungeon prematurely (e.g. lose gold, lose character level, etc.)
    } else {
        exitMessage.innerHTML = 'You have escaped the dungeon';
    }

    exitDungeonDiv.appendChild(exitMessage);

    let statistics = document.createElement('p');
    statistics.setAttribute('class', 'menuText');
    statistics.style.marginTop = '5vh';
    statistics.innerHTML = 'Statistics:';
    exitDungeonDiv.appendChild(statistics);

    generateBackToMenu();
    let backToMenu = document.querySelector('.backToMenu');
    backToMenu.setAttribute('value', 'Continue');
}

//Play music
function playMenuMusic() {
    if (!audio) {
        audio = new Audio('../music/track1.mp3');
        audio.loop = true;
        audio.volume = 0.0;

        audio.play();
    } else if (audio.paused) {
        audio.play();
    }
}

//Stop music
function stopAudio() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

//Ingame menu handling

function openInventory() {
    loadScreen('inventory');
    let body = document.getElementsByTagName('body')[0];

    const playerInventory = document.createElement('div');
    playerInventory.setAttribute('class', 'playerInventory');

    const inventoryOverlay = document.createElement('div');
    inventoryOverlay.setAttribute('class', 'inventoryOverlay');

    for (let i = 0; i < 2; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'inventoryRow');
        inventoryOverlay.appendChild(row);
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('class', 'inventoryCell');
            row.appendChild(cell);
        }
    }

    let closeButton = document.createElement('input');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('value', 'Close Inventory');
    closeButton.setAttribute('class', 'menuButton');
    closeButton.addEventListener('click', () => {
        loadScreen('dungeon');
        inventoryOverlay.remove();
    });

    inventoryOverlay.appendChild(closeButton);
    body.appendChild(inventoryOverlay);
}

function openSettings() {
    loadScreen('settings');
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
        loadScreen('dungeon');
        settingsOverlay.remove();
    });

    settingsOverlay.appendChild(volumeLabel);
    settingsOverlay.appendChild(volumeSlider);
    settingsOverlay.appendChild(closeButton);
    body.appendChild(settingsOverlay);
}

function abandonDungeon() {
    if (confirm('Are you sure you want to abandon the dungeon? Your progress will not be saved.')) {
        let abandoned = true;
        exitDungeon(abandoned);
    }
}
