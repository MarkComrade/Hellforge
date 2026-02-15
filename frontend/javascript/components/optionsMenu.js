function Options() {
    clearBody();

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
