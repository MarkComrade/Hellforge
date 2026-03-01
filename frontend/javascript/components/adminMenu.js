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
    document.getElementById('manageUsersButton').addEventListener('click', async function () {
        document.querySelector('body').innerHTML = '';
        generateBootStrapGrid(1, 1, 12, 'adminToolsTitle');
        let menuTitle = document.createElement('h1');
        menuTitle.setAttribute('class', 'menuTitle adminMenu');
        menuTitle.textContent = 'User Management';
        document.querySelector('.adminToolsTitle').appendChild(menuTitle);

        try {
            const userArray = await getMethodFetch('/api/adminActions/getAllUsers');

            // Create custom grid with col-4 and col-8
            const containerFluid = document.createElement('div');
            containerFluid.setAttribute('class', 'container-fluid');

            const rowDiv = document.createElement('div');
            rowDiv.setAttribute('class', 'row');
            containerFluid.appendChild(rowDiv);

            // First column (col-4) for user select
            const col4 = document.createElement('div');
            col4.setAttribute(
                'class',
                'col-sm-4 col-md-4 d-flex justify-content-center userSelectContainer'
            );
            rowDiv.appendChild(col4);

            // Second column (col-8) for inventory
            const col8 = document.createElement('div');
            col8.setAttribute(
                'class',
                'col-sm-8 col-md-8 d-flex justify-content-center inventoryContainer'
            );
            rowDiv.appendChild(col8);

            document.body.appendChild(containerFluid);

            const selectContainer = document.querySelector('.userSelectContainer');

            // Create label
            const label = document.createElement('label');
            label.setAttribute('class', 'menuText');
            label.textContent = 'Select User:';
            label.setAttribute('for', 'userSelect');
            selectContainer.appendChild(label);

            // Create select element
            const select = document.createElement('select');
            select.setAttribute('class', 'menuSelect');
            select.setAttribute('id', 'userSelect');
            select.setAttribute('size', '10'); // Show 10 users at once

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '- Choose a user -';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            // Populate select with users from array
            userArray.results.forEach((user) => {
                const option = document.createElement('option');
                option.value = user.userId;
                option.textContent = user.name || `User ${user.userId}`;
                select.appendChild(option);
            });

            selectContainer.appendChild(select);

            // Add event listener for selection
            select.addEventListener('change', async function () {
                const selectedUserId = this.value;
                console.log('Selected user:', selectedUserId);

                // Display inventory
                await displayUserInventory(selectedUserId);
            });
        } catch (error) {
            console.error('Session check hiba:', error.message);
        }

        generateBackToAdminTools();
    });

    generateBackToMenu();
    //TODO: Implementation of admin tools
}

async function displayUserInventory(userId) {
    const inventoryContainer = document.querySelector('.inventoryContainer');
    inventoryContainer.innerHTML = '';

    try {
        const response = await getMethodFetch(`/api/adminActions/getUserInventory/${userId}`);
        const inventory = response.inventory;

        // Create inventory title
        const title = document.createElement('h2');
        title.setAttribute('class', 'menuText');
        title.textContent = `${inventory.username}'s Inventory`;
        inventoryContainer.appendChild(title);

        // Create inventory display container
        const inventoryDisplay = document.createElement('div');
        inventoryDisplay.setAttribute('class', 'inventoryDisplay');

        // Gold display
        const goldDiv = document.createElement('div');
        goldDiv.setAttribute('class', 'inventoryItem');
        goldDiv.innerHTML = `
            <span class="menuText">Gold:</span>
            <span class="menuText inventoryValue">${inventory.gold}</span>
        `;
        inventoryDisplay.appendChild(goldDiv);

        // Helmet
        const helmetDiv = document.createElement('div');
        helmetDiv.setAttribute('class', 'inventoryItem');
        helmetDiv.innerHTML = `
            <span class="menuText">Helmet:</span>
            <span class="menuText inventoryValue">${inventory.helmet_name} (Tier ${inventory.helmet_tier})</span>
        `;
        inventoryDisplay.appendChild(helmetDiv);

        // Armor
        const armorDiv = document.createElement('div');
        armorDiv.setAttribute('class', 'inventoryItem');
        armorDiv.innerHTML = `
            <span class="menuText">Armor:</span>
            <span class="menuText inventoryValue">${inventory.armor_name} (Tier ${inventory.armor_tier})</span>
        `;
        inventoryDisplay.appendChild(armorDiv);

        // Melee
        const meleeDiv = document.createElement('div');
        meleeDiv.setAttribute('class', 'inventoryItem');
        meleeDiv.innerHTML = `
            <span class="menuText">Melee:</span>
            <span class="menuText inventoryValue">${inventory.melee_name} (Tier ${inventory.melee_tier})</span>
        `;
        inventoryDisplay.appendChild(meleeDiv);

        // Ranged
        const rangedDiv = document.createElement('div');
        rangedDiv.setAttribute('class', 'inventoryItem');
        rangedDiv.innerHTML = `
            <span class="menuText">Ranged:</span>
            <span class="menuText inventoryValue">${inventory.ranged_name} (Tier ${inventory.ranged_tier})</span>
        `;
        inventoryDisplay.appendChild(rangedDiv);

        inventoryContainer.appendChild(inventoryDisplay);
    } catch (error) {
        console.error('Error loading inventory:', error);
        inventoryContainer.innerHTML = '<p class="menuText">Error loading inventory</p>';
    }
}
