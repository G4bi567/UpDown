const { Engine, World, Bodies, Composite } = Matter;

let engine;
let world;
let boxes = [];
let ground;
let player1; // Declare player1 as a global variable

function setup() {
    createCanvas(1024, 576);
    engine = Engine.create();
    world = engine.world;
    ground = new Boundary(0, height, width, 100);
    Composite.add(world, ground);
    player1 = new Player(100, 100, 10, 10);
    Composite.add(world, player1);
}

function mousePressed() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)))
}

const keys = { d: { pressed: false }, a: { pressed: false } };
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            // Set the velocity of player1
            Matter.Body.setVelocity(player1.body, { x: 5, y: player1.body.velocity.y });
            break;
        case "a":
            Matter.Body.setVelocity(player1.body, { x: -5, y: player1.body.velocity.y });
            break;
        case "w":
            Matter.Body.setVelocity(player1.body, { x:  player1.body.velocity.x, y: -10 });
            break;
    }
});

function draw() {
    background(51);
    Engine.update(engine);
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].show();
    }
    ground.show();
    player1.show();
}
