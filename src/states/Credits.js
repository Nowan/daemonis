var creditsState = (function () {

  return {
    create: function () {
      this.title_group = this.game.add.group();
    
      var label_style = { font: "32px endorregular", 
                        fill: "#86322e", 
                        boundsAlignV: "middle",
                        align: "center" };
      
      var title_lbl = this.game.add.text( this.game.width * 0.5, 0, "Developed by", label_style );
      title_lbl.anchor.x = 0.5;
      
      label_style.font = "72px endorregular";
      var name_lbl = this.game.add.text( this.game.width * 0.5, title_lbl.height + 20, 
                                         "Mykyta Dniprovskyi", label_style );
      name_lbl.anchor.x = 0.5;
      
      label_style.font = "32px endorregular";
      var res_title_lbl = this.game.add.text( this.game.width * 0.5, name_lbl.y + name_lbl.height + 50, 
                                              "Resources", label_style );
      res_title_lbl.anchor.x = 0.5;
      
      var res_txt = "https://opengameart.org/content/info-box\n";
      res_txt += "https://opengameart.org/content/lpc-flames\n\n";
      res_txt += "http://www.1001fonts.com/endor-font.html\n\n";
      res_txt += "http://freemusicarchive.org/music/Artofescapism/Sound_Forest_Atmospheric_Tracks/Infiltration_of_Toy_Dungeon\n\n";
      res_txt += "https://freesound.org/people/vmgraw/sounds/257691/\n";
      res_txt += "https://freesound.org/people/pablocandel/sounds/219880/\n";
      res_txt += "https://freesound.org/people/JohnsonBrandEditing/sounds/243380/\n";
      res_txt += "https://freesound.org/people/jovanovich/sounds/394754/\n";
      res_txt += "https://freesound.org/people/scarbelly25/sounds/33943/\n";
      res_txt += "https://freesound.org/people/gelo_papas/sounds/65481/\n";
      res_txt += "https://wav-library.net/sounds/mechanisms/podemnyj_most_shum_cepi_medlennoe_vrashhenie_mekhanizma_zvuk_mp3_skachat/59-1-0-8153\n";
      
      label_style.font = "18px Arial";
      var res_lbl = this.game.add.text( this.game.width * 0.5, res_title_lbl.y + res_title_lbl.height + 20, 
                                        res_txt, label_style );
      res_lbl.anchor.x = 0.5;
      
      this.title_group.add(title_lbl);
      this.title_group.add(name_lbl);
      this.title_group.add(res_title_lbl);
      this.title_group.add(res_lbl);
      
      this.title_group.y = this.game.height;
      
      this.game.input.mouse.capture = true;
    },
    
    update: function () {
      if(this.title_group.y > -this.title_group.height){
        this.title_group.y -= 2;
        
        if(this.game.input.activePointer.leftButton.isDown)
          this.game.state.start("Menu");
      }
      else
        this.game.state.start("Menu");
    }
  };
}());
