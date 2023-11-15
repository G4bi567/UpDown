class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.zoomX = 6; // Zoom factor for the X dimension
        this.zoomY = 4; // Zoom factor for the Y dimension
        this.mouvement ="idle"
        let options = {
            friction: 0,
            inertia: Infinity,
            restitution: 0,
            center: true,
            frictionAir: 0.03

        };

        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(world, this.body);

        this.spriteIdle = loadImage('./Sprites/character/Idle.png');
        this.spriteRun = loadImage('./Sprites/character/Run.png');
        this.spriteJump = loadImage('./Sprites/character/Jump.png');
        this.spriteFall = loadImage('./Sprites/character/Fall.png');
        this.frameWidth = 200;
        this.frameHeight = 200;
        this.frames = 8;
        this.currentFrame = 0;

        this.frameRate = 8; // Set the frame rate (e.g., 10 frames per second)
        this.frameCounter = 0;
         // Set the frame rate for the entire sketch
    }

show() {

    let pos = this.body.position;
    let angle = this.body.angle;
    let scaledWidth = this.w * this.zoomX;
    let scaledHeight = this.h * this.zoomY;
    
    // Check the player's velocit
    if (this.body.velocity.y < -0.1 && this.body.velocity.x >= 0) {
        // If velocity.y is greater than 0 and velocity.x is greater than 0, display the jump sprite (2 frames)
        let jumpFrame = this.currentFrame % 2;
        image(
            this.spriteJump,
            this.body.position.x - scaledWidth / 2,
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            jumpFrame * this.frameWidth, // Use jumpFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );
    } else if (this.body.velocity.y < -0.1 && this.body.velocity.x < 0) {
        // If velocity.y is greater than 0 and velocity.x is less than 0 (moving left), flip the jump sprite horizontally
        let jumpFrame = this.currentFrame % 2;
        push();
        scale(-1, 1); // Flip horizontally
        image(
            this.spriteJump,
            -(this.body.position.x + 50), // Mirror the X position
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            jumpFrame * this.frameWidth, // Use jumpFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );
        pop(); // Restore the scale
    } else if (this.body.velocity.y > 0.1 && this.body.velocity.x >= 0) {
        // If velocity.y is less than 0 and velocity.x is greater than 0, display the fall sprite (2 frames)
        let fallFrame = this.currentFrame % 2;
        movementSound.stop();   
        image(
            this.spriteFall,
            this.body.position.x - scaledWidth / 2,
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            fallFrame * this.frameWidth, // Use fallFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );
    } else if (this.body.velocity.y > 0.1 && this.body.velocity.x < 0) {
        // If velocity.y is less than 0 and velocity.x is less than 0, flip the fall sprite horizontally
        let fallFrame = this.currentFrame % 2;
        push();
        scale(-1, 1); // Flip horizontally
        image(
            this.spriteFall,
            -(this.body.position.x + 50), // Mirror the X position
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            fallFrame * this.frameWidth, // Use fallFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );
        pop(); // Restore the scale
    } else if (this.body.velocity.y === 0 && this.body.velocity.x > 0) {
        // If velocity.y is 0 and velocity.x is greater than 0, display the running sprite (8 frames)
        let runFrame = this.currentFrame % 8;
        image(
            this.spriteRun,
            this.body.position.x - scaledWidth / 2,
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            runFrame * this.frameWidth, // Use runFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );
    } else if (this.body.velocity.y === 0 && this.body.velocity.x < 0) {
        // If velocity.y is 0 and velocity.x is less than 0 (moving left), flip the running sprite horizontally
        let runFrame = this.currentFrame % 8;
        push();
        scale(-1, 1); // Flip horizontally
        image(
            this.spriteRun,
            -(this.body.position.x + 50), // Mirror the X position
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            runFrame * this.frameWidth, // Use runFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );
        pop(); // Restore the scale
    }  else {
        // If none of the above conditions are met, use the idle sprite (8 frames)
        let idleFrame = this.currentFrame % 8;
        if (lookingleft1==true && this.body.label=="player1" ){
            
            push();
            scale(-1, 1); // Flip horizontally
            image(
                this.spriteIdle,
                -(this.body.position.x + 50), // Mirror the X position
                this.body.position.y - scaledHeight / 2,
                scaledWidth,
                scaledHeight,
                idleFrame   * this.frameWidth, // Use runFrame for animation frame
                0,
                this.frameWidth,
                this.frameHeight
            );
            pop();
        }else{
        image(
            this.spriteIdle,
            this.body.position.x - scaledWidth / 2,
            this.body.position.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight,
            idleFrame * this.frameWidth, // Use idleFrame for animation frame
            0,
            this.frameWidth,
            this.frameHeight
        );}
    }
    
    // Update the animation frame based on the frame rate
    this.frameCounter++;
    if (this.frameCounter >= this.frameRate) {
        this.currentFrame = (this.currentFrame + 1) % 8; // Update the frame based on 8 frames
        this.frameCounter = 0;
    }
}

}