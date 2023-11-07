class Boundary {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // Define the options for the boundary, including friction, static nature, and restitution.
        const options = {
            friction: 0,     // Friction (0 for no friction)
            isStatic: true,  // Static (won't move)
            restitution: 0,  // Restitution (bounciness, 0 for no bouncing)
        };

        // Create a rectangular body using Matter.js with the specified options.
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        this.body.label = "ground"; // Assign a label for identification.

        // Add the body to the physics world.
        Composite.add(world, this.body);
    }

    show() {
        const pos = this.body.position;
        const angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);

        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(0,0,0,0); // Set the fill color (black).

        rect(0, 0, this.w, this.h);

        pop();
    }
}
