async function Menu() {
    let isAdmin = false;
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        isLoggedIn = session.isLoggedIn;
        isAdmin = Boolean(session.isAdmin);
        if (isLoggedIn && session.userName) {
            userName = session.userName;
        } else if (isLoggedIn && session.isAdmin) {
            userName = 'Admin';
        } else if (!isLoggedIn) {
            userName = 'Guest';
        }
    } catch (error) {
        console.error('Session check hiba:', error);
    }

    let body = document.getElementsByTagName('body');
    clearBody();
    body[0].style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
    body[0].style.backgroundSize = 'cover';

    generateBootStrapGrid(1, 2, 8, 'topRow');
    const topRow = document.querySelectorAll('.topRow');
    topRow[1].setAttribute(
        'class',
        'col-sm-4 col-md-4 d-flex justify-content-center align-items-center topRow'
    );
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle mainMenu');
    menuTitle.textContent = 'HellForge';
    document.querySelector('.topRow').appendChild(menuTitle);

    let userNameDisplay = document.createElement('span');
    userNameDisplay.setAttribute('class', 'menuText');
    userNameDisplay.setAttribute('style', 'margin-right: 1vw;');
    userNameDisplay.textContent = userName;
    topRow[1].appendChild(userNameDisplay);

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

    buttons.forEach(({ text, onClick }, index) => {
        if (text == 'Login' && isLoggedIn) return;
        if (text == 'Logout' && !isLoggedIn) return;
        if (text == 'Admin' && isLoggedIn && !isAdmin) return;

        if (text != 'Login' && text != 'Logout') {
            let button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', text);
            button.setAttribute('class', 'menuButton');
            button.setAttribute('style', 'margin-top:5vh;');
            button.addEventListener('click', onClick);
            columns[index].appendChild(button);
        } else if (text == 'Login') {
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
            topRow[1].appendChild(button);
        }
    });
}
