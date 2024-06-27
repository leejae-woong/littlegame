document.addEventListener('DOMContentLoaded', () => {
    const playerCountInput = document.getElementById('playerCount');
    const setPlayersButton = document.getElementById('setPlayers');
    const setupDiv = document.getElementById('setup');
    const individualSetupDiv = document.getElementById('individualSetup');
    const playerNameInput = document.getElementById('playerName');
    const playerPasswordInput = document.getElementById('playerPassword');
    const savePlayerButton = document.getElementById('savePlayer');
    const gameDiv = document.getElementById('game');
    const roundNumberSpan = document.getElementById('roundNumber');
    const playerActionsDiv = document.getElementById('playerActions');
    const showResultsButton = document.getElementById('showResults');
    const startGameButton = document.getElementById('startGame');

    let players = [];
    let currentPlayerIndex = 0;
    let currentRound = 1;
    const totalRounds = 6;

    setPlayersButton.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value);
        if (playerCount < 6 || playerCount > 12) {
            alert('플레이어 인원수를 6명에서 12명 사이로 설정해주세요.');
            return;
        }

        players = [];
        for (let i = 0; i < playerCount; i++) {
            players.push({ name: '', password: '', selectedVillage: null });
        }

        setupDiv.classList.add('hidden');
        individualSetupDiv.classList.remove('hidden');
        showPlayerSetup(currentPlayerIndex);
    });

    function showPlayerSetup(index) {
        playerNameInput.value = players[index].name || '';
        playerPasswordInput.value = players[index].password || '';
    }

    savePlayerButton.addEventListener('click', () => {
        const playerName = playerNameInput.value;
        const playerPassword = playerPasswordInput.value;

        if (playerName && playerPassword.length === 4) {
            players[currentPlayerIndex].name = playerName;
            players[currentPlayerIndex].password = playerPassword;
            currentPlayerIndex++;
            if (currentPlayerIndex < players.length) {
                showPlayerSetup(currentPlayerIndex);
            } else {
                individualSetupDiv.classList.add('hidden');
                startGameButton.classList.remove('hidden');
            }
        } else {
            alert('비밀번호를 4자리로 설정해주세요.');
        }
    });

    startGameButton.addEventListener('click', () => {
        gameDiv.classList.remove('hidden');
        startGameButton.classList.add('hidden');
        startRound();
    });

    function startRound() {
        roundNumberSpan.textContent = currentRound;
        playerActionsDiv.innerHTML = '';

        players.forEach((player, index) => {
            const playerActionDiv = document.createElement('div');
            playerActionDiv.classList.add('mb-2');

            const playerNameSpan = document.createElement('span');
            playerNameSpan.textContent = player.name;
            playerNameSpan.classList.add('mr-2');

            const playerPasswordInput = document.createElement('input');
            playerPasswordInput.type = 'password';
            playerPasswordInput.placeholder = '비밀번호 입력';
            playerPasswordInput.classList.add('border', 'p-2', 'mr-2');

            const selectVillageButton = document.createElement('button');
            selectVillageButton.textContent = '마을 선택';
            selectVillageButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2');
            selectVillageButton.addEventListener('click', () => {
                if (playerPasswordInput.value === player.password) {
                    const villageChoiceDiv = document.createElement('div');
                    const smallVillageButton = document.createElement('button');
                    smallVillageButton.textContent = '작은마을';
                    smallVillageButton.classList.add('bg-green-500', 'text-white', 'px-4', 'py-2', 'mr-2');
                    smallVillageButton.addEventListener('click', () => {
                        player.selectedVillage = '작은마을';
                        selectVillageButton.disabled = true;
                        villageChoiceDiv.remove();
                    });

                    const bigVillageButton = document.createElement('button');
                    bigVillageButton.textContent = '큰마을';
                    bigVillageButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2');
                    bigVillageButton.addEventListener('click', () => {
                        player.selectedVillage = '큰마을';
                        selectVillageButton.disabled = true;
                        villageChoiceDiv.remove();
                    });

                    villageChoiceDiv.appendChild(smallVillageButton);
                    villageChoiceDiv.appendChild(bigVillageButton);
                    playerActionDiv.appendChild(villageChoiceDiv);
                } else {
                    alert('비밀번호가 틀렸습니다.');
                }
            });

            playerActionDiv.appendChild(playerNameSpan);
            playerActionDiv.appendChild(playerPasswordInput);
            playerActionDiv.appendChild(selectVillageButton);
            playerActionsDiv.appendChild(playerActionDiv);
        });

        showResultsButton.classList.remove('hidden');
        showResultsButton.addEventListener('click', showRoundResults);
    }

    function showRoundResults() {
        const smallVillagePlayers = players.filter(player => player.selectedVillage === '작은마을');
        const bigVillagePlayers = players.filter(player => player.selectedVillage === '큰마을');

        alert(`라운드 ${currentRound} 결과\n작은마을: ${smallVillagePlayers.map(player => player.name).join(', ')}\n큰마을: ${bigVillagePlayers.map(player => player.name).join(', ')}\n${smallVillagePlayers.length <= bigVillagePlayers.length ? '작은마을 승리' : '큰마을 승리'}`);

        if (currentRound < totalRounds) {
            currentRound++;
            startRound();
        } else {
            alert('게임 종료');
            setupDiv.classList.remove('hidden');
            gameDiv.classList.add('hidden');
            startGameButton.classList.add('hidden');
            currentRound = 1;
        }
    }
});
