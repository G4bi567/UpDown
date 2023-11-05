const { Engine, World, Composite, Bodies } = Matter;

let engine;
let world;
let boxes = [];
let ground;
let sol;
let player1;
const respawnPosition = { x: 100, y: 100 };
let backgroundImage; // Declare a variable to store the image
let CollisionBlocks=[]

function setup() {
    createCanvas(560, 1168);

    engine = Engine.create();
    world = engine.world;
    ground = new Boundary(0, 400, 400, 100);
    Composite.add(world, ground);
    sol = new Boundary(400, 600, 600, 50);
    Composite.add(world, sol);
    console.log(sol)
    player1 = new Player(32, 32, 16, 16);
    Composite.add(world, player1);
    var floorCollision2D=[]
    for(let i = 0;i < floorCollision.length; i+=35 ){
        floorCollision2D.push(floorCollision.slice(i,i+35))
    }
     
    floorCollision2D.forEach((row,y) => {
        row.forEach((symbol,x )=>{
            if (symbol==3193){
                console.log("hello");
                CollisionBlocks.push(new Boundary(x*16, y*16, 16, 16));
            }
        })
        
    });
    Composite.add(world, CollisionBlocks);
}



function preload() {
    // Load the image before setting up the canvas
    backgroundImage = loadImage('Sprites/Background/sans titre.png');
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
    const force = { x: 0, y: -0.005};
    Matter.Body.applyForce(player1.body, player1.body.position, force);
}

function respawnPlayer() {
    Matter.Body.setPosition(player1.body, respawnPosition);
    Matter.Body.setVelocity(player1.body, { x: 0, y: 0 });
}

function draw() {
    image(backgroundImage, 0, 0);
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
    for (let i = 0; i < CollisionBlocks.length; i++) {
        CollisionBlocks[i].show();
    }
    if (player1.body.position.y > height + 100) {
        respawnPlayer();
    }
}
