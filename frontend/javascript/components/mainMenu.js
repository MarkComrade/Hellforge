//Menu generation
function Menu() {
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
