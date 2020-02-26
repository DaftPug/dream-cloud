var myWords;
var layout ;
// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");




function myPreload(){
  fetch('https://itp.nyu.edu/registration/alum/linkedinGetDataNew.php')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    formatData(myJson,2008,2016);
   // console.log(dictionary);
  });
}


function formatData(data,begin,end){
  var returnStuff = [];

  for(var i = 0; i < data.length; i++){
    //console.log((data[i]));
    if(int(data[i].year) >= begin && int(data[i].year) <= end){
      dictionary.process(data[i].companies);
      dictionary.sortByCount();
      //let theseEntries = data[i].entries;
      //for(var j = 0; j < theseEntries.length; j++){
        //dictionary.process(theseEntries[j]);
        //var thisEntry = {"word":data[i][1], "size": "1"};
       // returnStuff.push(theseEntries[j]);
     // }
    }
  }
  myWords = [];
   for(let i = 0; i < dictionary.keys.length; i++){
     let thisWord = dictionary.keys[i];
     let thisCount = dictionary.getCount(thisWord);
     myWords.push({word:thisWord, size:thisCount});
   }
  console.log(myWords);
  constructCloud();
}
  

let dictionary;

function setup() {
  createCanvas(400, 400);
  dictionary = new Concordance();
  // List of words
  myPreload();
}

function constructCloud(){
// Constructs a new cloud layout instance. It run an algorythm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
  layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d.word, size:Math.max(8,d.size*3)}; }))
  .padding(1)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 0; })
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", drawC);
  layout.start();

}
function drawC(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}


function draw() {
  background(0);
}



// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// An object to store all the info related to a concordance

class Concordance {
  constructor() {
    this.dict = {};
    this.keys = [];
  }


  // Splitting up the text
  split(text) {
    // Split into array of tokens
    return text.split(/\W+/);
  }

  // A function to validate a toke
  validate(token) {
    return /\w{2,}/.test(token);
  }

  // Process new text
  process(tokens) {
    //console.log(tokens);
    // For every token
    for (var i = 0; i < tokens.length; i++) {
      // Lowercase everything to ignore case
      if (! tokens[i]) continue;
      var token = tokens[i].toLowerCase();
      if (this.validate(token)) {
        // Increase the count for the token
        this.increment(token);
      }
    }
  }

  // An array of keys
  getKeys() {
    return this.keys;
  }

  // Get the count for a word
  getCount(word) {
    return this.dict[word];
  }

  // Increment the count for a word
  increment(word) {
    // Is this a new word?
    if (!this.dict[word]) {
      this.dict[word] = 1;
      this.keys.push(word);
      // Otherwise just increment its count
    } else {
      this.dict[word]++;
    }
  }

  // Sort array of keys by counts
  sortByCount() {
    // For this function to work for sorting, I have
    // to store a reference to this so the context is not lost!
    var concordance = this;

    // A fancy way to sort each element
    // Compare the counts
    function sorter(a, b) {
      var diff = concordance.getCount(b) - concordance.getCount(a);
      return diff;
    }

    // Sort using the function above!
    this.keys.sort(sorter);
  }

}