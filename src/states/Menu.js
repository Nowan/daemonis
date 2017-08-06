var menuState = (function() {

  var music;

  var onPlayPressed = function(){};
  var onCreditsPressed = function(){};

  state = {
    create: function () {
      var logo = this.game.add.sprite(this.game.width * 0.5, 100, "logo");
      logo.scale.set(1.3);
      logo.anchor.x = 0.5;
      
      var play_btn = new Button(this.game, "Play", onPlayPressed, this);
      play_btn.x = (this.game.width - play_btn.width) * 0.5;
      play_btn.y = this.game.height * 0.5 + 150;
      
      var credits_btn = new Button(this.game, "Credits", onCreditsPressed, this);
      credits_btn.x = play_btn.x;
      credits_btn.y = play_btn.y + play_btn.height + 60;
      
      if(!music){
        music = this.game.add.audio('maintheme', 0.4);
        music.loop = true;
        music.play();
      }
      
    }
  };
  
  onPlayPressed = function(){
    this.game.state.start('Game');
  }
  
  onCreditsPressed = function(){
    this.game.state.start('Credits');
  }
  
  return state;
}());
