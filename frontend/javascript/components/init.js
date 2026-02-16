document.addEventListener('DOMContentLoaded', function () {
    window.isInGame = false;
    checkOrientation();

    //Start music
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });
});
