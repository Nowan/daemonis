var gameConfig = {
  
  // canvas parameters
  canvas_width: 1500,
  canvas_height: 1000,
  
  // grid parameters
  gridWidth: 10,
  gridHeight: 20,
  tileSize: 50, // recalculated on Boot state
  
  // gameplay parameters
  regular_drop_time: 1000, // time that tetromino stays on a single grid row
  accelerated_drop_time: 50, // time that tetromino stays on a single grid row with "down" key pressed
  move_delay: 200, // delay for tetromino column change
  rotation_delay: 200,
  row_burning_time: 1600,
  
  // scoring parameters
  drop_value: 2, // how many points each crate in a single tetromino adds to the score when it finishes dropping
  fill_value: 3, // how many points each crate in grid line adds to the score when entire line is filled
  line_bonus: 2.0 // bonus for filling two or more lines in with one tetromino
                   // (each line multiplies summary value by this parameter)
  
}