async function Home() {
    clearBody();

    document.body.style.backgroundImage = "url('../menuImages/home.jpg')";

    //TODO: Home screen content

    let gearLevel = 10; //placeholder values
    let gold = 250;

    generateBootStrapGrid(1, 1, 12, 'homeMenuRow');
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle homeMenu');
    menuTitle.style = 'font-size: 8vh;';
    menuTitle.textContent = 'Home';
    document.querySelector('.homeMenuRow').appendChild(menuTitle);

    generateBootStrapGrid(1, 2, 6, 'homeUI');

    let homeUI = document.querySelectorAll('.homeUI');
    homeUI[0].setAttribute(
        'class',
        'characterInfoDiv col-sm-3 col-md-3 d-flex flex-column align-items-center'
    );

    let userNameText = document.createElement('h2');
    userNameText.textContent = 'User: Player';
    userNameText.setAttribute('class', 'menuText');
    homeUI[0].appendChild(userNameText);

    let userImg = document.createElement('img');
    userImg.setAttribute('src', '../textures/misc/defaultportrait.png');
    userImg.setAttribute('class', 'characterImage img-fluid');
    homeUI[0].appendChild(userImg);

    //? Custom user image upload

    let characterInfo = document.createElement('h3');
    characterInfo.setAttribute('class', 'menuText');
    characterInfo.textContent = 'Character Level:' + gearLevel;
    homeUI[0].appendChild(characterInfo);

    //! Character level = overall gear level

    let goldAmount = document.createElement('h3');
    goldAmount.setAttribute('class', 'menuText');
    goldAmount.textContent = 'Gold:' + gold;
    homeUI[0].appendChild(goldAmount);

    let equipmentTitle = document.createElement('h2');
    equipmentTitle.setAttribute('class', 'menuText');
    equipmentTitle.textContent = 'Equipped gear:';
    homeUI[0].appendChild(equipmentTitle);

    let characterInfoDiv = document.querySelectorAll('.characterInfoDiv');

    let armourRow = document.createElement('div');
    armourRow.setAttribute('class', 'characterArmourRow');

    let weaponsRow = document.createElement('div');
    weaponsRow.setAttribute('class', 'characterWeaponsRow');

    const equipmentSlots = [
        { slot: 'Helmet', img: '../textures/items/armour/helmet_rusty.png', type: 'armour' },
        { slot: 'Armor', img: '../textures/items/armour/armour_rusty.png', type: 'armour' },
        { slot: 'Melee', img: '../textures/items/weapons/sword_rusty.png', type: 'weapon' },
        { slot: 'Ranged', img: '../textures/items/weapons/bow_rusty.png', type: 'weapon' }
    ];

    equipmentSlots.forEach(({ slot, img, type }) => {
        let slotDiv = document.createElement('div');
        slotDiv.setAttribute(
            'class',
            'equipmentSlot col-sm-6 col-md-6 d-flex flex-column align-items-center'
        );
        let slotImg = document.createElement('img');
        slotImg.setAttribute('src', img);
        slotImg.setAttribute('class', 'itemImage img-fluid');
        slotDiv.appendChild(slotImg);
        if (type === 'armour') {
            armourRow.appendChild(slotDiv);
        } else {
            weaponsRow.appendChild(slotDiv);
        }
    });

    characterInfoDiv[0].appendChild(armourRow);
    characterInfoDiv[0].appendChild(weaponsRow);

    homeUI[1].setAttribute(
        'class',
        'characterStashDiv col-sm-7 col-md-7 d-flex flex-column align-items-center'
    );

    equipmentSlots.forEach(({ slot, img }) => {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'equipmentRow');

        let leftBox = document.createElement('div');
        leftBox.setAttribute('class', 'equipmentLeft');

        let slotImg = document.createElement('img');
        slotImg.setAttribute('src', img);
        slotImg.setAttribute('class', 'itemImage');
        leftBox.appendChild(slotImg);

        let rightBox = document.createElement('div');
        rightBox.setAttribute('class', 'equipmentRight');

        rowDiv.appendChild(leftBox);
        rowDiv.appendChild(rightBox);
        homeUI[1].appendChild(rowDiv);
    });

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Dungeon Selection');
    backButton.setAttribute('class', 'menuButton');
    backButton.addEventListener('click', () => {
        document.body.style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
        StartGame();
    });

    generateBootStrapGrid(1, 1, 12, 'backToDungeonSelectRow');
    let backToDungeonSelectRow = document.querySelector('.backToDungeonSelectRow');
    backToDungeonSelectRow.appendChild(backButton);
}
