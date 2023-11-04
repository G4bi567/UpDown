const { Engine, World, Bodies, Composite } = Matter; // Import required Matter.js modules

let engine;
let world;
let boxes = [];
let ground;
let player1;
const respawnPosition = { x: 100, y: 100 };
let matterEngine; // Create a separate Matter.js engine for events
let playerContacted = false;

function setup() {
    createCanvas(1024, 576);

    // Initialize the main Matter.js engine for the world physics
    engine = Engine.create();
    world = engine.world;
    ground = new Boundary(0, height, width, 100);
    Composite.add(world, ground);
    player1 = new Player(100, 100, 100, 100);
    Composite.add(world, player1);

    // Initialize a separate Matter.js engine for events
    matterEngine = Engine.create();
    World.add(matterEngine.world, [player1.body, ground.body]);

    // Set up the collision event handling
    Matter.Events.on(matterEngine, 'collisionStart', (event) => {
        console.log("Collision event started"); // Add this line
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair.bodyA === player1.body && pair.bodyB.label === "ground") {
                console.log("Player touched the ground");
            } else if (pair.bodyA === player1.body && pair.bodyB.label === 'box') {
                console.log("Player touched a box");
            }
        }
    });
    
    
    Matter.Events.on(matterEngine, 'collisionEnd', (event) => {
        const pairs = event.pairs;
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if ((pair.bodyA === player1.body && pair.bodyB === ground.body) || (pair.bodyB === player1.body && pair.bodyA === ground.body)) {
                playerContacted = false; // Reset the contact state when contact ends
            }
        }
    });
}


function mouseDragged() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10, 40)));
}

function jump() {
    const force = { x: 0, y: -0.3 }; // Adjust the y value for jump strength
    Matter.Body.applyForce(player1.body, player1.body.position, force);
}

const keys = { d: false, a: false };

window.addEventListener("keydown", (event) => {
    if (event.key in keys) {
        keys[event.key] = true;}
    else if (event.key === 'w' && Math.abs(player1.body.velocity.y)  < 0.01)  {
            jump();
        }

    
});

window.addEventListener("keyup", (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
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
