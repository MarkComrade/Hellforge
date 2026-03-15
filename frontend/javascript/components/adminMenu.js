async function Admin() {
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (session.isAdmin) {
            adminTools();
            return;
        }
    } catch (error) {
        console.error('Session check hiba:', error);
    }

    clearBody();

    generateBootStrapGrid(1, 1, 12, 'adminHeader');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle adminMenu');
    menuTitle.textContent = 'Admin Login';
    document.querySelector('.adminHeader').appendChild(menuTitle);

    generateBootStrapGrid(2, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('.loginFormContainer');

    const forms = [
        { label: 'Username:', type: 'text', id: 'adminUsernameInput' },
        { label: 'Password:', type: 'password', id: 'adminPasswordInput' }
    ];

    forms.forEach((form, i) => {
        const row = document.createElement('div');
        row.setAttribute('class', 'row');
        loginRows[i].appendChild(row);

        const labelCol = document.createElement('div');
        labelCol.setAttribute(
            'class',
            'col-sm-6 col-md-6 d-flex justify-content-end align-items-center'
        );
        const label = document.createElement('label');
        label.setAttribute('class', 'menuText');
        label.textContent = form.label;
        label.setAttribute('for', form.id);
        labelCol.appendChild(label);
        row.appendChild(labelCol);

        const inputCol = document.createElement('div');
        inputCol.setAttribute(
            'class',
            'col-sm-6 col-md-6 d-flex justify-content-start align-items-center'
        );
        const input = document.createElement('input');
        input.setAttribute('class', 'menuInput');
        input.setAttribute('type', form.type);
        input.setAttribute('id', form.id);
        inputCol.appendChild(input);
        row.appendChild(inputCol);
    });

    generateBootStrapGrid(1, 1, 12, 'adminButtonRow');
    const buttonContainer = document.querySelector('.adminButtonRow');

    let loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'button');
    loginButton.setAttribute('value', 'Login');
    loginButton.setAttribute('class', 'menuButton');
    buttonContainer.appendChild(loginButton);
    loginButton.addEventListener('click', async function () {
        let username = document.querySelector('#adminUsernameInput').value;
        let password = document.querySelector('#adminPasswordInput').value;

        if (username && password) {
            try {
                const result = await postFetch('/api/loginAuthApi/loginAdmin', {
                    username,
                    password
                });

                if (result.success) {
                    console.log(result.message);
                    adminTools();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Hiba történt az admin bejelentkezés során');
                console.error(error);
            }
        } else {
            alert('Kérlek töltsd ki az összes mezőt!');
        }
    });

    generateBackToMenu();
}

async function adminTools() {
    clearBody();
    generateBootStrapGrid(1, 1, 12, 'adminToolsTitle');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle adminMenu');
    menuTitle.textContent = 'Admin Tools';
    document.querySelector('.adminToolsTitle').appendChild(menuTitle);

    const buttons = [
        { text: 'Manage Users', id: 'manageUsersButton', class: 'menuButton' },
        { text: 'View appeals', id: 'viewAppealsButton', class: 'menuButton' }
    ];

    generateBootStrapGrid(buttons.length + 1, 1, 12, 'adminToolsButtons');

    let i = 0;
    buttons.forEach(({ text, id, class: className }) => {
        let button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', text);
        button.setAttribute('id', id);
        button.setAttribute('class', className);

        document.querySelectorAll('.adminToolsButtons')[i].appendChild(button);
        i++;
    });

    generateBackToMenu();
    //TODO: Implementation of admin tools
}

