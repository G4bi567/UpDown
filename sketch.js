const GAME_WORLD_WIDTH = 2000;
const GAME_WORLD_HEIGHT = 1000;
const { Engine, World, Composite, Bodies } = Matter;
let CollisionBlocks = [], platformCollisionBlocks = [];


let gameStarted = false;
let mode;
let player1;
let player2;
let spawnPlayer2 = false;


let engine, world;
let zoom = 4;


let backgroundImage;
let lastWalkSoundTime = 0;
let walkSoundDelay = 1000;
let jumpSound, landingSound, movementSound,backgroundMusic;
let isMusicPlaying = false;

let part2Started = false;
let playerReachesTop = false
let timeAboveThreshold = 0;
const winningAltitude = 1100;
const requiredTime = 2000;

let respawnPosition = { x: 50, y: 1100 };
let respawnPositionPlayer2 = { x: respawnPosition.x + 100, y: respawnPosition.y };


const keys = { d: false, a: false, ArrowLeft: false, ArrowRight: false };
let lookingleft1 = false;
let lookingleft2 = false;


let playerNickname = '';


let isPlayer1InAir = false;
let isPlayer2InAir = false;
let lastAttackTimePlayer1 = 0;
let lastAttackTimePlayer2 = 0;
let attackCooldown = 1500;
let player1hit = false;
let player1attack = false;
let player2hit = false;
let player2attack = false;
let hasPlayerFallen = false;


let Windzonemet=true;
const windStrength = 0.0005;
const windDirection = { x: 1, y: 0 };
let windStart =350;
let windEnd = 200 ;
const maxWindVelocity = 3;

let lobbyReady = false;
let roleplayer;


let lastUpdateTime = Date.now();
const UPDATE_RATE = 15;


const MAX_DISTANCE = 500;
const TELEPORT_OFFSET = 50;


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

