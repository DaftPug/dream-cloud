// Adapted from Learning Processing, Daniel Shiffman
// learningprocessing.com
let input;
let analyzer;
var started = false;
var canvas;
function setup() {
    canvas= createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index','-1');
    background(000);
  

    // Create an Audio input
    input = new p5.AudioIn();

    input.start();
  
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function starter(){
started = true;

}

function stopped() {
    started = false;

}
function draw() {
    // Get the overall volume (between 0 and 1.0)
if (started){

    let volume = input.getLevel();

    // If the volume > 0.1,  a rect is drawn at a random location.
    // The louder the volume, the larger the rectangle.
    let threshold = 0.00001;
    
    if (volume > threshold) {
        
        fill(255,255);
        circle(random(10, width), random(height), volume * 30, volume * 30);
    }
    
    // Graph the overall potential volume, w/ a line at the threshold
    let y = map(volume, 0, 1, height, 0);
    let ythreshold = map(threshold, 0, 1, height, 0);

    noStroke();
    fill(000);
    rect(0, 0, 20, height);
    // Then draw a rectangle on the graph, sized according to volume
    fill(0);
    rect(0, y, 20, y);
    //stroke(0);
    line(0, ythreshold, 19, ythreshold);
}
}
