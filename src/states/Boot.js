var boot_state = function() {
  
  function resizeHandler(scale, parentBounds) {
    const fit_scale = parentBounds.height / this.game.height;
    scale.setUserScale(fit_scale, fit_scale, 0, 0);
  }
  
  return {
    preload() {
      
    },

    create() {
      this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.game.scale.setResizeCallback(resizeHandler, this);
      
      this.game.scale.parentIsWindow = false;
      this.game.scale.pageAlignHorizontally = true;
      
      this.game.stage.disableVisibilityChange = true;
      
      this.game.state.start('Preloader');
    }
  };
  
}();
