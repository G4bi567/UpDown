let gameStarted = false;

function startGame(mode) {
    if (mode === 'solo') {
        spawnPlayer2 = false;
    } else if (mode === 'local') {
        spawnPlayer2 = true;
    } else if (mode === 'multiplayer') {
        // Add logic for multiplayer if needed
    }
    document.getElementById('menu').style.display = 'none';
    gameStarted = true;
    setup();
}

