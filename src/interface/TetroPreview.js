/*

  Framed preview for a single tetromino.

*/

function TetroPreview(game, labelKey) {
  Phaser.Group.call(this, game);
  
  var width = 211, height = 202;
  
  var border = game.add.sprite(0, 0, "basesheet", "interface/square_border");
  
  var background = game.add.tileSprite((border.width - width) * 0.5, (border.height - height) * 0.5,
                                       width, height, "basesheet", "interface/game_bg");
  
  this.previewArea = new ClippedArea(game, width, height);
  this.previewArea.x = (border.width - width) * 0.5;
  this.previewArea.y = (border.height - height) * 0.5;
  
  this.add(background);
  this.add(this.previewArea);
  this.add(border);
  
  if (labelKey) {
    var label = game.add.sprite(0, 0, "basesheet", labelKey);
    label.x = (border.width - label.width) * 0.5;
    this.add(label);
    
    var labelMargin = label.height + 10;
    background.y += labelMargin;
    this.previewArea.y += labelMargin;
    border.y += labelMargin;
  }
};

TetroPreview.prototype = Object.create(Phaser.Group.prototype);

TetroPreview.prototype.updatePreview = function(game, tetrodata) {
  if (this.tetromino) { this.tetromino.destroy(); }
  
  this.tetromino = new Tetromino(game, tetrodata);
  this.tetromino.x = (this.previewArea.width - this.tetromino.width * gameConfig.tileSize) * 0.5;
  this.tetromino.y = (this.previewArea.height - this.tetromino.height * gameConfig.tileSize) * 0.5;
  
  this.previewArea.add(this.tetromino);
};