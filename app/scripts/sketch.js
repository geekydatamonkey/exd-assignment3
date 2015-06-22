// sketch.js
/*jshint newcap: false */

'use strict';
let p5 = require('p5');
let _ = require('lodash');
let Letter = require('./evolvingLetter');
let settings = require('./settings');
let letterList = window.letterList = settings.letterList;

let loopsPerRender = 1;
let loopNum = 0;

function mySketch(s) {

  s.preload = function() {
    _.each(letterList, function(letter) {
      let img = s.loadImage(letter.filename);
      letter.imageBuffer = img;
    });
    console.log(letterList);
  };

  s.setup = function (){

    s.createCanvas(500,100 * letterList.length).parent('choices');
    s.noStroke();
    s.ellipseMode(s.CORNER);
    //s.frameRate(1);

    // Setup each letter in letterList
    _.each(letterList, function(letter, letterNum) {
      letter.population = [];

      s.image(letter.imageBuffer, 0, letterNum * 100);

      for (let i = 0; i < 4; i++) {
        let l = new Letter({
          sketch: s,
          idealImage: letter.imageBuffer
        });
        l.mutate().render(100 + 100 * i, letterNum*100);
        letter.population.push(l);
      }
    }); // end each letter
  };

  s.draw = function() {

    _.each(letterList, function(letter, letterNum) {
      // which of the current letters is best?
      let diffs = [];

      _.each(letter.population, function(l) {
        diffs.push(l.getDiffFromIdeal());
      });
      
      let min = Math.min.apply(Math,diffs);
      let indexOfParent = diffs.indexOf(min);
    
      // make parent, cull the rest
      let parent = letter.population[indexOfParent];
      letter.population = [parent];

      // create offspring (with mutations)
      for (let i = 0; i < 3; i++) {
        let offspring = parent.clone();
        offspring.mutate();
        letter.population.push(offspring);
      }

      // throttle rendering 
      if (loopNum === 0) {
        // clear a subregion
        //s.rect(0,100*letterNum,s.width,100*letterNum + 99);
        s.image(letter.imageBuffer, 0, 100*letterNum);
        _.each(letter.population, function(l,i) {
          l.render(100 + i*100,100*letterNum);
        });
      }

      loopNum = (loopNum + 1) % loopsPerRender;

    }); // end each letter in letterList
  };

  s.windowResized = function() {};

}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};