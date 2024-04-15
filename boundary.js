class Boundary {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        const options = {

            isStatic: true,  // Static 
            restitution: 0,  //  0 for no bouncing
        };

      
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
        this.body.label = "ground";
        this.body.friction=0
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
        fill(0,0,0,0);

        rect(0, 0, this.w, this.h);

        pop();
    }
}
