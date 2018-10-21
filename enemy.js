class Enemy{
  constructor(){
    this.r = 20;
    this.pos = createVector();
    this.pos.x = random(this.r, width-this.r);
    this.pos.y = 0;
    this.dead = false;
    this.maxSpeed = 1;
    this.vel = createVector(0,0);
    this.acc = createVector(0,.1);
  }

  show(){
    ellipse(this.pos.x, this.pos.y, 2*this.r, 2*this.r);
  }

  update(){
    this.vel.add(this.acc);
    if(this.vel.mag()>this.maxSpeed)
      this.vel.setMag(this.maxSpeed);
    this.pos.add(this.vel);
  }

  offScreen(){
    if(this.pos.y+this.r>height){
      this.dead = true;
      return true;
    }
    return false;
  }
}
