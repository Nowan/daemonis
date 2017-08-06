/*

  Framed container for game world. Prevents rendering content outside its boundaries.

*/

function GameContainer(game) {
  Phaser.Group.call(this, game);
  
  var containerWidth = gameConfig.gridWidth * gameConfig.tileSize;
  var containerHeight = gameConfig.gridHeight * gameConfig.tileSize;
  
  var background = game.add.tileSprite(0, 0, containerWidth, containerHeight, "basesheet", "interface/game_bg");
  
  this.clippedArea = new ClippedArea(game, containerWidth, containerHeight);
  
  var borders = (function () {
    var borders = game.add.group();
    
    var leftBorder = game.add.tileSprite(-20, 0, 20, containerHeight, "basesheet", "interface/border_segment");
    var leftLight = game.add.sprite(-3, game.height * 0.5, "basesheet", "interface/border_light");
    leftLight.anchor.y = 0.5;
    
    var rightBorder = game.add.tileSprite(containerWidth + 20, 0, 20, containerHeight,
                                          "basesheet", "interface/border_segment");
    var rightLight = game.add.sprite(containerWidth + 3, game.height * 0.5, "basesheet", "interface/border_light");
    rightLight.anchor.y = 0.5;
    
    rightBorder.scale.x *= -1;
    rightLight.scale.x *= -1;
    
    borders.add(leftLight);
    borders.add(leftBorder);
    borders.add(rightLight);
    borders.add(rightBorder);
    
    return borders;
  }());
  
  this.add(background);
  this.add(this.clippedArea);
  this.add(borders);
}

GameContainer.prototype = Object.create(Phaser.Group.prototype);
GameContainer.prototype.varructor = GameContainer;

GameContainer.prototype.setContent = function (phaserGroup) {
  this.clippedArea.add(phaserGroup);
};