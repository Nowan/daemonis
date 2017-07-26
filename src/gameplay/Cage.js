function Cage(game){
	Phaser.Group.call(this, game);
  
  var cage = game.add.sprite(0, 0, "basesheet", "game/cage");
  
  var prisoner = game.add.sprite(0, 0, "basesheet", "game/prisoner/000");
  var walk_frames = Phaser.Animation.generateFrameNames('game/prisoner/', 0, 3, '', 3 );
  prisoner.animations.add("walk", walk_frames, 2, true);
  prisoner.animations.play("walk");
  
  this.add(prisoner);
  this.add(cage);
};

Cage.prototype = Object.create(Phaser.Group.prototype);
Cage.prototype.constructor = Cage;