/*

  "Where all the magic happens". 
  Controller for controlling all game logic and binding it with views. 

*/

function GameController(game, curPreview, nxtPreview, scoreIndicator, speedIndicator, gameView) {

  // public methods
  
  this.startGame = function () {};
  this.dropTetromino = function (applyAcceleration) {};
  this.clearRows = function () {};
  this.moveTetromino = function (direction) {}; // 1 - right, -1 - left
  this.rotateTetromino = function (direction) {}; // 1 - clockwise, -1 - counter-clockwise 
  this.tryToFinish = function () { return false; };
  
  // private variables
  
  var _tetroqueue = []; // queue of tetrominoes. Element at 0 is current tetrominoe, 1 - next
  var _tetrodata; // data of active tetromino
  var _position = { row: 0, col: 0 }; // position where active tetromino is located
  var _fillMap = (function () { // matrix showing what elements of grid are full or empty. Indexation by [row][col] 
    var map = [];
    for (var r = 0; r < gameConfig.gridHeight; r++) { 
      map[r] = [];
      for (var c = 0; c < gameConfig.gridWidth; c++) { map[r][c] = false; }
    }
    return map;
  }());
  
  var _lastDropTime = game.time.now; // helper variable to fire tetromino drop in proper time
  var _nextDropTime = game.time.now; // helper variable to check game finish in proper time
  var _lastMoveTime = game.time.now; // helper variable to move tetromino with proper delay
  var _lastRotTime = game.time.now; // helper variable to rotate tetromino with proper delay
  var _chainSoundTime = game.time.now;
  
  // private methods
  
  
  function _getRandomTetrodata() {
    var tetrobase = game.cache.getJSON('tetrominoes');
    return Tetrodata(tetrobase[game.rnd.integerInRange(0, tetrobase.length - 1)]);
  }
  
  
  
  function _canMoveTo(tetrodata, targetRow, targetCol) {
    // check, if tetromino can fit into new position
    
    // I check: if target position is inside game grid bounds
    if (targetRow < 0 || targetRow + tetrodata.height > gameConfig.gridHeight ||
        targetCol < 0 || targetCol + tetrodata.width > gameConfig.gridWidth) { return false; }
    
    // II check: check that tetromino does not collide with static objects on game grid
    for (var r = 0; r < tetrodata.height; r++) {
      for (var c = 0; c < tetrodata.width; c++) {
        if (tetrodata.shape[r][c] == 1 && _fillMap[targetRow + r][targetCol + c]) { return false; }
      }
    }
    
    return true;
  }
  
  
  
  function _updateSpeedIndicator(timeStep) {
    var speed = gameConfig.regDropTime / timeStep;
    if(speed == speedIndicator.getValue()) return;
    speedIndicator.setValue(speed.toFixed(1));
  }
  
  
  
  function _updateScore(rowN) {
    var score = gameConfig.gridWidth * gameConfig.fillValue; // regular reward for single line
    score *= rowN; // multiply by number of completed lines
    score += score * (rowN - 1) * gameConfig.bonusMultiplier; // apply bonus for multi-completion
    gameGlobals.score += score;
    scoreIndicator.setValue(gameGlobals.score);
  }
  
  

  function _updateTetroqueue() {
    _tetroqueue[0] = _tetroqueue[1];
    _tetroqueue[1] = _getRandomTetrodata();
    curPreview.updatePreview(game, _tetroqueue[0]);
    nxtPreview.updatePreview(game, _tetroqueue[1]);
  }
  
  
  
  function _spawnTetromino(tetrodata){
    _tetrodata = tetrodata;
    _position.row = 0;
    _position.col = Math.floor((gameConfig.gridWidth - tetrodata.width) * 0.5);
    gameView.updateTetromino(game, _position, _tetrodata);
  }

  
  
  // public methods initialization
  
  
  this.startGame = function(){
    _tetroqueue = [ _getRandomTetrodata(), _getRandomTetrodata() ];
    curPreview.updatePreview(game, _tetroqueue[0]);
    nxtPreview.updatePreview(game, _tetroqueue[1]);
    _spawnTetromino(_tetroqueue[0]);
  };
  
  
  
  this.dropTetromino = function(applyAcceleration) {
    var timeStep = applyAcceleration ? gameConfig.aclDropTime : gameConfig.regDropTime;
    _updateSpeedIndicator(timeStep);
    
    if (game.time.now < _lastDropTime + timeStep) return;
    
    if (_canMoveTo(_tetrodata, _position.row + 1, _position.col)) {
      // if tetromino is still falling - update its position in view
      _position.row += 1;
      gameView.updateTetromino(game, _position, _tetrodata);
    } else {
      // if tetromino has just fallen
      
      // update score indicator
      gameGlobals.score += _tetrodata.blocksNumber * gameConfig.dropValue;
      scoreIndicator.setValue(gameGlobals.score);
    
      // update _fillMap with data from fallen tetromino
      for (var r = 0; r < _tetrodata.height; r++) {
        for (var c = 0; c < _tetrodata.width; c++) {
          if(_tetrodata.shape[r][c] == 1) {
            _fillMap[_position.row + r][_position.col + c] = true;
          }
        }
      }
      
      // update view
      gameView.addStaticTetro(game, _position, _tetrodata);
      
      // generate next tetromino
      _updateTetroqueue();
      _spawnTetromino(_tetroqueue[0]);
    }
    
    // play chain sound
    if (game.time.now > _chainSoundTime) {
      var rndTrack = game.rnd.integerInRange(0, 10000) < 5000 ? 1 : 2;
      var chainSound = game.add.audio("chain_"+ rndTrack +"_snd");
      chainSound.volume = game.rnd.realInRange(0.9, 1);
      chainSound.play();
      chainSound._sound.playbackRate.value = game.rnd.realInRange(0.9,1.2);
      _chainSoundTime += Math.max(timeStep, 400);
    }
    
    // reset time counters
    _nextDropTime = game.time.now + timeStep;
    _lastDropTime = game.time.now;
  };
  
  
  
  this.clearRows = function() {
    if(game.time.now != _lastDropTime) return;
    
    // get complete rows indexes
    var rowIDs = [];
    for (var r = gameConfig.gridHeight - 1; r >= 0; r--) {
      var isRowComplete = true;
      for (var c = 0; c < gameConfig.gridWidth; c++) {
        if (!_fillMap[r][c]) { isRowComplete = false; break; }
      }
      if(isRowComplete) { rowIDs.push(r); }
    }
    
    if (rowIDs.length > 0) {
      _updateScore(rowIDs.length);

      // update _fillMap
      for (var i = rowIDs.length - 1; i >= 0; i--) {
        // move all rows above completed one on 1 position down
        var cr = rowIDs[i];
        var tmp_stack = _fillMap.slice(0, cr);
        _fillMap.splice.apply(_fillMap, [1, cr].concat(tmp_stack));
        _fillMap[0] = []; 
        for (var c = 0; c < gameConfig.gridWidth; c++) { _fillMap[0][c] = false; }
      }

      // play flame sound with appropriate rate 
      var flameSound = game.add.audio("flame_snd");
      flameSound.play();
      flameSound._sound.playbackRate.value = flameSound.totalDuration * 1000 / gameConfig.rowBurnTime;

      // add some screams! 
      (function playScreams() {
        var screamsN = game.rnd.integerInRange(rowIDs.length * 3, rowIDs.length * 5);
        for (var i = 0; i < screamsN; i++) {
          var rndN = game.rnd.integerInRange(0, 9000);
          var screamSound = game.add.audio("scream_" + (rndN < 3000 ? 1 : rndN < 6000 ? 2 : 3) + "_snd");
          screamSound.volume = game.rnd.realInRange(0.35, 0.5);

          // play sound with slight delay to prevent all prisoners screaming all at once
          game.time.events.add(game.rnd.integerInRange(0, 500), function () {
            screamSound.play();
            screamSound._sound.playbackRate.value = game.rnd.realInRange(0.9,1.2);
          }, this);
        }
      }());

      // update view
      gameView.clearRows(game, rowIDs, _fillMap);
    }
  };
  
  
  
  this.moveTetromino = function(direction) {
    if(game.time.now < _lastMoveTime + gameConfig.moveDelay) return;
    direction = Math.sign(direction);

    if (_canMoveTo(_tetrodata, _position.row, _position.col + direction)) {
      _position.col = _position.col + direction;
      gameView.updateTetromino(game, _position, _tetrodata);
    }
    
    _lastMoveTime = game.time.now;
  };
  
  
  
  this.rotateTetromino = function(direction) {
    if(game.time.now < _lastRotTime + gameConfig.rotDelay) return;
    
    // apply rotation on tetrodata copy
    var tmpTetrodata = new Tetrodata(_tetrodata);
    tmpTetrodata.rotate(direction);
    
    // automatically fix tetromino position if it is partly outside grid bounds
    var tmpPos = { 
      row: Math.min(_position.row, gameConfig.gridHeight - tmpTetrodata.height),
      col: Math.min(_position.col, gameConfig.gridWidth - tmpTetrodata.width)
    };

    // apply changes if tetromino does not overlap other objects
    if (_canMoveTo(tmpTetrodata, tmpPos.row, tmpPos.col)) {
      _tetrodata = tmpTetrodata;
      _position = tmpPos;
      gameView.updateTetromino(game, _position, _tetrodata);
      _lastRotTime = game.time.now;
    }
  };
  
  
  
  this.tryToFinish = function(){
    if(game.time.now < _nextDropTime) { return false; }
    
    // game is finished when next tetromino cannot be placed in starting position
    var isGameFinished = !_canMoveTo(_tetroqueue[1], 0, Math.floor((gameConfig.gridWidth - _tetrodata.width) * 0.5));
    
    if (isGameFinished) {
      var score = gameGlobals.score;
      gameGlobals.score = 0;
      game.state.start("Finish", true, false, score);
    }
    
    return isGameFinished;
  }
}