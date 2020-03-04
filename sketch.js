var text
var globalLang = 'da-DK'
var startbutton
var stopbutton
var dk_button
var button
var running = false
var myRec
var started = false
var cloudDiv
var titleDiv
var containerDiv
var ul
var input
var analyzer
var a_start
var a_stop
var cloudDict = {}
var cloudReadyArray = []
var wordList = []
var slowDict = {}
var slowReadyArray = []
var WORDLIMIT = 5
// var width = 800
// var height = 800
var fill
var layout
var ellipses = []
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var trueRec = new SpeechRecognition()

function preload() {
  // Preload test.txt to test string-manipulation and later cloudcreation
  createBody()

  // text = loadStrings('assets/test.txt')
  // myRec = new p5.SpeechRec('da-DK', parseResult) // new P5.SpeechRec object
  // myRec.continuous = true // do continuous recognition
  // myRec.interimResults = true // allow partial recognition (faster, less accurate)
  // slowRec = new p5.SpeechRec('da-DK', slowParse)
  // slowRec.continuous = true
}

function createBody() {
  ul = document.createElement('ul')
  ul.setAttribute('id', 'menu')

  a_start = document.createElement('a')
  a_start.setAttribute('class', 'menu-button icon-minus')
  a_start.setAttribute('href', '#menu')
  a_start.setAttribute('onclick', 'starter()')
  a_start.setAttribute('title', 'Hide navigation')
  a_stop = document.createElement('a')
  a_stop.setAttribute('class', 'menu-button icon-plus')
  a_stop.setAttribute('href', '#0')
  a_stop.setAttribute('onclick', 'stopped()')
  a_stop.setAttribute('title', 'Show navigation')

  ul.appendChild(a_start)
  ul.appendChild(a_stop)

  titleDiv = createDiv('DreamTracker')
  titleDiv.class('title')

  containerDiv = createDiv('')
  containerDiv.class('container')
  containerDiv.id('temp')
  containerDiv.child(ul)
  document.getElementById('menu').style.display = 'none'

  cloudDiv = createDiv('')
  cloudDiv.id('cloud')
  cloudDiv.parent('temp')
}

function reloadDiv() {
  // Deletes and creates an html div with id 'cloud'
  // so the wordcloud is updated at the same spot
  // instead of beneath each other
  cloudDiv.remove()
  cloudDiv = createDiv('')
  cloudDiv.id('cloud')
  cloudDiv.parent('temp')
}

function wordcount(textArray, dict) {
  for (let i = 0; i < textArray.length; i++) {
    // Because of the replace and split in formatData, some empty ""
    // will go through - this catches and eliminates them from the wordcount
    if (!textArray[i] == '') {
      increment(textArray[i], dict)
    }
  }
}

function newWordCount(textArray) {
  let dict = {}
  for (let i = 0; i < textArray.length; i++) {
    increment(textArray[i], dict)
  }
  return dict
}

function increment(word, dict) {
  // Increment the count for a word
  word = word.toLowerCase()
  // word toLowerCase - so all words are equal in the count
  if (!dict[word]) {
    // Is this a new word?
    dict[word] = 1
  } else {
    // Otherwise just increment its count
    dict[word]++
  }
}

function createCloudArray(dict) {
  cloudArray = []
  for (var key in dict) {
    cloudArray.push({ text: key, size: dict[key] })
  }
  // console.log(cloudArray)
  return cloudArray
}

function cloudify(transcript, log) {
  transList = []
  let tempList = split(transcript, ' ')
  for (let i = 0; i < tempList.length; i++) {
    transList.push(tempList[i])
  }
  let newDict = newWordCount(transList)
  if (log == 1) {
    console.log(newDict)
  }
  cloudReadyArray = createCloudArray(newDict)
  constructCloud(cloudReadyArray)
}

function starter() {
  // myRec.start()
  // slowRec.start()
  // document.getElementById('menu').style.display = 'none'
  let finalTranscript = ''
  let count = 0
  running = true
  input = new p5.AudioIn()
  input.start()
  trueRec.interimResults = true
  trueRec.maxAlternatives = 1
  trueRec.continuous = true
  trueRec.lang = globalLang
  trueRec.onresult = event => {
    let interimTranscript = finalTranscript
    for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
      let transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
        // console.log('Final: ' + finalTranscript)
        cloudify(finalTranscript, 1)
      } else {
        interimTranscript += transcript
        // console.groupCollapsed('Interim')
        // console.log('Interim: ' + interimTranscript)
        // console.groupEnd()
        cloudify(interimTranscript, 0)
      }
    }
  }
  // soundEffect()
  trueRec.start()
  console.log('Start')
}

function soundEffect() {
  let volume = input.getLevel()

  // If the volume > 0.1,  a rect is drawn at a random location.
  // The louder the volume, the larger the rectangle.
  let threshold = 0.00001

  if (volume > threshold) {
    fill(255, 255)
    // ellipses.push(ellipse(random(10, windowWidth), random(windowHeight), volume * 30, volume * 30))
    ellipse(random(windowWidth), random(windowHeight), volume * 50, volume * 50)
  }
}

function stopped() {
  running = false
  trueRec.stop()
  input.stop()
  ellipses = []
  console.log('Stop')
}

