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

  function colorPicker() {
    // var img = new Image();
    // img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
    var canvas = document.getElementById('defaultCanvas');
    var ctx = canvas.getContext('2d');
    // img.onload = function() {
    //   ctx.drawImage(img, 0, 0);
    //   img.style.display = 'none';
    // };
    var color = document.getElementById('color');
    function pick() {
      var x = s.mouseX;
      var y = s.mouseY;
      let d = window.devicePixelRatio;
      //console.log(`mouse: ${x}, ${y}`);
      var pixel = ctx.getImageData(x*d, y*d, d, d);
      var data = pixel.data;
      var rgba = 'rgba(' + data[0] + ',' + data[1] +
                 ',' + data[2] + ',' + data[3] + ')';
      color.style.background =  rgba;
      color.textContent = rgba;
      //console.log(`pick data:`, data);
    }
    canvas.addEventListener('mousemove', pick);
  }

  // function pixelDiff(l1, l2) {
  //   let pixels = l1.getPixels();
  //   let pixels2 = l2.getPixels();

  //   let diff = 0;
  //   //let sum = 0;
  //   for (var i = 0; i < pixels.length; i++) {
  //     //sum += pixels[i];
  //     if (pixels[i] !== pixels2[i]) {
  //       diff += 1;
  //     }
  //   }
  //   //console.log(`sum: ${sum}`);
  //   return diff;
  // }

  s.setup = function (){

    s.createCanvas(letterWidth * numberOfChoices,letterWidth + 1).parent('choices');
    s.noStroke();
    s.ellipseMode(s.CORNER);
    //s.frameRate(1);

    makeRandomLetters(5);
    colorPicker();
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
    _.each(letters, function(l, i) {
      let diff = letters[0].getPixelDiff(l);
      s.push();
      s.stroke('red');
      s.fill('red');
      s.text(diff,10 + i*100, 10);
      s.pop();
      console.log(diff);
    });

    // which letter was clicked?
    let letterIndex = Math.floor(s.mouseX / letterWidth);
    let l = letters[letterIndex];
    letters = [l];
    l.slideTo(0,0, function() {
      makeRandomLetters(numberOfChoices - 1, l);
    });


  };

  // s.mouseMoved = function() {
  //   //console.log(s.mouseX, s.mouseY);
  //   // which letter is hovered?
  //   let letterIndex = Math.floor(s.mouseX / letterWidth);
  //   let l = letters[letterIndex];
  //   let pixels = l.getPixels(s.mouseX, s.mouseY,1,1);
  //   //console.log('getPixels', pixels);
  // };
}

function init() {
  return new p5(mySketch);
}

module.exports = {
  init
};