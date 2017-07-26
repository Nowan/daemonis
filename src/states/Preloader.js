var load_state = function() {
  
  return {
  
    preload() {
      // load game assets
      this.game.load.atlasJSONArray( 'basesheet', 'assets/spritesheets/basesheet.png',
                                     'assets/spritesheets/basesheet.json' );
      
      this.game.load.json('tetrominoes', 'data/tetrominoes.json');
    },
    
    create() {
      this.game.state.start('Game');
    }
    
  };
  
}();
