// var database
var text
var myRec
var recording = false
var ended = true
var cloudDiv
var cloudDict = {}
var wordList = []
var cloudReadyArray = []
var WORDLIMIT = 20
var width = 800
var height = 800
var fill

// var margin = { top: 10, right: 10, bottom: 10, left: 10 },
//   width = 512 - margin.left - margin.right,
//   height = 512 - margin.top - margin.bottom

function preload() {
  // Preload test.txt to test string-manipulation and later cloudcreation
  cloudDiv = createDiv('')
  cloudDiv.id('cloud')
  cloudDiv.parent('temp')
  // text = loadStrings('assets/test.txt')
  myRec = new p5.SpeechRec('da-DK', parseResult) // new P5.SpeechRec object
  myRec.continuous = true // do continuous recognition
  myRec.interimResults = true // allow partial recognition (faster, less accurate)
  // myRec.onStart = console.log('HAHAHA')
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

function endRecording() {
  ended = true
  // console.log('Recording ended muahaha')
}

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

function parseResult() {
  // recognition system will often append words into phrases.
  // so hack here is to only use the last word:
  if (myRec.resultValue == true) {
    var detectedSpeech, compareSpeech
    detectedSpeech = myRec.resultString
    if (detectedSpeech != compareSpeech) {
      var tempList = split(detectedSpeech, ' ')

      for (let i = 0; i < tempList.length; i++) {
        // console.log(tempList[i])
        wordList.push(tempList[i])
      }
      if (wordList.length > WORDLIMIT) {
        wordcount(wordList, cloudDict)
        // console.log(cloudDict)
        cloudReadyArray = createCloudArray(cloudDict)
        // console.log(cloudReadyArray)
        // createCloud(cloudReadyArray)
        constructCloud(cloudArray)
        wordList = []
        console.table(cloudDict)
      }
      // console.log(detectedSpeech)
    }
    compareSpeech = detectedSpeech
  } else {
    console.log('not regeristering any speach now')
  }
}

function starter() {
  console.log('Start')
  myRec.start()
}

function stopped() {
  console.log('Stop')
  // TODO Find a way to actualy stop recording
  // myRec.cancel()
  // myRec.continuous = false // do continuous recognition
  // myRec.interimResults = false // allow partial recognition (faster, less accurate)
}

function setup() {}

function draw() {
  // if (recording == true) {
  //   if (ended == true) {
  //     myRec = new p5.SpeechRec('da-DK', parseResult) // new P5.SpeechRec object
  //     // myRec.continuous = true // do continuous recognition
  //     myRec.interimResults = true // allow partial recognition (faster, less accurate)
  //     // myRec.onEnd = endRecording()
  //     // console.log((myRec.onEnd = endRecording()))
  //     myRec.start()
  //     ended = false
  //   }
  //   if (myRec.onEnd == true) {
  //     console.log('IT ENDED')
  //   }
  //   if (myRec.resultValue == true) {
  //     console.log('value == false')
  //     ended = true
  //   }
  // }
  // myRec.onEnd = endRecording()
}

function createCloud(cloudArray) {
  reloadDiv()
  d3.wordcloud()
    .size([800, 800])
    .selector('#cloud')
    .words(cloudArray)
    .start()
}
// var skillsToDraw = [
//   { text: 'javascript', size: 80 },
//   { text: 'D3.js', size: 30 },
//   { text: 'coffeescript', size: 50 },
//   { text: 'shaving sheep', size: 50 },
//   { text: 'AngularJS', size: 60 },
//   { text: 'Ruby', size: 60 },
//   { text: 'ECMAScript', size: 30 },
//   { text: 'Actionscript', size: 20 },
//   { text: 'Linux', size: 40 },
//   { text: 'C++', size: 40 },
//   { text: 'C#', size: 50 },
//   { text: 'JAVA', size: 76 }
// ]

// var svg = d3
//   .select('#cloud')
//   .append('svg')
//   .attr('width', width + margin.left + margin.right)
//   .attr('height', height + margin.top + margin.bottom)
//   .append('g')
//   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

function constructCloud(cloudArray) {
  reloadDiv()
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
      return d.size
    })
    .on('end', drawSkillCloud)
  // debugger
  layout.start()
}

// function drawC(words) {
//   svg
//     .append('g')
//     .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
//     .selectAll('text')
//     .data(words)
//     .enter()
//     .append('text')
//     .style('font-size', function(d) {
//       return d.size
//     })
//     .style('fill', '#69b3a2')
//     .attr('text-anchor', 'middle')
//     .style('font-family', 'Impact')
//     .attr('transform', function(d) {
//       return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
//     })
//     .text(function(d) {
//       return d.text
//     })
// }

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
