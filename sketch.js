const { Engine, World, Composite, Bodies } = Matter;
const respawnPosition = { x: 0, y: 1050 };
const keys = { d: false, a: false };

let engine, world, boxes = [],zoom=2, ground, sol, player1, backgroundImage, CollisionBlocks = [], platformCollisionBlocks = [];

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
    player1 = new Player(respawnPosition.x, respawnPosition.y, 16, 28);
    Composite.add(world, player1);
    createCollisionBlocks(floorCollision, CollisionBlocks, 16, 32);
    createCollisionBlocks(platformCollision, platformCollisionBlocks, 1, 2);
}

function preload() {
    backgroundImage = loadImage('Sprites/Background/new.png');
}

const keyState = {
    d: false,
    a: false,
};

window.addEventListener("keydown", (event) => {
    if (event.key in keyState) {
        keyState[event.key] = true;
    } else if (event.key === 'w' && Math.abs(player1.body.velocity.y) < 0.01) {
        jump();
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key in keyState) {
        keyState[event.key] = false;
    }
});

function applyPlayerForces() {
    let playerVelocity = { x: 0, y: player1.body.velocity.y };

    if (keyState.a) {
        left();
    }

    if (keyState.d) {
        right();
    }

    Matter.Body.setVelocity(player1.body, playerVelocity);
}

function handlePlayerPosition() {
    if (player1.body.position.x < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (player1.body.position.x > width / (zoom - 1) - (player1.w / 2)) {
        Matter.Body.setPosition(player1.body, { x: width / (zoom - 1) - (player1.w / 2), y: player1.body.position.y });
    }
}

function draw() {
    // Calculate the camera position to follow the player
    let cameraX = (width / 2) - player1.body.position.x * zoom;
    let cameraY = (height / 2) - player1.body.position.y * zoom;

    // Set the scale (zoom)
    scale(zoom);

    // Translate and draw everything accordingly
    translate(cameraX / zoom, cameraY / zoom);

    // Clear the canvas
    background(0);

    Engine.update(engine);

    // Draw the background image without applying translation
    image(backgroundImage, 0, 0);

    // Draw other elements with the camera adjustments applied
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].show();
    }

    if (player1.body.position.y > height * 2) {
        respawnPlayer();
    }

    applyPlayerForces();
    handlePlayerPosition();

    player1.show();

    for (let i = 0; i < CollisionBlocks.length; i++) {
        CollisionBlocks[i].show();
    }

    // Reset the translation and scale to their original states
    translate(-cameraX / zoom, -cameraY / zoom);
    scale(1 / zoom);
}

function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)));
}

function jump() {
    const force = { x: 0, y: -0.009 };
    Matter.Body.applyForce(player1.body, player1.body.position, force);
}

function right() {
    const force = { x: 0.004, y: 0 };
    Matter.Body.applyForce(player1.body, player1.body.position, force);
}

function left() {
    const force = { x: -0.004, y: 0 };
    Matter.Body.applyForce(player1.body, player1.body.position, force);
}

function respawnPlayer() {
    Matter.Body.setPosition(player1.body, respawnPosition);
    Matter.Body.setVelocity(player1.body, { x: 0, y: 0 });
}
