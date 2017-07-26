/*
  
  Tetromino object - a group of crates bound together. 
  Requires src/gameplay/Cage.js.
  
  Constructor:
  
      Tetromino(game, tetromino_data)
  
  game - instance of Phaser.Game object
  tetromino_data - single item from data/tetrominoes.json
  
*/

function Tetromino(game, tetromino_data){
	Phaser.Group.call(this, game);
  
  this.data = tetromino_data;
  this.tiled_width = this.data.shape[0].length;
  this.tiled_height = this.data.shape.length;
  
  const tile_size = game.height / GameConfig.grid_size[1];
  
  for( var r = 0; r < this.tiled_height; r++ ){
    for( var c = 0; c < this.tiled_width; c++ ){
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