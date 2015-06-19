'use strict';

let _ = require('lodash');

function _create2DArray(width,height, initialValue = 0) {
  let arr = new Array(width);
  for (let i=0; i < arr.length; i++) {
    arr[i] = new Array(height);
    for (let j=0; j < arr[i].length; j++) {
      arr[i][j] = initialValue;
    }
  }
  return arr;
}

class Letter {

  constructor(width, height) {
    // create a 2D array using false for off
    this.pixels = _create2DArray(width, height, false);
  }

  getWidth() {
    return this.pixels.length;
  }

  getHeight() {
    return this.pixels[0].length;
  }

  setPixelOn(x, y) {
    this.pixels[x][y] = true;
  }

  setPixelOff(x, y) {
    this.pixels[x][y] = false;
  }

  /**
  * Turns every pixel on a list on.
  * Does not touch pixels not on the list.
  * 
  * list in the form of: [[1,4],[1,3],...]
  **/
  setPixelsOn(pixelList) {
    let self = this;
    _.each(pixelList, function(pixel) {
      // get coords
      let x = pixel[0];
      let y = pixel[1];
      self.setPixelOn(x,y);
    });
  }

  isPixelOn(x,y) {
    // check if in bounds
    if (x >= this.getWidth() || y >= this.getHeight) {
      return false;
    }
    return this.pixels[x][y];
  }

}

module.exports = Letter;