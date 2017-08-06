/*
  
  A group of cages bound together. 
  
*/

function Tetromino(game, tetrodata) {
  Phaser.Group.call(this, game);
  
  this.data = new Tetrodata(tetrodata);
  
  Object.defineProperty(this, 'width', { enumerable: true, get: function(){
    return this.data.width;
  }});
  
  Object.defineProperty(this, 'height', { enumerable: true, get: function(){
    return this.data.height;
  }});
  
  for (var r = 0; r < this.height; r++) {
    for (var c = 0; c < this.width; c++) {
      if (this.data.shape[r][c] == 1) {
        var cage = new Cage(game);
        
        var offsetX = (gameConfig.tileSize - cage.width) * 0.5;
        var offsetY = (gameConfig.tileSize - cage.height) * 0.5;
        
        cage.x = c * gameConfig.tileSize + offsetX;
        cage.y = r * gameConfig.tileSize + offsetY;
        
        this.add(cage);
      }
    }
  }
};

Tetromino.prototype = Object.create(Phaser.Group.prototype);