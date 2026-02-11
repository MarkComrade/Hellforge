document.addEventListener('DOMContentLoaded', function () {
    checkOrientation();

    //Start music
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });
});
