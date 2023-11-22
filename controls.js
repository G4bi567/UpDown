function displayAnimation(animationType, flipHorizontally) {
    let frame = this.currentFrame % this.frames;
    let sprite;

    switch (animationType) {
        case "hit":
            sprite = this.spriteHit;
            break;
        case "jump":
            sprite = this.spriteJump;
            break;
        // Add cases for other animation types

        default:
            sprite = this.spriteIdle; // Default to idle sprite
    };

    push();
    if (flipHorizontally) {
        scale(-1, 1);
    };

    image(
        sprite,
        flipHorizontally ? -(this.body.position.x + 50) : this.body.position.x - this.w * this.zoomX / 2,
        this.body.position.y - this.h * this.zoomY / 2,
        this.w * this.zoomX,
        this.h * this.zoomY,
        frame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight
    );
}
