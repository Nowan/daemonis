/*
  
  Creates an image from sprite filled with solid color.
  
  Credit to 
  
  http://www.html5gamedevs.com/profile/17010-webcaetano/
  http://www.html5gamedevs.com/topic/18254-spritetint-white-color-problem/
  
*/

function ColorImage(game, source, color="#ffffff"){
  var color = Phaser.Color.hexToColor(color);
  
  var bitmap = game.add.bitmapData(source.width, source.height)
               .fill(color.r, color.g, color.b)
               .blendDestinationAtop()
               .draw(source, 0, 0, source.width, source.height);
  
	Phaser.Image.call(this, game, 0, 0, bitmap);
};

ColorImage.prototype = Object.create(Phaser.Image.prototype);
ColorImage.prototype.constructor = ColorImage;
