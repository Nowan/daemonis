function Cage(game) {
  Phaser.Group.call(this, game);
  
  this.crate = game.add.sprite(0, 0, "basesheet", "game/cage");
  this.prisoner = game.add.sprite(0, 0, "basesheet", "game/prisoner/000");
  
  var animFrames = Phaser.Animation.generateFrameNames('game/prisoner/', 0, 3, '', 3);
  this.prisoner.animations.add("walk", animFrames, 4, true);
  this.prisoner.animations.play("walk");
  this.prisoner.animations.currentAnim.setFrame(game.rnd.integerInRange(0, animFrames.length - 1), true);
  
  this.add(this.prisoner);
  this.add(this.crate);
};

Cage.prototype = Object.create(Phaser.Group.prototype);

Cage.prototype.burn = function (game) {
  // apply "flash" effect on crate
  var flashOverlay = new ColorImage(game, this.crate, "#ff0c00");
  this.add(flashOverlay);
  flashOverlay.alpha = 0;
  game.add.tween(flashOverlay).to({ alpha: 0.4 }, 1000, "Linear", true);
  
  // add flames in waves
  var waveN = 4;
  var waveDelay = gameConfig.rowBurnTime / waveN;
  var offsetX = (gameConfig.tileSize - this.width) * 0.5;
  var offsetY = (gameConfig.tileSize - this.height) * 0.5;

  function createFlame() {
    var flame = game.add.sprite(0, 0, 'flamesheet');
    flame.x = game.rnd.integerInRange(offsetX - flame.width * 0.1, gameConfig.tileSize - offsetX - flame.width * 0.9);
    flame.y = game.rnd.integerInRange(offsetY - flame.height * 0.1, gameConfig.tileSize - offsetY - flame.height * 0.9);
    flame.animations.add('burn');
    flame.animations.play('burn', 20, true);
    flame.animations.currentAnim.setFrame(game.rnd.integerInRange(0, 11), true);
    return flame;
  }
  
  function makeWave() {
    var flameN = game.rnd.integerInRange(2, 4);
    for (var i = 0; i < flameN; i++) {
      var flame = createFlame();
      this.add(flame);
    }
  }
  
  makeWave.call(this);
  game.time.events.repeat(waveDelay, waveN - 1, makeWave, this);
};