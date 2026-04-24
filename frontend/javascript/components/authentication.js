function buildAuthForm(fields) {
    generateBootStrapGrid(fields.length, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('.loginFormContainer');

    fields.forEach((form, i) => {
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
}

async function Login() {
    clearBody();

    generateBootStrapGrid(1, 1, 12, 'loginMenu');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.textContent = 'Login';
    document.querySelector('.loginMenu').appendChild(menuTitle);

    buildAuthForm([
        { label: 'Username:', type: 'text', id: 'usernameInput' },
        { label: 'Password:', type: 'password', id: 'passwordInput' }
    ]);

    generateBootStrapGrid(1, 1, 12, 'authButtonRow');
    const buttonContainer = document.querySelector('.authButtonRow');

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const passwordRegex = /^.{6,128}$/;

    let loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'button');
    loginButton.setAttribute('value', 'Login');
    loginButton.setAttribute('class', 'menuButton');
    buttonContainer.appendChild(loginButton);
    loginButton.addEventListener('click', async function () {
        const username = document.querySelector('#usernameInput').value.trim();
        const password = document.querySelector('#passwordInput').value;

        if (!usernameRegex.test(username)) {
            toast(
                'Username must be 3–20 characters: letters, numbers, or underscores only.',
                'error'
            );
            return;
        }
        if (!passwordRegex.test(password)) {
            toast('Password must be between 6 and 128 characters.', 'error');
            return;
        }

        try {
            const result = await postFetch('/api/loginAuthApi/loginUser', {
                username,
                password
            });

            if (result.success) {
                toast(result.message || 'Login successful!', 'success');
                Menu();
            } else {
                toast(result.message, 'error');
            }
        } catch (error) {
            toast('An error occurred during login.', 'error');
            console.error(error);
        }
    });

    generateBackToMenu();
}

async function Register() {
    clearBody();

    generateBootStrapGrid(1, 1, 12, 'loginMenu');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.textContent = 'Register';
    document.querySelector('.loginMenu').appendChild(menuTitle);

    buildAuthForm([
        { label: 'Username:', type: 'text', id: 'usernameInput' },
        { label: 'Password:', type: 'password', id: 'passwordInput' },
        { label: 'Confirm Password:', type: 'password', id: 'confirmPasswordInput' }
    ]);

    generateBootStrapGrid(1, 1, 12, 'authButtonRow');
    const buttonContainer = document.querySelector('.authButtonRow');

    const usernameRegex = /^[a-zA-Z0-9_]{3,12}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,15}$/;

    let registerButton = document.createElement('input');
    registerButton.setAttribute('type', 'button');
    registerButton.setAttribute('value', 'Register');
    registerButton.setAttribute('class', 'menuButton');
    buttonContainer.appendChild(registerButton);
    registerButton.addEventListener('click', async function () {
        const username = document.querySelector('#usernameInput').value.trim();
        const password = document.querySelector('#passwordInput').value;
        const confirmPassword = document.querySelector('#confirmPasswordInput').value;

        if (!usernameRegex.test(username)) {
            toast(
                'Username must be 3–12 characters: letters, numbers, or underscores only.',
                'error'
            );
            return;
        }
        if (!passwordRegex.test(password)) {
            toast(
                'Password must be 8–15 characters and include at least one letter and one number.',
                'error'
            );
            return;
        }
        if (password !== confirmPassword) {
            toast('Passwords do not match.', 'error');
            return;
        }

        try {
            const result = await postFetch('/api/loginAuthApi/registerUser', {
                username,
                password
            });

            if (result.success) {
                toast(result.message || 'Registration successful!', 'success');
                Menu();
            } else {
                toast(result.message, 'error');
            }
        } catch (error) {
            toast('An error occurred during registration.', 'error');
            console.error(error);
        }
    });

    generateBackToMenu();
}

async function Logout() {
    try {
        await postFetch('/api/loginAuthApi/logout', {});
        Menu();
    } catch (error) {
        console.error('An error occurred during logging out:', error);
        Menu();
    }
}
