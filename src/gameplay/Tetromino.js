/*
  
  A group of cages bound together. 
  
*/

function Tetromino(game, tetrodata) {
  Phaser.Group.call(this, game);
  
  this.data = new Tetrodata(tetrodata);
  
  this.getWidth = tetrodata.getWidth;
  this.getHeight = tetrodata.getHeight;
  
  for (var r = 0; r < this.getHeight(); r++) {
    for (var c = 0; c < this.getWidth(); c++) {
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