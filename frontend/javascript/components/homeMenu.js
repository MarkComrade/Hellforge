async function Home() {
    clearBody();

    document.body.style.backgroundImage = "url('../menuImages/home.jpg')";

    let playerName = 'Guest';
    let playerId = null;
    let gold = 0;
    let equippedGear = null;

    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (session.isLoggedIn && session.userId) {
            playerId = session.userId;
            playerName = session.userName;

            const [equipmentResult, goldResult] = await Promise.all([
                getMethodFetch(`/api/inventory/equipment`),
                getMethodFetch(`/api/inventory/gold`)
            ]);

            if (equipmentResult.success) {
                equippedGear = equipmentResult.inventory;
            }
            if (goldResult.success) {
                gold = Math.round(Number(goldResult.gold.stash) + Number(goldResult.gold.loadout));
            }
        }
    } catch (error) {
        console.error('Failed to load player data:', error);
    }

    generateBootStrapGrid(1, 1, 12, 'homeMenuRow');
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle homeMenu');
    menuTitle.textContent = 'Home';
    document.querySelector('.homeMenuRow').appendChild(menuTitle);

    generateBootStrapGrid(1, 1, 12, 'homeUI');

    let homeUI = document.querySelectorAll('.homeUI');
    homeUI[0].setAttribute(
        'class',
        'characterInfoDiv col-12 d-flex flex-column align-items-center'
    );

    let userNameText = document.createElement('h2');
    userNameText.textContent = 'User: ' + playerName;
    userNameText.setAttribute('class', 'menuText');
    homeUI[0].appendChild(userNameText);

    let userImg = document.createElement('img');
    userImg.setAttribute('src', '../textures/misc/defaultportrait.png');
    userImg.setAttribute('class', 'characterImage img-fluid');
    homeUI[0].appendChild(userImg);

    let goldAmount = document.createElement('h3');
    goldAmount.setAttribute('class', 'menuText');
    goldAmount.textContent = 'Gold: ' + gold;
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

    const equipmentSlots = equippedGear
        ? [
              {
                  slot: 'Helmet',
                  img: equippedGear.helmet_img,
                  name: equippedGear.helmet_name,
                  type: 'armour'
              },
              {
                  slot: 'Armor',
                  img: equippedGear.armor_img,
                  name: equippedGear.armor_name,
                  type: 'armour'
              },
              {
                  slot: 'Melee',
                  img: equippedGear.melee_img,
                  name: equippedGear.melee_name,
                  type: 'weapon'
              },
              {
                  slot: 'Ranged',
                  img: equippedGear.ranged_img,
                  name: equippedGear.ranged_name,
                  type: 'weapon'
              }
          ]
        : [
              {
                  slot: 'Helmet',
                  img: '../textures/items/armour/helmet_rusty.png',
                  name: 'Rusty Helmet',
                  type: 'armour'
              },
              {
                  slot: 'Armor',
                  img: '../textures/items/armour/armour_rusty.png',
                  name: 'Rusty Chestplate',
                  type: 'armour'
              },
              {
                  slot: 'Melee',
                  img: '../textures/items/weapons/sword_rusty.png',
                  name: 'Rusty Sword',
                  type: 'weapon'
              },
              {
                  slot: 'Ranged',
                  img: '../textures/items/weapons/bow_rusty.png',
                  name: 'Rusty Bow',
                  type: 'weapon'
              }
          ];

    equipmentSlots.forEach(({ img, name, type }) => {
        let slotDiv = document.createElement('div');
        slotDiv.setAttribute(
            'class',
            'equipmentSlot col-sm-6 col-md-6 d-flex flex-column align-items-center'
        );
        let slotImg = document.createElement('img');
        slotImg.setAttribute('src', img);
        slotImg.setAttribute('class', 'itemImage img-fluid');
        slotImg.setAttribute('title', name);
        slotDiv.appendChild(slotImg);
        if (type === 'armour') {
            armourRow.appendChild(slotDiv);
        } else {
            weaponsRow.appendChild(slotDiv);
        }
    });

    let gearRowsWrapper = document.createElement('div');
    gearRowsWrapper.setAttribute('class', 'gearRowsWrapper');
    gearRowsWrapper.appendChild(armourRow);
    gearRowsWrapper.appendChild(weaponsRow);
    characterInfoDiv[0].appendChild(gearRowsWrapper);

    let stashButton = document.createElement('input');
    stashButton.setAttribute('type', 'button');
    stashButton.setAttribute('value', 'Open Stash');
    stashButton.setAttribute('class', 'menuButton');
    stashButton.addEventListener('click', () => {
        openStash();
    });

    let loadoutButton = document.createElement('input');
    loadoutButton.setAttribute('type', 'button');
    loadoutButton.setAttribute('value', 'Open Loadout');
    loadoutButton.setAttribute('class', 'menuButton');
    loadoutButton.addEventListener('click', () => {
        openInventory();
    });

    generateBootStrapGrid(1, 3, 4, 'homeActionRow');
    let homeActionCols = document.querySelectorAll('.homeActionRow');
    homeActionCols[0].appendChild(stashButton);
    homeActionCols[1].appendChild(loadoutButton);

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Dungeon Selection');
    backButton.setAttribute('class', 'menuButton');
    backButton.addEventListener('click', () => {
        document.body.style.backgroundImage = "url('../menuImages/mainBackGround-brightened.png')";
        StartGame();
    });
    homeActionCols[2].appendChild(backButton);
}
