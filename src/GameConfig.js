var gameConfig = {
  
  // canvas parameters
  canvasWidth: 1500,
  canvasHeight: 1000,
  
  // grid parameters
  gridWidth: 10,
  gridHeight: 20,
  tileSize: 50, // recalculated on Boot state
  
  // gameplay parameters
  regDropTime: 1000, // time that tetromino stays on a single grid row
  aclDropTime: 50, // time that tetromino stays on a single grid row with "down" key pressed
  moveDelay: 200, // delay for tetromino column change
  rotDelay: 200,
  rowBurnTime: 1600,
  
  // scoring parameters
  dropValue: 2, // how many points each crate in a single tetromino adds to the score when it finishes dropping
  fillValue: 3, // how many points each crate in grid line adds to the score when entire line is filled
  bonusMultiplier: 2.0 // multiplier bonus for filling two or more lines in with a single tetromino
  
}