/*

  Object for visualizing game world with data from GameController.

*/

function GameView(game) {
  Phaser.Group.call(this, game);
  
  this.objectMap = []; // matrix of static display objects accessed by [row][col]
  for (var r = 0; r < gameConfig.gridHeight; r++) {
    this.objectMap[r] = [];
  }
  
  this.objectGroup = game.add.group();
  this.add(this.objectGroup);
};

GameView.prototype = Object.create(Phaser.Group.prototype);
GameView.prototype.varructor = GameView;

GameView.prototype.updateTetromino = function(game, position, tetrodata){
  // update display objects only if data has changed
  if (!this.tetromino || tetrodata !== this.tetromino.data) {
    if (this.chain) { this.chain.destroy(); }
    this.chain = game.add.tileSprite( 0, 0, 8, 0, "basesheet", "game/chain");
    this.chain.anchor.x = 0.5;
    this.add(this.chain)
    
    if (this.tetromino) { this.tetromino.destroy(); }
    this.tetromino = new Tetromino(game, tetrodata);
    this.add(this.tetromino);
  }
  
  this.chain.height = position.row * gameConfig.tileSize;
  this.chain.x = (position.col + this.tetromino.getWidth() * 0.5) * gameConfig.tileSize;
  this.tetromino.x = position.col * gameConfig.tileSize;
  this.tetromino.y = position.row * gameConfig.tileSize;
};

GameView.prototype.addStaticTetro = function (game, position, tetrodata) {
  for (var r = 0; r < tetrodata.getHeight(); r++) {
    for (var c = 0; c < tetrodata.getWidth(); c++) {
      if (tetrodata.shape[r][c] === 1) {
        var cage = new Cage(game);
        
        var offsetX = (gameConfig.tileSize - cage.width) * 0.5;
        var offsetY = (gameConfig.tileSize - cage.height) * 0.5;
        
        cage.x = (position.col + c) * gameConfig.tileSize + offsetX;
        cage.y = (position.row + r) * gameConfig.tileSize + offsetY;
        
        this.objectGroup.add(cage);
        this.objectMap[position.row + r][position.col + c] = cage;
      }
    }
  }
};

GameView.prototype.clearRows = function (game, rowIDs, fillMap) {
  for (var i = 0; i < rowIDs.length; i++) {
    var r = rowIDs[i];
    for (var c = gameConfig.gridWidth - 1; c >= 0; c--) {
      if (this.objectMap[r][c]) {
        this.objectMap[r][c].burn(game);
        this.objectMap[r].splice(c, 1);
      }
    }
  }
  
  game.time.events.add(gameConfig.row_burning_time, function () {
    this.resetView(game, fillMap);
  }, this);
};

GameView.prototype.resetView = function (game, fillMap) {
  this.objectGroup.removeAll();
  
  for (var r = 0; r < gameConfig.gridHeight; r++) {
    this.objectMap[r] = [];
    
    for (var c = 0; c < gameConfig.gridWidth; c++) {
      if (fillMap[r][c]) {
        var cage = new Cage(game);
        
        var offsetX = (gameConfig.tileSize - cage.width) * 0.5;
        var offsetY = (gameConfig.tileSize - cage.height) * 0.5;
        
        cage.x = c * gameConfig.tileSize + offsetX;
        cage.y = r * gameConfig.tileSize + offsetY;
        
        this.objectGroup.add(cage);
        this.objectMap[r][c] = cage;
      }
    }
  }
};