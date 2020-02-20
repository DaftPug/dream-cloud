// https://github.com/processing/p5.js/wiki/Positioning-your-canvas
// https://www.geeksforgeeks.org/p5-js-textalign-function/
let mic, recorder, soundFile;

let state = 0; // mousePress will increment from Record, to Stop, to Play

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
function setup() {
  //createCanvas(windowWidth, windowHeight/4);
  createCanvas(0,0);
  background(0);
  fill(255);


  // create an audio in
  mic = new p5.AudioIn();

  // users must manually enable their browser microphone for recording to work properly!
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // create an empty sound file that we will use to playback the recording
  soundFile = new p5.SoundFile();

}
function draw(){
//  textAlign(CENTER);
  // Set font size
//  textSize(26);
//  text('Enable mic and click to record',windowWidth/2,100);
}


function record() {
  // Tell recorder to record to a p5.SoundFile which we will use for playback
  recorder.record(soundFile);

}

function stoprecord() {
  recorder.stop(); // stop recorder, and send the result to soundFile
  soundFile.play(); // play the result!
  //https://p5js.org/reference/#/p5/saveSound
  saveSound(soundFile, "Dream, "+today.toLocaleDateString("en-US", options),'.wav'); // save file

}
