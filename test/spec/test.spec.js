/* global describe, it */

'use strict';
let Letter = require('../../app/scripts/letter.js');

describe('Letter', function() {

  it('should exist', function() {
    let l = new Letter();
    expect(l).to.be.instanceof(Letter);
  });

  it('should have a grid width and height', function() {
    let l = new Letter(4,4);
    expect(l.getWidth()).to.equal(4);
    expect(l.getHeight()).to.equal(4);

    let l2 = new Letter(16,12);
    expect(l2.getWidth()).to.equal(16);
    expect(l2.getHeight()).to.equal(12);

  });

  it('should allow points in grid to be set on/off', function() {

    let l = new Letter(4,4);
    let onPixels = [];
    let offPixels = [];

    // make some random points
    for (let i=0; i < 4; i++) {
      for (let j=0; j < 4; j++) {
        if (Math.random() > 0.5) {
          onPixels.push([i,j]);
        } else {
          offPixels.push([i,j]);
        }
      }
    }

    l.setPixelsOn(onPixels);

    for (let i=0; i < onPixels.length; i++) {
      let px = onPixels[i][0];
      let py = onPixels[i][1];
      expect(l.isPixelOn(px, py)).to.be.true;
    }

    for (let i=0; i < offPixels.length; i++) {
      let p = offPixels[i];
      let px = p[0];
      let py = p[1];
      expect(l.isPixelOn(px, py)).to.be.false;
    }

  });

}); // end Letter

