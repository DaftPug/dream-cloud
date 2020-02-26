// Where we save the video feed
var video;
// A reference to the slider element
var slider;
// We use this to scale the video up or down
var vScale = 8;

function setup() {
	// Create the P5 canvas
  createCanvas(640, 480);

  // For newer laptops, there are sometimes twice as many pixels as we think (on Macbooks, these are called Retina screens)
  // But going through the double amount of pixels is not necessary and pretty intense for the computer
  // So with this function we set it to 1
  pixelDensity(1);

  // Start capturing video from the webcam
	video = createCapture(VIDEO);

	// Save references to the sliders in variables
  slider = select('.slider');
  vScale = slider.value();

	// Scale down the video, so we 
	video.size(width / vScale, height / vScale);

	// Hide the video element, and just show the canvas
	video.hide();

	// We don't want any strokes on the rectangles
	noStroke();
	// We want our rectangles to be white
	fill(255);
}

function draw() {
	if(slider.value() !== vScale) {
	  vScale = slider.value();

		// Scale down the video, so we 
		video.size(width / vScale, height / vScale);
	}

	// Color the background first
	background("hsl(25, 47%, 70%)");

	// Load the pixels of the video
	video.loadPixels();

	// Go through each pixel of the video
	for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {

    	// The pixels of the video are saved in the video.pixels array
    	// They are saved like this:
    	// [Pixel 1 Red, Pixel 1 Green, Pixel 1 Blue, Pixel 1 Alpha (a.k.a. transparency), Pixel 2 Red, etc.]
    	// For this reason, we have to do some math to jump ahead by four values for each pixel
      var index = (x + (y * video.width)) * 4;

      // Red is the first color, i.e. at the index
      var r = video.pixels[index];
      // Green is after red
      var g = video.pixels[index + 1];
      // Blue is after green
      var b = video.pixels[index + 2];

      // Putting all three together and dividing by 3 gives us the brightness of the pixel
      var bright = (r + g + b) / 3;

      // We can then map the brightness to the width of a rectangle for a bitchin' effect
      var w = map(bright, 0, 255, 0, vScale);

      // Uncomment the next line to see another way that rectangles can be drawn
      // rectMode(CENTER);

      // We draw the rectangles at the x/y-positions multiplied by our vScale
      // and then we make them as wide as the brightness of the pixel they represent
      rect(x * vScale, y * vScale, w, w);

      // Comment out the above line, and uncomment the next line to use circles instead
      // ellipse(x * vScale, y * vScale, w, w);
    }
  }
}