/*
  
  Extended Phaser Group which clips all overflowing elements.
  
*/

function ClippedArea(game, width, height){
	Phaser.Group.call(this, game);
  
  // draw rectangle that would serve as a mask for clipped area 
  var mask_graphics = game.add.graphics(0, 0);
  mask_graphics.lineStyle(0);
  mask_graphics.beginFill(0x000000, 1);
  mask_graphics.drawRect(0, 0, width, height);
  mask_graphics.endFill();

  // apply mask to the group
  this.mask = mask_graphics;
  this.add(mask_graphics);
};

ClippedArea.prototype = Object.create(Phaser.Group.prototype);
ClippedArea.prototype.constructor = ClippedArea;
