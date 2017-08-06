var gameState = (function () {

  var gameController;

  return {
  
    create: function () {
      var previewMarginLeft = 40;
      var previewMarginTop = 80;
      var indicatorWidth = 380;
      var contentCenter = { x: this.game.width * 0.5, y: this.game.height * 0.5 };
      
      // initialize interface
      var gameContainer = new GameContainer(this.game);
      gameContainer.x = contentCenter.x - gameContainer.width * 0.5;
      
      var currentPreview = new TetroPreview(this.game, "interface/lbl_current");
      currentPreview.x = gameContainer.x + gameContainer.width + previewMarginLeft;
      currentPreview.y = previewMarginTop;
      
      var nextPreview = new TetroPreview(this.game, "interface/lbl_next");
      nextPreview.x = gameContainer.x + gameContainer.width + previewMarginLeft;
      nextPreview.y = currentPreview.y + currentPreview.height + previewMarginTop;
      
      var scoreIndicator = new ParamIndicator(this.game, indicatorWidth, "interface/lbl_score", 0);
      scoreIndicator.x = gameContainer.x - indicatorWidth;
      scoreIndicator.y = contentCenter.y - 110;
      
      var speedIndicator = new ParamIndicator(this.game, indicatorWidth, "interface/lbl_speed", "1.0", "x");
      speedIndicator.x = gameContainer.x - indicatorWidth;
      speedIndicator.y = contentCenter.y + 30;
      
      var gameView = new GameView(this.game);
      gameContainer.setContent(gameView);
      
      // register keys for future handling
      this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.keyUp = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.keyDown = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      
      // stop selected keys propagation to the browser
      this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
                                               Phaser.Keyboard.UP, Phaser.Keyboard.DOWN ]);
      
      // initialize game controller and start a new game
      gameController = new GameController(this.game, currentPreview, nextPreview,
                                          scoreIndicator, speedIndicator, gameView);
      gameController.startGame();
    },

    update: function () {
      var isGameFinished = gameController.tryToFinish();
      if (isGameFinished) { return; }
      
      var applyAcceleration = false;
      
      // handle keys
      if (this.keyLeft.isDown) {
        gameController.moveCage(-1);
      }
    
      if (this.keyRight.isDown) {
        gameController.moveCage(1);
      }
      
      if (this.keyUp.isDown) {
        gameController.rotateCage(1);
      }
      
      if (this.keyDown.isDown) {
        applyAcceleration = true;
      }
      
      gameController.dropCage(applyAcceleration);
      gameController.clearRows();
    }
    
  };
}());
