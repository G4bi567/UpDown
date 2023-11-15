
function isPlayer1Touching(object) {


    const collision = Matter.SAT.collides(player1.body, object.body);

    return collision ? collision.collided : false;
}

function isPlayersTouching() {
    const collision = Matter.SAT.collides(player1.body, player2.body);

    return collision ? collision.collided : false;
}

function applyPlayerForces(player) {
    let playerVelocity = { x: player.body.velocity.x, y: player.body.velocity.y };
    
    if(player == player1){
    if (keys.a && keys.d ){
        playerVelocity.x=   0;
    }
    else if (keys.a && playerVelocity.x >=-2.5) {
        playWalkSound()
        playerVelocity.x=-2.5;
        lookingleft1=true
    }
    else if (keys.d && playerVelocity.x <=2.5) {
        playWalkSound()
        playerVelocity.x=2.5;
        lookingleft1=false
    }}else{
        
        if (keys.ArrowLeft && keys.ArrowRight ){
            playerVelocity.x=   0;
        }
        else if (keys.ArrowLeft) {
            playWalkSound()
            playerVelocity.x=-2.5;
            lookingleft2=true
        }
        else if (keys.ArrowRight) {
            playWalkSound()
            playerVelocity.x=2.5;
            lookingleft2=false
        }
        console.log(playerVelocity)
    }
    

    Matter.Body.setVelocity(player.body, playerVelocity);
}
function jump(player) {
    const force = { x: 0, y: -0.008 };
    Matter.Body.applyForce(player.body, player.body.position, force);
    isPlayerInAir = true
}

function handlePlayerPosition() {
    if (player1.body.position.x < player1.w / 2) {
        Matter.Body.setPosition(player1.body, { x: player1.w / 2, y: player1.body.position.y });
    } else if (player1.body.position.x > width / (zoom - 2) - player1.w -50) {
        Matter.Body.setPosition(player1.body, { x: width / (zoom - 2) - player1.w -50 , y: player1.body.position.y });
    }
}

function respawnPlayer(player) {
    Matter.Body.setPosition(player.body, respawnPosition);
    Matter.Body.setVelocity(player.body, { x: 0, y: 0 });
}
function attack(attacker, target, lastAttackTime) {
    const currentTime = Date.now();
    if (currentTime - lastAttackTime>  attackCooldown) {
        // Perform attack action here
        
        // Set the last attack time to the current time
        if (attacker.body.label === 'player1') {
            lastAttackTimePlayer1 = currentTime;
        } else {
            lastAttackTimePlayer2 = currentTime;
        }

        // Eject the target (respawn or any other action)
        const force = { x: 9, y:-1};
        Matter.Body.setVelocity(target.body,  force);
    }
}