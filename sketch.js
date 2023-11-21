let gameStarted = false;



function startGame(mode) {
    if (mode === 'solo') {
        spawnPlayer2 = false;
    } else if (mode === 'local') {
        spawnPlayer2 = true;
    } else if (mode === 'multiplayer') {
        const socket = io('http://localhost:3000', { transports: ['websocket'], withCredentials: true });


        socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Listen for errors during the connection attempt
        socket.on('connect_error', (error) => {
            console.error('Connection failed:', error);
        });

        // Listen for messages from the server
        socket.on('message', (data) => {
            console.log('Message from server:', data);
        });
    }
    document.getElementById('menu').style.display = 'none';
    
    // Set gameStarted to true to allow player movement
    gameStarted = true;


    setup();
}


let spawnPlayer2 = true;

const { Engine, World, Composite, Bodies } = Matter;
let player2;
const respawnPosition = { x: 100, y: 1050 };
const respawnPositionPlayer2 = { x: respawnPosition.x + 100, y: respawnPosition.y };
const keys = { d: false, a: false, ArrowLeft: false, ArrowRight: false, f: false };
let lookingleft1 = false;
let lookingleft2 = false;

let engine, world, boxes = [], zoom = 4, ground, sol, player1, backgroundImage, CollisionBlocks = [], platformCollisionBlocks = [];
let lastWalkSoundTime = 0;
let walkSoundDelay = 1000;
let jumpSound, landingSound, movementSound;
let backgroundMusic;
let isPlayerInAir = false;

let menuVisible = true;
let lastAttackTimePlayer1 = 0;
let lastAttackTimePlayer2 = 0;
let attackCooldown = 4000;
let lastKeyPressTimePlayer2 = 0;
let player1hit = false;
let player1attack = false;
let player2hit = false;
let player2attack = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    engine = Engine.create();
    world = engine.world;
    player1 = new Player(respawnPosition.x, respawnPosition.y, 16, 24);
    player1.body.label="player1"
    Composite.add(world, player1);

    if (spawnPlayer2) {
        player2 = new Player(respawnPositionPlayer2.x, respawnPositionPlayer2.y, 16, 24, "player2");
        player2.body.label="player2"
        Composite.add(world, player2);
    }

    createCollisionBlocks(floorCollision, CollisionBlocks, 50, 100);
    createCollisionBlocks(platformCollision, platformCollisionBlocks, 5, 2);

    setupSounds();
}

function preload() {
    backgroundImage = loadImage('Sprites/Background/new.png');
    backgroundMusic = loadSound('Sprites/sound/background.mp3');
    jumpSound = loadSound('Sprites/sound/jump.mp3');
    landingSound = loadSound('Sprites/sound/fall.mp3');
    movementSound = loadSound('Sprites/sound/walk.mp3');
}


function setupSounds() {
    movementSound.setVolume(0.2);
    landingSound.setVolume(0.2);
    jumpSound.setVolume(0.3);
    backgroundMusic.setVolume(0.08);
    backgroundMusic.play();
}


function playWalkSound() {
    const currentTime = Date.now();
    if (currentTime - lastWalkSoundTime > walkSoundDelay) {
        walkSoundDelay = 4000;
        movementSound.loop();
        lastWalkSoundTime = currentTime;
    }
}

function createCollisionBlocks(data, collisionArray, yOffset, height) {
    const collision2D = [];
    for (let i = 0; i < data.length; i += 35) {
        collision2D.push(data.slice(i, i + 35));
    }
    collision2D.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol == 3193) {
                collisionArray.push(new Boundary((x * 16) + 7, (y * 16) + yOffset, 16, height));
            }
        });
    });
    Composite.add(world, collisionArray);
}

function isPlayer1Touching(object) {
    const collision = Matter.SAT.collides(player1.body, object.body);
    return collision ? collision.collided : false;
}

function isPlayersTouching() {
    const collision = Matter.SAT.collides(player1.body, player2.body);
    return collision ? collision.collided : false;
}


