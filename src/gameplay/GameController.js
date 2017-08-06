function GameController(game, current_preview, next_preview, score_indicator, speed_indicator, gameView){

  // public methods
  this.startGame = function(){};
  this.dropCage = function(apply_acceleration){};
  this.clearRows = function(){};
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
  let _chain_sound_time = game.time.now;
  
  // private methods
  function _getRandomTetrodata(){
    var tetrobase = game.cache.getJSON('tetrominoes'); // list of templates from 'data/tetrominoes.json'
    const random_index = Math.floor(Math.random() * tetrobase.length);
    return Tetrodata(tetrobase[random_index]);
  }
  
  function _initFulfillmentMap(){
    _fulfillment_map = [];
    for( var r = 0; r < gameConfig.gridHeight; r++ ){
      _fulfillment_map[r] = [];
      for( var c = 0; c < gameConfig.gridWidth; c++ )
        _fulfillment_map[r][c] = false;
    }
  }
  
  function _canMoveTo(tetrodata, target_row, target_col){
    // I check: if target position is inside game grid bounds
    if( target_row < 0 || target_row + tetrodata.height > gameConfig.gridHeight ||
        target_col < 0 || target_col + tetrodata.width > gameConfig.gridWidth )
      return false;
    
    // II check: check that tetromino does not collide with static objects on game grid
    for( var r = 0; r < tetrodata.height; r++ ){
      for( var c = 0; c < tetrodata.width; c++ ){
        if(tetrodata.shape[r][c] == 1 && _fulfillment_map[target_row + r][target_col + c])
          return false;
      }
    }
    
    return true;
  }
  
  function _updateSpeedIndicator(time_step){
    const speed = gameConfig.regDropTime / time_step;
    if(speed == speed_indicator.getValue()) return; // prevent update if value is still the same
    speed_indicator.setValue(speed.toFixed(1));
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
    gameView.updateTetromino(game, _active_position, _active_tetrodata);
  }
  
  function _getClosestRowCompletions(row, complete_ids){
    // returns closest completed rows for provided one; complete_ids - array of completed rows indexes
    var top_row = 0;
    var bot_row = complete_ids[complete_ids.length - 1];
    
    for( var i = 0; i < complete_ids.length; i++ ){
      if(row / complete_ids[i] > 1 ){ 
        top_row = complete_ids[i]; 
        bot_row = i - 1 >= 0 ? complete_ids[i - 1] : gameConfig.gridHeight - 1;
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
    const time_step = apply_acceleration ? gameConfig.aclDropTime : gameConfig.regDropTime;
    _updateSpeedIndicator(time_step);
    
    if(game.time.now < _last_drop_time + time_step) return;
    
    const is_falling = _canMoveTo(_active_tetrodata, _active_position.row + 1, _active_position.col);
    
    if(is_falling){
      _active_position.row += 1;
      gameView.updateTetromino(game, _active_position, _active_tetrodata);
    }
    else{ // if tetromino has fallen
      // update score indicator
      gameGlobals.score += _active_tetrodata.blocksNumber * gameConfig.dropValue;
      score_indicator.setValue(gameGlobals.score);
    
      // set flags of _fulfillment_map from active tetromino shape
      for( var r = 0; r < _active_tetrodata.height; r++ )
        for( var c = 0; c < _active_tetrodata.width; c++ )
          if(_active_tetrodata.shape[r][c] == 1)
            _fulfillment_map[_active_position.row + r][_active_position.col + c] = true;
      
      gameView.addStaticTetro(game, _active_position, _active_tetrodata);
      _updateTetroqueue();
      _spawnTetromino(_tetroqueue[0]);
    }
    
    // play chain sound with max 250 ms frequency and slight rate & volume change
    if(game.time.now > _chain_sound_time){
      const rand_track = game.rnd.integerInRange(0, 10000) < 5000 ? 1 : 2;
      var chain_sound = game.add.audio("chain_"+ rand_track +"_snd");
      chain_sound.volume = game.rnd.realInRange(0.9, 1);
      chain_sound.play();
      chain_sound._sound.playbackRate.value = game.rnd.realInRange(0.9,1.2);
      _chain_sound_time += Math.max(time_step, 400);
    }
    // reset counters
    _next_drop_time = game.time.now + time_step;
    _last_drop_time = game.time.now;
  }
  
  this.clearRows = function(){
    if(game.time.now != _last_drop_time) return;
    
    // get complete rows indexes
    let complete_row_ids = [];
    for( var r = gameConfig.gridHeight - 1; r >= 0; r-- ){
      let is_row_complete = true;
      for( var c = 0; c < gameConfig.gridWidth; c++ )
        if(!_fulfillment_map[r][c]){ is_row_complete = false; break; }
      if(is_row_complete) complete_row_ids.push(r);
    }
    
    if(complete_row_ids.length <= 0) return;
    
    // update score & indicator
    let score = gameConfig.gridWidth * gameConfig.fillValue; // regular reward for single line
    score *= complete_row_ids.length; // multiply by complete lines number
    score += score * (complete_row_ids.length - 1) * gameConfig.bonusMultiplier; // apply bonus for multi-completion
    gameGlobals.score += score;
    score_indicator.setValue(gameGlobals.score);
    
    // update _fulfillment_map
    for( var i = complete_row_ids.length - 1; i >= 0; i-- ){ // loop through complete rows
      const cr = complete_row_ids[i];
      const tmp_stack = _fulfillment_map.slice(0, cr); // make copy of all rows above complete one
      _fulfillment_map.splice.apply(_fulfillment_map, [1, cr].concat(tmp_stack)); // move rows on 1 position down
      _fulfillment_map[0] = []; // make topmost row empty
      for( var c = 0; c < gameConfig.gridWidth; c++ ) _fulfillment_map[0][c] = false;
    }
    
    // play flame sound with appropriate rate 
    var flame_sound = game.add.audio("flame_snd");
    flame_sound.play();
    flame_sound._sound.playbackRate.value = flame_sound.totalDuration * 1000 / gameConfig.rowBurnTime;
    
    // add some screams! 
    const screams_n = game.rnd.integerInRange(complete_row_ids.length * 3, complete_row_ids.length * 5);
    for( var i = 0; i < screams_n; i++ ){
      const rand_int = game.rnd.integerInRange(0, 9000);
      const track_id = rand_int < 3000 ? 1 : rand_int < 6000 ? 2 : 3;
      var scream_sound = game.add.audio("scream_"+ track_id +"_snd");
      scream_sound.volume = game.rnd.realInRange(0.35, 0.5);
      
      // play sound with slight delay to prevent all prisoners screaming all at once
      game.time.events.add(game.rnd.integerInRange(0, 500), function(){
        scream_sound.play();
        scream_sound._sound.playbackRate.value = game.rnd.realInRange(0.9,1.2);
      }, this);
    }
    
    // run view animation
    gameView.clearRows(game, complete_row_ids, _fulfillment_map);
  }
  
  this.moveCage = function(direction){
    if(game.time.now < _last_move_time + gameConfig.moveDelay) return;
    
    direction = Math.sign(direction);
    const next_col = _active_position.col + direction;
    const is_direction_free = _canMoveTo(_active_tetrodata, _active_position.row, next_col);
    
    if(is_direction_free){
      _active_position.col = next_col;
      gameView.updateTetromino(game, _active_position, _active_tetrodata);
    }
    
    _last_move_time = game.time.now;
  }
  
  this.rotateCage = function(direction){
    if(game.time.now < _last_rotation_time + gameConfig.rotDelay) return;
    
    var tmp_tetrodata = new Tetrodata(_active_tetrodata);
    tmp_tetrodata.rotate(direction);
    
    // automatically fix tetromino position if it is partly outside grid bounds
    var tmp_position = { 
      row: Math.min(_active_position.row, gameConfig.gridHeight - tmp_tetrodata.height),
      col: Math.min(_active_position.col, gameConfig.gridWidth - tmp_tetrodata.width)
    };

    // apply changes if rotated tetromino does not overlap static objects
    if(_canMoveTo(tmp_tetrodata, tmp_position.row, tmp_position.col)){
      _active_tetrodata = tmp_tetrodata;
      _active_position = tmp_position;
    
      gameView.updateTetromino(game, _active_position, _active_tetrodata);
      _last_rotation_time = game.time.now;
    }
  }
  
  this.tryToFinish = function(){
    if(game.time.now < _next_drop_time) return false;
    
    // game is finished when new tetromino cannot be placed in starting position
    var is_game_finished = !_canMoveTo(_active_tetrodata, 0, 0);
    
    if(is_game_finished){
      // finish game
      const score = gameGlobals.score;
      gameGlobals.score = 0;
      
      game.state.start("Finish", true, false, score);
    }
    
    return is_game_finished;
  }
  
  _initFulfillmentMap();
}