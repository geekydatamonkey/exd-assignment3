// sketch.js
/*jshint newcap: false */

'use strict';
let p5 = require('p5');
let _ = require('lodash');
let Letter = require('./letter');
//let $ = require('jquery');

let letters = [];
let idealLetterImg;

let letterWidth = 100;
let numberOfChoices = 5;
let currentBest = Math.Infinity;

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

  s.preload = function() {
    idealLetterImg = s.loadImage('images/letterA.png');
  };

  s.setup = function (){

    //s.frameRate(0.5);
    s.createCanvas(letterWidth * (numberOfChoices + 1),letterWidth + 1).parent('choices');
    s.noStroke();
    s.ellipseMode(s.CORNER);
    s.image(idealLetterImg,letterWidth * (numberOfChoices + 1), 0);
    makeRandomLetters(5);
  };

  s.draw = function() {
    s.background(255);
    s.image(idealLetterImg,500, 0);
    _.each(letters, function(l) {
      l.update();
      l.render();
    });

    // if (letters[0].getPixelDiff(500,0) > currentBest){
    //   throw ('current Best increasing?!');
    // }
    console.log('letters[0]:' + letters[0].getPixelDiff(500,0));

    let diffs = [];
    _.each(letters, function(l, i) {
      diffs[i] = l.getPixelDiff(500,0);
    });

    let minValue = Math.min.apply(Math, diffs);
    let minIndex = diffs.indexOf(minValue);
    let winner = letters[minIndex];

    // if (winner.getPixelDiff(500,0) > currentBest) {
    //   throw 'not a better letter'
    // }

    // console.log('diffs ' + diffs);
    // console.log('minValue ' + minValue);
    // console.log('minIndex ' + minIndex);

    winner.setRenderPosition(0,0);
    
    let newLetters = [];
    newLetters.push(winner);

    // add mutants of first index
    for (let i=0; i < 4; i++) {
      let clone = winner.clone();
      clone.setRenderPosition((i+1)*100,0);
      clone.addRandomLetterForm();
      newLetters.push(clone);
    }

    letters = newLetters;

    currentBest = letters[0].diff;

  };

  s.windowResized = function() {};

  s.mousePressed = function() {
    // which letter was clicked?
    // let letterIndex = Math.floor(s.mouseX / letterWidth);
    // let l = letters[letterIndex];
    // letters = [l];
    // // l.slideTo(0,0, function() {
    // //   makeRandomLetters(numberOfChoices - 1, l);
    // // });
    // l.setRenderPosition(0,0);
    // makeRandomLetters(numberOfChoices - 1, l);
    s.noLoop();
  };
}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};