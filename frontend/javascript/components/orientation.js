window.isGamePaused = false;
window.addEventListener('resize', () => {
    checkOrientation();
});

function checkOrientation() {
    if (!window.matchMedia('(orientation: landscape)').matches) {
        if (window.isInGame) {
            window.isGamePaused = true;
        }

        if (!document.querySelector('.orientationWarning')) {
            const warning = document.createElement('div');
            warning.setAttribute('class', 'orientationWarning');
            warning.textContent =
                'Please rotate your device to landscape mode or make the window fullscreen to continue.';
            document.body.appendChild(warning);
        }

        return false;
    } else {
        const warning = document.querySelector('.orientationWarning');
        if (warning) {
            warning.remove();
        }

        if (window.isInGame && window.isGamePaused) {
            window.isGamePaused = false;
        }

        return true;
    }
}
