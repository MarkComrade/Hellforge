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
