window.isGamePaused = false;
window.addEventListener('resize', checkOrientation);

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

        if (window.isInGame === false) {
            body[0].style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
            if (mainMenu) {
                Menu();
            } else if (optionsMenu) {
                Options();
            } else if (loginMenu) {
                Login();
            } else if (leaderMenu || window.isLeaderboardLoading) {
                LeaderBoard();
            } else if (adminMenu) {
                if (window.isAdmin) {
                    adminTools();
                } else {
                    Admin();
                }
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
