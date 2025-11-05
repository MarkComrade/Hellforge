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
window.addEventListener('resize', checkOrientation);

//Tool to generate bootstrap grid
function generateBootStrapGrid(row, col, col_md_value, id) {
    let body = document.getElementsByTagName('body');
    let contDiv = document.createElement('div');
    contDiv.setAttribute('class', 'container-fluid');

    for (let i = 0; i < row; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'row');
        contDiv.appendChild(rowDiv);

        for (let j = 0; j < col; j++) {
            let colDiv = document.createElement('div');
            colDiv.setAttribute(
                'class',
                `col-sm-12 col-md-${col_md_value} d-flex justify-content-center`
            );
            if (id) {
                colDiv.setAttribute('id', id);
            }
            rowDiv.appendChild(colDiv);
        }
    }

    body[0].appendChild(contDiv);
}

function generateBackToMenu() {
    generateBootStrapGrid(1, 1, 12, 'backToMenu');

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Menu');
    backButton.setAttribute('class', 'menuButton');

    backButton.addEventListener('click', Menu);

    let backToMenu = document.getElementById('backToMenu');
    backToMenu.appendChild(backButton);
}

//Menu generation
function Menu() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    //Title
    generateBootStrapGrid(1, 2, 6, 'topRow');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle mainMenu');
    menuTitle.innerHTML = 'HellForge';
    document.getElementById('topRow').appendChild(menuTitle);

    let loggedUser = document.createElement('p');
    loggedUser.setAttribute('class', 'menuTitle menuText');
    if (isLoggedIn == true) {
        loggedUser.innerHTML = `Logged in as: ${userName}`;
    } else if (isLoggedIn == false && userName == '') {
        loggedUser.innerHTML = 'Not logged in';
    } else if (isLoggedIn == false && userName == 'Guest') {
        loggedUser.innerHTML = 'Logged in as: Guest';
    }
    document.getElementById('topRow').nextSibling.appendChild(loggedUser);

    //Buttons
    const buttons = [
        { text: 'Login', onClick: Login },
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
            if (text != 'Login') {
                let button = document.createElement('input');
                button.setAttribute('type', 'button');
                button.setAttribute('value', text);
                button.setAttribute('class', 'menuButton');
                button.setAttribute('style', 'margin-top:5vh;');
                button.addEventListener('click', onClick);
                columns[index].appendChild(button);
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
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    generateBootStrapGrid(1, 1, 12, 'loginMenu');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.innerHTML = 'Login';
    document.getElementById('loginMenu').appendChild(menuTitle);

    generateBootStrapGrid(3, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('#loginFormContainer');

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
            'col-sm-12 col-md-6 d-flex justify-content-end align-items-center'
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
            'col-sm-12 col-md-6 d-flex justify-content-start align-items-center'
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
    document.getElementById('loginButtonRow').appendChild(loginButton);
    loginButton.addEventListener('click', function () {
        let username = document.getElementById('usernameInput').value;
        let password = document.getElementById('passwordInput').value;
        let passwordConfirmation = document.getElementById('passwordConfirmationInput').value;

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
    document.getElementById('loginButtonRow').nextSibling.appendChild(guestButton);
    guestButton.addEventListener('click', function () {
        isLoggedIn = false;
        userName = 'Guest';
        Menu();
    });

    generateBackToMenu();
}

//Start game
function StartGame() {
    newGame();

    generateBackToMenu();
}

//Load game
function LeaderBoard() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    //Title
    generateBootStrapGrid(1, 1, 12);
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle leaderBoardMenu');
    menuTitle.innerHTML = 'Leaderboard';
    document.querySelector('.col-md-12').appendChild(menuTitle);

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
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    // Music controls
    generateBootStrapGrid(1, 1, 12, 'optionsTitle');
    let optionsTitle = document.createElement('h1');
    optionsTitle.setAttribute('class', 'menuTitle optionsMenu');
    optionsTitle.innerHTML = 'Options';

    document.querySelector('.col-md-12').appendChild(optionsTitle);

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
        body[0].innerHTML = '';

        let warning = document.createElement('div');
        warning.setAttribute('class', 'orientationWarning');
        warning.innerHTML =
            'Please rotate your device to landscape mode or make the window fullscreen to continue.';
        warning.style.position = 'absolute';
        warning.style.top = '50%';
        warning.style.left = '50%';
        warning.style.transform = 'translate(-50%, -50%)';

        body[0].appendChild(warning);
        return false;
    } else {
        const mainMenu = document.querySelector('.mainMenu');
        const optionsMenu = document.querySelector('.optionsMenu');
        const loginMenu = document.querySelector('.loginMenu');

        if (mainMenu) {
            Menu();
        } else if (optionsMenu) {
            Options();
        } else if (loginMenu) {
            Login();
        } else {
            Menu();
        }
    }

    return true;
}

//Play music
function playMenuMusic() {
    if (!audio) {
        audio = new Audio('music/track1.mp3');
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
