isLoggedIn = false;
userName = '';
userPassword = '';

//Login menu
function Login() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    generateBootStrapGrid(1, 1, 12, 'loginMenu');
    let menuTitle = document.createElement('h1');
    menuTitle.setAttribute('class', 'menuTitle');
    menuTitle.innerHTML = 'Login';
    document.querySelector('.loginMenu').appendChild(menuTitle);

    generateBootStrapGrid(3, 1, 12, 'loginFormContainer');
    const loginRows = document.querySelectorAll('.loginFormContainer');

    const forms = [
        { label: 'Username:', type: 'text', id: 'usernameInput' },
        { label: 'Password:', type: 'password', id: 'passwordInput' },
        { label: 'Password again:', type: 'password', id: 'passwordConfirmationInput' }
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
        label.innerHTML = form.label;
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

    generateBootStrapGrid(1, 2, 6, 'loginButtonRow');
    let loginButton = document.createElement('input');
    loginButton.setAttribute('type', 'button');
    loginButton.setAttribute('value', 'Login / Register');
    loginButton.setAttribute('class', 'menuButton');
    document.querySelector('.loginButtonRow').appendChild(loginButton);
    loginButton.addEventListener('click', function () {
        let username = document.querySelector('#usernameInput').value;
        let password = document.querySelector('#passwordInput').value;
        let passwordConfirmation = document.querySelector('#passwordConfirmationInput').value;

        if (username && password && password === passwordConfirmation) {
            userName = username;
            userPassword = password;
            isLoggedIn = true;
            Menu();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    let guestButton = document.createElement('input');
    guestButton.setAttribute('type', 'button');
    guestButton.setAttribute('value', 'Continue as Guest');
    guestButton.setAttribute('class', 'menuButton');
    document.querySelector('.loginButtonRow').nextSibling.appendChild(guestButton);
    guestButton.addEventListener('click', function () {
        isLoggedIn = false;
        userName = 'Guest';
        Menu();
    });

    generateBackToMenu();
}

function Logout() {
    if (isLoggedIn == true || (isLoggedIn == false && userName == 'Guest')) {
        isLoggedIn = false;
        userName = '';
        userPassword = '';
        Menu();
    }
}