function toggleBackgroundMusic() {
    if (backgroundMusic.isPlaying()) {
        backgroundMusic.pause();
        isMusicPlaying = false; 
    } else {
        backgroundMusic.loop();  
        isMusicPlaying = true;  
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
    movementSound.setVolume(GameConfig.soundVolumes.movement);
    landingSound.setVolume(GameConfig.soundVolumes.landing);
    jumpSound.setVolume(GameConfig.soundVolumes.jump);
    backgroundMusic.setVolume(GameConfig.soundVolumes.backgroundMusic);
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
    /**
 * Generates collision blocks 16x16 pixels from a given dataset and adds them to the game world.
 * @param {Array} data - Array of data defining blocks.
 * @param {Array} collisionArray - Array to store created block objects.
 * @param {number} yOffset - Vertical offset for positioning blocks.
 * @param {number} height - Height of each block.
 */
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

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {

    if (event.key in keys) {
        keys[event.key] = true;
    }

    handleGameControls(event);
}

function handleGameControls(event) {
    switch (event.key) {
        case 'w':
            tryPlayerJump(player1, 0.000000001);
            break;
        case 'ArrowUp':
            if (spawnPlayer2) {
                tryPlayerJump(player2, 0.000000001);
            }
            break;
        case 'Escape':
            escapetoggleMenuDisplay();
            break;
        case 'l':
            if (player2) {
                attack(player2, player1, lastAttackTimePlayer2);
            }
            break;
        case 'g':
            if (player2) {
                attack(player1, player2, lastAttackTimePlayer1);
            }
            break;
    }
}

function tryPlayerJump(player, threshold) {
    if (Math.abs(player.body.velocity.y) < threshold) {
        jump(player);
        jumpSound.play();
    }
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

function handleKeyUp(event) {
    if (event.key in keys) {
        keys[event.key] = false;
        movementSound.stop();
        walkSoundDelay = 0;
    }
}

function applyPlayerForces(player) {
    updatePlayerVelocity(player);

}

function updatePlayerVelocity(player) {
    if (player === player1) {
        handlePlayerMovement(player, 'a', 'd', lookingleft1);
    } else if (player === player2) {
        handlePlayerMovement(player, 'ArrowLeft', 'ArrowRight', lookingleft2);
    }
}

function handlePlayerMovement(player, leftKey, rightKey, lookingLeft) {
    /**
     * Applies dynamic forces to a player based on current game inputs and player status.
     * It adjusts player velocity depending on input keys and current game mode.
     * - Prevents movement if the player is hit.
     * - Adjusts velocity based on left or right movement commands.
     * - Plays walking sounds when movement occurs.
     * - Sets the new velocity in the physics engine.
     */
    let playerVelocity = { x: player.body.velocity.x, y: player.body.velocity.y };

    if (!(player === player1 ? player1hit : player2hit)) {
        if (keys[leftKey] && keys[rightKey]) {
            playerVelocity.x = 0;
        } else if (keys[leftKey]) {
            playerVelocity.x = -2.5;
            lookingLeft = true;
        } else if (keys[rightKey]) {
            playerVelocity.x = 2.5;
            lookingLeft = false;
        } else {
            playerVelocity.x = 0;
        }
        if (playerVelocity.x !== 0) playWalkSound();
    }

    Matter.Body.setVelocity(player.body, playerVelocity);

    if (player === player1) {
        lookingleft1 = lookingLeft;
    } else if (player === player2) {
        lookingleft2 = lookingLeft;
    }
}



function checkPlayerReachedTree(player) {
    const treePosition = { x: 420, y: 104 };
    const proximityThreshold = 15;

    const distance = dist(player.body.position.x, player.body.position.y, treePosition.x, treePosition.y);
    if (distance < proximityThreshold) {
        startPart2();
    }
}

function draw() {
    if (!gameStarted) {
        drawWaitingScreen();
        return;
    }

    renderGameMode();

    checkGameConditions();

    handlePlayerConditions();
}

function renderGameMode() {
    if (mode === 'multiplayer' && player2) {
        drawSinglePlayerView();
        throttleUpdateGame();
    } else if (spawnPlayer2) {
        drawMultiplayerView();
    } else {
        drawSinglePlayerView();
    }
}

function checkGameConditions() {
    checkifwin(player1);
    if (spawnPlayer2) {
        checkifwin(player2);
    }
    if (!part2Started) {
        checkPlayerReachedTree(player1);
        if (spawnPlayer2) {
            checkPlayerReachedTree(player2);
        }
    } else {
        checkPlayerFall(player1);
        if (spawnPlayer2) {
            checkPlayerFall(player2);
        }
    }
    if (mode=="local"){
        localmodeplay()
    }
}

function handlePlayerConditions() {
    handleWindConditions();

    if (playerReachesTop) {
        playerReachesTop = false;
        showPopup();
    }
}

function handleWindConditions() {
    if (!Windzonemet) return;

    if (player1.body.position.y < windStart) {
        Windcareful();
        applyWindForce(player1);
    }

    if (spawnPlayer2 && mode == "local" && player2.body.position.y < windStart) {
        Windcareful();
        applyWindForce(player2);
    }
}

function throttleUpdateGame() {
    if (!lastUpdateTime || Date.now() - lastUpdateTime > 1000 / UPDATE_RATE) {
        updateGame();
        lastUpdateTime = Date.now();
    }
}

function updateGame() {

    if (gameStarted && mode === 'multiplayer' && Date.now() - lastUpdateTime > 1000 / UPDATE_RATE) {
        const playerState = {
            position: player1.body.position,
            velocity: player1.body.velocity
        };
        socket.emit('updatePlayerState', playerState);
        lastUpdateTime = Date.now();
    }
}

function drawMultiplayerView() {

    const { midpointX, midpointY, dynamicZoom } = calculateCameraSettings(player1, player2);
    setupCamera(midpointX, midpointY, dynamicZoom);
    drawGameScene();  
    drawPlayers(player1, player2, dynamicZoom);
    pop();
}

function drawSinglePlayerView() {
    /**
     * Draws the game view for a single player.
     * Sets up the camera focused on the single player, managing zoom and translation to keep the player centered.
     * Handles drawing of the game's background, the player, and checks for interactions with game elements.
     */
    if (!player1 || !player1.body) {
        console.log("Player1 or player1.body is undefined");
        return;
    }
    const cameraX = -player1.body.position.x * zoom + width / 2;
    const cameraY = -player1.body.position.y * zoom + height / 2;

    setupCamera(cameraX, cameraY, zoom);
    drawGameScene();
    drawPlayers(player1, null, zoom);
    pop();
}

function calculateCameraSettings(player1, player2) {
    /**
     * Calculates camera settings based on players' positions for dynamic zoom and focus in multiplayer mode.
     * - Computes the midpoint between two players for camera centering.
     * - Determines the zoom level based on the distance between players to ensure both are visible and the action is focused.
     * 
     * @param {Object} player1 - First player object.
     * @param {Object} player2 - Second player object.
     * @returns {Object} Contains midpointX, midpointY, and dynamicZoom for camera setup.
     */
    const midpointX = (player1.body.position.x + player2.body.position.x) / 2;
    const midpointY = (player1.body.position.y + player2.body.position.y) / 2;
    const distanceBetweenPlayers = dist(player1.body.position.x, player1.body.position.y, player2.body.position.x, player2.body.position.y);
    const dynamicZoom = spawnPlayer2 ? constrain(map(distanceBetweenPlayers, 0, 500, 3, 1), 1, 3) : zoom;
    return { midpointX, midpointY, dynamicZoom };
}

function setupCamera(x, y, zoom) {
    /**
     * Sets up the camera for the game view, applying translations and scaling based on the given parameters.
     * This function also manages background drawing and updates the physics engine state.
     * 
     * @param {number} x - The x-coordinate for camera translation.
     * @param {number} y - The y-coordinate for camera translation.
     * @param {number} zoom - The zoom level to apply.
     */
    push(); 
    if (spawnPlayer2){
    translate(width / 2 - x * zoom, height / 2 - y * zoom);
    }else{
        translate(x,y);
    }
    scale(zoom);
    background(0);
    Engine.update(engine);
    image(backgroundImage, 0, 0);
}

function drawGameScene() {
    [player1, player2].forEach(player => {
        if (player && player.body.position.y > height * 2 + 100) {
            respawnPlayer(player);
        }
    });
}

function drawPlayers(player1, player2, zoom) {
    [player1, player2].filter(player => player).forEach(player => {
        applyPlayerForces(player);
        drawAttackGauge(player);
        player.show();
        checkPlayerInteractions(player, zoom);
    });
}

function checkPlayerInteractions(player, zoom) {
    CollisionBlocks.forEach(block => {
        block.show();
        block.friction = 0;
        if (isPlayerTouching(block, player)) {
            handlePlayerLanding(player);
        }
    });
}

function handlePlayerLanding(player) {
    if ((player === player1 && isPlayer1InAir) || (player === player2 && isPlayer2InAir)) {
        landingSound.play();
        if (player === player1) {
            isPlayer1InAir = false;
        } else {
            isPlayer2InAir = false;
        }
    }
}

function drawWaitingScreen() {
    background(0);
    fill(255);

}

function startPart2() {
    part2Started = true;
    playerReachesTop = true
    respawnPosition = {x:500,y:50}
    respawnPositionPlayer2 = {x:550,y:50}

}

function checkPlayerFall(player) {
    const maxFallSpeed  = 5.3
    if (player.body.velocity.y > maxFallSpeed  && part2Started) {
        hasPlayerFallen = true;
    }

    const stabilizationSpeed  = 0.1
    if (hasPlayerFallen && Math.abs(player.body.velocity.y) <= stabilizationSpeed ) {
        respawnPlayer(player); 
        hasPlayerFallen = false; 
    }
}

function respawnPlayer(player) {
    Matter.Body.setPosition(player.body, respawnPosition);
    Matter.Body.setVelocity(player.body, { x: 0, y: 0 });
}

function attack(attacker, target, lastAttackTime) {

    const playersCloseEnough = abs(player1.body.position.x - player2.body.position.x) <= 30 &&
                               abs(player1.body.position.y - player2.body.position.y) <= 30;
    if (playersCloseEnough) {
        const currentMillis = Date.now();

        if (currentMillis - lastAttackTime > attackCooldown) {
            attacker.attackGaugeVisible = true;
            attacker.lastAttackTime = currentMillis;
            if (attacker.body.label === 'player1') {
                lastAttackTimePlayer1 = currentMillis;
            } else {
                lastAttackTimePlayer2 = currentMillis;
            }
            applyAttackForce(attacker, target);
            if (mode === "multiplayer" && lobbyReady) {
                socket.emit('playerAttack', {
                    attackerId: attacker.body.label,
                    targetId: target.body.label
                });
            }
        }
    }
}

function applyAttackForce(attacker, target) {
    let force;
    setAttackRoles(target);
    attackSound.play();
    hitSound.play();

    if (attacker.body.position.x - target.body.position.x < 0) {
        force = { x: 4, y: -4 };
    } else {
        force = { x: -4, y: -4 };
    }


    Matter.Body.setVelocity(target.body, force);
}


function setAttackRoles(target) {

    if (target.body.label === 'player1') {
        player1hit = true;
        player2attack = true;
    } else {
        player2hit = true;
        player1attack = true;
    }

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

function drawAttackGauge(player) {
    if (player.attackGaugeVisible) {
        const currentMillis = Date.now();
        const timeElapsed = currentMillis - player.lastAttackTime;
        const gaugeWidth = Math.max(0, player.attackGaugeWidth - (player.attackGaugeWidth * timeElapsed / attackCooldown));

        push();
        fill(255,255, 255);
        noStroke();
        rect(player.body.position.x - player.attackGaugeWidth / 2, player.body.position.y - 30, gaugeWidth, player.attackGaugeHeight);
        pop();

        if (timeElapsed >= attackCooldown) {
            player.attackGaugeVisible = false; 
        }
    }
}

function Windcareful() {
    document.getElementById('popup3').style.display = 'block';
    setTimeout(() => {
        document.getElementById('popup3').style.display = 'none';
    }, 3000);
    Windzonemet = false
}

function applyWindForce(player) {
    
    if (player.body.position.y > windEnd && player.body.position.y < windStart) {

        if (Math.abs(player.body.velocity.x) < maxWindVelocity) {
            let windForce = { 
                x: windStrength * windDirection.x, 
                y: windStrength * windDirection.y 
            };
            Matter.Body.applyForce(player.body, player.body.position, windForce);
        }
    }
}

function setupSocketListeners() {
    if (!socket) {
        console.log("Socket not initialized when setting up listeners");
        return;
    }
    socket.on('attackReceived', (data) => {
        let attacker = (data.attackerId === 'player1') ? player1 : player2;
        let target = (data.targetId === 'player1') ? player1 : player2;
        if (target && attacker) {
            applyAttackForce(attacker, target);
        }
    });


    socket.on('updateRemotePlayer', (data) => {
        console.log("Received data for remote player:", data);
        updateRemotePlayer(data);
    });

}

function updateRemotePlayer(state) {
    if (player2 && player2.body) {
        Matter.Body.setPosition(player2.body, state.position);
        Matter.Body.setVelocity(player2.body, state.velocity);
    } else {
        console.log("player2 is not properly initialized");
    }
}

function escapetoggleMenuDisplay() {
    if (document.getElementById('menu').style.display == 'none'){
        document.getElementById('menu').style.display = 'block';}
    else{
        document.getElementById('menu').style.display = 'none';
    }
    
}

function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function showVictoryPopup() {
    document.getElementById('popup2').style.display = 'block';
    setTimeout(() => {
        document.getElementById('popup2').style.display = 'none';
        showGameMenu();
    }, 3000); 
}

function showGameMenu() {
    document.getElementById('menu').style.display = 'block';
    resetGame();
}

function stopGameAndShowMenu() {
    resetGame();
    toggleMenuDisplay(true); 
}

function toggleMenuDisplay(show = false) {
    document.getElementById('menu').style.display = show ? 'block' : 'none';
}

function checkifwin(player){
    let playerY = player.body.position.y;
    let currentMillis = Date.now();
    
    if (playerY >= winningAltitude && part2Started) {
        if (timeAboveThreshold === 0) { 
            timeAboveThreshold = currentMillis;
        } else if (currentMillis - timeAboveThreshold > requiredTime) {

            showVictoryPopup();
            timeAboveThreshold = 0;
        }
    }else{
        timeAboveThreshold = 0; 
    }
}

function resetGame() {

    if (player1 && player1.body) {
        Matter.Body.setPosition(player1.body, respawnPosition);
        Matter.Body.setVelocity(player1.body, { x: 0, y: 0 });
    }
    if (spawnPlayer2 && player2 && player2.body) {
        Matter.Body.setPosition(player2.body, respawnPositionPlayer2);
        Matter.Body.setVelocity(player2.body, { x: 0, y: 0 });
    }


    gameStarted = false;
    part2Started = false;
    playerReachesTop = false;
    timeAboveThreshold = 0; 


    if (backgroundMusic.isPlaying()) {
        backgroundMusic.stop();
    }


    document.getElementById('menu').style.display = 'block';
    document.querySelectorAll('.game-ui').forEach(ui => ui.style.display = 'none');

}

function localmodeplay() {

    let distance = dist(player1.body.position.x, player1.body.position.y, player2.body.position.x, player2.body.position.y);


    if (distance > MAX_DISTANCE) {
        if (part2Started) {

            if (player1.body.position.y < player2.body.position.y) {

                teleportPlayerTo(player1, player2);
            } else {

                teleportPlayerTo(player2, player1);
            }
        } else {

            if (player1.body.position.y < player2.body.position.y) {

                teleportPlayerTo(player2, player1);
            } else {

                teleportPlayerTo(player1, player2);
            }
        }
    }
} 

function teleportPlayerTo(playerToTeleport, referencePlayer) {
    let direction = (playerToTeleport.body.position.x > referencePlayer.body.position.x) ? -1 : 1;

    let newX = referencePlayer.body.position.x + direction * TELEPORT_OFFSET;
    let newY = referencePlayer.body.position.y; 

    Matter.Body.setPosition(playerToTeleport.body, { x: newX, y: newY });
}
