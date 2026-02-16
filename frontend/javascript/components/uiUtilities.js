//Tool to generate bootstrap grid
function generateBootStrapGrid(row, col, col_md_value, className) {
    let contDiv = document.createElement('div');
    contDiv.setAttribute('class', 'container-fluid');

    for (let i = 0; i < row; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.setAttribute('class', 'row');
        contDiv.appendChild(rowDiv);

        for (let j = 0; j < col; j++) {
            let colDiv = document.createElement('div');
            let classes = [
                `col-sm-${col_md_value}`,
                `col-md-${col_md_value}`,
                'd-flex',
                'justify-content-center'
            ];
            if (className) {
                classes.push(className);
            }
            colDiv.setAttribute('class', classes.join(' '));
            rowDiv.appendChild(colDiv);
        }
    }

    /*
    ! May require further functionality
    */

    document.body.appendChild(contDiv);
    return contDiv;
}

function clearBody() {
    const body = document.body;
    body.replaceChildren();
}

function generateBackToMenu() {
    generateBootStrapGrid(1, 1, 12, 'backToMenu');

    let backButton = document.createElement('input');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', 'Back to Menu');
    backButton.setAttribute('class', 'menuButton');

    backButton.addEventListener('click', Menu);

    let backToMenu = document.querySelector('.backToMenu');
    backToMenu.appendChild(backButton);
}


function showLoadingScreen(message,className) {
    removeLoadingScreen(className);
    
    const loadingScreen = document.createElement('div');
    loadingScreen.className = className;
    loadingScreen.innerHTML = `
        <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-light mt-3">${message}</p>
    `;
    loadingScreen.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh;';
    document.body.appendChild(loadingScreen);
    
    return loadingScreen;
}

function removeLoadingScreen(className) {
    const loading = document.querySelector(`.${className}`);
    if (loading) {
        loading.remove();
    }
}
