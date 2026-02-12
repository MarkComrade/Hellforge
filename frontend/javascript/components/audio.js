let audio;

//Play music
function playMenuMusic() {
    if (!audio) {
        audio = new Audio('../music/track1.mp3');
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
