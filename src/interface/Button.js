function Button(game, labelText, actionCallback, callbackContext) {
  Phaser.Group.call(this, game);
  
  var button = game.add.button(0, 0, "buttonsheet", actionCallback, callbackContext, 1, 0);
  
  var labelStyle = {font: "20px endorregular", fill: "#86322e",
                    boundsAlignV: "middle", align: "center" };
  
  var label = game.add.text(button.width * 0.5, button.height * 0.5 + 2, labelText, labelStyle);
  label.anchor.set(0.5);
  
  var hoverSound = game.add.audio('hover_snd', 0.3);
  var pressSound = game.add.audio('press_snd');
  button.setSounds(hoverSound, null, pressSound);
  
  this.add(button);
  this.add(label);
}

Button.prototype = Object.create(Phaser.Group.prototype);