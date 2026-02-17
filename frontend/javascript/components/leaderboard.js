let leaderboardAbortController = null;

const COIN_TEXTURE = '../textures/items/coing.png';
const MAX_COINS = 150;
const COIN_SPACING = 0.38;
const COIN_ANIMATION_DELAY = 35; // ms delay between each coin appearing
const COIN_STACK_CLASS =
    'coinStack d-flex flex-column align-items-center justify-content-end position-relative';

/**
 * Renders the leaderboard screen with player rankings and coin pile visualizations.
 * Cancels any pending fetch from a previous call  WINDOW RESIZE
 */
function LeaderBoard() {
    // Cancel any in-flight request to prevent duplicate renders on resize
    if (leaderboardAbortController) {
        leaderboardAbortController.abort();
    }
    leaderboardAbortController = new AbortController();

    clearBody();
    renderTitle();
    fetchLeaderboardData();
    generateBackToMenu();
}

/** Creates the leaderboard page title. */
function renderTitle() {
    generateBootStrapGrid(1, 1, 12);
    const title = document.createElement('div');
    title.className = 'menuTitle leaderMenu';
    title.textContent = 'LeaderBoard';
    document.querySelector('.col-md-12').appendChild(title);
}

/** Fetches leaderboard data and determines which players to display. */
function fetchLeaderboardData() {
    // TODO: Replace with actual logged-in username from session/auth
    const loggedInUsername = 'test_player_' + (Math.floor(Math.random() * 13) + 1);

    fetch(`/api/leaderboard?username=${loggedInUsername}`, {
        signal: leaderboardAbortController.signal
    })
        .then((response) => response.json())
        .then((data) => {
            const top10 = data.top10 || [];
            const userData = data.user;

            if (top10.length === 0) {
                console.warn('No leaderboard data received');
                return;
            }

            if (userData) {
                const isInTop10 = top10.some((player) => player.name === userData.name);
                // If user isn't in top 10, show top 9 + user at the end
                const displayData = isInTop10 ? top10 : [...top10.slice(0, 9), userData];
                generatePiles(displayData, userData);
            } else {
                generatePiles(top10, null);
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') return;
            console.error('Error fetching leaderboard:', error);
        });
}

/**
 * Creates a single coin stack column element.
 * @returns {{ element: HTMLDivElement, position: number }}
 */
function createCoinStack() {
    const element = document.createElement('div');
    element.className = COIN_STACK_CLASS;
    return { element, position: 0 };
}

/**
 * Generates the coin pile visualizations for each player.
 * Coin count is proportional to the player's score relative to the top scorer.
 * @param {Array} players - Array of player objects with name and score
 * @param {Object|null} loggedUser - The currently logged-in user's data, or null
 */
function generatePiles(players, loggedUser) {
    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    const container = document.createElement('div');
    container.className = 'leadboardContainer container-fluid';

    const maxScore = players[0].score;

    players.forEach((entry) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'playerCard text-center p-3 rounded col-sm-1';

        // Player name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'playerName fw-bold mt-1';
        nameDiv.innerText = entry.name;

        // Player score
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'playerScore text-light';
        scoreDiv.innerText = `${entry.score}p`;

        // Coin stacks (3 columns for visual spread)
        const coinStackRow = document.createElement('div');
        coinStackRow.className = 'coinStackRow d-flex flex-direction-row';

        const stacks = [createCoinStack(), createCoinStack(), createCoinStack()];

        if (entry.score === 0) {
            const noCoinDiv = document.createElement('div');
            noCoinDiv.className = 'noCoins text-light small';
            noCoinDiv.innerText = 'No coins';
            stacks[1].element.appendChild(noCoinDiv);
        } else {
            const coinCount = Math.max(1, Math.round((entry.score / maxScore) * MAX_COINS));

            for (let c = 0; c < coinCount; c++) {
                const coin = document.createElement('img');
                coin.className = 'coin';
                coin.src = COIN_TEXTURE;

                // Randomly distribute coins across the 3 stacks (weighted toward center)
                const roll = Math.floor(Math.random() * 7);
                const stackIndex = roll < 2 ? 0 : roll < 5 ? 1 : 2;
                const stack = stacks[stackIndex];

                coin.style.bottom = `${stack.position * COIN_SPACING}vh`;
                stack.element.appendChild(coin);
                stack.position++;

                // Staggered fade-in animation
                setTimeout(() => coin.classList.add('coinVisible'), c * COIN_ANIMATION_DELAY);
            }
        }

        // Highlight the logged-in player
        if (loggedUser && entry.name === loggedUser.name) {
            nameDiv.classList.add('highlightedPlayer');
        }

        // Assemble the player card
        stacks.forEach((stack) => coinStackRow.appendChild(stack.element));
        entryDiv.appendChild(coinStackRow);
        entryDiv.appendChild(nameDiv);
        entryDiv.appendChild(scoreDiv);
        row.appendChild(entryDiv);
    });

    container.appendChild(row);
    document.body.appendChild(container);
}
