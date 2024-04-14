let gameStarted = false;
const GAME_WORLD_WIDTH = 2000;
const GAME_WORLD_HEIGHT = 1000;
let playerNickname = '';
let spawnPlayer2 = false;
let mode 
let particles = [];
let Windzonemet=true
const { Engine, World, Composite, Bodies } = Matter;
let player1
let player2;
let respawnPosition = { x: 50, y: 1100 };
let respawnPositionPlayer2 = { x: respawnPosition.x + 100, y: respawnPosition.y };
const keys = { d: false, a: false, ArrowLeft: false, ArrowRight: false };
let lookingleft1 = false;
let lookingleft2 = false;

let engine, world, boxes = [], zoom = 4, ground, sol, backgroundImage, CollisionBlocks = [], platformCollisionBlocks = [];
let lastWalkSoundTime = 0;
let walkSoundDelay = 1000;
let jumpSound, landingSound, movementSound;
let backgroundMusic;
let isPlayer1InAir = false;
let isPlayer2InAir = false;
let menuVisible = true;
let lastAttackTimePlayer1 = 0;
let lastAttackTimePlayer2 = 0;
let attackCooldown = 1500;
let lastKeyPressTimePlayer2 = 0;
let player1hit = false;
let player1attack = false;
let player2hit = false;
let player2attack = false;
let part2Started = false;
const windStrength = 0.0005; // Adjust this value based on desired effect
const windDirection = { x: 1, y: 0 }; // Wind blowing to the right
let windStart =350
let windEnd = 200
let windapply = false 
let playerReachesTop = false
let hasPlayerFallen = false;
let otherPlayers = {}; // Tracks other players
let roleplayer
let lobbyReady = false;
let timeAboveThreshold = 0;
const winningAltitude = 1100;
const requiredTime = 2000; // Time in milliseconds

function startGame(mode_name){
    document.getElementById('menu').style.display = 'none';
    mode = mode_name;
    if (mode_name == "solo") {
        lobbyReady = true;
        initializeGame();
    } else if (mode_name == "local") {
        lobbyReady = true;
        spawnPlayer2 = true;
        initializeGame();
    } else if (mode_name == "multiplayer") {
        spawnPlayer2 = true;
        toggleMultiplayerLobby();
        // Don't call initializeGame() here; it will be called after lobby setup
    }
}


function initializeGame() {
    setup();
    gameStarted = true;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    engine = Engine.create();
    world = engine.world;
    player1 = new Player(respawnPosition.x, respawnPosition.y, 16, 24);
    player1.body.label="player1"
    Composite.add(world, player1);

    if (spawnPlayer2) {
        player2 = new Player(respawnPositionPlayer2.x, respawnPositionPlayer2.y, 16, 24);
        player2.body.label="player2"
        Composite.add(world, player2);
        if (playerRole == "player2"){
            player1 = new Player(respawnPositionPlayer2.x, respawnPositionPlayer2.y, 16, 24)
            player2 = new Player(respawnPosition.x, respawnPosition.y, 16, 24);
        }
        
        
    }
   
    createCollisionBlocks(floorCollision, CollisionBlocks, 50, 100);
    createCollisionBlocks(platformCollision, platformCollisionBlocks, 5, 2);

    setupSounds();

}
let isMusicPlaying = false;  // Flag to track music state

function toggleBackgroundMusic() {
    if (backgroundMusic.isPlaying()) {  // Check if the music is playing
        backgroundMusic.pause();  // Pause the music
        isMusicPlaying = false;  // Update flag
    } else {
        backgroundMusic.loop();  // Play the music
        isMusicPlaying = true;  // Update flag
    }
}


function preload() {
    backgroundImage = loadImage('Sprites/Background/new.png');
    backgroundMusic = loadSound('Sprites/sound/background.mp3');
    jumpSound = loadSound('Sprites/sound/jump.mp3');
    hitSound = loadSound('Sprites/sound/hit.mp3');
    attackSound = loadSound('Sprites/sound/attack1.mp3');
    landingSound = loadSound('Sprites/sound/fall.mp3');
    movementSound = loadSound('Sprites/sound/walk.mp3');
}


function setupSounds() {
    movementSound.setVolume(0.14);
    landingSound.setVolume(0.14);
    jumpSound.setVolume(0.21);
    backgroundMusic.setVolume(0.1);
}


function playWalkSound() {
    const currentMillis = Date.now();
    if (currentMillis - lastWalkSoundTime > walkSoundDelay) {
        walkSoundDelay = 4000;
        movementSound.loop();
        lastWalkSoundTime = currentMillis;
    }
}

