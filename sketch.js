const { Engine, World, Composite, Bodies } = Matter;

let engine;
let world;
let boxes = [];
let ground;
let sol;
let player1;
const respawnPosition = { x: 100, y: 100 };

function setup() {
    createCanvas(1024, 576);

    engine = Engine.create();
    world = engine.world;
    ground = new Boundary(0, 400, 400, 100);
    Composite.add(world, ground);
    sol = new Boundary(400, 200, 500, 100);
    Composite.add(world, sol);
    console.log(sol)
    player1 = new Player(100, 100, 50, 100);
    Composite.add(world, player1);


}

const keys = { d: false, a: false };

window.addEventListener("keydown", (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    } else if (event.key === 'w' && Math.abs(player1.body.velocity.y) < 0.01) {
        jump();
    }
});

window.addEventListener("keyup", (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});
function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)));
}

function jump() {
    const force = { x: 0, y: -0.3 };
    Matter.Body.applyForce(player1.body, player1.body.position, force);
}

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

    if (player1.body.position.x < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (player1.body.position.x > width - player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: width - player1.w / 2, y: player1.body.position.y });
    }

    ground.show();
    player1.show();
    sol.show()

    if (player1.body.position.y > height + 100) {
        respawnPlayer();
    }
}
