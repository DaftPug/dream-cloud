// Define all the variables we want to save things in
var myCanvas,
	sliderOne, sliderTwo, sliderThree, sliderFour,
	headImg, heartImg, gutsImg, feetImg;

// This function is called once when the page loads
function setup() {
		// Make the p5 canvas 400 x 400 px
    myCanvas = createCanvas(400, 400);
    // Put it inside the HTML element with the id 'main'
    myCanvas.parent('main');

    // Save references to the sliders in variables
    sliderOne = select('.slider-input-one');
    sliderTwo = select('.slider-input-two');
    sliderThree = select('.slider-input-three');
    sliderFour = select('.slider-input-four');

    // Load the images into our variables
    headImg = loadImage('img/head.png');
    heartImg = loadImage('img/heart.png');
    gutsImg = loadImage('img/guts.png');
    feetImg = loadImage('img/feet.png');

    // Make a black background as a base
    background(0);
    // Don't add any strokes around what we draw
    noStroke();
}

// This function is called continuously
function draw() {
	// Color everything we draw light grey
	fill(120, 120, 120);
	// Draw a rectangle the same width as the canvas, and 100 px high
	rect(0, 0, width, 100);
	// Show an image of a head in the center of the rectangle
	image(headImg, width/2 - 50, 0, 100, 100);

	// Color everything we draw a darker grey
	fill(100, 100, 100);
	// Draw a rectangle the same width as the canvas, and 100 px high, but further down
	rect(0, 100, width, 100);
	// Show an image of a heart in the center of the rectangle
	image(heartImg, width/2 - 50, 100, 100, 100);

	// Color everything we draw an even darker grey
	fill(80, 80, 80);
	// Draw a rectangle the same width as the canvas, and 100 px high, but further down
	rect(0, 200, width, 100);
	// Show an image of a stomach in the center of the rectangle
	image(gutsImg, width/2 - 50, 200, 100, 100);

	// Color everything we draw an even more darker grey
	fill(60, 60, 60);
	// Draw a rectangle the same width as the canvas, and 100 px high, but further down
	rect(0, 300, width, 100);
	// Show an image of feet in the center of the rectangle
	image(feetImg, width/2 - 50, 300, 100, 100);

	// Only do something if the mouse is inside the sketch on the x-axis
	// We check for the y-axis in the other if-statements
	if(mouseX > 0 && mouseX < width) {

		// Map the mouse position on the X-axis to a number between -90 and 90
		mouseXDeg = map(mouseX, 0, 400, -90, 90);

		// If the mouse is inside the first rectangle
		if(mouseY > 0 && mouseY < 100) {
			// Set the value of the first slider to the x position of mouse
			sliderOne.value(mouseX);
			// Skew the first slider by the mapped mouse value
			sliderOne.style('transform', 'skew(' + mouseXDeg + 'deg)');
		}
		// If the mouse is inside the second rectangle
		else if(mouseY > 100 && mouseY < 200) {
			// Set the value of the second slider to the x position of mouse
			sliderTwo.value(mouseX);
			// Skew the second slider by the mapped mouse value
			sliderTwo.style('transform', 'skew(' + mouseXDeg + 'deg)');
		}
		// If the mouse is inside the third rectangle
		else if(mouseY > 200 && mouseY < 300) {
			// Set the value of the third slider to the x position of mouse
			sliderThree.value(mouseX);
			// Skew the third slider by the mapped mouse value
			sliderThree.style('transform', 'skew(' + mouseXDeg + 'deg)');
		}
		// If the mouse is inside the fourth rectangle
		else if(mouseY > 300 && mouseY < 400) {
			// Set the value of the fourth slider to the x position of mouse
			sliderFour.value(mouseX);
			// Skew the fourth slider by the mapped mouse value
			sliderFour.style('transform', 'skew(' + mouseXDeg + 'deg)');
		}
	}
}