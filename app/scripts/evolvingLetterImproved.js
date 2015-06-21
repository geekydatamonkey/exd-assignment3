'use strict';

const _ = require('lodash');
const pixelDensity = window.devicePixelRatio || 1;

class EvolvingLetter {

  constructor(config) {

    let defaults = {
      width: 100,
      height: 100,
      sketch: null,
      letterForms: [],
      idealImage: null,
      background: [0]
    };

    config = _.assign({}, defaults, config);

    this.width = config.width;
    this.height = config.height;
    this.sketch = config.sketch;
    this.letterForms = config.letterForms;
    this.background = config.background;

    // buffer for current image of letterforms
    this.currentBuffer = this.sketch.createGraphics(this.width * pixelDensity, this.height * pixelDensity);
    this.currentBuffer.background(this.background);

    // Buffer for Ideal graphics form
    this.idealBuffer = this.sketch.createGraphics(this.width * pixelDensity, this.height * pixelDensity);
    this.idealBuffer.image(config.idealImage, 0, 0);

  }

  /**
  * makes an independent copy of the letter
  **/
  clone() {}

  /**
  * compares the letter to its ideal form
  * returns a score. The closer to 0, the more exact
  * the match
  **/
  getDiffFromIdeal() {
    let currentBufferCtx = this.currentBuffer.drawingContext;
    let idealBufferCtx = this.idealBuffer.drawingContext;

    let w = this.width * pixelDensity;
    let h = this.height * pixelDensity;

    let currentBufferData = currentBufferCtx.getImageData(0,0,w,h).data;

    let idealBufferData = idealBufferCtx.getImageData(0,0,w,h).data;

    let diff = 0;
    for (let i=0; i < currentBufferData.length; i++) {
      if (currentBufferData[i] !== idealBufferData[i]){
        diff += 1;
      }
    }

    return diff;
  }


  /**
  * mutates the letter
  **/
  mutate() {}

  /**
   * renders the letter at coordinates (x,y)
   **/

  render(x,y) {
    console.log(this.currentBuffer);
    this.sketch.image(this.currentBuffer, x, y);
  }



}


module.exports = EvolvingLetter;