window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleKeyDown(event) {
    if (event.key in keys) {
        keys[event.key] = true;
    } else if (event.key === 'w' && Math.abs(player1.body.velocity.y) < 0.000000001) {
        jump(player1);
        jumpSound.play();
    } else if (event.key === 'ArrowUp' && Math.abs(player2.body.velocity.y) < 0.01 && spawnPlayer2) {
        jump(player2);
        jumpSound.play();
    } else if (event.key === 'g') {
        lastKeyPressTimePlayer2 = Date.now();
    } else if (event.key === 'Escape') {
        toggleMenuDisplay();
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
    let playerVelocity = { x: player.body.velocity.x, y: player.body.velocity.y };

    
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
}


function handlePlayerPosition() {
    const playerX = player1.body.position.x;

    if (playerX < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (playerX > width / (zoom - 2) - player1.w - 50) {
        Matter.Body.setPosition(player1.body, { x: width / (zoom - 2) - player1.w - 50, y: player1.body.position.y });
    }
}



function draw() {
    if (gameStarted) {
        if (spawnPlayer2) {
            drawMultiplayer();
        } else {
            drawSinglePlayer();
        }
    } else {
        drawWaitingScreen();
    }
}

function drawMultiplayer() {
    let midpointX = (player1.body.position.x + player2.body.position.x) / 2;
    let midpointY = (player1.body.position.y + player2.body.position.y) / 2;
    let distanceBetweenPlayers = dist(player1.body.position.x, player1.body.position.y, player2.body.position.x, player2.body.position.y);
    let dynamicZoom = spawnPlayer2 ? map(distanceBetweenPlayers, 0, 500, 3, 1) : zoom;
    let cameraX = -midpointX * dynamicZoom + width / 2;
    let cameraY = -midpointY * dynamicZoom + height / 2;

    translate(cameraX / dynamicZoom, cameraY);
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
    if (spawnPlayer2) {
        applyPlayerForces(player2);
    }

    for (let i = 0; i < CollisionBlocks.length; i++) {
        const block = CollisionBlocks[i];
        block.show();
        block.friction = 0;

        if (isPlayer1Touching(block)) {
            if (isPlayerInAir) {
                isPlayerInAir = false;
                landingSound.play();
            }
        }
    }

    if (abs(player1.body.position.x - player2.body.position.x) <= 30 && abs(player1.body.position.y - player2.body.position.y) <= 30 && keys.f) {
        attack(player1, player2, lastAttackTimePlayer1);

    }

    player1.show();
    if (spawnPlayer2) {
        player2.show();
    }

    translate(-cameraX / dynamicZoom, -cameraY / dynamicZoom);
    scale(1 / dynamicZoom);
}

function drawSinglePlayer() {
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

    applyPlayerForces(player1);

    player1.show();
    for (let i = 0; i < CollisionBlocks.length; i++) {
        const block = CollisionBlocks[i];
        block.show();
        block.friction = 0;

        if (isPlayer1Touching(block)) {
            if (isPlayerInAir) {
                isPlayerInAir = false;
                landingSound.play();
            }
        }
    }

    if (abs(player1.body.velocity.y) > 0.1) {
        player1.friction = 0;
    } else {
        player1.friction = 1;
    }

    for (let i = 0; i < platformCollisionBlocks.length; i++) {
        const platform = platformCollisionBlocks[i];
        platform.show();

        if (isPlayer1Touching(platform)) {
            if (isPlayerInAir) {
                isPlayerInAir = false;
                landingSound.play();
            }
        }
    }

    translate(-cameraX / zoom, -cameraY / zoom);
    scale(1 / zoom);
}

function drawWaitingScreen() {
    background(0);
    fill(255);
    // Draw a message or waiting screen indicating that the game is not started
}

function jump(player) {
    const force = { x: 0, y: -0.008 };
    Matter.Body.applyForce(player.body, player.body.position, force);
    isPlayerInAir = true;
}

function respawnPlayer(player) {
    Matter.Body.setPosition(player.body, respawnPosition);
    Matter.Body.setVelocity(player.body, { x: 0, y: 0 });
}

function attack(attacker, target, lastAttackTime) {
    const currentTime = Date.now();
    let force;

    if (currentTime - lastAttackTime > attackCooldown) {
        if (attacker.body.label === 'player1') {
            lastAttackTimePlayer1 = currentTime;
        } else {
            lastAttackTimePlayer2 = currentTime;
        }
        console.log(target.body.label)
        if (target.body.label=="player1"){
            player1hit = true;
            player2attack =true;
        }else{
            player2hit = true;
            player1attack =true;
        }
        setTimeout(() => {
            if (target.label=="player1"){
                player1hit = false;
                player2attack =false;
            }else{
                player2hit = false;
                player1attack =false;
            }
        }, 400);

        if (attacker.body.position.x - target.body.position.x < 0) {
            force = { x: 6, y: -4 };
        } else {
            force = { x: -6, y: -4 };
        }

        Matter.Body.setVelocity(target.body, force);
    }
}
