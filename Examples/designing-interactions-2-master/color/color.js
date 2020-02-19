var mic, body, btn;
var bodyColor = 0;

function setup() {
    // Create the mic as an Audio Input
    mic = new p5.AudioIn();
    // Start the mic
    mic.start();

    // Save references to the body and the button in variables
    body = select('body');
    btn = select('button');
}

function draw() {
    // Save the input volume of the mic
    micLevel = mic.getLevel();

    // If it's above 0.1
    if(micLevel > 0.1) {
        // and if the bodyColor is not maximum
    	if(bodyColor < 80) {
            // Increase the bodyColor by 1
    		bodyColor++;
    	}
    }

    // When the mouse clicks the button, reset the bodyColor
    btn.mouseClicked(function() {
    	bodyColor = 0;
    });

    // Set the background of the body with the color:
    // Hue: 25, Saturation: 47%, Lightness: whatever our bodyColor variable is
    body.style('background', 'hsl(25, 47%, ' + bodyColor + '%)');
}