var bootState = (function () {
  
  function resizeHandler(scale, parentBounds) {
    const fitScale = parentBounds.height / this.game.height;
    scale.setUserScale(fitScale, fitScale, 0, 0);
  }
  
  return {
    create: function () {
      this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.game.scale.setResizeCallback(resizeHandler, this);
      
      this.game.scale.parentIsWindow = false;
      this.game.scale.pageAlignHorizontally = true;
      
      this.game.stage.disableVisibilityChange = true;
      
      gameConfig.tileSize = this.game.height / gameConfig.gridHeight;
      
      this.game.state.start('Preloader');
    }
  };
  
}());
