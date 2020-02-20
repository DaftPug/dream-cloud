var database
var text
var myWords

function preload() {
  // Preload test.txt to test string-manipulation and later cloudcreation
  text = loadStrings('assets/test.txt')
}

function formatData(data, wordDict) {
  myWords = []
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

// Increment the count for a word
function increment(word, dict) {
  word = word.toLowerCase()
  // Is this a new word?
  if (!dict[word]) {
    dict[word] = 1
    // Otherwise just increment its count
  } else {
    dict[word]++
  }
}

function setup() {
  createCanvas(400, 400)

  // -------------- Firebase
  var firebaseConfig = {
    apiKey: 'AIzaSyAET8NX9-hMGX0WeYaZNNI147BMHOL5RII',
    authDomain: 'dream-cloud-d4d1d.firebaseapp.com',
    databaseURL: 'https://dream-cloud-d4d1d.firebaseio.com',
    projectId: 'dream-cloud-d4d1d',
    storageBucket: 'dream-cloud-d4d1d.appspot.com',
    messagingSenderId: '470432303775',
    appId: '1:470432303775:web:ca3e84b4d9754e2e9df0aa',
    measurementId: 'G-5ET0GNFW4M'
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  // firebase.analytics()
  console.log(firebase)
  // database = firebase.database()
  // var ref = database.ref('dreams')
  // -------------- Firebase

  // -------------- Texthandling
  var wordDict = {}
  formatData(text, wordDict)

  console.log(wordDict)

  // -------------- Texthandling
}

function draw() {
  background(210)
}

class TextHandler {
  constructor() {
    this.dict = {}
    this.keys = []
  }

  // Splitting up the text
  split(text) {
    // Split into array of tokens
    return text.split(/\W+/)
  }

  // A function to validate a toke
  validate(token) {
    return /\w{2,}/.test(token)
  }

  // Process new text
  process(tokens) {
    //console.log(tokens);
    // For every token
    for (var i = 0; i < tokens.length; i++) {
      // Lowercase everything to ignore case
      if (!tokens[i]) continue
      var token = tokens[i].toLowerCase()
      if (this.validate(token)) {
        // Increase the count for the token
        this.increment(token)
      }
    }
  }

  // An array of keys
  getKeys() {
    return this.keys
  }

  // Get the count for a word
  getCount(word) {
    return this.dict[word]
  }

  // Increment the count for a word
  increment(word) {
    // Is this a new word?
    if (!this.dict[word]) {
      this.dict[word] = 1
      this.keys.push(word)
      // Otherwise just increment its count
    } else {
      this.dict[word]++
    }
  }

  // Sort array of keys by counts
  sortByCount() {
    // For this function to work for sorting, I have
    // to store a reference to this so the context is not lost!
    var concordance = this

    // A fancy way to sort each element
    // Compare the counts
    function sorter(a, b) {
      var diff = concordance.getCount(b) - concordance.getCount(a)
      return diff
    }

    // Sort using the function above!
    this.keys.sort(sorter)
  }
}
