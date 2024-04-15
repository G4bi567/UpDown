class Player {
    constructor(x, y, w, h) {
        this.setPosition(x, y);
        this.setSize(w, h);
        this.setPhysicsOptions();
        this.loadSprites();
        this.initializeAnimationProperties();
        this.setGaugeSettings()
        this.previousAnimationState = null;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(w, h) {
        this.w = w;
        this.h = h;
        this.zoomX = 6;
        this.zoomY = 4;
    }

    setPhysicsOptions() {
        let options = {
            friction: 0,
            inertia: Infinity,
            restitution: 0,
            center: true,
            frictionAir: 0.03
        };
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(world, this.body);
    }

    loadSprites() {
        this.spriteIdle = loadImage('./Sprites/character/Idle.png');
        this.spriteRun = loadImage('./Sprites/character/Run.png');
        this.spriteJump = loadImage('./Sprites/character/Jump.png');
        this.spriteFall = loadImage('./Sprites/character/Fall.png');
        this.spriteHit = loadImage('./Sprites/character/Take Hit.png');
        this.spriteAttack = loadImage('./Sprites/character/Attack1.png');
    }

    initializeAnimationProperties() {
        this.frameWidth = 200;
        this.frameHeight = 200;
        this.frames = 8;
        this.currentFrame = 0;
        this.frameRate = 8;
        this.frameCounter = 0;
        this.isCurrentlyAttacking = false;
    }

    setGaugeSettings(){
        this.attackGaugeWidth = 30; // Initial full width of the gauge
        this.attackGaugeHeight = 2; // Height of the gauge
        this.attackGaugeVisible = false; // Initially not visible
        this.lastAttackTime = 0; // Timestamp of the last attack

    }
    show() {
        let currentAnimationState = this.determineAnimationState();
        if (this.previousAnimationState !== currentAnimationState) {
            this.resetAnimation();
        }
        this.previousAnimationState = currentAnimationState;

        let scaledWidth = this.w * this.zoomX;
        let scaledHeight = this.h * this.zoomY;

        if (this.isHit()) {
            this.displaySprite(this.spriteHit, scaledWidth, scaledHeight);
        }else if (this.isAttacking() && !this.isCurrentlyAttacking) {
            this.attackResetAnimation();
            this.isCurrentlyAttacking = true;
        } else if (this.isAttacking() && this.isCurrentlyAttacking) {
            this.displaySprite(this.spriteAttack, scaledWidth, scaledHeight);
             // Reset the animation if the attack is finished
        }else if (!this.isAttacking() && this.isCurrentlyAttacking) {
            this.isCurrentlyAttacking = false;
        } 
        else if (this.isJumping()) {
            this.displaySprite(this.spriteJump, scaledWidth, scaledHeight);
        } else if (this.isFalling()) {
            this.displaySprite(this.spriteFall, scaledWidth, scaledHeight);
        } else if (this.isRunning()) {
            this.displaySprite(this.spriteRun, scaledWidth, scaledHeight);
        } else {
            this.displaySprite(this.spriteIdle, scaledWidth, scaledHeight);
        }

        this.updateAnimationFrame();
    }

    displaySprite(sprite, scaledWidth, scaledHeight) {
        let frameIndex;

        if (sprite === this.spriteJump || sprite === this.spriteFall) {
            // Jump and fall animations use 2 frames
            frameIndex = this.currentFrame % 2;
        } else if (sprite === this.spriteHit) {
            // Hit animation uses 4 frames
            frameIndex = this.currentFrame % 4;
        } else if (sprite === this.spriteAttack) {
            // Attack animation uses 6 frames
            frameIndex = this.currentFrame % 6;
        }else {
            // Other animations use the 8 frames
            frameIndex = this.currentFrame % this.frames;
        }
        let flip = this.shouldFlipSprite();

        push();
        if (flip) {
            scale(-1, 1);
            image(sprite, -(this.body.position.x + 50), this.body.position.y - scaledHeight / 2,
                  scaledWidth, scaledHeight, frameIndex * this.frameWidth, 0, this.frameWidth, this.frameHeight);
        } else {
            image(sprite, this.body.position.x - scaledWidth / 2, this.body.position.y - scaledHeight / 2,
                  scaledWidth, scaledHeight, frameIndex * this.frameWidth, 0, this.frameWidth, this.frameHeight);
        }
        pop();
    }

    shouldFlipSprite() {
        return (this.body.label === "player1" && lookingleft1) || 
               (this.body.label === "player2" && lookingleft2);
    }

    resetAnimation() {
        this.currentFrame = 0;
        this.frameCounter = 0;
    }
    attackResetAnimation() {
        this.currentFrame = 3;
        this.frameCounter = 0;
    }

    updateAnimationFrame() {
        this.frameCounter++;
        if (this.isCurrentlyAttacking && this.currentFrame >= 5) {
            // If the player is attacking and has reached the 6th frame
            return; // Do not update the frame further for this attack
        }
        
        if (this.frameCounter >= this.frameRate) {
           
            this.currentFrame = (this.currentFrame + 1) % this.frames;
            this.frameCounter = 0;
        }
    }

    determineAnimationState() {
        // Logic to determine the current animation state
        if (this.isHit()) {
            return 'hit';
        } else if (this.isAttacking()) {
            return 'attacking';
        } else if (this.isJumping()) {
            return 'jumping';
        } else if (this.isFalling()) {
            return 'falling';
        } else if (this.isRunning()) {
            return 'running';
        } else {
            return ' ';
        }
    }
    isHit() {
        return (this.body.label === "player1" && player1hit) || 
               (this.body.label === "player2" && player2hit);
    }

    isJumping() {
        return this.body.velocity.y < -0.1;
    }

    isFalling() {
        return this.body.velocity.y > 0.1;
    }

    isRunning() {
        return this.body.velocity.y === 0 && Math.abs(this.body.velocity.x) > 0;
    }

    isAttacking() {
        // player1attack and player2attack are global variables tracking attack state
        return (this.body.label === "player1" && player1attack) || 
               (this.body.label === "player2" && player2attack);
    }
    applyForce(force) {
        Matter.Body.applyForce(this.body, this.body.position, force);
    }
    
}