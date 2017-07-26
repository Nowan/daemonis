var load_state = function() {
  
  return {
  
    preload() {
      // load game assets
      this.game.load.atlasJSONArray( 'basesheet', 'assets/spritesheets/basesheet.png',
                                     'assets/spritesheets/basesheet.json' );
    },
    
    create() {
      this.game.state.start('Game');
    }
    
  };
  
}();