async function displayUserInventory(userId) {
    const inventoryContainer = document.querySelector('.inventoryContainer');
    inventoryContainer.innerHTML = '';

    try {
        // Fetch user inventory and all available items
        const [inventoryResponse, armorsResponse, weaponsResponse] = await Promise.all([
            getMethodFetch(`/api/adminActions/getUserInventory/${userId}`),
            getMethodFetch('/api/adminActions/getAllArmors'),
            getMethodFetch('/api/adminActions/getAllWeapons')
        ]);

        const inventory = inventoryResponse.inventory;
        const armors = armorsResponse.armors;
        const weapons = weaponsResponse.weapons;

        // Create inventory title
        const title = document.createElement('h2');
        title.setAttribute('class', 'menuText');
        title.textContent = `${inventory.username}'s Inventory`;
        inventoryContainer.appendChild(title);

        // Create editable form
        const inventoryForm = document.createElement('form');
        inventoryForm.setAttribute('class', 'inventoryDisplay');
        inventoryForm.setAttribute('id', 'inventoryForm');
        inventoryForm.setAttribute('data-user-id', userId);

        // Gold input
        const goldDiv = document.createElement('div');
        goldDiv.setAttribute('class', 'inventoryItem');
        goldDiv.innerHTML = `
            <label class="menuText" for="goldInput">Gold:</label>
            <input type="number" id="goldInput" class="menuInput inventoryInput" 
                   value="${inventory.gold}" min="0" required>
        `;
        inventoryForm.appendChild(goldDiv);

        // Helmet select
        const helmetDiv = document.createElement('div');
        helmetDiv.setAttribute('class', 'inventoryItem');
        const helmetLabel = document.createElement('label');
        helmetLabel.setAttribute('class', 'menuText');
        helmetLabel.setAttribute('for', 'helmetSelect');
        helmetLabel.textContent = 'Helmet:';
        helmetDiv.appendChild(helmetLabel);

        const helmetSelect = document.createElement('select');
        helmetSelect.setAttribute('id', 'helmetSelect');
        helmetSelect.setAttribute('class', 'menuSelect inventorySelect');
        armors
            .filter((armor) => armor.type === 'Helmet')
            .forEach((armor) => {
                const option = document.createElement('option');
                option.value = armor.armorId;
                option.textContent = `${armor.name} (Tier ${armor.tier})`;
                if (armor.armorId === inventory.helmet_id) {
                    option.selected = true;
                }
                helmetSelect.appendChild(option);
            });
        helmetDiv.appendChild(helmetSelect);
        inventoryForm.appendChild(helmetDiv);

        // Armor select
        const armorDiv = document.createElement('div');
        armorDiv.setAttribute('class', 'inventoryItem');
        const armorLabel = document.createElement('label');
        armorLabel.setAttribute('class', 'menuText');
        armorLabel.setAttribute('for', 'armorSelect');
        armorLabel.textContent = 'Armor:';
        armorDiv.appendChild(armorLabel);

        const armorSelect = document.createElement('select');
        armorSelect.setAttribute('id', 'armorSelect');
        armorSelect.setAttribute('class', 'menuSelect inventorySelect');
        armors
            .filter((armor) => armor.type === 'Armor')
            .forEach((armor) => {
                const option = document.createElement('option');
                option.value = armor.armorId;
                option.textContent = `${armor.name} (Tier ${armor.tier})`;
                if (armor.armorId === inventory.armor_id) {
                    option.selected = true;
                }
                armorSelect.appendChild(option);
            });
        armorDiv.appendChild(armorSelect);
        inventoryForm.appendChild(armorDiv);

        // Melee weapon select
        const meleeDiv = document.createElement('div');
        meleeDiv.setAttribute('class', 'inventoryItem');
        const meleeLabel = document.createElement('label');
        meleeLabel.setAttribute('class', 'menuText');
        meleeLabel.setAttribute('for', 'meleeSelect');
        meleeLabel.textContent = 'Melee:';
        meleeDiv.appendChild(meleeLabel);

        const meleeSelect = document.createElement('select');
        meleeSelect.setAttribute('id', 'meleeSelect');
        meleeSelect.setAttribute('class', 'menuSelect inventorySelect');
        weapons
            .filter((weapon) => weapon.type === 'Melee')
            .forEach((weapon) => {
                const option = document.createElement('option');
                option.value = weapon.weaponId;
                option.textContent = `${weapon.name} (Tier ${weapon.tier})`;
                if (weapon.weaponId === inventory.melee_id) {
                    option.selected = true;
                }
                meleeSelect.appendChild(option);
            });
        meleeDiv.appendChild(meleeSelect);
        inventoryForm.appendChild(meleeDiv);

        // Ranged weapon select
        const rangedDiv = document.createElement('div');
        rangedDiv.setAttribute('class', 'inventoryItem');
        const rangedLabel = document.createElement('label');
        rangedLabel.setAttribute('class', 'menuText');
        rangedLabel.setAttribute('for', 'rangedSelect');
        rangedLabel.textContent = 'Ranged:';
        rangedDiv.appendChild(rangedLabel);

        const rangedSelect = document.createElement('select');
        rangedSelect.setAttribute('id', 'rangedSelect');
        rangedSelect.setAttribute('class', 'menuSelect inventorySelect');
        weapons
            .filter((weapon) => weapon.type === 'Ranged')
            .forEach((weapon) => {
                const option = document.createElement('option');
                option.value = weapon.weaponId;
                option.textContent = `${weapon.name} (Tier ${weapon.tier})`;
                if (weapon.weaponId === inventory.ranged_id) {
                    option.selected = true;
                }
                rangedSelect.appendChild(option);
            });
        rangedDiv.appendChild(rangedSelect);
        inventoryForm.appendChild(rangedDiv);

        inventoryContainer.appendChild(inventoryForm);
    } catch (error) {
        console.error('Error loading inventory:', error);
        inventoryContainer.innerHTML = '<p class="menuText">Error loading inventory</p>';
    }
}
//asdsadasddsd
