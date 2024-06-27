document.addEventListener('DOMContentLoaded', () => {
    const playerCountInput = document.getElementById('playerCount');
    const setPlayersButton = document.getElementById('setPlayers');
    const setupDiv = document.getElementById('setup');
    const playerSetupDiv = document.getElementById('playerSetup');
    const playerNameInput = document.getElementById('playerName');
    const playerPasswordInput = document.getElementById('playerPassword');
    const savePlayerButton = document.getElementById('savePlayer');
    const gameDiv = document.getElementById('game');
    const roundNumberSpan = document.getElementById('roundNumber');
    const playerActionsDiv = document.getElementById('playerActions');
    const showResultsButton = document.getElementById('showResults');
    const passwordPromptDiv = document.getElementById('passwordPrompt');
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordButton = document.getElementById('submitPassword');
    const villageSelectionDiv = document.getElementById('villageSelection');
    const smallVillageButton = document.getElementById('smallVillage');
    const bigVillageButton = document.getElementById('bigVillage');
    const resultsDiv = document.getElementById('results');
    const resultRoundNumberSpan = document.getElementById('resultRoundNumber');
    const resultDetailsDiv = document.getElementById('resultDetails');
    const nextRoundButton = document.getElementById('nextRound');

    let players = [];
    let currentPlayerIndex = 0;
    let currentRound = 1;
    let currentVillageSelectionPlayer = null;
    const totalRounds = 5;

    setPlayersButton.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value);
        if (playerCount < 6 || playerCount > 12) {
            alert('플레이어 인원수를 6명에서 12명 사이로 설정해주세요.');
            return;
        }

        players = Array(playerCount).fill({}).map(() => ({ name: '', password: '', selectedVillage: null }));

        setupDiv.classList.add('hidden');
        playerSetupDiv.classList.remove('hidden');
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
                playerSetupDiv.classList.add('hidden');
                gameDiv.classList.remove('hidden');
                startRound();
            }
        } else {
            alert('이름을 입력하고 비밀번호를 4자리로 설정해주세요.');
        }
    });

    function startRound() {
        roundNumberSpan.textContent = currentRound;
        playerActionsDiv.innerHTML = '';

        players.forEach((player, index) => {
            const playerButton = document.createElement('button');
            playerButton.textContent = player.name;
            playerButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'mr-2', 'mb-2');
            if (player.selectedVillage) {
                playerButton.classList.remove('bg-blue-500');
                playerButton.classList.add('bg-gray-500');
                playerButton.disabled = true;
            }
            playerButton.addEventListener('click', () => {
                currentVillageSelectionPlayer = player;
                passwordPromptDiv.classList.remove('hidden');
                gameDiv.classList.add('hidden');
            });
            playerActionsDiv.appendChild(playerButton);
        });

        showResultsButton.classList.remove('hidden');
        showResultsButton.addEventListener('click', showRoundResults);
    }

    submitPasswordButton.addEventListener('click', () => {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === currentVillageSelectionPlayer.password) {
            passwordPromptDiv.classList.add('hidden');
            villageSelectionDiv.classList.remove('hidden');
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    });

    smallVillageButton.addEventListener('click', () => {
        selectVillage('작은마을');
    });

    bigVillageButton.addEventListener('click', () => {
        selectVillage('큰마을');
    });

    function selectVillage(village) {
        currentVillageSelectionPlayer.selectedVillage = village;
        villageSelectionDiv.classList.add('hidden');
        gameDiv.classList.remove('hidden');
        startRound();
    }

    function showRoundResults() {
        const smallVillagePlayers = players.filter(player => player.selectedVillage === '작은마을');
        const bigVillagePlayers = players.filter(player => player.selectedVillage === '큰마을');

        resultRoundNumberSpan.textContent = currentRound;
        resultDetailsDiv.innerHTML = `
            <p>작은마을: ${smallVillagePlayers.map(player => player.name).join(', ')}</p>
            <p>큰마을: ${bigVillagePlayers.map(player => player.name).join(', ')}</p>
        `;

        let resultMessage;
        if (smallVillagePlayers.length === bigVillagePlayers.length) {
            resultMessage = `무승부`;
        } else {
            const winningVillage = smallVillagePlayers.length < bigVillagePlayers.length ? '작은마을' : '큰마을';
            resultMessage = `${winningVillage} 승리`;
        }

        resultDetailsDiv.innerHTML += `<p>${resultMessage}</p>`;

        gameDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
    }

    nextRoundButton.addEventListener('click', () => {
        if (currentRound < totalRounds) {
            currentRound++;
            players.forEach(player => player.selectedVillage = null);
            resultsDiv.classList.add('hidden');
            startRound();
            gameDiv.classList.remove('hidden');
        } else {
            alert('게임 종료');
            setupDiv.classList.remove('hidden');
            resultsDiv.classList.add('hidden');
            currentRound = 1;
        }
    });
});
