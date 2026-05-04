async function Admin() {
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (session.isAdmin) {
            renderUserManagement();
            return;
        }
    } catch (error) {
        console.error('Session check error:', error);
    }

    renderAdminLogin();
}

function renderAdminLogin() {
    clearBody();

    generateBootStrapGrid(1, 1, 12, 'adminHeader');
    const menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle adminMenu');
    menuTitle.textContent = 'Admin Login';
    document.querySelector('.adminHeader').appendChild(menuTitle);

    generateBootStrapGrid(2, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('.loginFormContainer');

    const fields = [
        { label: 'Username:', type: 'text', id: 'adminUsernameInput' },
        { label: 'Password:', type: 'password', id: 'adminPasswordInput' }
    ];

    fields.forEach(({ label, type, id }, i) => {
        const row = document.createElement('div');
        row.setAttribute('class', 'row');
        loginRows[i].appendChild(row);

        const labelCol = document.createElement('div');
        labelCol.setAttribute(
            'class',
            'col-sm-6 col-md-6 d-flex justify-content-end align-items-center'
        );
        const labelEl = document.createElement('label');
        labelEl.setAttribute('class', 'menuText');
        labelEl.textContent = label;
        labelEl.setAttribute('for', id);
        labelCol.appendChild(labelEl);
        row.appendChild(labelCol);

        const inputCol = document.createElement('div');
        inputCol.setAttribute(
            'class',
            'col-sm-6 col-md-6 d-flex justify-content-start align-items-center'
        );
        const input = document.createElement('input');
        input.setAttribute('class', 'menuInput');
        input.setAttribute('type', type);
        input.setAttribute('id', id);

        if (type === 'password') {
            const inputWrapper = document.createElement('div');
            inputWrapper.setAttribute('class', 'passwordWrapper');
            inputWrapper.appendChild(input);

            const toggleBtn = document.createElement('button');
            toggleBtn.setAttribute('type', 'button');
            toggleBtn.setAttribute('class', 'passwordToggle');
            toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
            toggleBtn.innerHTML = `<svg class="eyeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`;
            toggleBtn.addEventListener('click', function () {
                const isPassword = input.getAttribute('type') === 'password';
                input.setAttribute('type', isPassword ? 'text' : 'password');
                toggleBtn.innerHTML = isPassword
                    ? `<svg class="eyeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>`
                    : `<svg class="eyeIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>`;
            });
            inputWrapper.appendChild(toggleBtn);
            inputCol.appendChild(inputWrapper);
        } else {
            inputCol.appendChild(input);
        }

        row.appendChild(inputCol);
    });

    generateBootStrapGrid(1, 1, 12, 'adminButtonRow');
    const loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'button');
    loginButton.setAttribute('value', 'Login');
    loginButton.setAttribute('class', 'menuButton');
    document.querySelector('.adminButtonRow').appendChild(loginButton);

    loginButton.addEventListener('click', async function () {
        const username = document.querySelector('#adminUsernameInput').value;
        const password = document.querySelector('#adminPasswordInput').value;

        if (!username || !password) {
            toast('Please enter both username and password', 'error');
            return;
        }

        try {
            const result = await postFetch('/api/loginAuthApi/loginAdmin', { username, password });
            if (result.success) {
                renderUserManagement();
            } else {
                toast(result.message, 'hiba');
            }
        } catch (error) {
            toast(error.message || 'An error occurred while logging in as admin', 'error');
            console.error('Admin login error:', error);
        }
    });

    generateBackToMenu();
}

