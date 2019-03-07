class Game{
  constructor(ai){
    this.player = new Player(100,height-40);
    this.enemies = [];
    this.initialEnemyRate = 0.01;
    this.enemyRate = this.initialEnemyRate;
    this.enemyGain = 0.002;
    this.ai = ai;
    if(this.ai){
      this.population = new Population(200);
    }
  }

  static highscore(value){
    if(value == undefined){
      return this.curHighscore || 0;
    }
    this.curHighscore = value;
  }

  keyPressed(keyCode){
    if(this.ai)
      return;
    if(keyCode == LEFT_ARROW)
      this.player.left = true;
    if(keyCode == RIGHT_ARROW)
      this.player.right = true;
    if(keyCode == 32)
      this.player.shoot();
  }

  keyReleased(keyCode){
    if(this.ai)
      return;
    if(keyCode == LEFT_ARROW)
      this.player.left = false;
    if(keyCode == RIGHT_ARROW)
      this.player.right = false;
  }

  update(){
    if(!this.ai){
      this.generateEnemies();
      this.player.update();
      for(let enemy of this.enemies)
        enemy.update();
      this.enemiesHit();
      this.enemiesWin();
      this.enemyRate = this.initialEnemyRate+this.enemyGain*floor(this.player.score/10)
    }
  else{
    for(let i=0; i<speedSlider.value(); i++){
      this.population.update();
    }
  }
  }

  show(){
    if(!this.ai){
    this.showScore();
    this.player.show();
    for(let enemy of this.enemies)
      enemy.show();
    }
    else{
      this.population.show();
    }
  }

  generateEnemies(){
    if(random(1)<this.enemyRate)
      this.enemies.push(new Enemy());
  }

  enemiesHit(){
    for(let i=this.enemies.length-1; i>=0; i--){
      let enemy = this.enemies[i];
      for(let j=this.player.bullets.length-1; j>=0; j--){
        let bullet = this.player.bullets[j];
        //if bullet hits enemy
        if(dist(bullet.pos.x, bullet.pos.y, enemy.pos.x, enemy.pos.y) <= bullet.r+enemy.r){
          this.player.bullets.splice(j,1);
          this.enemies.splice(i,1);
          this.player.score++;
        }
      }
    }
  }

  enemiesWin(){
    for(let enemy of this.enemies){
      if(enemy.offScreen())
        this.gameover();
    }
  }

  showScore(){
    push();
    fill(255);
    noStroke();
    textSize(20);
    text('score: ' + this.player.score, 10, 30);
    text('highscore: ' + Game.highscore(), 10, 50);
    pop();
  }

  gameover(){
    if(this.player.score > Game.highscore())
      Game.highscore(this.player.score);
    restart();
  }
}
