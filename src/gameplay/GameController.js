function GameController(game, current_preview, next_preview, score_indicator, speed_indicator, game_area){

  // public methods
  this.startGame = function(){};
  this.dropCage = function(apply_acceleration){};
  this.emptyRows = function(){};
  this.moveCage = function(direction){}; // 1 - right, -1 - left; 
  this.rotateCage = function(direction){}; // 1 - clockwise, -1 - counter-clockwise
  this.tryToFinish = function(){ return false; };
  
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
  let _next_drop_time = game.time.now; // helper variable to check game finish in proper time
  let _last_move_time = game.time.now; // helper variable to move tetromino with proper delay
  let _last_rotation_time = game.time.now; // helper variable to rotate tetromino with proper delay
  
  // private methods
  function _getRandomTetrodata(){
    var tetrobase = game.cache.getJSON('tetrominoes'); // list of templates from 'data/tetrominoes.json'
    const random_index = Math.floor(Math.random() * tetrobase.length);
    return Tetrodata(tetrobase[random_index]);
  }
  
  function _initFulfillmentMap(){
    _fulfillment_map = [];
    for( var r = 0; r < GameConfig.grid.height; r++ ){
      _fulfillment_map[r] = [];
      for( var c = 0; c < GameConfig.grid.width; c++ )
        _fulfillment_map[r][c] = r==18 || r == 17 || r == 16;
    }
    _fulfillment_map[19][0] = true;
    _fulfillment_map[15][5] = true;
    _fulfillment_map[15][4] = true;
    _fulfillment_map[14][5] = true;
  }
  
  function _canMoveTo(tetrodata, target_row, target_col){
    // I check: if target position is inside game grid bounds
    if( target_row < 0 || target_row + tetrodata.getHeight() > GameConfig.grid.height ||
        target_col < 0 || target_col + tetrodata.getWidth() > GameConfig.grid.width )
      return false;
    
    // II check: check that tetromino does not collide with static objects on game grid
    for( var r = 0; r < tetrodata.getHeight(); r++ ){
      for( var c = 0; c < tetrodata.getWidth(); c++ ){
        if(tetrodata.shape[r][c] == 1 && _fulfillment_map[target_row + r][target_col + c])
          return false;
      }
    }
    
    return true;
  }

  function _updateTetroqueue(){
    _tetroqueue[0] = _tetroqueue[1];
    _tetroqueue[1] = _getRandomTetrodata();
    current_preview.setPreview(game, _tetroqueue[0]);
    next_preview.setPreview(game, _tetroqueue[1]);
  }
  
  function _spawnTetromino(tetrodata){
    _active_tetrodata = tetrodata;
    _active_position.row = 0;
    _active_position.col = 0;
    game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
  }
  
  function _getClosestRowCompletions(row, complete_ids){
    // returns closest completed rows for provided one; complete_ids - array of completed rows indexes
    var top_row = 0;
    var bot_row = complete_ids[complete_ids.length - 1];
    
    for( var i = 0; i < complete_ids.length; i++ ){
      if(row / complete_ids[i] > 1 ){ 
        top_row = complete_ids[i]; 
        bot_row = i - 1 >= 0 ? complete_ids[i - 1] : GameConfig.grid.height - 1;
        break; 
      }
    }
    
    return { top: top_row, bottom: bot_row };
  }
  
  // public methods initialization
  this.startGame = function(){
    _tetroqueue = [ _getRandomTetrodata(), _getRandomTetrodata() ];
    current_preview.setPreview(game, _tetroqueue[0]);
    next_preview.setPreview(game, _tetroqueue[1]);
    _spawnTetromino(_tetroqueue[0]);
  }
  
  this.dropCage = function( apply_acceleration ){
    const time_step = apply_acceleration ? GameConfig.accelerated_drop_time : GameConfig.regular_drop_time;
    if(game.time.now < _last_drop_time + time_step) return;
    
    const is_falling = _canMoveTo(_active_tetrodata, _active_position.row + 1, _active_position.col);
    
    if(is_falling){
      _active_position.row += 1;
      game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
    }
    else{ // if tetromino has fallen
      // update score indicator
      GameGlobals.score += _active_tetrodata.segments_n * GameConfig.drop_value;
      score_indicator.setValue(GameGlobals.score);
    
      // set flags of _fulfillment_map from active tetromino shape
      for( var r = 0; r < _active_tetrodata.getHeight(); r++ )
        for( var c = 0; c < _active_tetrodata.getWidth(); c++ )
          if(_active_tetrodata.shape[r][c] == 1)
            _fulfillment_map[_active_position.row + r][_active_position.col + c] = true;
      
      game_area.updateStaticObjects(game, _fulfillment_map);
      _updateTetroqueue();
      _spawnTetromino(_tetroqueue[0]);
    }
    
    _next_drop_time = game.time.now + time_step;
    _last_drop_time = game.time.now;
  }
  
  this.emptyRows = function(){
    if(game.time.now != _last_drop_time) return;
    
    // get complete rows indexes
    let complete_row_ids = [];
    for( var r = GameConfig.grid.height - 1; r >= 0; r-- ){
      let is_row_complete = true;
      for( var c = 0; c < GameConfig.grid.width; c++ )
        if(!_fulfillment_map[r][c]){ is_row_complete = false; break; }
      if(is_row_complete) complete_row_ids.push(r);
    }
    
    if(complete_row_ids.length <= 0) return;
    
    // update _fulfillment_map
    for( var i = complete_row_ids.length - 1; i >= 0; i-- ){ // loop through complete rows
      const cr = complete_row_ids[i];
      const tmp_stack = _fulfillment_map.slice(0, cr); // make copy of all rows above complete one
      _fulfillment_map.splice.apply(_fulfillment_map, [1, cr].concat(tmp_stack)); // move rows on 1 position down
      for( var c = 0; c < GameConfig.grid.width; c++ ) _fulfillment_map[0][c] = false; // empty first row
    }
    
    game_area.updateStaticObjects(game, _fulfillment_map);
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
    
    var tmp_tetrodata = new Tetrodata(_active_tetrodata);
    tmp_tetrodata.rotate(direction);
    
    // automatically fix tetromino position if it is partly outside grid bounds
    var tmp_position = { 
      row: Math.min(_active_position.row, GameConfig.grid.height - tmp_tetrodata.getHeight()),
      col: Math.min(_active_position.col, GameConfig.grid.width - tmp_tetrodata.getWidth())
    };

    // apply changes if rotated tetromino does not overlap static objects
    if(_canMoveTo(tmp_tetrodata, tmp_position.row, tmp_position.col)){
      _active_tetrodata = tmp_tetrodata;
      _active_position = tmp_position;
    
      game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
      _last_rotation_time = game.time.now;
    }
  }
  
  this.tryToFinish = function(){
    if(game.time.now < _next_drop_time) return false;
    
    var is_game_finished = false;
    for( var c = 0; c < GameConfig.grid.width; c++ ){
      if(_fulfillment_map[0][c]){
        is_game_finished = true;
        break;
      }
    }
    
    if(is_game_finished){
      
    }
    
    return is_game_finished;
  }
  
  _initFulfillmentMap();
}