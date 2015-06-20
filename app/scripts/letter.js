'use strict';

let _ = require('lodash');

/**
* A letter is constructed from Random shapes,
* which we call LetterForms
**/
class Letter {

  constructor(width = 100, height = 100) {
    this.letterForms = []; // container for letterforms
    this.width = width;
    this.height = height;
    this.sketch = null;
    this.renderPosition = {x: 0, y: 0};
    this.background = null;
    this.slidingTo = {
      x : this.renderPosition.x,
      y : this.renderPosition.y
    };
    this.isSliding = false;
    this.slideToCallback = null;
  }

  update() {
    if (this.isSliding && this.slidingTo.x === this.renderPosition.x) {
        this.isSliding = false;
        return this.slideToCallback();
    }
    if (this.isSliding) {
      this.background = 'yellow';
      this.renderPosition.x -= 10;
    }
  }

  getPixelDiff(l2) {
    let pixels = this.getPixels();
    let pixels2 = l2.getPixels();

    let diff = 0;

    for (var i = 0; i < pixels.length; i++) {
      if (pixels[i] !== pixels2[i]) {
        diff += 1;
      }
    }
    return diff;
  }

  getPixels(x = this.renderPosition.x, y = this.renderPosition.y, w = this.width, h = this.height) {
    let s = this.sketch;
    let dppx = window.devicePixelRatio;
    x = x * dppx;
    y = y * dppx;
    w = w * dppx;
    h = h * dppx;
    let ctx = s.drawingContext;
    return ctx.getImageData(x,y,s.width,s.height).data;
  }

  setSketch(s) {
    this.sketch = s;
  }

  setBackground(color) {
    this.background = color;
  }

  setRenderPosition(x,y) {
    this.renderPosition = {x, y};
    this.slidingTo = {x, y};
  }

  slideTo(x,y, callback) {
    this.slidingTo = {x, y};
    this.isSliding = true;
    this.slideToCallback = callback;
  }

  clone() {
    let source = this;
    let clone = new Letter();
    clone.letterForms = _.cloneDeep(source.letterForms);
    return clone;
  }

  addRandomLetterForm() {
    let operation = {
        'fn': this._getShapeFn(),
        'args': this._getArgs(),
        'fill': this._getFill()
    }; 
    this.letterForms.push(operation);
  }

  _renderBackground() {
    let s = this.sketch;
    s.push();
    s.noFill();
    if (this.background) {
      s.fill(this.background);
    }
    s.stroke(222);
    s.strokeWeight(3);
    s.rect(0,0, this.width, this.height);
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
    if (Math.random() < 0.5) {
      return [0];
    }
    return [255];
  }
}

module.exports = Letter;