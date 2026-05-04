let leaderboardAbortController = null;

const COIN_TEXTURE = '../textures/items/coin.png';
const MAX_COINS = 150;
const COIN_SPACING = 0.38;
const COIN_ANIMATION_DELAY = 35; 
const COIN_STACK_CLASS =
    'coinStack d-flex flex-column align-items-center justify-content-end position-relative';


function LeaderBoard() {
    
    if (leaderboardAbortController) {
        leaderboardAbortController.abort();
    }
    leaderboardAbortController = new AbortController();

    clearBody();
    renderTitle();
    fetchLeaderboardData();
    generateBackToMenu();
}


function renderTitle() {
    generateBootStrapGrid(1, 1, 12);
    const title = document.createElement('div');
    title.className = 'menuTitle leaderMenu';
    title.textContent = 'LeaderBoard';
    document.querySelector('.col-md-12').appendChild(title);
}


async function fetchLeaderboardData() {
    
    let loggedInUsername = null;
    try {
        const session = await getMethodFetch('/api/loginAuthApi/session');
        if (session.isLoggedIn && session.userName) {
            loggedInUsername = session.userName;
        }
    } catch (error) {
        console.warn('Could not fetch session, showing leaderboard without user highlight');
    }

    const url = loggedInUsername
        ? `/api/leaderboard?username=${loggedInUsername}`
        : '/api/leaderboard';

    fetch(url, { signal: leaderboardAbortController.signal })
        .then((response) => response.json())
        .then((data) => {
            const top10 = data.top10 || [];

            if (top10.length === 0) {
                toast('No leaderboard data found yet.', 'warning');
                return;
            }

            
            const userData =
                data.user ||
                (loggedInUsername
                    ? { name: loggedInUsername, score: 0, rank: top10.length + 1 }
                    : null);

            if (userData) {
                const isInTop10 = top10.some((player) => player.name === userData.name);
                
                const displayData = isInTop10 ? top10 : [...top10.slice(0, 9), userData];
                generatePiles(displayData, userData);
            } else {
                generatePiles(top10, null);
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') return;
            toast('Failed to load leaderboard', 'error');
            console.error('Error fetching leaderboard:', error);
        });
}


function createCoinStack() {
    const element = document.createElement('div');
    element.className = COIN_STACK_CLASS;
    return { element, position: 0 };
}


function generatePiles(players, loggedUser) {
    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    const container = document.createElement('div');
    container.className = 'leadboardContainer container-fluid';

    const maxScore = Number(players[0].score);

    players.forEach((entry) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'playerCard text-center p-3 rounded col-sm-1';

        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'playerName fw-bold mt-1';
        nameDiv.innerText = entry.name;

        
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'playerScore text-light';
        scoreDiv.innerText = `${entry.score}g`;

        
        const coinStackRow = document.createElement('div');
        coinStackRow.className = 'coinStackRow d-flex flex-direction-row';

        const stacks = [createCoinStack(), createCoinStack(), createCoinStack()];

        if (Number(entry.score) === 0) {
            const noCoinDiv = document.createElement('div');
            noCoinDiv.className = 'noCoins text-light small';
            noCoinDiv.innerText = 'Zero coins';
            stacks[1].element.appendChild(noCoinDiv);
        } else {
            const coinCount = Math.max(1, Math.round((Number(entry.score) / maxScore) * MAX_COINS));

            for (let c = 0; c < coinCount; c++) {
                const coin = document.createElement('img');
                coin.className = 'coin';
                coin.src = COIN_TEXTURE;

                
                const roll = Math.floor(Math.random() * 7);
                const stackIndex = roll < 2 ? 0 : roll < 5 ? 1 : 2;
                const stack = stacks[stackIndex];

                coin.style.bottom = `${stack.position * COIN_SPACING}vh`;
                stack.element.appendChild(coin);
                stack.position++;

                
                setTimeout(() => coin.classList.add('coinVisible'), c * COIN_ANIMATION_DELAY);
            }
        }

        
        if (loggedUser && entry.name === loggedUser.name) {
            nameDiv.classList.add('highlightedPlayer');
        }

        
        stacks.forEach((stack) => coinStackRow.appendChild(stack.element));
        entryDiv.appendChild(coinStackRow);
        entryDiv.appendChild(nameDiv);
        entryDiv.appendChild(scoreDiv);
        row.appendChild(entryDiv);
    });

    container.appendChild(row);
    document.body.appendChild(container);
}
