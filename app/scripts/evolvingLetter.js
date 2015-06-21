'use strict';

let _ = require('lodash');

/**
* A letter is constructed from Random shapes,
* which we call LetterForms
**/
class EvolvingLetter {

  /**
  * creates a new letter
  **/
  constructor(sketch, x = 0, y = 0, width = 100, height = 100) {
    this.letterForms = []; // container for letterforms
    this.width = width;
    this.height = height;
    this.renderPosition = {x, y};
    this.sketch = sketch;
    this.pixels = null;
    this.idealPixels = null;
    this.background = null;
    this.diff = null;
  }

  getPixels() {
    if (!this.pixels) {
      // TODO: render offscreen to get pixel data
      // directly from letterforms. Can't trust
      // render position since it may change after pixels are drawn
      this.pixels = this._getPixelDataFrom(
        this.renderPosition.x,
        this.renderPosition.y,
        this.width,
        this.height
      );
    }
    return this.pixels;
  }

  setIdealPixels(x,y,w,h) {
    this.idealPixels = this._getPixelDataFrom(x,y,w,h);
    return this;
  }

  getIdealPixels() {
    return this.idealPixels;
  }

  updateDiffFromIdeal() {
    let diff = this._pixelDiff(this.getPixels(), this.getIdealPixels());

    this.diff = diff;
  }

  getDiffFromIdeal() {

    if (!this.diff) {
      this.updateDiffFromIdeal();
    }

    return this.diff;

  }

  _getPixelDataFrom(x,y,w,h) {
    if (!this.sketch) { throw 'No sketch set.'; }

    let dppx = window.devicePixelRatio;
    let ctx = this.sketch.drawingContext;

    x = x * dppx;
    y = y * dppx;
    w = w * dppx;
    h = h * dppx;

    return ctx.getImageData(x,y,w,h).data;
  }

  _pixelDiff(pixelData1, pixelData2) {
    let diff = 0;
    
    if (pixelData1.length !== pixelData2.length) {
      throw 'pixels array not the same length';
    }

    for (var i = 0; i < pixelData1.length; i++) {
      if (pixelData1[i] !== pixelData2[i]) {
        diff += 1;
      }
    }

    return diff;
  }

  setSketch(s) {
    this.sketch = s;
  }

  setBackground(color) {
    this.background = color;
  }

  setRenderPosition(x,y) {
    this.renderPosition = {x, y};
  }

  clone() {
    let source = this;

    function Clone() {}
    Clone.prototype = source;
    return new Clone();
  }

  addRandomLetterForm() {
    let operation = {
        'fn': this._getShapeFn(),
        'args': this._getArgs(),
        'fill': this._getFill()
    }; 
    this.letterForms.push(operation);

    // reset diff so that it updates
    this.diff = null;
  }

  _renderBackground() {
    let s = this.sketch;
    s.push();
    s.fill(this.background);
    s.rect(this.renderPosition.x, this.renderPosition.y, this.width, this.height);
    s.pop();
  }

  render() {
    let s = this.sketch;
    let self = this;

    s.push();
    s.translate(self.renderPosition.x,self.renderPosition.y);
    this._renderBackground();

    _.each(self.letterForms, function(op) {
      s.fill.apply(s, op.fill);
      s[op.fn].apply(s,op.args);
    });
    s.pop();
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