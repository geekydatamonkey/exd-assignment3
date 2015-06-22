// sketch.js
/*jshint newcap: false */

'use strict';
let p5 = require('p5');
let _ = require('lodash');
let Letter = require('./evolvingLetter');
let letterList = window.letterList;
console.log(letterList);

let text;
let textSize = 48;

function mySketch(s) {

  s.preload = function() {
    text = s.loadStrings('origin.txt');
  }

  s.setup = function() {
    s.noStroke();
    s.createCanvas(500,1500).parent('result');
    s.textSize(textSize);
    text = text.join('').toUpperCase().split('');
    console.log(letterList);
  }

  s.draw = function() {
    s.background(255);

    let cursor = {x: 0, y: textSize};

    for (let i = 0, len = text.length; i < len; i++) {

      // make sure cursor doesn't go off the page
      if (cursor.y > s.height) {
        return;
      }
      if (cursor.x > s.width) {
        cursor.x = 0;
        cursor.y = cursor.y + textSize;
      }

      // if id in 
      let evolvingLetter = _.find(letterList,function(letter) {
        return letter.id === text[i];
      });

      if (evolvingLetter) {
        let parent = evolvingLetter.population[0];
        //s.image(parent.currentBuffer,cursor.x, cursor.y - textSize,textSize,textSize);
        parent.render(
          cursor.x + 0.125*textSize,
          cursor.y - 0.75*textSize,
          0.75* textSize,
          0.75* textSize,
          s
        );
      } else {
        s.push();
        s.fill(0);
        s.text(text[i],cursor.x, cursor.y);
        s.pop();
      }
      cursor.x += textSize;
    }
  }

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};