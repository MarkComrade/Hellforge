function Admin() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    generateBootStrapGrid(1, 1, 12);
    let menuTitle = document.createElement('div');
    menuTitle.setAttribute('class', 'menuTitle adminMenu');
    menuTitle.innerHTML = 'Admin Login';
    document.querySelector('.col-md-12').appendChild(menuTitle);

    generateBackToMenu();
}
