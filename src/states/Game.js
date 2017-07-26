var game_state = function() {

  return {
  
    create() {
      const previews_margin_left = 40;
      const previews_margin_top = 80;
      
      var game_container = new GameContainer(this.game);
      game_container.x = (this.game.width - game_container.width) * 0.5;
      
      var current_preview = new TetroPreview(this.game, "interface/lbl_current");
      current_preview.x = game_container.x + game_container.width + previews_margin_left;
      current_preview.y = previews_margin_top;
      
      var next_preview = new TetroPreview(this.game, "interface/lbl_next");
      next_preview.x = game_container.x + game_container.width + previews_margin_left;
      next_preview.y = current_preview.y + current_preview.height + previews_margin_top;
    },

    update() {
      
    },

    render() {
      
    }
  
  };
}();
