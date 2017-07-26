function ParamIndicator(game, width, label_key, value){
	Phaser.Group.call(this, game);
  
  var label = game.add.sprite(0, 0, "basesheet", label_key);
  label.anchor.y = 0.5;
  label.y = label.height * 0.5;
  
  const indicator_style = { font: "72px endorregular", 
                            fill: "#69231f", 
                            boundsAlignV: "middle",
                            align: "left" };
  this.indicator = game.add.text(width * 0.3, label.y - 6, value, indicator_style);
  this.indicator.anchor.y = 0.5;
  
  this.add(label);
  this.add(this.indicator);
};

ParamIndicator.prototype = Object.create(Phaser.Group.prototype);
ParamIndicator.prototype.constructor = ParamIndicator;

ParamIndicator.prototype.setValue = function(value) {
  this.indicator.text = value;
}