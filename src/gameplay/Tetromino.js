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
  
  const tile_size = game.height / GameConfig.grid_size[1];
  
  for( var r = 0; r < this.getHeight(); r++ ){
    for( var c = 0; c < this.getWidth(); c++ ){
      if( this.data.shape[r][c] == 1 ){
        var cage = new Cage(game);
        cage.x = c * tile_size;
        cage.y = r * tile_size;
        this.add(cage);
      }
    }
  }
  
};

Tetromino.prototype = Object.create(Phaser.Group.prototype);
Tetromino.prototype.constructor = Tetromino;