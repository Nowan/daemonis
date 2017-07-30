function Tetrodata(template){
  var tetrodata = JSON.parse(JSON.stringify(template)); // deep clone of template from "data/tetrominoes.json"
  
  tetrodata.rotation = 0; // additional value describing shape matrix rotation
  
  tetrodata.getWidth = function(){
    return tetrodata.shape[0].length;
  }
  
  tetrodata.getHeight = function(){
    return tetrodata.shape.length;
  }
  
  tetrodata.equals = function(other){
    // compare rotation
    if(tetrodata.rotation != other.rotation) return false;
    
    // compare boundaries
    if(tetrodata.getWidth() != other.getWidth() || tetrodata.getHeight() != other.getHeight) return false;
    
    // compare shapes
    for( var r = 0; r < tetrodata.getHeight(); r++ )
      for( var c = 0; c < tetrodata.getWidth(); c++ )
        if(tetrodata.shape[r][c] != other.shape[r][c])
          return false;
    
    return true;
  }
  
  tetrodata.rotate = function(direction){
    const n = Math.max(tetrodata.getWidth(), tetrodata.getHeight());
    
    // init square matrix with original shape data and zeros on overflowing positions
    const orig_matrix = [];
    for( var r = 0; r < n; r++ ){
      orig_matrix[r] = [];
      for( var c = 0; c < n; c++ )
        orig_matrix[r][c] = (r < tetrodata.getHeight() && c < tetrodata.getWidth()) ? tetrodata.shape[r][c] : 0;
    }
    
    // init square matrix with rotated shape data
    var rot_matrix = [];
    for( var r = 0; r < n; r++ ){
      rot_matrix[r] = [];
      for( var c = 0; c < n; c++ )
        rot_matrix[r][c] = direction > 0 ? orig_matrix[n - c - 1][r] : orig_matrix[c][n - r - 1];
    }
    
    // clean rotated matrix from empty rows and columns
    for( var r = n - 1; r >= 0; r-- ){
      var is_row_empty = true;
      for( var c = 0; c < n; c++ )
        if( rot_matrix[r][c] == 1 ){ is_row_empty = false; break; }
      if(is_row_empty) rot_matrix.splice(r, 1);
    }
    
    for( var c = n - 1; c >= 0; c-- ){
      var is_col_empty = true;
      for( var r = 0; r < rot_matrix.length; r++ )
        if( rot_matrix[r][c] == 1 ){ is_col_empty = false; break; }
      if(is_col_empty) for( var r = 0; r < rot_matrix.length; r++ ) rot_matrix[r].splice(c, 1);
    }
    
    tetrodata.rotation += Math.sign(direction);
    tetrodata.shape = rot_matrix;
  }
  
  return tetrodata;
};