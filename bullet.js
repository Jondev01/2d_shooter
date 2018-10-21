class Bullet{
  constructor(x,y){
    this.r = 3;
    this.dead = false;
    this.pos = createVector(x,y);
    this.maxSpeed = 7;
    this.vel = createVector(0,-this.maxSpeed);
    this.acc = createVector(0,0);
  }

  show(){
    ellipse(this.pos.x, this.pos.y, 2*this.r, 2*this.r);
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  onScreen(){
    if(this.y-this.r<0)
      this.dead = true;
  }
}
