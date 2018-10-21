let height = 500;
let width = 500;
let game;
let speedSlider;

function keyPressed(){
  game.keyPressed(keyCode);
}

function keyReleased(){
  game.keyReleased(keyCode);
}

function setup() {
  createCanvas(width, height);
  game = new Game();
  speedSlider = createSlider(1,20,1)
}

function draw() {
  background(51);
  game.update();
  game.show();
}

function restart(){
  game = new Game();
}
