class Player{
  constructor(x,y, ai=false){
    this.pos = createVector(x,y);
    this.maxSpeed = 6;
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.speed = 0.05;
    this.left = false;
    this.right = false;
    this.w = 20;
    this.h = 20;
    this.bullets = [];
    this.score = 0;
    this.ai = ai;
    if(ai){
      this.enemies = [new Enemy()];
      this.brain = new NeuralNetwork(1,2,2);
      this.enemyRate = 0.01;
      this.fitness = 0;
      this.dead = false;
      this.shootTimer = 0;
      this.age = 0;
    }

  }

  update(){
    this.updateBullets();
    if(this.ai && !this.dead){
      this.age++;
      this.generateEnemies();
      this.think();
      for(let enemy of this.enemies)
        enemy.update();
    }
    if(!this.dead){
      if(this.left){
        let force = createVector(-1,0).mult(this.speed);
        this.applyForce(createVector(-1,0));
      }
      if(this.right){
        let force = createVector(1,0).mult(this.speed);
        this.applyForce(createVector(1,0));
      }
      else if(!this.right && !this.left)
        this.vel.mult(0);
      this.vel.add(this.acc);
      if(this.vel.mag()>this.maxSpeed)
        this.vel.setMag(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.adjustToScreen();
    }
    if(this.ai){
      this.enemiesHit();
      this.enemiesWin();
    }
  }

  show(){
    for(let bullet of this.bullets)
        bullet.show();
    if(this.enemies)
      this.showEnemies();
    push();
    noFill();
    stroke(255);
    triangle(this.pos.x, this.pos.y,
            this.pos.x-this.w/2, this.pos.y+this.h,
            this.pos.x+this.w/2, this.pos.y+this.h
    );
    pop();
  }

  applyForce(force){
    this.acc.add(force);
  }

  adjustToScreen(){
    if(this.pos.x+this.w/2>width){
      this.pos.x = width-this.w/2;
      //this.dead = true;
    }
    else if(this.pos.x-this.w/2 <0){
      this.pos.x = this.w/2;
      //this.dead = true;
    }
  }
  shoot(){
    if(!this.ai || this.shootTimer == 0){
      this.bullets.push(new Bullet(this.pos.x, this.pos.y));
      //this.shootTimer = 100;
    }
  }

  updateBullets(){
    for(let i=this.bullets.length-1; i>=0; i--){
      let bullet = this.bullets[i];
      if(!bullet.dead)
        bullet.update();
      else {
        bullets.splice(i,1);
      }
    }
  }

  think(){
    //get output from NN
    let input = this.vision();
    let output = this.brain.calculateOutput(input);
    //update right left shoot
    this.left = false;
    this.right = false;
    if(output[0]>0.5)
      this.left = true;
    else {
      this.right = true;
    }
    if(output[1]>0.5)
      this.shoot();
  }

  vision(){
    let vision = [];
    let factor = 1000;
    //Closetst Enemy's positions
    if(this.enemies.length>0){
      let closestEnemy = this.enemies[this.enemies.length-1];
      for(let i=this.enemies.length-2; i>=0; i--){
        if(this.enemies[i].pos.y > closestEnemy.pos.y)
          closestEnemy = this.enemies[i];
      }
      if(closestEnemy.pos.x - this.pos.x > 0)
        vision.push(1)
      else vision.push(-1);
      //vision.push((closestEnemy.pos.x - this.pos.x)/factor);
      //vision.push((closestEnemy.pos.y - this.pos.y)/factor);
    }
    else{
      //no enemies
      vision = vision.push(0);
    }
    return vision;
  }

  generateEnemies(){
    //if(random(1)<this.enemyRate)
    //  this.enemies.push(new Enemy());
    if(this.enemies.length == 0)
      this.enemies.push(new Enemy());
  }

  enemiesHit(){
    for(let i=this.enemies.length-1; i>=0; i--){
      let enemy = this.enemies[i];
      for(let j=this.bullets.length-1; j>=0; j--){
        let bullet = this.bullets[j];
        //if bullet hits enemy
        if(dist(bullet.pos.x, bullet.pos.y, enemy.pos.x, enemy.pos.y) <= bullet.r+enemy.r){
          this.bullets.splice(j,1);
          this.enemies.splice(i,1);
          this.score++;
        }
      }
    }
  }

  showEnemies(){
    for(let enemy of this.enemies){
      enemy.show();
    }
  }

  enemiesWin(){
    for(let i=this.enemies.length-1; i>=0; i--){
      let enemy = this.enemies[i];
      if(enemy.offScreen()){
        this.dead = true;
        this.enemies.splice(i,1);
      }
    }
  }

  calculateFitness(){
    this.fitness = 1;
    this.fitness *= (this.score+1);
    this.fitness *= this.age;
    return this.fitness;
  }

}
