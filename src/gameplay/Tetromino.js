/*
  
  Tetromino object - a group of crates bound together. 
  Requires src/gameplay/Cage.js.
  
  Constructor:
  
      Tetromino(game, tetromino_data)
  
  game - instance of Phaser.Game object
  tetromino_data - single item from data/tetrominoes.json
  
*/

function Tetromino(game, tetrodata){
	Phaser.Group.call(this, game);
  
  this.data = new Tetrodata(tetrodata);
  
  this.getWidth = tetrodata.getWidth;
  this.getHeight = tetrodata.getHeight;
  
  for( var r = 0; r < this.getHeight(); r++ ){
    for( var c = 0; c < this.getWidth(); c++ ){
      if( this.data.shape[r][c] == 1 ){
        var cage = new Cage(game);
        
        // offset to place cage precisely in tile center
        const offset_x = (gameConfig.tileSize - cage.width) * 0.5;
        const offset_y = (gameConfig.tileSize - cage.height) * 0.5;
        
        cage.x = c * gameConfig.tileSize + offset_x;
        cage.y = r * gameConfig.tileSize + offset_y;
        
        this.add(cage);
      }
    }
  }
  
};

Tetromino.prototype = Object.create(Phaser.Group.prototype);
Tetromino.prototype.constructor = Tetromino;