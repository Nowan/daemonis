var load_state = function() {
  
  return {
  
    preload() {
      // load game assets
      this.game.load.atlasJSONArray( 'basesheet', 'assets/spritesheets/basesheet.png',
                                     'assets/spritesheets/basesheet.json' );
      this.game.load.spritesheet('buttonsheet', 'assets/spritesheets/buttonsheet.png', 304, 49);
      this.game.load.image('logo','assets/textures/logo.png');
      
      // load data files
      this.game.load.json('tetrominoes', 'data/tetrominoes.json');
      
      // force Phaser to preload custom font by creating temporary text object
      var font_fix = this.game.add.text(0, 0, "fix", {font:"1px endorregular"}); font_fix.destroy();
    },
    
    create() {
      this.game.state.start('Menu');
    }
    
  };
  
}();
