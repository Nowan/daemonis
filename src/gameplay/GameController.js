function GameController(game, current_preview, next_preview, score_indicator, speed_indicator, game_area){

  // public methods
  this.startGame = function(){};
  this.dropCage = function(){};
  
  // private variables
  let _tetroqueue = []; // queue of tetrominoes. Element at 0 is current tetrominoe, 1 - next, ...
  let _active_tetromino;
  let _drop_time = 0; // helper variable to fire tetromino drop in proper time
  
  // private methods
  function _getRandomTetrodata(game){
    var tetrobase = game.cache.getJSON('tetrominoes'); // list of tetrominoes from 'data/tetrominoes.json'
    const random_index = Math.floor(Math.random() * tetrobase.length);
    return tetrobase[random_index];
  }
  
  function _spawnTetromino(tetrodata){
    _active_tetromino = game_area.spawnTetromino(game, tetrodata);
  }
  
  // public methods initialization
  this.startGame = function(){
    _tetroqueue = [ _getRandomTetrodata(game), _getRandomTetrodata(game) ];
    current_preview.setPreview(game, _tetroqueue[0]);
    next_preview.setPreview(game, _tetroqueue[1]);
    _spawnTetromino(_tetroqueue[0]);
  }
  
  this.dropCage = function(){
    if(game.time.now < _drop_time) return;
    
    const tile_size = game.height / GameConfig.grid_size[1];
    _active_tetromino.y += tile_size;
    _drop_time = game.time.now + GameConfig.regular_drop_time;
  }
}