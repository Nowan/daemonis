var game_state = function() {
  
  var game_area;

  return {
  
    create() {
      game_container = new GameContainer(this.game);
      game_container.x = (this.game.width - game_container.width) * 0.5;
    },

    update() {
      
    },

    render() {
      
    }
  
  };
}();
