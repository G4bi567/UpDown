const { Engine, World, Bodies, Composite } = Matter;

let engine;
let world;
let boxes = [];
let ground;
let player1;
const respawnPosition = { x: 100, y: 100 }; // Set the respawn position

function setup() {
    createCanvas(1024, 576);
    engine = Engine.create();
    world = engine.world;
    ground = new Boundary(0, height, width, 100);
    Composite.add(world, ground);
    player1 = new Player(100, 100, 100, 100);
    Composite.add(world, player1);
}

function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)));
}

const keys = { d: false, a: false };

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            keys.d = true;
            break;
        case "a":
            keys.a = true;
            break;
        case "w":
            if (Matter.Body.getVelocity(player1.body).y === 0) { // Check for vertical velocity
                Matter.Body.setVelocity(player1.body, { x: player1.body.velocity.x, y: -10 });
            }
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d = false;
            break;
        case "a":
            keys.a = false;
            break;
    }
});

function respawnPlayer() {
    Matter.Body.setPosition(player1.body, respawnPosition);
    Matter.Body.setVelocity(player1.body, { x: 0, y: 0 });
}

function draw() {
    background(51);
    Engine.update(engine);

    for (let i = 0; i < boxes.length; i++) {
        boxes[i].show();
    }

    let playerVelocity = { x: 0, y: player1.body.velocity.y };

    if (keys.a) {
        playerVelocity.x -= 5;
    }

    if (keys.d) {
        playerVelocity.x += 5;
    }

    Matter.Body.setVelocity(player1.body, playerVelocity);

    // Block the player at the world edges
    // Block the player at the world edges
    if (player1.body.position.x < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (player1.body.position.x > width - player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: width - player1.w / 2, y: player1.body.position.y });
    }

    ground.show();
    player1.show();

    // Check if the player has fallen off the map and respawn them
    if (player1.body.position.y > height + 100) {
        respawnPlayer();
    }
}
