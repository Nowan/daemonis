var creditsState = (function () {

  return {
    create: function () {
      this.titleGroup = this.game.add.group();
    
      var labelStyle = { font: "32px endorregular", fill: "#86322e",
                         boundsAlignV: "middle", align: "center" };
      
      // Title labels
      var titleLbl = this.game.add.text(this.game.width * 0.5, 0, "Developed by", labelStyle);
      titleLbl.anchor.x = 0.5;
      
      labelStyle.font = "72px endorregular";
      var nameLbl = this.game.add.text(this.game.width * 0.5, titleLbl.height + 20,
                                       "Mykyta Dniprovskyi", labelStyle);
      nameLbl.anchor.x = 0.5;
      
      // Resource labels
      labelStyle.font = "32px endorregular";
      var resTitleLbl = this.game.add.text(this.game.width * 0.5, nameLbl.y + nameLbl.height + 50,
                                           "Resources", labelStyle);
      resTitleLbl.anchor.x = 0.5;
      
      var resTxt = "https://opengameart.org/content/info-box\n";
      resTxt += "https://opengameart.org/content/lpc-flames\n\n";
      resTxt += "http://www.1001fonts.com/endor-font.html\n\n";
      resTxt += "http://freemusicarchive.org/music/Artofescapism/Sound_Forest_Atmospheric_Tracks/Infiltration_of_Toy_Dungeon\n\n";
      resTxt += "https://freesound.org/people/vmgraw/sounds/257691/\n";
      resTxt += "https://freesound.org/people/pablocandel/sounds/219880/\n";
      resTxt += "https://freesound.org/people/JohnsonBrandEditing/sounds/243380/\n";
      resTxt += "https://freesound.org/people/jovanovich/sounds/394754/\n";
      resTxt += "https://freesound.org/people/scarbelly25/sounds/33943/\n";
      resTxt += "https://freesound.org/people/gelo_papas/sounds/65481/\n";
      resTxt += "https://wav-library.net/sounds/mechanisms/podemnyj_most_shum_cepi_medlennoe_vrashhenie_mekhanizma_zvuk_mp3_skachat/59-1-0-8153\n";
      
      labelStyle.font = "18px Arial";
      var resLbl = this.game.add.text(this.game.width * 0.5, resTitleLbl.y + resTitleLbl.height + 20,
                                      resTxt, labelStyle);
      resLbl.anchor.x = 0.5;
      
      // Include labels into single group
      this.titleGroup.add(titleLbl);
      this.titleGroup.add(nameLbl);
      this.titleGroup.add(resTitleLbl);
      this.titleGroup.add(resLbl);
      
      // Activate mouse capture events
      this.game.input.mouse.capture = true;
      
      this.titleGroup.y = this.game.height;
    },
    
    update: function () {
      if (this.titleGroup.y > -this.titleGroup.height) {
        this.titleGroup.y -= 2;
        
        if (this.game.input.activePointer.leftButton.isDown) {
          this.game.state.start("Menu");
        }
      } else {
        this.game.state.start("Menu");
      }
    }
  };
}());
