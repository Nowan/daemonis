function GameController(game, current_preview, next_preview, score_indicator, speed_indicator, game_area){

  // public methods
  this.startGame = function(){};
  this.dropCage = function(){};
  
  // additional callbacks
  this.onTetrominoFit = function(position, tetrodata){};
  this.onRowFull = function(row_index){};
  
  // private variables
  let _tetroqueue = []; // queue of tetrominoes. Element at 0 is current tetrominoe, 1 - next, ...
  let _active_tetrodata; // data of active tetromino (as in "data/tetrominoes.json")
  let _active_position = { row: 0, col: 0 }; // position where active tetromino is located
  let _fulfillment_map = []; // boolean matrix of a size of game grid. Provides info about tetrominoes that have   
                             // fallen already. If element at [row, col] is true - slot is full, false - empty. 
  let _drop_time = 0; // helper variable to fire tetromino drop in proper time
  
  // private methods
  function _getRandomTetrodata(){
    var tetrobase = game.cache.getJSON('tetrominoes'); // list of tetrominoes from 'data/tetrominoes.json'
    const random_index = Math.floor(Math.random() * tetrobase.length);
    return tetrobase[random_index];
  }
  
  function _rotateTetrodata(tetrodata, direction){
    // TODO: rotate tetrodata matrix in clockwise / couter-clockwise directions
  }
  
  function _initFulfillmentMap(){
    _fulfillment_map = [];
    for( var r = 0; r < GameConfig.grid_size[1]; r++ ){
      _fulfillment_map[r] = [];
      for( var c = 0; c < GameConfig.grid_size[0]; c++ )
        _fulfillment_map[r][c] = false;
    }
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
    console.log(_active_tetrodata);
  }
  
  // public methods initialization
  this.startGame = function(){
    _tetroqueue = [ _getRandomTetrodata(), _getRandomTetrodata() ];
    current_preview.setPreview(game, _tetroqueue[0]);
    next_preview.setPreview(game, _tetroqueue[1]);
    _spawnTetromino(_tetroqueue[0]);
  }
  
  this.dropCage = function(){
    if(game.time.now < _drop_time) return;
    
    const tetrowidth = _active_tetrodata.shape[0].length;
    const tetroheight = _active_tetrodata.shape.length;
    
    if(_active_position.row + tetroheight < GameConfig.grid_size[1]){
      _active_position.row += 1;
      game_area.updateActiveTetromino(game, _active_position, _active_tetrodata);
    }
    else{
      // update flags of _fulfillment_map with active tetromino
      for( var r = 0; r < tetroheight; r++ )
        for( var c = 0; c < tetrowidth; c++ )
          if(_active_tetrodata.shape[r][c] == 1)
            _fulfillment_map[_active_position.row + r][_active_position.col + c] = true;
      
      game_area.updateStaticObjects(game, _fulfillment_map);
      _updateTetroqueue();
      _spawnTetromino(_tetroqueue[0]);
    }
    
    _drop_time = game.time.now + GameConfig.regular_drop_time;
  }
  
  _initFulfillmentMap();
}