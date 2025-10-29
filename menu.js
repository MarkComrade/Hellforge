document.addEventListener('DOMContentLoaded', function() {
    checkOrientation();
      document.addEventListener('click', function startMusicOnce() {
        playMenuMusic();
        document.removeEventListener('click', startMusicOnce);
    });
 
});
let audio;
window.addEventListener("resize", checkOrientation);

function Menu(){
    //title
    let body= document.getElementsByTagName('body');
    body.innerHTML= "";
    let menu= document.createElement('div');
    menu.setAttribute('class','Menutitle');
    menu.innerHTML= "Hellforge"
    body[0].appendChild(menu);
    //buttons container div

    menufluid.setAttribute('class','menufluid container-fluid');
    body[0].appendChild(menufluid);
    //row div
    let row1= document.createElement('div');
    row1.setAttribute('class','row');
    menufluid.appendChild(row1);
   
}

function Save() {
  document.body.innerHTML = "";
  console.log("Game loaded!");
}

function Admin() {
  document.body.innerHTML = "";
  console.log("Admin menu opened!");
}

function Options() {
    //Title container
    const body = document.body;
    body.innerHTML = "";

    let container = document.createElement('div');
    container.setAttribute('class', 'containerfluid');
    body.appendChild(container);
    
    let row = document.createElement('div');
    row.setAttribute('class', 'row');
    container.appendChild(row);

    let col = document.createElement('div');
    col.setAttribute('class', 'col-12');
    row.appendChild(col);

    const options = Object.assign(document.createElement("div"), {
        className: "Menutitle",
        innerHTML: "Options"
    });
    col.appendChild(options);

    //Options container
    let optionsContainer = document.createElement('div');
    container.setAttribute('class', 'containerfluid');
    body.appendChild(container);
    
    let optionsRow = document.createElement('div');
    row.setAttribute('class', 'row');
    container.appendChild(row);

    const volumeLabel = Object.assign(document.createElement("label"), {
        htmlFor: "volume",
        innerHTML: "Volume"
    });
    const volume = Object.assign(document.createElement("input"), {
        type: "range",
        id: "volume",
        min: "0",
        max: "100",
        value: "10",
        className: "VolumeSlider mt-4"
    });

    for(let i = 0; i < 2; i++) {
        let col = document.createElement('div');
        col.setAttribute('class', 'col-6');
        optionsRow.appendChild(col);
    }
    optionsRow.childNodes[0].appendChild(volumeLabel);
    optionsRow.childNodes[1].appendChild(volume);

    optionsContainer.appendChild(optionsRow);

    volume.addEventListener('input', (e) => {
        if (audio) audio.volume = e.target.value / 100;
    });

    let disableMusic = document.createElement('input');
    disableMusic.type = 'button';
    disableMusic.value = 'Disable Music';
    disableMusic.id = 'disableMusic';
    disableMusic.classList.add('miscButton');
    disableMusic.addEventListener('click', stopAudio);

    disableMusic.addEventListener('click', () => {
        if(disableMusic.value === 'Disable Music') {
            disableMusic.value = 'Enable Music';
            stopAudio();
        } else {
            disableMusic.value = 'Disable Music';
            playMenuMusic();
        }
    });    
    
    body.appendChild(volumeLabel);
    body.appendChild(volume);
    body.appendChild(disableMusic);
}

function checkOrientation() {
    const body= document.getElementsByTagName('body');

    if (!window.matchMedia("(orientation: landscape)").matches) {
        body[0].innerHTML= "";
        let warning= document.createElement('div');
        warning.setAttribute('class','OrientationWarning');
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
        body[0].innerHTML = "";

        Menu();
    }

    return true;
}

function playMenuMusic() {
    
    if (!audio) {
        audio = new Audio('music/track1.mp3');
        audio.loop = true;
        audio.volume = 0.1;
        audio.play();
    } else if (audio.paused) {
        audio.play();
    }
}

function stopAudio() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}