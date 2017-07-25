var load_state = function() {
  
  return {
  
    preload() {
      // load game assets
      
    },
    
    create() {
      this.game.state.start('Game');
    }
    
  };
  
}();
