function Button( game, label_text, actionCallback, callback_context ){
  Phaser.Group.call(this, game);
  
  const button = game.add.button(0, 0, "buttonsheet", actionCallback, callback_context, 1, 0);
  
  const label_style = { font: "20px endorregular", 
                        fill: "#86322e", 
                        boundsAlignV: "middle",
                        align: "center" };
  const label = game.add.text(button.width * 0.5, button.height * 0.5 + 2, label_text, label_style);
  label.anchor.set(0.5);
  
  const hover_sound = game.add.audio('hover_snd', 0.3);
  const press_sound = game.add.audio('press_snd');
  button.setSounds(hover_sound, null, press_sound);
  
  this.add(button);
  this.add(label);
}

Button.prototype = Object.create(Phaser.Group.prototype);
Button.prototype.constructor = Button;