async function renderUserManagement() {
    clearBody();

    generateBootStrapGrid(1, 1, 12, 'adminToolsTitle');
    const menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle adminMenu');
    menuTitle.textContent = 'User Management';
    document.querySelector('.adminToolsTitle').appendChild(menuTitle);

    try {
        const userArray = await getMethodFetch('/api/adminActions/getAllUsers');

        const container = document.createElement('div');
        container.setAttribute('class', 'container-fluid');
        const row = document.createElement('div');
        row.setAttribute('class', 'row');
        container.appendChild(row);

        const col4 = document.createElement('div');
        col4.setAttribute(
            'class',
            'col-sm-4 col-md-4 d-flex flex-column align-items-center userSelectContainer'
        );
        row.appendChild(col4);

        const col8 = document.createElement('div');
        col8.setAttribute(
            'class',
            'col-sm-8 col-md-8 d-flex justify-content-center inventoryContainer'
        );
        row.appendChild(col8);

        document.body.appendChild(container);

        const selectLabel = document.createElement('label');
        selectLabel.setAttribute('class', 'menuText');
        selectLabel.setAttribute('for', 'userSelect');
        selectLabel.textContent = 'Select User:';
        col4.appendChild(selectLabel);

        const select = document.createElement('select');
        select.setAttribute('class', 'menuSelect');
        select.setAttribute('id', 'userSelect');
        select.setAttribute('size', '10');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '- Choose a user -';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        userArray.results.forEach((user) => {
            const option = document.createElement('option');
            option.value = user.userId;
            option.textContent = user.name;
            select.appendChild(option);
        });

        col4.appendChild(select);

        select.addEventListener('change', async function () {
            if (!this.value) return;
            await displayUserInventory(this.value);
        });

        const actionsContainer = document.createElement('div');
        actionsContainer.setAttribute('class', 'container-fluid');
        const actionsRow = document.createElement('div');
        actionsRow.setAttribute('class', 'row');
        actionsContainer.appendChild(actionsRow);

        const deleteCol = document.createElement('div');
        deleteCol.setAttribute('class', 'col-sm-6 col-md-6 d-flex justify-content-center');
        const deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('value', 'Delete User');
        deleteButton.setAttribute('class', 'menuButton');
        deleteButton.addEventListener('click', async function () {
            const form = document.getElementById('inventoryForm');
            if (!form) {
                toast('Please select a user first!', 'warning');
                return;
            }

            const userId = form.getAttribute('data-user-id');
            const selectedOption = select.options[select.selectedIndex];
            const username = selectedOption ? selectedOption.textContent : 'this user';

            // TODO: In the future, this will add user to ban list instead of deleting
            const confirmed = await areYouSure(
                `You are about to delete ${username}. This action cannot be undone and will permanently remove the user's account and inventory data. Are you sure?`,
                'Confirm User Deletion',
                'Cancel',
                'Delete'
            );
            if (confirmed) {
                try {
                    const response = await postFetch(`/api/adminActions/deleteUser/${userId}`, {});
                    if (response.success) {
                        toast('User deleted successfully!', 'success');
                        document.querySelector('.inventoryContainer').innerHTML =
                            '<p class="menuText">User deleted. Select another user.</p>';
                        selectedOption?.remove();
                        select.value = '';
                    } else {
                        toast('Error deleting user: ' + response.message, 'error');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    toast('Error deleting user: ' + error.message, 'error');
                }
            }
        });
        deleteCol.appendChild(deleteButton);
        actionsRow.appendChild(deleteCol);

        const saveCol = document.createElement('div');
        saveCol.setAttribute('class', 'col-sm-6 col-md-6 d-flex justify-content-center');
        const saveButton = document.createElement('input');
        saveButton.setAttribute('type', 'button');
        saveButton.setAttribute('value', 'Save Changes');
        saveButton.setAttribute('class', 'menuButton');
        saveButton.addEventListener('click', async function () {
            const form = document.getElementById('inventoryForm');
            if (!form) {
                toast('Please select a user first!', 'warning');
                return;
            }

            const userId = form.getAttribute('data-user-id');
            const helmet = document.getElementById('helmetSelect').value;
            const armor = document.getElementById('armorSelect').value;
            const melee = document.getElementById('meleeSelect').value;
            const ranged = document.getElementById('rangedSelect').value;
            const goldRaw = document.getElementById('stashGoldInput').value;

            if (!helmet || !armor || !melee || !ranged) {
                toast('All equipment fields are required!', 'error');
                return;
            }

            const goldParsed = parseInt(goldRaw, 10);
            if (isNaN(goldParsed)) {
                toast('Gold must be a whole number.', 'error');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('helmet', helmet);
                formData.append('armor', armor);
                formData.append('melee', melee);
                formData.append('ranged', ranged);

                const [equipResponse, goldResponse] = await Promise.all([
                    postFetchForm(`/api/adminActions/updateUserInventory/${userId}`, formData),
                    postFetch(`/api/adminActions/setUserStashGold/${userId}`, { gold: goldParsed })
                ]);

                if (equipResponse.success && goldResponse.success) {
                    toast('User updated successfully!', 'success');
                    await displayUserInventory(userId);
                } else {
                    const msg = [equipResponse, goldResponse]
                        .filter((r) => !r.success)
                        .map((r) => r.message)
                        .join(' | ');
                    toast('Error saving changes: ' + msg, 'error');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                toast('Error updating user: ' + error.message, 'error');
            }
        });
        saveCol.appendChild(saveButton);
        actionsRow.appendChild(saveCol);

        document.body.appendChild(actionsContainer);
    } catch (error) {
        console.error('Error loading users:', error);
    }

    generateBackToMenu();
}

async function displayUserInventory(userId) {
    const inventoryContainer = document.querySelector('.inventoryContainer');
    inventoryContainer.innerHTML = '';

    try {
        const [inventoryResponse, armorsResponse, weaponsResponse, goldResponse] =
            await Promise.all([
                getMethodFetch(`/api/adminActions/getUserInventory/${userId}`),
                getMethodFetch('/api/adminActions/getAllArmors'),
                getMethodFetch('/api/adminActions/getAllWeapons'),
                getMethodFetch(`/api/adminActions/getUserGold/${userId}`)
            ]);

        const inventory = inventoryResponse.inventory;
        const armors = armorsResponse.armors;
        const weapons = weaponsResponse.weapons;
        const stashGold = goldResponse.stashGold ?? 0;

        const title = document.createElement('h2');
        title.setAttribute('class', 'menuText');
        title.textContent = `${inventory.username}'s Equipment`;
        inventoryContainer.appendChild(title);

        const form = document.createElement('form');
        form.setAttribute('class', 'inventoryDisplay');
        form.setAttribute('id', 'inventoryForm');
        form.setAttribute('data-user-id', userId);

        const goldDiv = document.createElement('div');
        goldDiv.setAttribute('class', 'inventoryItem');
        const goldLabel = document.createElement('label');
        goldLabel.setAttribute('class', 'menuText');
        goldLabel.setAttribute('for', 'stashGoldInput');
        goldLabel.textContent = 'Stash Gold:';
        goldDiv.appendChild(goldLabel);
        const goldInput = document.createElement('input');
        goldInput.setAttribute('type', 'number');
        goldInput.setAttribute('id', 'stashGoldInput');
        goldInput.setAttribute('class', 'menuInput inventoryInput');
        goldInput.value = stashGold;
        goldDiv.appendChild(goldInput);
        form.appendChild(goldDiv);

        const slots = [
            {
                label: 'Helmet:',
                id: 'helmetSelect',
                currentId: inventory.helmet_id,
                items: armors.filter((a) => a.type === 'Helmet'),
                idKey: 'armorId'
            },
            {
                label: 'Armor:',
                id: 'armorSelect',
                currentId: inventory.armor_id,
                items: armors.filter((a) => a.type === 'Armor'),
                idKey: 'armorId'
            },
            {
                label: 'Melee:',
                id: 'meleeSelect',
                currentId: inventory.melee_id,
                items: weapons.filter((w) => w.type === 'Melee'),
                idKey: 'weaponId'
            },
            {
                label: 'Ranged:',
                id: 'rangedSelect',
                currentId: inventory.ranged_id,
                items: weapons.filter((w) => w.type === 'Ranged'),
                idKey: 'weaponId'
            }
        ];

        slots.forEach(({ label, id, currentId, items, idKey }) => {
            const div = document.createElement('div');
            div.setAttribute('class', 'inventoryItem');

            const labelEl = document.createElement('label');
            labelEl.setAttribute('class', 'menuText');
            labelEl.setAttribute('for', id);
            labelEl.textContent = label;
            div.appendChild(labelEl);

            const selectEl = document.createElement('select');
            selectEl.setAttribute('id', id);
            selectEl.setAttribute('class', 'menuSelect inventorySelect');
            items.forEach((item) => {
                const option = document.createElement('option');
                option.value = item[idKey];
                option.textContent = `${item.name} (Tier ${item.tier})`;
                if (item[idKey] === currentId) option.selected = true;
                selectEl.appendChild(option);
            });
            div.appendChild(selectEl);
            form.appendChild(div);
        });

        inventoryContainer.appendChild(form);
    } catch (error) {
        console.error('Error loading inventory:', error);
        inventoryContainer.innerHTML = '<p class="menuText">Error loading inventory</p>';
    }
}
