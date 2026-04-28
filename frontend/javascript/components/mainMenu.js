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
        console.error('Session check error:', error);
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
        { text: 'Register', onClick: Register },
        { text: 'Logout', onClick: Logout },
        { text: 'New Game', onClick: StartGame },
        { text: 'Leaderboard', onClick: LeaderBoard },
        { text: 'Admin', onClick: Admin },
        { text: 'Options', onClick: Options }
    ];

    generateBootStrapGrid(buttons.length, 1, 12, 'menuButtons');

    const columns = document.querySelectorAll('.container-fluid:last-child .col-md-12');

    buttons.forEach(({ text, onClick }, index) => {
        const isLoginRelated = text === 'Login' || text === 'Register' || text === 'Admin';
        const isPublic = text === 'Leaderboard';

        if (isAdmin && text !== 'Admin' && text !== 'Logout') return;
        if (!isAdmin && !isLoggedIn && !isLoginRelated && !isPublic) return;
        if (!isAdmin && isLoggedIn && isLoginRelated) return;

        const button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', text);
        button.addEventListener('click', onClick);

        if (text === 'Logout') {
            button.setAttribute('class', 'logOutButton');
            topRow[1].appendChild(button);
        } else {
            button.setAttribute('class', 'menuButton');
            button.setAttribute('style', 'margin-top:5vh;');
            columns[index].appendChild(button);
        }
    });
}
