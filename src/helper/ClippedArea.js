/*
  
  Extended Phaser Group which clips all overflowing elements.
  
*/

function ClippedArea(game, width, height) {
  Phaser.Group.call(this, game);
  
  // draw rectangle that would serve as a mask for clipped area 
  var maskGraphics = game.add.graphics(0, 0);
  maskGraphics.lineStyle(0);
  maskGraphics.beginFill(0x000000, 1);
  maskGraphics.drawRect(0, 0, width, height);
  maskGraphics.endFill();

  // apply mask to the group
  this.mask = maskGraphics;
  this.add(maskGraphics);
}

ClippedArea.prototype = Object.create(Phaser.Group.prototype);
