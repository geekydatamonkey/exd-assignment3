'use strict';

const _ = require('lodash');
const pixelDensity = window.devicePixelRatio || 1;

class EvolvingLetter {

  constructor(config) {

    let defaults = {
      width: 100,
      height: 100,
      sketch: null,
      letterForms: [], // {fn, args, fill}
      idealImage: null,
      background: [255]
    };

    config = _.assign({}, defaults, config);

    this.width = config.width;
    this.height = config.height;
    this.sketch = config.sketch;
    this.letterForms = config.letterForms;
    this.background = config.background;
    this.idealImage = config.idealImage;

    // buffer for current image of letterforms
    this.currentBuffer = this.sketch.createGraphics(this.width * pixelDensity, this.height * pixelDensity);
    this.currentBuffer.background(this.background);

    // Buffer for Ideal graphics form
    this.idealBuffer = this.sketch.createGraphics(this.width * pixelDensity, this.height * pixelDensity);
    this.idealBuffer.image(this.idealImage, 0, 0);

  }

  /**
  * makes an independent copy of the letter
  **/
  clone() {
    let self = this;
    let config = {
      width: self.width,
      height: self.height,
      sketch: self.sketch, // okay that it points to the same sketch
      letterForms: _.cloneDeep(self.letterForms), // {fn, args, fill}
      idealImage: self.idealImage,
      background: _.clone(self.background)
    };
    
    return new EvolvingLetter(config);
  }

  /**
  * compares the letter to its ideal form
  * returns a score. The closer to 0, the more exact
  * the match
  **/
  getDiffFromIdeal() {

    if (this.diffCache) {
      return this.diffCache;
    }

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

    // cache it
    this.diffCache = diff;

    return diff;
  }


  /**
  * mutates the letter
  **/
  mutate() {
    let mutation = {};

    mutation.fn = this._getShapeFn();
    mutation.args = this._getArgs(mutation.fn);
    mutation.fill = this._getFill();
 
    this.letterForms.push(mutation);
    this.diffCache = null; // invalidate cache
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
    buffer.noStroke();
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

  render(x,y, w = this.width, h = this.height, sketch = this.sketch) {
    sketch.image(this.currentBuffer, x, y, w*pixelDensity, h*pixelDensity);
    return this;
  }


  /**
  * returns a random shape
  **/
  _getShapeFn() {
    let fnList = [
      'ellipse',
      'rect',
      'triangle'
    ];
    let i = _.random(0, fnList.length - 1);
    return fnList[i];
  }

  /**
  * returns random paramenters for shape
  **/
  _getArgs(fn) {

    if (fn === 'triangle') {
      return[
        _.random(0, 100), //x1
        _.random(0, 100), //y1
        _.random(0, 100), //x2
        _.random(0, 100), //y2
        _.random(0, 100), //x3
        _.random(0, 100), //y3
      ];
    }

    let w = _.random(2,30);
    let h = _.random(2,30);

    // keep shape in bounds
    let x = _.random(0, 100 - w);
    let y = _.random(0, 100 - h);

    return [x,y,w,h];
  }

  _getFill() {
    if (Math.random() < 0.75) {
      return [0];
    }
    return [255];
  }

}


module.exports = EvolvingLetter;
