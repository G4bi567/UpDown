

window.addEventListener("keydown", (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    } else if (event.key === 'w' && Math.abs(player1.body.velocity.y) < 0.01) {
        jump(player1);
        jumpSound.play();
    } else if (event.key === 'ArrowUp' && Math.abs(player2.body.velocity.y) < 0.01 && spawnPlayer2 == true) {
        jump(player2);
        jumpSound.play();
    } else if (event.key === 'g') {
        // Save the current time when the 'g' key is pressed for Player 2
        lastKeyPressTimePlayer2 = Date.now();
    } else if (event.key === 'Escape') {
        // Toggle the display of the menu
        const menu = document.getElementById('menu');
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
        movementSound.stop();
        walkSoundDelay = 0;
    }
});
