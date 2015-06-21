// sketch.js
/*jshint newcap: false */

'use strict';
let p5 = require('p5');
let _ = require('lodash');
let Letter = require('./evolvingLetterImproved');

let letters = [];
let imgA;

function mySketch(s) {

  s.preload = function() {
    imgA = s.loadImage('images/letterAfilled.png');
  };

  s.setup = function (){

    s.createCanvas(500,100).parent('choices');
    s.noStroke();
    s.ellipseMode(s.CORNER);

    // ideal A
    s.image(imgA, 0, 0);

    for (let i = 0; i < 4; i++) {
      let l = new Letter({
        sketch: s,
        idealImage: imgA
      });
      l.mutate().render(100 + i*100,0);
      console.log(l.getDiffFromIdeal());
      letters.push(l);
    }
  };

  s.draw = function() {

    // which of the current letters is best?
    let diffs = [];
    _.each(letters, function(l) {
      diffs.push(l.getDiffFromIdeal());
    });
    console.log(diffs);
    let min = Math.min.apply(Math,diffs);
    console.log(min);
    let indexOfParent = diffs.indexOf(min);
    console.log(indexOfParent);

    // make parent, cull the rest
    let parent = letters[indexOfParent];
    letters = [parent];

    s.clear();
    s.image(imgA, 0, 0);
    parent.render(100,0);

    // create offspring (with mutations) based on winner
    for (let i = 0; i < 3; i++) {
      let offspring = parent.clone();
      offspring.mutate().render(200 + i*100,0);
      letters.push(offspring);
    }

  };

  s.windowResized = function() {};

  s.mousePressed = function() {
    s.noLoop();
  };
}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};