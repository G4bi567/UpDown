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
    player1 = new Player(100, 100, 100, 100);
    Composite.add(world, player1);
}

function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)))
}

const keys = { d: { pressed: false }, a: { pressed: false } };

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            // Set the velocity of player1
            d.pressed= true;
            break;
        case "a":
            a.pressed= true;
            break;
        case "w":
            console.log(Matter.Body.getVelocity(player1.body))
            if (Matter.Body.getVelocity(player1.body) == 0){
            Matter.Body.setVelocity(player1.body, { x:  player1.body.velocity.x, y: -10 });
        }
            break;
    }
});
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            // Set the velocity of player1
            d.pressed= false;
            break;
        case "a":
            a.pressed= false;
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
