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

    l.render(100,0);
    //l2.render(200,0);
    //l3.render(300,0);

    console.log(l.getDiffFromIdeal());
    //console.log(l2.getDiffFromIdeal());
    //console.log(l3.getDiffFromIdeal());

    let l2 = l.clone();
    l2.mutate();
    l2.render(200,0);
    console.log(l2.getDiffFromIdeal());

    let l3 = l2.clone();
    l3.mutate().render(300,0);
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