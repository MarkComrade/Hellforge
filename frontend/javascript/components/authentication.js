async function Login() {
    clearBody();

    generateBootStrapGrid(1, 1, 12, 'loginMenu');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.textContent = 'Login / Register';
    document.querySelector('.loginMenu').appendChild(menuTitle);

    generateBootStrapGrid(2, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('.loginFormContainer');

    const forms = [
        { label: 'Username:', type: 'text', id: 'usernameInput' },
        { label: 'Password:', type: 'password', id: 'passwordInput' }
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

    generateBootStrapGrid(1, 2, 6, 'authButtonRow');
    const buttonContainers = document.querySelectorAll('.authButtonRow');

    let loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'button');
    loginButton.setAttribute('value', 'Login');
    loginButton.setAttribute('class', 'menuButton');
    buttonContainers[0].appendChild(loginButton);
    loginButton.addEventListener('click', async function () {
        let username = document.querySelector('#usernameInput').value;
        let password = document.querySelector('#passwordInput').value;

        if (username && password) {
            try {
                const result = await postFetch('/api/loginAuthApi/loginUser', {
                    username,
                    password
                });

                if (result.success) {
                    console.log(result.message);
                    Menu();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Hiba történt a bejelentkezés során');
                console.error(error);
            }
        } else {
            alert('Kérlek töltsd ki az összes mezőt!');
        }
    });

    let registerButton = document.createElement('input');
    registerButton.setAttribute('type', 'button');
    registerButton.setAttribute('value', 'Register');
    registerButton.setAttribute('class', 'menuButton');
    buttonContainers[1].appendChild(registerButton);
    registerButton.addEventListener('click', async function () {
        let username = document.querySelector('#usernameInput').value;
        let password = document.querySelector('#passwordInput').value;

        if (username && password) {
            try {
                const result = await postFetch('/api/loginAuthApi/registerUser', {
                    username,
                    password
                });

                if (result.success) {
                    console.log(result.message);
                    Menu();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Hiba történt a regisztráció során');
                console.error(error);
            }
        } else {
            alert('Kérlek töltsd ki az összes mezőt!');
        }
    });

    generateBackToMenu();
}

async function Logout() {
    try {
        await postFetch('/api/loginAuthApi/logout', {});
        Menu();
    } catch (error) {
        console.error('Hiba a kijelentkezés során:', error);
        Menu();
    }
}
