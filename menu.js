import { NewGame } from './room.js';
document.addEventListener('DOMContentLoaded', function() {
    checkOrientation();


    //Start music
    document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });

});

let audio;
window.addEventListener("resize", checkOrientation);

//Tool to generate bootstrap grid
function generateBootStrapGrid(row, col, col_md_value, id)
{
    let body = document.getElementsByTagName('body');
    let contDiv = document.createElement('div');
    contDiv.setAttribute('class','container-fluid');

    for(let i = 0; i < row; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class','row');
        contDiv.appendChild(rowDiv);

        for(let j = 0; j < col; j++) {
            let colDiv = document.createElement('div');
            colDiv.setAttribute('class',`col-sm-12 col-md-${col_md_value} d-flex justify-content-center`);
            // Set the ID on the column if provided
            if (id) {
                colDiv.setAttribute('id', id);
            }
            rowDiv.appendChild(colDiv);
        }
    }

    body[0].appendChild(contDiv);
}

//Menu generation
function Menu(){
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = "";

    //Title
    generateBootStrapGrid(1, 1, 12);
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle mainMenu');  // Added mainMenu class
    menuTitle.innerHTML = "Hellforge";
    document.querySelector('.col-md-12').appendChild(menuTitle);

    //Buttons
    const buttons = [
        { text: 'New Game', onClick: StartGame },
        { text: 'Load Game', onClick: loadGame },
        { text: 'Admin', onClick: Admin },
        { text: 'Options', onClick: Options }
    ];

    generateBootStrapGrid(buttons.length, 1, 12, "menuButtons");

    const columns = document.querySelectorAll('.container-fluid:last-child .col-md-12');
    
    // Add buttons
    buttons.forEach(({ text, onClick }, index) => {
        let button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', text);
        button.setAttribute('class', 'menuButton');
        button.setAttribute('style', 'margin-top:5vh;');
        button.addEventListener('click', onClick);
        
        columns[index].appendChild(button);
    });
}

//Start game
function StartGame() {
    NewGame();
}

//Load game
function loadGame() {
  document.body.innerHTML = "";
}

//Admin menu
function Admin() {
  document.body.innerHTML = "";
}

//Options menu
function Options() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML= "";

    // Music controls
    generateBootStrapGrid(1,1,12,"optionsTitle");
    let optionsTitle = document.createElement('h1');
    optionsTitle.setAttribute('class','menuTitle optionsMenu');  // Added optionsMenu class
    optionsTitle.innerHTML= "Options";

    document.querySelector('.col-md-12').appendChild(optionsTitle);

    generateBootStrapGrid(1,3,4,"musicControls");

    const volumeLabel = Object.assign(document.createElement("label"), {
        htmlFor: "volume",
        innerHTML: "Music controls:",
        className: "menuText"
    });
    
    const volume = Object.assign(document.createElement("input"), {
        type: "range",
        id: "volume",
        min: "0",
        max: "100",
        value: "10",
        className: "volumeSlider"
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
        disableMusic.value = disableMusic.value === 'Disable Music' ? 'Enable Music' : 'Disable Music';
        disableMusic.value === 'Enable Music' ? stopAudio() : playMenuMusic();
    });
    
    document.querySelectorAll('.col-md-4')[0].appendChild(volumeLabel);
    document.querySelectorAll('.col-md-4')[1].appendChild(volume);
    document.querySelectorAll('.col-md-4')[2].appendChild(disableMusic);

    generateBootStrapGrid(1,1,12,"backToMenu");

    //Back To Menu

    let backButton = document.createElement('input');
    backButton.setAttribute('type','button');
    backButton.setAttribute('value','Back to Menu');
    backButton.setAttribute('class','menuButton');

    backButton.addEventListener('click', Menu);


    let backToMenu = document.getElementById("backToMenu");
    backToMenu.appendChild(backButton);

}

//Check the display size
function checkOrientation() {
    const body= document.getElementsByTagName('body');

    if (!window.matchMedia("(orientation: landscape)").matches) {

        body[0].innerHTML= "";

        let warning= document.createElement('div');
        warning.setAttribute('class','orientationWarning');
        warning.innerHTML= "Please rotate your device to landscape mode or make the window fullscreen to continue.";
        warning.style.position = 'absolute';
        warning.style.top = '50%';
        warning.style.left = '50%';
        warning.style.transform = 'translate(-50%, -50%)';

        body[0].appendChild(warning);
        return false;
    }
    else
    {
        const mainMenu = document.querySelector('.mainMenu');
        const optionsMenu = document.querySelector('.optionsMenu');
        
        if (mainMenu) {
            Menu();
        } else if (optionsMenu) {
            Options();
        } else {
            Menu();
        }
    }

    return true;
}

//Play music
function playMenuMusic() {
    if (!audio) {

        audio = new Audio('music/track1.mp3');
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