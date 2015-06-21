'use strict';

const _ = require('lodash');
const cloner = require('js-object-clone'); // Object.clone()
const pixelDensity = window.devicePixelRatio || 1;

class EvolvingLetter {

  constructor(config) {

    let defaults = {
      width: 100,
      height: 100,
      sketch: null,
      letterForms: [], // {fn, args, fill}
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
  clone() {
    return Object.clone(this);
  }

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
  mutate() {
    let mutation = {
      'fn': this._getShapeFn(),
      'args': this._getArgs(),
      'fill': this._getFill()
    }; 
    this.letterForms.push(mutation);
    this.update();
    return this;
  }


  /**
  * updates the currentBuffer to match the letterForms
  **/
  update() {
    let self = this;
    let buffer = self.currentBuffer;

    buffer.push();
    _.each(self.letterForms, function(form){
      // set the proper fill color
      buffer.fill.apply(buffer, form.fill);

      // draw shape
      buffer[form.fn].apply(buffer, form.args);
    });
    buffer.pop();

  }

  /**
   * renders the letter at coordinates (x,y)
   **/

  render(x,y) {
    this.sketch.image(this.currentBuffer, x, y);
    return this;
  }


  /**
  * returns a random shape
  **/
  _getShapeFn() {
    if (Math.random() < 0.5) {
      return 'ellipse';
    }
    return 'rect';
  }

  /**
  * returns random paramenters for shape
  **/
  _getArgs() {
    let x = _.random(100);
    let y = _.random(100);

    // cannot be wider than 100
    let w = _.random(0, 100 - x);
    let h = _.random(0, 100 - y);
    return [x,y,w,h];
  }

  _getFill() {
    return [255];
  }


}


module.exports = EvolvingLetter;
