/*

  Container for game world, displayed in the center of page. 

*/

function GameContainer( game ){
  Phaser.Group.call(this, game);
  
  const container_width = GameConfig.grid.width * GameConfig.tile_size;
  const container_height = GameConfig.grid.height * GameConfig.tile_size;
  
  function initBorders() {
    const border_width = 20;
    const light_height = 520;
    const light_y = (container_height - light_height) * 0.5;
    
    var g_borders = game.add.group();
    
    var left_border = game.add.tileSprite( -border_width, 0, border_width, container_height, 
                                           "basesheet", "interface/border_segment");
    var left_light = game.add.tileSprite( -3, light_y, 20, light_height, 
                                          "basesheet", "interface/border_light");
    
    var right_border = game.add.tileSprite( container_width + border_width, 0, border_width, container_height, 
                                           "basesheet", "interface/border_segment");
    right_border.scale.x *= -1;
    
    var right_light = game.add.tileSprite( container_width + 3, light_y, 20, light_height, 
                                           "basesheet", "interface/border_light");
    right_light.scale.x *= -1;
    
    g_borders.add(left_light);
    g_borders.add(left_border);
    
    g_borders.add(right_light);
    g_borders.add(right_border);
    
    return g_borders;
  }
 
  function initBackground() {
    return game.add.tileSprite( 0, 0, container_width, container_height, 
                                "basesheet", "interface/game_bg");
  }
  
  var background = initBackground();
  this.clipped_area = new ClippedArea(game, container_width, container_height);
  var borders = initBorders();
  
  this.add(background);
  this.add(this.clipped_area);
  this.add(borders);
}

GameContainer.prototype = Object.create(Phaser.Group.prototype);
GameContainer.prototype.constructor = GameContainer;

GameContainer.prototype.setContent = function(group_object) {
  this.clipped_area.add(group_object);
}