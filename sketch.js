const { Engine, World, Bodies, Composite } = Matter;

let engine;
let world;
let boxes = [];
let ground;
let player1; // Declare player1 as a global variable

class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0.3,
        };
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        
        Composite.add(world, this.body);
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255);
        fill("red");
        rect(0, 0, this.w, this.h);
        pop();
    }
}

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
            Matter.Body.setVelocity(player1.body, { x: 5, y: 0 });
            break;
        case "a":
            Matter.Body.setVelocity(player1.body, { x: -5, y: 0 });
            break;
        case "w":
            Matter.Body.setVelocity(player1.body, { x: 0, y: -10 });
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
