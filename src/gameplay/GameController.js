function GameController(game, current_preview, next_preview, score_indicator, speed_indicator, game_area){

  // public methods
  this.startGame = function(){};
  this.dropCage = function(apply_acceleration){};
  this.moveCage = function(direction){}; // 1 - right, -1 - left; 
  this.rotateCage = function(direction){}; // 1 - clockwise, -1 - counter-clockwise
  
  // additional callbacks
  this.onTetrominoFit = function(position, tetrodata){};
  this.onRowFull = function(row_index){};
  
  // private variables
  let _tetroqueue = []; // queue of tetrominoes. Element at 0 is current tetrominoe, 1 - next, ...
  let _active_tetrodata; // data of active tetromino (as in "data/tetrominoes.json")
  let _active_position = { row: 0, col: 0 }; // position where active tetromino is located
  let _fulfillment_map = []; // boolean matrix of a size of game grid. Provides info about tetrominoes that have   
                             // fallen already. If element at [row, col] is true - slot is full, false - empty. 
  let _last_drop_time = game.time.now; // helper variable to fire tetromino drop in proper time
  let _last_move_time = game.time.now; // helper variable to move tetromino with proper delay
  let _last_rotation_time = game.time.now; // helper variable to rotate tetromino with proper delay
  
  // private methods
  function _getRandomTetrodata(){
    var tetrobase = game.cache.getJSON('tetrominoes'); // list of tetrominoes from 'data/tetrominoes.json'
    const random_index = Math.floor(Math.random() * tetrobase.length);
    return tetrobase[random_index];
  }
  
  function _rotateTetrodata(tetrodata, direction){
    const tetrowidth = tetrodata.shape[0].length;
    const tetroheight = tetrodata.shape.length;
    const n = Math.max(tetrowidth, tetroheight);
    
    // init square matrix with original shape data and zeros on overflowing positions
    const orig_matrix = [];
    for( var r = 0; r < n; r++ ){
      orig_matrix[r] = [];
      for( var c = 0; c < n; c++ )
        orig_matrix[r][c] = (r < tetroheight && c < tetrowidth) ? tetrodata.shape[r][c] : 0;
    }
    
    // init square matrix with rotated shape data
    var rot_matrix = [];
    for( var r = 0; r < n; r++ ){
      rot_matrix[r] = [];
      for( var c = 0; c < n; c++ )
        rot_matrix[r][c] = direction > 0 ? orig_matrix[n - c - 1][r] : orig_matrix[c][n - r - 1];
    }
    
    // clean rotated matrix from empty rows and columns
    for( var r = n - 1; r >= 0; r-- ){
      var is_row_empty = true;
      for( var c = 0; c < n; c++ )
        if( rot_matrix[r][c] == 1 ){ is_row_empty = false; break; }
      if(is_row_empty) rot_matrix.splice(r, 1);
    }
    
    for( var c = n - 1; c >= 0; c-- ){
      var is_col_empty = true;
      for( var r = 0; r < rot_matrix.length; r++ )
        if( rot_matrix[r][c] == 1 ){ is_col_empty = false; break; }
      if(is_col_empty) for( var r = 0; r < rot_matrix.length; r++ ) rot_matrix[r].splice(c, 1);
    }
    
    tetrodata.shape = rot_matrix;
  }
  
  function _initFulfillmentMap(){
    _fulfillment_map = [];
    for( var r = 0; r < GameConfig.grid_size[1]; r++ ){
      _fulfillment_map[r] = [];
      for( var c = 0; c < GameConfig.grid_size[0]; c++ )
        _fulfillment_map[r][c] = false;
    }
  }
  
  function _canMoveTo(tetrodata, target_row, target_col){
    const tetrowidth = tetrodata.shape[0].length;
    const tetroheight = tetrodata.shape.length;
    
    // I check: if target position is inside game grid bounds
    if( target_row < 0 || target_row + tetroheight > GameConfig.grid_size[1] ||
        target_col < 0 || target_col + tetrowidth > GameConfig.grid_size[0] )
      return false;
    
    // II check: check that tetromino does not collide with static objects on game grid
    for( var r = 0; r < tetroheight; r++ ){
      for( var c = 0; c < tetrowidth; c++ ){
        if(tetrodata.shape[r][c] == 1 && _fulfillment_map[target_row + r][target_col + c])
          return false;
      }
    }
    
    return true;
  }

  function _updateTetroqueue(){
    _tetroqueue[0] = _tetroqueue[1];
    _tetroqueue[1] = _getRandomTetrodata();
    // 
    current_preview.setPreview(game, _tetroqueue[0]);
    next_preview.setPreview(game, _tetroqueue[1]);
  }
  
  function _spawnTetromino(tetrodata){
    _active_tetrodata = tetrodata
    _active_position.row = 0;
    _active_position.col = 0;
    game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
  }
  
  // public methods initialization
  this.startGame = function(){
    _tetroqueue = [ _getRandomTetrodata(), _getRandomTetrodata() ];
    current_preview.setPreview(game, _tetroqueue[0]);
    next_preview.setPreview(game, _tetroqueue[1]);
    _spawnTetromino(_tetroqueue[0]);
  }
  
  this.dropCage = function( apply_acceleration ){
    let time_step = apply_acceleration ? GameConfig.accelerated_drop_time : GameConfig.regular_drop_time;
    if(game.time.now < _last_drop_time + time_step) return;
    
    const is_falling = _canMoveTo(_active_tetrodata, _active_position.row + 1, _active_position.col);
    
    if(is_falling){
      _active_position.row += 1;
      game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
    }
    else{
      const tetrowidth = _active_tetrodata.shape[0].length;
      const tetroheight = _active_tetrodata.shape.length;
      
      // set flags of _fulfillment_map from active tetromino shape
      for( var r = 0; r < tetroheight; r++ )
        for( var c = 0; c < tetrowidth; c++ )
          if(_active_tetrodata.shape[r][c] == 1)
            _fulfillment_map[_active_position.row + r][_active_position.col + c] = true;
      
      game_area.updateStaticObjects(game, _fulfillment_map);
      _updateTetroqueue();
      _spawnTetromino(_tetroqueue[0]);
    }
    
    _last_drop_time = game.time.now;
  }
  
  this.moveCage = function(direction){
    if(game.time.now < _last_move_time + GameConfig.move_delay) return;
    
    direction = Math.sign(direction);
    const next_col = _active_position.col + direction;
    const is_direction_free = _canMoveTo(_active_tetrodata, _active_position.row, next_col);
    
    if(is_direction_free){
      _active_position.col = next_col;
      game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
    }
    
    _last_move_time = game.time.now;
  }
  
  this.rotateCage = function(direction){
    if(game.time.now < _last_rotation_time + GameConfig.rotation_delay) return;
    
    _rotateTetrodata(_active_tetrodata, direction);
    game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
    
    _last_rotation_time = game.time.now;
  }
  
  _initFulfillmentMap();
}