function setup() {
  // Create canvas
  canvas = createCanvas(windowWidth, windowHeight)
  // canvas.parent('temp')
  canvas.position(0, 0)
  canvas.style('z-index', '-1')
  background(204, 153, 255)
  // Create an Audio input

  // create start button
  startbutton = new Clickable()
  startbutton.img = loadImage('/assets/start_4.svg')
  startbutton.locate(20, 20)
  startbutton.width = 50
  startbutton.height = 50
  startbutton.onPress = function() {
    starter()
  }

  // create stop button
  stopbutton = new Clickable()
  stopbutton.img = loadImage('/assets/stop_3.svg')
  stopbutton.locate(20, 20)
  stopbutton.width = 50
  stopbutton.height = 50
  stopbutton.onPress = function() {
    stopped()
  }

  // create danish language button
  dk_button = new Clickable()
  dk_button.img = loadImage('/assets/dk_true.svg')
  dk_button.locate(20, 90)
  dk_button.onPress = function() {
    if (running == true) {
      stopped()
    }
    de_button.img = loadImage('/assets/de.svg')
    gb_button.img = loadImage('/assets/gb.svg')
    dk_button.img = loadImage('/assets/dk_true.svg')
    es_button.img = loadImage('/assets/sp.svg')
    console.log('Dansk')
    globalLang = 'da-DK'
    // starter()
  }

  // create german language button
  de_button = new Clickable()
  de_button.img = loadImage('/assets/de.svg')
  de_button.locate(20, 160)
  de_button.onPress = function() {
    if (running == true) {
      stopped()
    }
    de_button.img = loadImage('/assets/de_true.svg')
    gb_button.img = loadImage('/assets/gb.svg')
    dk_button.img = loadImage('/assets/dk.svg')
    es_button.img = loadImage('/assets/sp.svg')
    console.log('Tysk')
    globalLang = 'de-DE'
    // starter()
  }

  // create english language button
  gb_button = new Clickable()
  gb_button.img = loadImage('/assets/gb.svg')
  gb_button.locate(20, 230)
  gb_button.onPress = function() {
    if (running == true) {
      stopped()
    }
    de_button.img = loadImage('/assets/de.svg')
    gb_button.img = loadImage('/assets/gb_true.svg')
    dk_button.img = loadImage('/assets/dk.svg')
    es_button.img = loadImage('/assets/sp.svg')
    console.log('Brexit')
    globalLang = 'en-GB'
    // starter()
  }

  // create spanish language button
  es_button = new Clickable()
  es_button.img = loadImage('/assets/sp.svg')
  es_button.locate(20, 300)
  es_button.onPress = function() {
    if (running == true) {
      stopped()
    }
    de_button.img = loadImage('/assets/de.svg')
    gb_button.img = loadImage('/assets/gb.svg')
    dk_button.img = loadImage('/assets/dk.svg')
    es_button.img = loadImage('/assets/sp_true.svg')
    console.log('Spansk')
    globalLang = 'es-ES'
    // starter()
  }
}

function draw() {
  background(204, 153, 255)

  // background(000)
  dk_button.draw()
  de_button.draw()
  gb_button.draw()
  es_button.draw()
  // console.log(startbutton.color)
  if (running == true) {
    stopbutton.draw()
    // soundEffect()
    // if (ellipses != []) {
    //   console.log(ellipses)
    //   for (let i = 0; i < ellipses.length; i++) {
    //     ellipses[i]
    //   }
    // }
  } else {
    startbutton.draw()
  }
  // console.count(running == true)
}

function loadImage(imgFile) {
  let newImg = new Image()
  newImg.src = imgFile
  return newImg
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function changeButton() {
  if (running == false) {
    console.log('running == false')
    running = true
    button.text = 'Stop dreaming'
    button.onPress = function() {
      changeButton()
      stopped()
    }
  } else {
    console.log('running == true')
    running = false
    button.text = 'Start dreaming'
    button.onPress = function() {
      changeButton()
      starter()
    }
  }
}

function createLanguageButton(x, y, language) {}

function constructCloud(cloudArray) {
  reloadDiv()
  if (started == true) {
    layout.stop()
  }
  fill = d3.scale.category20()
  layout = d3.layout
    .cloud()
    .size([400, 400])
    .words(cloudArray)
    .spiral('rectangular')
    .font('Impact')
    .fontSize(function(d) {
      return d.size * 20
    })
    .on('end', drawSkillCloud)

  layout.start()
}

// apply D3.js drawing API
function drawSkillCloud(words) {
  d3.select('#cloud')
    .append('svg')
    .attr('width', layout.size()[0])
    .attr('height', layout.size()[1])
    .append('g')
    .attr(
      'transform',
      'translate(' + ~~(layout.size()[0] / 2) + ',' + ~~(layout.size()[1] / 2) + ')'
    )
    .selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .style('font-size', function(d) {
      return d.size + 'px'
    })
    .style('-webkit-touch-callout', 'none')
    .style('-webkit-user-select', 'none')
    .style('-khtml-user-select', 'none')
    .style('-moz-user-select', 'none')
    .style('-ms-user-select', 'none')
    .style('user-select', 'none')
    .style('cursor', 'default')
    .style('font-family', 'Impact')
    .style('fill', function(d, i) {
      return fill(i)
    })
    .attr('text-anchor', 'middle')
    .attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
    })
    .text(function(d) {
      return d.text
    })
  var svg = document.getElementsByTagName('svg')[0]
  var bbox = svg.getBBox()
  var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(' ')
  svg.setAttribute('viewBox', viewBox)
}