function createCollisionBlocks(data, collisionArray, yOffset, height) {
    const collision2D = [];
    for (let i = 0; i < data.length; i += 35) {
        collision2D.push(data.slice(i, i + 35));
    }
    collision2D.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol != 0) {
                collisionArray.push(new Boundary((x * 16) + 7, (y * 16) + yOffset, 16, height));
            }
        });
    });
    Composite.add(world, collisionArray);
}


function isPlayerTouching(object ,player) {
    const collision = Matter.SAT.collides(player.body, object.body);
    return collision ? collision.collided : false;
}

function handleKeyDown(event) {
    
    if (event.key in keys) {

        keys[event.key] = true;
    } else if (event.key === 'w' && Math.abs(player1.body.velocity.y) < 0.000000001) {
        jump(player1);
        jumpSound.play();
    } else if (event.key === 'ArrowUp' && Math.abs(player2.body.velocity.y) < 0.01 && spawnPlayer2) {
        jump(player2);
        jumpSound.play();
    } else if (event.key === 'Escape') {

        toggleMenuDisplay();
    }if (player2){
        if (event.key === 'l') {
        attack(player2,player1,lastAttackTimePlayer2)
        }else if (event.key === 'g') {
        attack(player1,player2,lastAttackTimePlayer1)
        }
    }
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyUp(event) {
    if (event.key in keys) {
        keys[event.key] = false;
        movementSound.stop();
        walkSoundDelay = 0;
    }
}
let lastPhysicsUpdate = Date.now();
const PHYSICS_UPDATE_RATE = 30; // Updates per second

function applyPlayerForces(player) {
    if (Date.now() - lastPhysicsUpdate > 1000 / PHYSICS_UPDATE_RATE  || mode != "multiplayer" ) {
        let playerVelocity = { x: player.body.velocity.x, y: player.body.velocity.y }
    
        if (player == player1) {

            if (!player1hit) {
                if (keys.a && keys.d) {

                    playerVelocity.x = 0;
                } else if (!keys.a && !keys.d) {
                    playerVelocity.x = 0;
                } else if (keys.a && playerVelocity.x >= -2.5) {
                    playWalkSound();
                    
                    playerVelocity.x = -2.5;
                    lookingleft1 = true;

                } else if (keys.d && playerVelocity.x <= 2.5) {
                    playWalkSound();
                    playerVelocity.x = 2.5;
                    lookingleft1 = false;
                }
            }
        } else {
            if (!player2hit) {
                
                if (keys.ArrowLeft && keys.ArrowRight || !keys.ArrowRight && !keys.ArrowLeft) {
                    playerVelocity.x = 0;
                } else if (keys.ArrowLeft) {
                    playWalkSound();
                    playerVelocity.x = -2.5;
                    lookingleft2 = true;
                } else if (keys.ArrowRight) {
                    playWalkSound();
                    playerVelocity.x = 2.5;
                    lookingleft2 = false;
                }
            }
        }
    Matter.Body.setVelocity(player.body, playerVelocity);
    lastPhysicsUpdate = Date.now();
    }
}

function handlePlayerPosition() {
    const playerX = player1.body.position.x;

    if (playerX < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (playerX > width / (zoom - 2) - player1.w - 50) {
        Matter.Body.setPosition(player1.body, { x: width / (zoom - 2) - player1.w - 50, y: player1.body.position.y });
    }
}

function checkPlayerReachedTree(player) {
    // Assuming the tree's position is known
    const treePosition = { x: 420, y: 104 };
    // Check if player is near the tree
    if (dist(player.body.position.x, player.body.position.y, treePosition.x, treePosition.y) < 15) {
        startPart2();
    }
}
function draw() {
    if (gameStarted) {
        if (mode === 'multiplayer' && player2) {
            drawSinglePlayer()
            throttleUpdateGame();
        }else if(spawnPlayer2){
            drawMultiplayer();
        } else {
            drawSinglePlayer();
        }
        
        checkifwin(player1)
        if (spawnPlayer2){
            checkifwin(player2)
            localmodeplay()
        }
        if (!part2Started) {
            checkPlayerReachedTree(player1);
        }
        if (part2Started) {
            checkPlayerFall(player1);
        }
        if (Windzonemet && player1.body.position.y < windStart ){
            Windcareful()
        }
        applyWindForce(player1);
  
        if (spawnPlayer2 && mode == "local") {

            if (Windzonemet && player2.body.position.y < windStart){
                Windcareful()
            }
            applyWindForce(player2);
        }

        if (playerReachesTop) {
            playerReachesTop = false;
            showPopup();
        }
    } else {
        drawWaitingScreen();
    }
}


function throttleUpdateGame() {
    // Throttle the update game function to reduce network load
    if (!lastUpdateTime || Date.now() - lastUpdateTime > 1000 / UPDATE_RATE) {
        updateGame();
        lastUpdateTime = Date.now();
    }
}


function drawMultiplayer() {
    let midpointX = (player1.body.position.x + player2.body.position.x) / 2;
    let midpointY = (player1.body.position.y + player2.body.position.y) / 2;

    // Calculate the dynamic zoom based on the distance between players
    let distanceBetweenPlayers = dist(player1.body.position.x, player1.body.position.y, player2.body.position.x, player2.body.position.y);
    let dynamicZoom = spawnPlayer2 ? constrain(map(distanceBetweenPlayers, 0, 500, 3, 1), 1, 3) : zoom;

    // Apply the translations and scaling to simulate camera movement
    // Make sure to translate by negative values to move the canvas in the opposite direction of the player movement
    let cameraX = width / 2 - midpointX * dynamicZoom;
    let cameraY = height / 2 - midpointY * dynamicZoom;

    push(); // Push the current transformation matrix onto the stack
    translate(cameraX, cameraY);
    scale(dynamicZoom);

    background(0);
    Engine.update(engine);
    image(backgroundImage, 0, 0);

    if (player1.body.position.y > height * 2 + 100) {
        respawnPlayer(player1);
    }
    if (player2.body.position.y > height * 2 + 100) {
        respawnPlayer(player2);
    }
    applyPlayerForces(player1);
    drawAttackGauge(player1);
    player1.show();
    if (player2) {
        applyPlayerForces(player2);
        drawAttackGauge(player2);
        player2.show(); // Ensure player2 is also rendered
    }

    for (let i = 0; i < CollisionBlocks.length; i++) {
        const block = CollisionBlocks[i];
        block.show();
        block.friction = 0;

        if (isPlayerTouching(block,player1)) {
            if (isPlayer1InAir) {
                isPlayer1InAir = false;
                landingSound.play();
            }
        }
        if (isPlayerTouching(block,player2)) {
            if (isPlayer2InAir) {
                isPlayer2InAir = false;
                landingSound.play();
            }
        }
    }


    translate(-cameraX * dynamicZoom, -cameraY * dynamicZoom);
    scale(1 / dynamicZoom);
    pop();
}

function drawSinglePlayer() {
    if (!player1 || !player1.body) {
        console.log("player1 or player1.body is undefined");
        return; // Exit the function if player1 or its body is undefined
    }
    let cameraX = -player1.body.position.x * zoom + width / 2;
    let cameraY = -player1.body.position.y * zoom + height / 2;

    scale(zoom);
    translate(cameraX / zoom, cameraY / zoom);
    background(0);
    Engine.update(engine);
    image(backgroundImage, 0, 0);

    if (player1.body.position.y > height * 2 + 100) {
        respawnPlayer(player1);
    }

    if (player1.body.position.y > height * 2 + 100) {
        respawnPlayer(player1);
    }
    
    applyPlayerForces(player1);
    drawAttackGauge(player1);
    player1.show();
    if (player2) {
        if (player2.body.position.y > height * 2 + 100) {
            respawnPlayer(player2);
        }
        applyPlayerForces(player2);
        drawAttackGauge(player2);
        player2.show(); // Ensure player2 is also rendered
    }

    for (let i = 0; i < CollisionBlocks.length; i++) {
        const block = CollisionBlocks[i];
        block.show();
        block.friction = 0;

        if (isPlayerTouching(block,player1)) {
            if (isPlayer1InAir) {
                isPlayer1InAir = false;
                landingSound.play();
            }
        }
    }

    if (abs(player1.body.velocity.y) > 0.1) {
        player1.friction = 0;
    } else {
        player1.friction = 1;
    }


    translate(-cameraX / zoom, -cameraY / zoom);
    scale(1 / zoom);
}

function drawWaitingScreen() {
    background(0);
    fill(255);
    // Draw a message or waiting screen indicating that the game is not started
}

function startPart2() {
    part2Started = true;
    playerReachesTop = true
    respawnPosition = {x:500,y:50}
    respawnPositionPlayer2 = {x:550,y:50}
    // Initialize part 2 environment
    // You may load different platforms, change the environment, etc.
}

function checkPlayerFall(player) {
    // Check if the player is falling fast
    if (player.body.velocity.y > 5.3 && part2Started) {
        hasPlayerFallen = true;
    }

    // Check if the player has stopped falling (velocity is near zero) and has previously fallen
    if (hasPlayerFallen && Math.abs(player.body.velocity.y) <= 0.13) {
        respawnPlayer(player); // Respawn the player
        hasPlayerFallen = false; // Reset the flag
    }
}
// Helper function to clamp values within a specified range
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function jump(player) {
    const force = { x: 0, y: -0.01 };
    Matter.Body.applyForce(player.body, player.body.position, force);
    if(player.body.label=="player1"){
        isPlayer1InAir=true
    }else{
        isPlayer2InAir=true
    }
}

function respawnPlayer(player) {
    Matter.Body.setPosition(player.body, respawnPosition);
    Matter.Body.setVelocity(player.body, { x: 0, y: 0 });
}
function attack(attacker, target, lastAttackTime) {
    // Check if players are close enough to interact
    const playersCloseEnough = abs(player1.body.position.x - player2.body.position.x) <= 30 &&
                               abs(player1.body.position.y - player2.body.position.y) <= 30;
    if (playersCloseEnough) {
        const currentMillis = Date.now();
        // Check if the attacker can attack based on cooldown
        if (currentMillis - lastAttackTime > attackCooldown) {
            attacker.attackGaugeVisible = true; // Show the gauge
            attacker.lastAttackTime = currentMillis; // Record the attack time
            if (attacker.body.label === 'player1') {
                lastAttackTimePlayer1 = currentMillis;
            } else {
                lastAttackTimePlayer2 = currentMillis;
            }
            attackSound.play();
            hitSound.play();
            setAttackRoles(target);
            applyAttackForce(attacker, target);
        }
    }
}


function setAttackRoles(target) {
    // Determine which player is hit and which player is attacking
    if (target.body.label === 'player1') {
        player1hit = true;
        player2attack = true;
    } else {
        player2hit = true;
        player1attack = true;
    }

    // Reset the roles after a delay
    setTimeout(() => {
        if (target.body.label === 'player1') {
            player1hit = false;
            player2attack = false;
        } else {
            player2hit = false;
            player1attack = false;
        }
    }, 600);
}

const maxWindVelocity = 3; // Maximum velocity when in the wind zone

function applyWindForce(player) {
    if (player.body.position.y > windEnd && player.body.position.y < windStart) {
        // Only apply wind force if the player's velocity is below the maximum
        if (Math.abs(player.body.velocity.x) < maxWindVelocity) {
            let windForce = { 
                x: windStrength * windDirection.x, 
                y: windStrength * windDirection.y 
            };
            Matter.Body.applyForce(player.body, player.body.position, windForce);
        }
    }
}


function applyAttackForce(attacker, target) {
    let force;

    // Determine the direction of the force based on the attacker's position
    if (attacker.body.position.x - target.body.position.x < 0) {
        force = { x: 4, y: -4 };
    } else {
        force = { x: -4, y: -4 };
    }

    // Apply the force to the target
    Matter.Body.setVelocity(target.body, force);
}


function toggleMenuDisplay() {
    if (document.getElementById('menu').style.display == 'none'){
        document.getElementById('menu').style.display = 'block';}
    else{
        document.getElementById('menu').style.display = 'none';
    }
    
}
function drawAttackGauge(player) {
    if (player.attackGaugeVisible) {
        const currentMillis = Date.now();
        const timeElapsed = currentMillis - player.lastAttackTime;
        const gaugeWidth = Math.max(0, player.attackGaugeWidth - (player.attackGaugeWidth * timeElapsed / attackCooldown));

        push();
        fill(255,255, 255); // Red color for the gauge
        noStroke();
        rect(player.body.position.x - player.attackGaugeWidth / 2, player.body.position.y - 30, gaugeWidth, player.attackGaugeHeight);
        pop();

        if (timeElapsed >= attackCooldown) {
            player.attackGaugeVisible = false; // Hide the gauge after cooldown
        }
    }
}

function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

let lastUpdateTime = Date.now();
const UPDATE_RATE = 15; 
function updateGame() {
    // Throttling network updates
    if (gameStarted && mode === 'multiplayer' && Date.now() - lastUpdateTime > 1000 / UPDATE_RATE) {
        const playerState = {
            position: player1.body.position,
            velocity: player1.body.velocity
            // Other player properties
        };
        socket.emit('updatePlayerState', playerState);
        lastUpdateTime = Date.now();
    }
}



function setupSocketListeners() {
    if (!socket) {
        console.log("Socket not initialized when setting up listeners");
        return;
    }

    socket.on('updateRemotePlayer', (data) => {
        console.log("Received data for remote player:", data);
        updateRemotePlayer(data);
    });

    // Add other socket event listeners here as needed
}

// Call this function after you are sure the socsket is initialized


function updateRemotePlayer(state) {
    if (player2 && player2.body) {
        Matter.Body.setPosition(player2.body, state.position);
        Matter.Body.setVelocity(player2.body, state.velocity);
    } else {
        console.log("player2 is not properly initialized");
    }
}
function showVictoryPopup() {
    document.getElementById('popup2').style.display = 'block';
    setTimeout(() => {
        document.getElementById('popup2').style.display = 'none';
        showGameMenu();
    }, 3000); // Display the popup for 3 seconds before showing the menu
}
function Windcareful() {
    document.getElementById('popup3').style.display = 'block';
    setTimeout(() => {
        document.getElementById('popup3').style.display = 'none';
    }, 3000); // Display the popup for 3 seconds before showing the menu
    Windzonemet = false
}
function checkifwin(player){
    let playerY = player.body.position.y;
    let currentMillis = Date.now();
    
    if (playerY >= winningAltitude && part2Started) {
        if (timeAboveThreshold === 0) { // Starting the timer
            timeAboveThreshold = currentMillis;
        } else if (currentMillis - timeAboveThreshold > requiredTime) {
            // Player has won the game
            showVictoryPopup();
            timeAboveThreshold = 0; // Reset the timer
        }
    }else{
        timeAboveThreshold = 0; 
    }
}
function showGameMenu() {
    document.getElementById('menu').style.display = 'block';
    resetGame(); // Call a function to reset game state
    
}

function resetGame() {
    // Reset all game settings to their initial states
    // This includes player positions, velocities, game timers, etc.
    if (player1 && player1.body) {
        Matter.Body.setPosition(player1.body, respawnPosition);
        Matter.Body.setVelocity(player1.body, { x: 0, y: 0 });
    }
    if (spawnPlayer2 && player2 && player2.body) {
        Matter.Body.setPosition(player2.body, respawnPositionPlayer2);
        Matter.Body.setVelocity(player2.body, { x: 0, y: 0 });
    }

    // Reset game flags
    gameStarted = false;
    part2Started = false;
    playerReachesTop = false;
    timeAboveThreshold = 0; // Reset the timer for altitude victory condition

    // Reset sound or music if needed
    if (backgroundMusic.isPlaying()) {
        backgroundMusic.stop();
    }

    // Hide any game-specific UI and show the main menu
    document.getElementById('menu').style.display = 'block';
    document.querySelectorAll('.game-ui').forEach(ui => ui.style.display = 'none'); // Assuming game UIs have a class 'game-ui'

    // Optionally clear any game-specific intervals or timeouts
    // clearInterval(gameInterval);
    // Reset any other state variables or cleanup tasks
}

// Function to stop the game and show the menu, might be called from a pause menu or game over logic
function stopGameAndShowMenu() {
    resetGame();
    toggleMenuDisplay(true); // Ensures the menu is shown if hidden
}

// Helper function to manage game menu display
function toggleMenuDisplay(show = false) {
    document.getElementById('menu').style.display = show ? 'block' : 'none';
}
// Constants
const MAX_DISTANCE = 500; // Maximum distance allowed between players
const TELEPORT_OFFSET = 50; // Distance to place the teleported player next to the other

function localmodeplay() {
    // Calculate the distance between the players
    let distance = dist(player1.body.position.x, player1.body.position.y, player2.body.position.x, player2.body.position.y);

    // Check if the distance is too great
    if (distance > MAX_DISTANCE) {
        if (part2Started) {
            // Part 2 logic: teleport the player above to the player below
            if (player1.body.position.y < player2.body.position.y) {
                // Player 1 is above Player 2
                teleportPlayerTo(player1, player2);
            } else {
                // Player 2 is above Player 1
                teleportPlayerTo(player2, player1);
            }
        } else {
            // Normal logic: teleport the player below to the player above
            if (player1.body.position.y < player2.body.position.y) {
                // Player 1 is above Player 2
                teleportPlayerTo(player2, player1);
            } else {
                // Player 2 is above Player 1
                teleportPlayerTo(player1, player2);
            }
        }
    }
} 

// Teleport a player to another player's position with an offset
function teleportPlayerTo(playerToTeleport, referencePlayer) {
    // Calculate the direction to place the teleported player
    let direction = (playerToTeleport.body.position.x > referencePlayer.body.position.x) ? -1 : 1;

    // Set the new position for the teleported player
    let newX = referencePlayer.body.position.x + direction * TELEPORT_OFFSET;
    let newY = referencePlayer.body.position.y; // Same vertical position, or adjust as needed

    // Update the position of the player
    Matter.Body.setPosition(playerToTeleport.body, { x: newX, y: newY });
}
