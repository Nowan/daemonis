/*

  Extension of an object from 'data/tetrominoes.json'. 

  
  Additional properties:
  
  width, height - boundary size of tetrodata shape
  
  blocksNumber - number of full blocks in tetrodata shape
  
  
  Additional methods:
  
  rotate(direction) - applies rotation to shape matrix; direction: 1 - clockwise, -1 - counter-clockwise
  
  equals(tetrodata) - compares tetrodata references, periods and shapes to tell whether they are the same
  
*/

function Tetrodata(template) {
  var tetrodata = JSON.parse(JSON.stringify(template));
  
  tetrodata.period = 0; // period of shape matrix rotation
  
  Object.defineProperty(tetrodata, 'width', { enumerable: true, get: function () {
    return this.shape[0].length;
  }});
  
  Object.defineProperty(tetrodata, 'height', { enumerable: true, get: function () {
    return this.shape.length;
  }});
  
  Object.defineProperty(tetrodata, 'blocksNumber', { enumerable: true, get: function () {
    var blocksN = 0;
    for (var r = 0; r < this.height; r++) {
      for (var c = 0; c < this.width; c++) {
        if (this.shape[r][c] === 1) blocksN++;
      }
    }
    return blocksN;
  }});
  
  tetrodata.equals = function (other) {
    if (tetrodata === other) { return true; }
    
    if (tetrodata.period !== other.period) { return false; }
    
    if(tetrodata.width !== other.width || tetrodata.height !== other.height) { return false; }
    
    for (var r = 0; r < tetrodata.height; r++) {
      for (var c = 0; c < tetrodata.width; c++) {
        if(tetrodata.shape[r][c] != other.shape[r][c]) { return false; }
      }
    }
    
    return true;
  };
  
  tetrodata.rotate = function (direction) {
    const n = Math.max(tetrodata.width, tetrodata.height);
    
    // copy original shape into square matrix
    const origMatrix = [];
    for( var r = 0; r < n; r++ ){
      origMatrix[r] = [];
      for( var c = 0; c < n; c++ )
        origMatrix[r][c] = (r < tetrodata.height && c < tetrodata.width) ? tetrodata.shape[r][c] : 0;
    }
    
    // rotate shape into rotMatrix
    var rotMatrix = [];
    for( var r = 0; r < n; r++ ){
      rotMatrix[r] = [];
      for( var c = 0; c < n; c++ )
        rotMatrix[r][c] = direction > 0 ? origMatrix[n - c - 1][r] : origMatrix[c][n - r - 1];
    }
    
    // get rid of empty rows / columns
    for (var r = n - 1; r >= 0; r--) {
      var isRowEmpty = true;
      for (var c = 0; c < n; c++) {
        if (rotMatrix[r][c] == 1) { isRowEmpty = false; break; }
      }
      if (isRowEmpty) { rotMatrix.splice(r, 1); }
    }
    
    for (var c = n - 1; c >= 0; c--) {
      var isColEmpty = true;
      for (var r = 0; r < rotMatrix.length; r++){
        if (rotMatrix[r][c] == 1) { isColEmpty = false; break; }
      }
      if (isColEmpty) { for( var r = 0; r < rotMatrix.length; r++ ) rotMatrix[r].splice(c, 1); }
    }
    
    // apply changes to original tetrodata
    tetrodata.period += Math.sign(direction);
    tetrodata.shape = rotMatrix;
  }
  
  return tetrodata;
};