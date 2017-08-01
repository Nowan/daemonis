function GameArea(game){
	Phaser.Group.call(this, game);
  
  const container_width = GameConfig.grid.width * GameConfig.tile_size;
  const container_height = GameConfig.grid.height * GameConfig.tile_size;
  
  this.static_objects = []; // two-dimensional array for storing static objects; 
                            // element indexing sequence: static_objects[row][col]
  for( var r = 0; r < GameConfig.grid.height; r++ ) this.static_objects[r] = [];
  
  function initGrid(){
    // draw grid on Phaser.Graphics object
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, 0x69231f, 0.85);
    graphics.beginFill(0x000000, 1);
    
    // vertical lines
    for( var i = 1; i < GameConfig.grid.width; i++ ){
      var line_x = i * GameConfig.tile_size;
      graphics.moveTo(line_x, 0);
      graphics.lineTo(line_x, container_height);
    }
    
    // horizontal lines
    for( var i = 1; i < GameConfig.grid.height; i++ ){
      var line_y = i * GameConfig.tile_size;
      graphics.moveTo(0, line_y);
      graphics.lineTo(container_width, line_y);
    }
    
    graphics.endFill();
    return graphics;
  }
  
  var grid = initGrid();
  this.add(grid);
  
  this.objects_group = game.add.group();
  this.add(this.objects_group);
};

GameArea.prototype = Object.create(Phaser.Group.prototype);
GameArea.prototype.constructor = GameArea;

GameArea.prototype.updateActiveTetromino = function(game, position, tetrodata){
  // initialize / reinitialize tetromino object only if neccessary 
  if(!this.active_tetromino || !tetrodata.equals(this.active_tetromino.data)){
    // init chain
    if(this.chain) this.chain.destroy();
    this.chain = game.add.tileSprite( 0, 0, 8, 0, "basesheet", "game/chain");
    this.chain.anchor.x = 0.5;
    this.add(this.chain)
    
    // init tetromino itself
    if(this.active_tetromino) this.active_tetromino.destroy();
    this.active_tetromino = new Tetromino(game, tetrodata);
    this.add(this.active_tetromino);
  }
  
  this.chain.height = position.row * GameConfig.tile_size;
  this.chain.x = (position.col + this.active_tetromino.getWidth() * 0.5) * GameConfig.tile_size;
  this.active_tetromino.x = position.col * GameConfig.tile_size;
  this.active_tetromino.y = position.row * GameConfig.tile_size;
}

GameArea.prototype.addStaticObjects = function(game, position, tetrodata){
  for( var r = 0; r < tetrodata.getHeight(); r++ ){
    for( var c = 0; c < tetrodata.getWidth(); c++ ){
      if(tetrodata.shape[r][c] == 1){
        var cage = new Cage(game);
        
        // offset to place cage precisely in tile center
        const offset_x = (GameConfig.tile_size - cage.width) * 0.5;
        const offset_y = (GameConfig.tile_size - cage.height) * 0.5;
        
        cage.x = (position.col + c) * GameConfig.tile_size + offset_x;
        cage.y = (position.row + r) * GameConfig.tile_size + offset_y;
        
        this.static_objects[position.row + r][position.col + c] = cage;
        this.objects_group.add(cage);
      }
    }
  }
}

GameArea.prototype.clearRows = function(game, row_ids, fulfillment_map){
  for( var i = 0; i < row_ids.length; i++ ){
    const r = row_ids[i];
    for( var c = GameConfig.grid.width - 1; c >= 0; c-- ){
      if(this.static_objects[r][c]){
        this.static_objects[r][c].burn(game);
        this.static_objects[r].splice(c, 1);
      }
    }
  }
  
  game.time.events.add(GameConfig.row_burning_time, function(){
    this.resetView(game, fulfillment_map);
  }, this);
}

GameArea.prototype.resetView = function(game, fulfillment_map){
  this.objects_group.removeAll();
  
  for( var r = 0; r < GameConfig.grid.height; r++ ){
    this.static_objects[r] = []; // remove all object references
    
    for( var c = 0; c < GameConfig.grid.width; c++ ){
      if(fulfillment_map[r][c]){
        var cage = new Cage(game);
        
        // offset to place cage precisely in tile center
        const offset_x = (GameConfig.tile_size - cage.width) * 0.5;
        const offset_y = (GameConfig.tile_size - cage.height) * 0.5;
        
        cage.x = c * GameConfig.tile_size + offset_x;
        cage.y = r * GameConfig.tile_size + offset_y;
        
        this.objects_group.add(cage);
        this.static_objects[r][c] = cage;
      }
    }
  }
}