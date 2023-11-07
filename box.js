class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        const options = {
            friction: 0.7,
            restitution: 0.6
        };
        
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        this.body.label = "box";
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
        stroke(255);
        fill(127);
        rect(0, 0, this.w, this.h);
        pop();
    }
}
