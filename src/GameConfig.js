var GameConfig = {
  
  canvas_width: 1500,
  canvas_height: 1000,
  
  grid: {
    width: 10,
    height: 20
  },
  
  tile_size: 50, // recalculated on Boot state
  
  regular_drop_time: 1000, // time that tetromino stays on a single grid row
  accelerated_drop_time: 150, // time that tetromino stays on a single grid row with "down" key pressed
  
  move_delay: 200, // delay for tetromino column change
  rotation_delay: 200
  
}