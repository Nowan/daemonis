function Button( game, actionCallback, callback_context ){
  Phaser.Button.call(this, game, 0, 0, "buttonsheet", actionCallback, callback_context, 1, 0 );
  game.add.existing(this);
}

Button.prototype = Object.create(Phaser.Button.prototype);
Button.prototype.constructor = Button;