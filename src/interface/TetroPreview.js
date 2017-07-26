/*

  Preview for a single tetromino inside appropriately stylized border.

*/

function TetroPreview(game, label_key) {
	Phaser.Group.call(this, game);
  
  const container_width = 211;
  const container_height = 202;
  
  var border = game.add.sprite(0, 0, "basesheet", "interface/square_border");
  var background = game.add.tileSprite( (border.width - container_width) * 0.5, 
                                        (border.height - container_height) * 0.5, 
                                        container_width, container_height, 
                                        "basesheet", "interface/game_bg" );
  
  this.preview_area = new ClippedArea(game, container_width, container_height);
  this.preview_area.x = (border.width - container_width) * 0.5;
  this.preview_area.y = (border.height - container_height) * 0.5;
  
  this.add(background);
  this.add(this.preview_area);
  this.add(border);
  
  if(label_key) {
    var label = game.add.sprite(0, 0, "basesheet", label_key);
    label.x = (border.width - label.width) * 0.5;
    this.add(label);
    
    var label_margin = label.height + 10;
    background.y += label_margin;
    this.preview_area.y += label_margin;
    border.y += label_margin;
  }
};

TetroPreview.prototype = Object.create(Phaser.Group.prototype);
TetroPreview.prototype.constructor = TetroPreview;

TetroPreview.prototype.setPreview = function(game, tetrodata) {
  if(this.tetromino) this.tetromino.destroy();
  
  const tile_size = game.height / GameConfig.grid_size[1];
  
  this.tetromino = new Tetromino(game, tetrodata);
  this.tetromino.x = (this.preview_area.width - this.tetromino.tiled_width * tile_size) * 0.5;
  this.tetromino.y = (this.preview_area.height - this.tetromino.tiled_height * tile_size) * 0.5;
  
  this.preview_area.add(this.tetromino);
}