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
                `col-sm-12`,
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
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    //Title
    generateBootStrapGrid(1, 3, 6, 'topRow');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle mainMenu');
    menuTitle.innerHTML = 'HellForge';
    document.querySelector('.topRow').appendChild(menuTitle);

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
    //Leadboard data
    let loggedIn = true; //Simulate logged in for demo purposes
    let leaderboardData = []; // Array to hold leaderboard data

    //Generate test data
    for (let i = 1; i <= 100; i++) {
        leaderboardData.push({ name: `Player${i}`, score: Math.floor(Math.random() * 1000) });
    }

    //Sort data by score
    for (var i = 0; i < leaderboardData.length; i++) {
        // Last i elements are already in place
        for (var j = 0; j < leaderboardData.length - i - 1; j++) {
            // Checking if the item at present iteration
            // is greater than the next iteration
            if (leaderboardData[j].score < leaderboardData[j + 1].score) {
                // If the condition is true
                // then swap them
                let temp = leaderboardData[j];
                leaderboardData[j] = leaderboardData[j + 1];
                leaderboardData[j + 1] = temp;
            }
        }
    }
    //Simulate logged user
    let userIndex = Math.floor(Math.random() * 100);
    let loggedUser = leaderboardData[userIndex];
    if (loggedIn) {
        let top9 = [];
        //Check if logged user is in top 10
        if (userIndex < 10) {
            top9 = leaderboardData.slice(0, 10);
            generatepiles(top9, loggedUser, true, userIndex);
        } else {
            top9 = leaderboardData.slice(0, 9);
            top9.push(loggedUser);
            generatepiles(top9, loggedUser, false, userIndex);
        }
    } else {
        //Not logged in, just show top 10
        generatepiles(leaderboardData.slice(0, 10), null, false, null);
    }
    function generatepiles(top9, loggedUser, top9IncludesLoggedUser, userIndex) {
        console.log(top9);
        //Generate leaderboard entries
        generateBootStrapGrid(top9.length, 1, 12, 'leaderboardRows');
        const leaderboardRows = document.querySelectorAll('.leaderboardRows');
        top9.forEach((entry, i) => {
            //Create entry div
            let entryDiv = document.createElement('div');
            entryDiv.setAttribute('class', 'leaderboardEntry');
            //Check if entry is logged user
            if (loggedIn && entry.name == loggedUser.name) {
                if (top9IncludesLoggedUser) {
                    //Logged user is in top 10
                    entryDiv.innerHTML = `${i + 1}. ${entry.name} - ${entry.score}`;
                    entryDiv.setAttribute('style', 'font-weight: bold; color: yellow;');
                    console.log('in top 10');
                } else {
                    //Logged user is not in top 10
                    entryDiv.innerHTML = `${userIndex}. ${entry.name} - ${entry.score}`;
                    entryDiv.setAttribute('style', 'font-weight: bold; color: yellow;');
                }
            } else {
                //Not logged user or regular entry
                entryDiv.innerHTML = `${i + 1}. ${entry.name} - ${entry.score}`;
                entryDiv.setAttribute('style', 'color: white;');
            }
            //Append entry to row
            leaderboardRows[i].appendChild(entryDiv);
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
