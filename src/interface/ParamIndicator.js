/*

  Text indicator for displaying score and speed values.

*/

function ParamIndicator(game, width, labelKey, value, postfix) {
  Phaser.Group.call(this, game);
  
  var label = game.add.sprite(0, 0, "basesheet", labelKey);
  label.anchor.y = 0.5;
  label.y = label.height * 0.5;
  
  var indicatorStyle = {font: "72px endorregular", fill: "#69231f",
                          boundsAlignV: "middle", align: "left" };
  
  this.indicator = game.add.text(width * 0.3, label.y - 6, value, indicatorStyle);
  this.indicator.anchor.y = 0.5;
  
  if (postfix) {
    indicatorStyle.fontSize = 45;
    this.indicatorPostfix = game.add.text(this.indicator.x + this.indicator.width,
                                          this.indicator.y + 8, postfix, indicatorStyle);
    this.indicatorPostfix.anchor.y = 0.5;
    this.add(this.indicatorPostfix);
  }
  
  this.add(label);
  this.add(this.indicator);
};

ParamIndicator.prototype = Object.create(Phaser.Group.prototype);

ParamIndicator.prototype.setValue = function (value) {
  this.indicator.text = value;
  if (this.indicatorPostfix) { this.indicatorPostfix.x = this.indicator.x + this.indicator.width; }
};

ParamIndicator.prototype.getValue = function () { return this.indicator.text; }