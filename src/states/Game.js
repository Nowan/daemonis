var gameState = (function () {

  var game_controller;

  return {
  
    create: function () {
      const previews_margin_left = 40;
      const previews_margin_top = 80;
      const indicators_width = 380;
      const content_center = { x: this.game.width * 0.5, y: this.game.height * 0.5 };
      
      // initialize interface
      var game_container = new GameContainer(this.game);
      game_container.x = content_center.x - game_container.width * 0.5;
      
      var current_preview = new TetroPreview(this.game, "interface/lbl_current");
      current_preview.x = game_container.x + game_container.width + previews_margin_left;
      current_preview.y = previews_margin_top;
      
      var next_preview = new TetroPreview(this.game, "interface/lbl_next");
      next_preview.x = game_container.x + game_container.width + previews_margin_left;
      next_preview.y = current_preview.y + current_preview.height + previews_margin_top;
      
      var score_indicator = new ParamIndicator(this.game, indicators_width, "interface/lbl_score", 0);
      score_indicator.x = game_container.x - indicators_width;
      score_indicator.y = content_center.y - 110;
      
      var speed_indicator = new ParamIndicator(this.game, indicators_width, "interface/lbl_speed", "1.0", "x");
      speed_indicator.x = game_container.x - indicators_width;
      speed_indicator.y = content_center.y + 30;
      
      var game_area = new GameArea(this.game);
      game_container.setContent(game_area);
      
      // register keys for future handling
      this.key_left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.key_down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      
      // stop selected keys propagation to the browser
      this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, 
                                               Phaser.Keyboard.UP, Phaser.Keyboard.DOWN ]);
      
      // initialize game controller and start a new game
      game_controller = new GameController( this.game, current_preview, next_preview,
                                                score_indicator, speed_indicator, game_area );
      game_controller.startGame();
    },

    update: function () {
      var is_game_finished = game_controller.tryToFinish();
      if(is_game_finished) return;
      
      var apply_acceleration = false;
      
      // handle keys
      if (this.key_left.isDown){
        game_controller.moveCage(-1);
      } 
    
      if (this.key_right.isDown){
        game_controller.moveCage(1);
      }
      
      if (this.key_up.isDown){
        game_controller.rotateCage(1);
      } 
      
      if (this.key_down.isDown){
        apply_acceleration = true;
      } 
      
      game_controller.dropCage(apply_acceleration);
      game_controller.clearRows();
    }
    
  };
}());
