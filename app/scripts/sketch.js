// sketch.js
/*jshint newcap: false */

'use strict';
let p5 = require('p5');
let _ = require('lodash');
let Letter = require('./letter');
//let $ = require('jquery');

let letters = [];

let letterWidth = 100;
let numberOfChoices = 5;

function mySketch(s) {

  function makeRandomLetters(n, sourceLetter) {
    for (let i=0; i < n; i++) {
      
      let l;

      // base this letter on another letter if we have one
      if (sourceLetter) {
        l = sourceLetter.clone();
      } else {
        l = new Letter();
      }
      l.setSketch(s);

      // there may already be letters in letters[]
      l.setRenderPosition(letters.length*letterWidth, 0);
      l.addRandomLetterForm();
      letters.push(l);
    }
  }

  s.setup = function (){

    s.createCanvas(letterWidth * numberOfChoices,letterWidth + 1).parent('choices');
    s.noStroke();
    s.ellipseMode(s.CORNER);
    //s.frameRate(1);

    makeRandomLetters(5);
    _.each(letters, function(l){
      let img = l.getPixels();
      console.log(img);
      for (let x=0; x < img.width; x++) {
        for (let y=0; y < img.height; y++) {
          let pxSum = img.get(x,y).reduce(function(item, prev) {
            return prev + item;
          });
          
          if (pxSum > 0) {
            console.log(`black at ${x}, ${y}`);
          }
        }
      }
    });

    console.log(letters);

  };

  s.draw = function() {
    s.clear();
    _.each(letters, function(l) {
      l.update();
      l.render();
    });


  };

  s.windowResized = function() {};

  s.mousePressed = function() {
    console.log(s.mouseX, s.mouseY);

    // which letter was clicked?
    let letterIndex = Math.floor(s.mouseX / letterWidth);
    let l = letters[letterIndex];
    l.slideTo(0,0, function() {
      makeRandomLetters(numberOfChoices - 1, l);
    });
    letters = [l];

  };
}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};