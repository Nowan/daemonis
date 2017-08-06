/*

  Framed container for game world. 
  Renders background, grid, game view and borders in the enlisted order.
  Prevents rendering content outside container boundaries.

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
  
  var grid = (function () {
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, 0x69231f, 0.85);
    graphics.beginFill(0x000000, 1);
    
    for( var i = 1; i < gameConfig.gridWidth; i++ ){
      var line_x = i * gameConfig.tileSize;
      graphics.moveTo(line_x, 0);
      graphics.lineTo(line_x, containerHeight);
    }
    
    for( var i = 1; i < gameConfig.gridHeight; i++ ){
      var line_y = i * gameConfig.tileSize;
      graphics.moveTo(0, line_y);
      graphics.lineTo(containerWidth, line_y);
    }
    
    graphics.endFill();
    return graphics;
  }());
  
  this.add(background);
  this.add(grid);
  this.add(this.clippedArea);
  this.add(borders);
}

GameContainer.prototype = Object.create(Phaser.Group.prototype);
GameContainer.prototype.varructor = GameContainer;

GameContainer.prototype.setContent = function (phaserGroup) {
  this.clippedArea.add(phaserGroup);
};