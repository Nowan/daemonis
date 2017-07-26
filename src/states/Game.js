var game_state = function() {
  
  var current_tetrodata, next_tetrodata;

  function getRandomTetroData(game){
    var tetrobase = game.cache.getJSON('tetrominoes'); // list of tetrominoes from 'data/tetrominoes.json'
    const random_index = Math.floor(Math.random() * tetrobase.length);
    return tetrobase[random_index];
  }

  return {
  
    create() {
      const previews_margin_left = 40;
      const previews_margin_top = 80;
      const indicators_width = 380;
      const content_center = { x: this.game.width * 0.5, y: this.game.height * 0.5 };
      
      current_tetrodata = getRandomTetroData(this.game);
      next_tetrodata = getRandomTetroData(this.game);
      
      var game_container = new GameContainer(this.game);
      game_container.x = content_center.x - game_container.width * 0.5;
      
      var current_preview = new TetroPreview(this.game, "interface/lbl_current");
      current_preview.x = game_container.x + game_container.width + previews_margin_left;
      current_preview.y = previews_margin_top;
      current_preview.setPreview(this.game, current_tetrodata);
      
      var next_preview = new TetroPreview(this.game, "interface/lbl_next");
      next_preview.x = game_container.x + game_container.width + previews_margin_left;
      next_preview.y = current_preview.y + current_preview.height + previews_margin_top;
      next_preview.setPreview(this.game, next_tetrodata);
      
      var score_indicator = new ParamIndicator(this.game, indicators_width, "interface/lbl_score", 0);
      score_indicator.x = game_container.x - indicators_width;
      score_indicator.y = content_center.y - 110;
      
      var speed_indicator = new ParamIndicator(this.game, indicators_width, "interface/lbl_speed", "1.0x");
      speed_indicator.x = game_container.x - indicators_width;
      speed_indicator.y = content_center.y + 30;
      
      var game_area = new GameArea(this.game);
      game_container.setContent(game_area);
      
      
    },

    update() {
      
    },

    render() {
      
    }
  
  };
}();
