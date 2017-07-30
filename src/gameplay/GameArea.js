function GameArea(game){
	Phaser.Group.call(this, game);
  
  const tile_size = game.height / GameConfig.grid_size[1];
  const container_width = GameConfig.grid_size[0] * tile_size;
  const container_height = GameConfig.grid_size[1] * tile_size;
  
  function initGrid(){
    // draw grid on Phaser.Graphics object
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, 0x69231f, 0.85);
    graphics.beginFill(0x000000, 1);
    
    // vertical lines
    for( var i = 1; i < GameConfig.grid_size[0]; i++ ){
      var line_x = i * tile_size;
      graphics.moveTo(line_x, 0);
      graphics.lineTo(line_x, container_height);
    }
    
    // horizontal lines
    for( var i = 1; i < GameConfig.grid_size[1]; i++ ){
      var line_y = i * tile_size;
      graphics.moveTo(0, line_y);
      graphics.lineTo(container_width, line_y);
    }
    
    graphics.endFill();
    return graphics;
  }
  
  var grid = initGrid();
  this.add(grid);
};

GameArea.prototype = Object.create(Phaser.Group.prototype);
GameArea.prototype.constructor = GameArea;

GameArea.prototype.updateActiveTetromino = function(game, position, tetrodata){
  if(!this.active_tetromino || this.active_tetromino.data != tetrodata){
    if(this.active_tetromino) this.active_tetromino.destroy();
    this.active_tetromino = new Tetromino(game, tetrodata);
    this.add(this.active_tetromino);
  }
  
  const tile_size = game.height / GameConfig.grid_size[1];
  this.active_tetromino.x = position.col * tile_size;
  this.active_tetromino.y = position.row * tile_size;
}

GameArea.prototype.updateStaticObjects = function(game, fulfillment_map){
  
}