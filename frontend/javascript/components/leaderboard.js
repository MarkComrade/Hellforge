function LeaderBoard() {
    let body = document.getElementsByTagName('body');
    body[0].innerHTML = '';

    // Title
    generateBootStrapGrid(1, 1, 12);
    let leaderBoardTitle = document.createElement('div');
    leaderBoardTitle.setAttribute('class', 'menuTitle leaderMenu');
    leaderBoardTitle.innerHTML = 'LeaderBoard';
    document.querySelector('.col-md-12').appendChild(leaderBoardTitle);

    // Fetch leaderboard data from API
    // Simulate logged-in user (in real app, get from session/auth)
    const loggedInUsername = 'test_player_' + (Math.floor(Math.random() * 13) + 1); // Random player 1-13

    fetch(`/api/leaderboard?username=${loggedInUsername}`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Leaderboard data:', data); // Debug log
            let loggedIn = true;
            let top10 = data.top10 || [];
            let userData = data.user;

            if (top10.length === 0) {
                console.warn('No leaderboard data received');
                return;
            }

            if (loggedIn && userData) {
                let displayData = [];

                // Check if user is in top 10
                const isInTop10 = top10.some((player) => player.name === userData.name);

                if (isInTop10) {
                    // User is in top 10, show all top 10
                    displayData = top10;
                    generatepiles(displayData, userData, loggedIn, userData.rank - 1);
                } else {
                    // User is outside top 10, show top 9 + user at the end
                    displayData = top10.slice(0, 9);
                    displayData.push(userData);
                    generatepiles(displayData, userData, loggedIn, userData.rank - 1);
                }
            } else {
                generatepiles(top10, null, false, null);
            }
        })
        .catch((error) => {
            console.error('Error fetching leaderboard:', error);
            // Fallback: generate test data
            let leaderboardData = [];
            for (let i = 1; i <= 20; i++) {
                leaderboardData.push({
                    name: `Player${i}`,
                    score: Math.floor(Math.random() * 1000000)
                });
            }
            generatepiles(leaderboardData.slice(0, 10), null, false, null);
        });

    // Érmehalmok generálása
    function generatepiles(top9, loggedUser, loggedIn, userIndex) {
        const row = document.createElement('div');
        row.className = 'row justify-content-center';

        const container = document.createElement('div');
        container.className = 'leadboardContainer container-fluid';

        const maxScore = top9[0].score;
        const maxCoins = 150;

        top9.forEach((entry) => {
            // játékos "kártya"
            let entryDiv = document.createElement('div');
            entryDiv.className = 'playerCard text-center p-3 rounded col-sm-1 ';

            // név
            const nameDiv = document.createElement('div');
            nameDiv.className = 'playerName fw-bold  mt-1';
            nameDiv.innerText = entry.name;

            // pont
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'playerScore text-light';
            scoreDiv.innerText = `${entry.score}p`;

            // érme halom
            let coinStackRow = document.createElement('div');
            coinStackRow.className = 'coinStackRow d-flex flex-direction-row';
            const coinStack1 = document.createElement('div');
            coinStack1.className =
                'coinStack d-flex flex-column align-items-center justify-content-end position-relative';
            const coinStack2 = document.createElement('div');
            coinStack2.className =
                'coinStack d-flex flex-column align-items-center justify-content-end position-relative';
            const coinStack3 = document.createElement('div');
            coinStack3.className =
                'coinStack d-flex flex-column align-items-center justify-content-end position-relative';
            let coinStackPosition1 = 0;
            let coinStackPosition2 = 0;
            let coinStackPosition3 = 0;
            if (entry.score == 0) {
                const noCoinDiv = document.createElement('div');
                noCoinDiv.className = 'noCoins text-light small';
                noCoinDiv.innerText = 'No coins';
                coinStack2.appendChild(noCoinDiv);
            } else {
                const coinCount = Math.max(1, Math.round((entry.score / maxScore) * maxCoins));
                for (let c = 0; c < coinCount; c++) {
                    const whichStack = Math.floor(Math.random() * 7) + 1;

                    const coin = document.createElement('img');
                    coin.className = 'coin';
                    coin.src = '../textures/items/coing.png';

                    switch (whichStack) {
                        case 1:
                        case 2:
                            coin.style.bottom = `${coinStackPosition1 * 0.38}vh`;
                            coinStack1.appendChild(coin);
                            coinStackPosition1++;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            coin.style.bottom = `${coinStackPosition2 * 0.38}vh`;
                            coinStack2.appendChild(coin);
                            coinStackPosition2++;
                            break;
                        case 6:
                        case 7:
                            coin.style.bottom = `${coinStackPosition3 * 0.38}vh`;
                            coinStack3.appendChild(coin);
                            coinStackPosition3++;
                            break;
                    }

                    // animáció időzítése
                    setTimeout(() => {
                        coin.classList.add('coinVisible');
                    }, c * 35);
                }
            }

            // kiemelés, ha a bejelentkezett userről van szó
            if (loggedIn && entry.name === loggedUser.name) {
                nameDiv.classList.add('highlightedPlayer');
            }
            coinStackRow.appendChild(coinStack1);
            coinStackRow.appendChild(coinStack2);
            coinStackRow.appendChild(coinStack3);
            entryDiv.appendChild(coinStackRow);
            entryDiv.appendChild(nameDiv);
            entryDiv.appendChild(scoreDiv);
            row.appendChild(entryDiv);
            container.appendChild(row);

            document.body.appendChild(container);
        });
    }

    generateBackToMenu();
}
