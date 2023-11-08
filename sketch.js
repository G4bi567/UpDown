const { Engine, World, Composite, Bodies } = Matter;
let spawnPlayer2 = true;
let player2;
const respawnPosition = { x: 100, y: 1050 };
const respawnPositionPlayer2 = { x: respawnPosition.x + 100, y: respawnPosition.y };
const keys = { d: false, a: false, ArrowLeft: false, ArrowRight: false };


let engine, world, boxes = [],zoom=4, ground, sol, player1, backgroundImage, CollisionBlocks = [], platformCollisionBlocks = [];

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

function setup() {
    createCanvas(windowWidth, windowHeight);
    engine = Engine.create();
    world = engine.world;
    player1 = new Player(respawnPosition.x, respawnPosition.y, 16, 24);
    Composite.add(world, player1);
    if (spawnPlayer2) {
        console.log("v2")
        player2 = new Player(respawnPositionPlayer2.x, respawnPositionPlayer2.y, 16, 24);
        Composite.add(world, player2);
    }
    createCollisionBlocks(floorCollision, CollisionBlocks, 16, 32);
    createCollisionBlocks(platformCollision, platformCollisionBlocks, 5, 2);
    
}

function preload() {
    backgroundImage = loadImage('Sprites/Background/new.png');
}


window.addEventListener("keydown", (event) => {
    if (event.key in keys) {
        console.log(event.key)
        keys[event.key] = true;
    } else if (event.key === 'w' && Math.abs(player1.body.velocity.y) < 0.01) {
        jump(player1);
    }else if (event.key === 'ArrowUp' && Math.abs(player2.body.velocity.y) < 0.01 && spawnPlayer2 == true) {
        jump(player2);
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

function applyPlayerForces(player) {
    let playerVelocity = { x: 0, y: player.body.velocity.y };

    if(player == player1){
    if (keys.a) {
        console.log("a")
        playerVelocity.x+=-2.5;
    }
    if (keys.d) {
        console.log("d")
        playerVelocity.x+=2.5;
    }}else{
        console.log("hello")
        if (keys.ArrowLeft) {
            console.log("l")
            playerVelocity.x+=-2.5;
        }
        if (keys.ArrowRight) {
            console.log("r")
            playerVelocity.x+=2.5;
        }
    }

    Matter.Body.setVelocity(player.body, playerVelocity);
}

function handlePlayerPosition() {
    if (player1.body.position.x < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (player1.body.position.x > width / (zoom - 2) - player1.w -50) {
        Matter.Body.setPosition(player1.body, { x: width / (zoom - 2) - player1.w -50 , y: player1.body.position.y });
    }
}

function draw() {
    // Calculate the camera position to follow the player
    let cameraX = (width / 2) - player1.body.position.x * zoom;
    let cameraY = (height / 2) - player1.body.position.y * zoom;
    // Limit the camera position to stay within the world bounds window

    // Set the scale (zoom)
    scale(zoom);

    // Translate and draw everything accordingly
    translate(cameraX / zoom, cameraY / zoom);

    // Clear the canvas
    background(0);

    Engine.update(engine);

    // Draw the background image without applying translation
    image(backgroundImage, 0, 0);


    if (player1.body.position.y > height * 2+100) {
        respawnPlayer();
    }

    applyPlayerForces(player1);
    if (spawnPlayer2) {
        applyPlayerForces(player2);
    }
    /*
    handlePlayerPosition();
    */
    player1.show();
    if (spawnPlayer2) {
        player2.show();
    }
    for (let i = 0; i < CollisionBlocks.length; i++) {
        CollisionBlocks[i].show();
    }

    // Reset the translation and scale to their original states
    translate(-cameraX / zoom, -cameraY / zoom);
    scale(1 / zoom);
}


function jump(player) {
    const force = { x: 0, y: -0.008 };
    Matter.Body.applyForce(player.body, player.body.position, force);
}


function respawnPlayer() {
    Matter.Body.setPosition(player1.body, respawnPosition);
    Matter.Body.setVelocity(player1.body, { x: 0, y: 0 });
}
