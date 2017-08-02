var load_state = function() {
  
  return {
  
    preload() {
      // load game assets
      this.game.load.atlasJSONArray( 'basesheet', 'assets/spritesheets/basesheet.png',
                                     'assets/spritesheets/basesheet.json' );
      this.game.load.spritesheet('buttonsheet', 'assets/spritesheets/buttonsheet.png', 304, 49);
      this.game.load.spritesheet('flamesheet', 'assets/spritesheets/flames.png', 16, 24);
      this.game.load.image('logo','assets/textures/logo.png');
      
      this.game.load.audio('hover_snd', 'assets/sounds/btn_hover.wav');
      this.game.load.audio('press_snd', 'assets/sounds/btn_press.wav');
      this.game.load.audio('chain_1_snd', 'assets/sounds/chain_1.wav');
      this.game.load.audio('chain_2_snd', 'assets/sounds/chain_2.wav');
      this.game.load.audio('flame_snd', 'assets/sounds/flame.wav');
      this.game.load.audio('scream_1_snd', 'assets/sounds/scream_1.wav');
      this.game.load.audio('scream_2_snd', 'assets/sounds/scream_2.wav');
      this.game.load.audio('scream_3_snd', 'assets/sounds/scream_3.wav');
      
      this.game.load.audio('maintheme', 'assets/music/artofescapism__infiltration_of_toy_dungeon.mp3');
      
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
