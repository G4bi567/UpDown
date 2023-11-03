class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0,
            inertia: Infinity,
            restitution: 0
        }
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
        stroke(255)
        fill("red");
        rect(0, 0, this.w, this.h);
        pop();
    }
}