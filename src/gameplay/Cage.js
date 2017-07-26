function Cage(game){
	Phaser.Group.call(this, game);
  
  var cage = game.add.sprite(0, 0, "basesheet", "game/cage");
  var prisoner = game.add.sprite(0, 0, "basesheet", "game/prisoner/000");
  
  // animate prisoner
  var walk_frames = Phaser.Animation.generateFrameNames('game/prisoner/', 0, 3, '', 3 );
  prisoner.animations.add("walk", walk_frames, 4, true);
  prisoner.animations.play("walk");
  
  // randomize starting animation frame
  var random_frame = Math.floor(Math.random() * walk_frames.length);
  prisoner.animations.currentAnim.setFrame(random_frame, true);
  
  this.add(prisoner);
  this.add(cage);
};

Cage.prototype = Object.create(Phaser.Group.prototype);
Cage.prototype.constructor = Cage;