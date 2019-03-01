let height = 500;
let width = 500;
let game;
let speedSlider;
let playSelfButton;
let aiButton;

function keyPressed(){
  game.keyPressed(keyCode);
}

function keyReleased(){
  game.keyReleased(keyCode);
}

function setup() {
  playSelfButton = createButton('play yourself');
  aiButton = createButton('use machine learning');
  playSelfButton.mousePressed(() => restart(false));
  aiButton.mousePressed(() => restart(true));
  createCanvas(width, height);
  game = new Game();
  speedSlider = createSlider(1,20,1);
}

function draw() {
  background(51);
  game.update();
  game.show();
}

function restart(ai){
  game = new Game(ai);
}

