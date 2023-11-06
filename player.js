class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.zoomX = 6; // Zoom factor for the X dimension
        this.zoomY = 4; // Zoom factor for the Y dimension

        let options = {
            friction: 0,
            inertia: Infinity,
            restitution: 0,
            center: true
        };

        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        Composite.add(world, this.body);

        this.spriteIdle = loadImage('./Sprites/character/Idle.png');
        this.spriteRun = loadImage('./Sprites/character/Run.png');
        this.frameWidth = 200;
        this.frameHeight = 200;
        this.frames = 8;
        this.currentFrame = 0;

        this.frameRate = 10; // Set the frame rate (e.g., 10 frames per second)
        this.frameCounter = 0;
         // Set the frame rate for the entire sketch
    }

    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        let scaledWidth = this.w * this.zoomX;
        let scaledHeight = this.h * this.zoomY;
        console.log(this.body.velocity.y)
        // Check the player's velocity
        if (this.body.velocity.y === 0 && this.body.velocity.x > 0) {
            console.log("run")
            // If velocity.y is 0 and velocity.x is greater than 0, switch to the running sprite
            image(
                this.spriteIdle,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight
            );
        } else {
            // Otherwise, use the idle sprite
            image(
                this.spriteIdle,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight
            );
        }

        // Update the animation frame based on the frame rate
        this.frameCounter++;
        if (this.frameCounter >= this.frameRate) {
            this.currentFrame = (this.currentFrame + 1) % this.frames;
            this.frameCounter = 0;
        }
    }
}