document.addEventListener('DOMContentLoaded', function () {
    window.isInGame = false;

    if (checkOrientation()) {
        Menu();
    }

    document.body.classList.add('ready');

    //Start music
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });
});
