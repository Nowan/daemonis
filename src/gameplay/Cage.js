function Cage(game){
	Phaser.Group.call(this, game);
  
  this.crate = game.add.sprite(0, 0, "basesheet", "game/cage");
  this.prisoner = game.add.sprite(0, 0, "basesheet", "game/prisoner/000");
  
  // animate prisoner
  var walk_frames = Phaser.Animation.generateFrameNames('game/prisoner/', 0, 3, '', 3 );
  this.prisoner.animations.add("walk", walk_frames, 4, true);
  this.prisoner.animations.play("walk");
  
  // randomize starting animation frame
  const random_frame = Math.floor(Math.random() * walk_frames.length);
  this.prisoner.animations.currentAnim.setFrame(random_frame, true);
  
  this.add(this.prisoner);
  this.add(this.crate);
};

Cage.prototype = Object.create(Phaser.Group.prototype);
Cage.prototype.constructor = Cage;

Cage.prototype.burn = function(game){
  // apply "flash" effect on crate
  var flash_overlay = new ColorImage(game, this.crate, "#ff0c00");
  this.add(flash_overlay);
  flash_overlay.alpha = 0;
    
  game.add.tween(flash_overlay).to( { alpha: 0.4 }, 1000, "Linear", true);
  
  // add flames (in waves)
  const waves_n = 4;
  const wave_delay = gameConfig.row_burning_time / waves_n;
  const offset_x = (gameConfig.tileSize - this.width) * 0.5;
  const offset_y = (gameConfig.tileSize - this.height) * 0.5;

  function createFlame(){
    var flame = game.add.sprite(0, 0, 'flamesheet');
    
    // randomize position inside crate bounds
    flame.x = Math.floor(Math.random() * (gameConfig.tileSize - offset_x * 2 - flame.width)) + offset_x;
    flame.y = Math.floor(Math.random() * (gameConfig.tileSize - offset_y * 2 - flame.height)) + offset_y;
    
    flame.animations.add('burn');
    flame.animations.play('burn', 20, true);
    flame.animations.currentAnim.setFrame(Math.floor(Math.random() * 12), true);
    return flame;
  }
  
  makeWave = function(){
    const flame_number = Math.floor(Math.random() * 2) + 2;
    for( var i = 0; i < flame_number; i++){
      let flame = createFlame();
      this.add(flame);
    }
  }
  
  makeWave.call(this);
  game.time.events.repeat(wave_delay, waves_n - 1, makeWave, this);
}