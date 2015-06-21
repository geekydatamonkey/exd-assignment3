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

    let l = new Letter({
      sketch: s,
      idealImage: imgA
    });

    let l2 = new Letter({
      sketch: s,
      idealImage: imgA,
      background: [255,0,0,255]
    });
    let l3 = new Letter({
      sketch: s,
      idealImage: imgA,
      background: [255,255,255,255]
    });

    l.render(100,0);
    l2.render(200,0);
    l3.render(300,0);

    console.log(l.getDiffFromIdeal());
    console.log(l2.getDiffFromIdeal());
    console.log(l3.getDiffFromIdeal());
  };

  s.draw = function() {

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