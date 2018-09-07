var img;
var canvas;

function preload() {
  img = loadImage('https://cdn.glitch.com/e4030d4f-d24d-4d27-9745-9b07ee47048b%2FSBS79_5_Child_Drawing%20copy.png?1520050805321');
}

function windowResized(){
  
}

function setup() {
 noLoop();
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  

  //background(0);
}
function draw(){
   image(img, 0, 0);
img.resize(windowWidth, windowHeight);
  image(img, 0, 0);
}
  
  