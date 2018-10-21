class Population{
  constructor(size){
    this.players = [];
    this.size = size;
    this.start = createVector(width/2, height-40);
    this.generation = 1;
    this.highscore = 0;
    for(let i=0; i<this.size; i++){
      this.players.push(new Player(this.start.x, this.start.y, true));
    }
  }

  update(){
    for(let player of this.players){
      player.update();
    }
    if(this.allDead())
      this.evolve();
  }

  show(){
    for(let player of this.players){
      player.show();
    }
    //this.players[0].show();
    fill(255);
    text("generation: " + this.generation, 10, 80);
    text("score: " + this.players[0].score, 10, 100);
    text("highscore: " + this.highscore, 10, 120);
  }

  evolve(){
    this.calculateFitness();
    this.generation++;
    this.players = this.newGeneration();
  }

  calculateFitness(){
    let total = 0;
    let bestFitness=0;
    let bestIndex;
    this.players.forEach(function(player, i){
      let fitness = player.calculateFitness();
      total += fitness
      if(fitness >= bestFitness){
        bestFitness = fitness;
        bestIndex = i;
      }
    });
    this.bestIndex = bestIndex;
    this.totalFitness = total;
  }

  newGeneration(){
    let newGen = [];
    //add best to next generation
    let best = this.players[this.bestIndex]
    let child = new Player(this.start.x, this.start.y, true);
    child.brain = best.brain.clone();
    newGen.push(child);
    //check if highscore
    if(best.score > this.highscore)
      this.highscore = best.score;
    for(let i=1; i<this.players.length; i++){
      newGen.push(this.newChild());
    }
    return newGen;
  }

  selectOne(){
    let rand = random(1);
    let sum = 0;
    for(let i=0; i<this.players.length-1; i++){
      let fitness = this.players[i].fitness/this.totalFitness;
      if(sum<=rand && rand<sum+fitness){
        return this.players[i];
      }
      sum += this.players[i].fitness/this.totalFitness;
    }
    return this.players[this.players.length-1];
  }

  newChild(){
    let parent1 = this.selectOne();
    let parent2 = this.selectOne();
    let childBrain = parent1.brain.crossover(parent2.brain);
    let child = new Player(this.start.x, this.start.y, true);
    child.brain = childBrain.clone();
    child.brain = child.brain.mutate(0.01);
    return child;
    /*let parent = this.selectOne();
    let child = new Player(this.start.x, this.start.y, true);
    child.brain = parent.brain.clone();
    child.brain = child.brain.mutate(0.01);
    return child;*/
  }

  allDead(){
    let allDead = true;
    for(let player of this.players){
      if(!player.dead){
        allDead = false;
        break;
      }
    }
    return allDead;
  }
}
