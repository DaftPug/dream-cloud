var text
var myRec
var started = false
var cloudDiv
var titleDiv
var containerDiv
var ul
var a_start
var a_stop
var cloudDict = {}
var cloudReadyArray = []
var wordList = []
var slowDict = {}
var slowReadyArray = []
var WORDLIMIT = 5
var width = 800
var height = 800
var fill
var layout
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

// function createDivs() {
//   titleDiv = createDiv('DreamTracker')
//   titleDiv.class('title')

//   containerDiv = createDiv('')
//   containerDiv.class('container')
//   containerDiv.id('temp')
//   containerDiv.child(ul)
// }

function formatData(data, wordDict) {
  // Testing function for the H.C.Andersen text, not used anymore
  for (let i = 0; i < data.length; i++) {
    // var textArray = String.prototype.split(data[i], /\W+/)
    var textArray = data[i].replace(/[^ÆØÅæøåA-Za-zó]+/g, '/')
    // console.log(textArray)
    textArray = textArray.split(/[^ÆØÅæøåA-Za-zó]+/g)
    wordcount(textArray, wordDict)
  }
  // console.log(myWords)
  // constructCloud()
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

Object.size = function(obj) {
  var size = 0,
    key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++
  }
  return size
}

function parseResult() {
  // recognition system will often append words into phrases.
  // so hack here is to only use the last word:
  if (myRec.resultValue == true) {
    // console.count('myRec.resultValue == true')
    var detectedSpeech = myRec.resultString
    for (let i = 0; i < tempList.length; i++) {
      wordList.push(tempList[i])
    }
    // if (wordList.length > WORDLIMIT) {
    // console.count('WORDLIMIT reached')
    wordcount(wordList, cloudDict)
    cloudReadyArray = createCloudArray(cloudDict)
    constructCloud(cloudReadyArray)

    wordList = []
    // var size = Object.size(cloudDict)
    // var size = Object.keys(cloudDict).length
    // console.log(size)
    // console.log(cloudDict)
    // }
    // console.log(detectedSpeech)
    // }
  } else {
    console.log('not regeristering any speach now')
  }
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
  document.getElementById('menu').style.display = 'none'
  let finalTranscript = ''
  let count = 0
  trueRec.interimResults = true
  trueRec.maxAlternatives = 10
  trueRec.continuous = true
  trueRec.lang = 'da-DK'
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
  trueRec.start()
  console.log('Start')
}

function stopped() {
  trueRec.stop()
  console.log('Stop')
}

function setup() {}

function draw() {}

function createCloud(cloudArray) {
  reloadDiv()
  d3.wordcloud()
    .size([800, 800])
    .selector('#cloud')
    .words(cloudArray)
    .start()
}

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
    // .rotate(function() {
    //   return ~~(Math.random() * 2) * 90
    // })
    // .padding(5)
    .spiral('rectangular')
    .font('Impact')
    .fontSize(function(d) {
      return d.size * 20
    })
    .on('end', drawSkillCloud)
  // debugger
  // console.groupCollapsed('layout', layout)
  if (started == false) {
    started = true
  }
  layout.start()
}

// apply D3.js drawing API
function drawSkillCloud(words) {
  // debugger
  d3.select('#cloud')
    .append('svg')
    .attr('width', layout.size()[0])
    .attr('height', layout.size()[1])
    .append('g')
    // .attr('transform', 'translate(' + layout.size()[0] + ',' + layout.size()[1] + ')')
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
