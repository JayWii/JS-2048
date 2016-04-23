//获取当前设备屏幕宽度
screenWidth = screen.availWidth;
//获取当前元素Position Top值
function getPosTop(row) {
  console.log(screenWidth);
  if (screenWidth <= 520) {
    return 67.5*row + 5;
  }
  return 120*row + 10;
}
//获取当前元素Position Left值
function getPosLeft(col) {
  if (screenWidth <= 520) {
    return 67.5*col + 5;
  }
  return 120*col + 10;
}
//根据数值大小设置cell颜色
function getGridCellColor(num) {
  switch (num) {
    case 2:return "#FFE59B";break;
    case 4:return "#FFCE44";break;
    case 8:return "#44E7C9";break;
    case 16:return "#42E1D5";break;
    case 32:return "#34CBBE";break;
    case 64:return "#24BCEE";break;
    case 128:return "#02B1EB";break;
    case 256:return "#0289B0";break;
    case 512:return "#013B64";break;
    case 1024:return "#01172C";break;
    case 2048:return "#FDFFFC";break;
  }
}
//根据数字大小设置数字颜色
function getNumberColor(num) {
  if (num <= 4) {
    return "#011832";
  }
  if (num === 2048) {
    return "#011832";
  }
}
//根据数字大小设置字体
function getNumberSize(num) {
  if (num%1000) {
    if (screenWidth <= 520) {
      return 22;
    }
    return 40;
  }
  if (num%100) {
    if (screenWidth <= 520) {
      return 28;
    }
    return 50;
  }
}
//判断是否还有剩余空间
function hasSpace() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0;j < 4; j++){
      if (board[i][j] === 0) {
        return true;
      }
    }
  }
  return false;
}
//判断是否能够向上移动
function canMoveUp(board) {
  for (var i = 1; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        if (board[i-1][j] === 0 || board[i-1][j] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
//判断是否能够向右移动
function canMoveRight(board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] != 0) {
        if (board[i][j+1] === 0 || board[i][j+1] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
//判断是否能够向下移动
function canMoveDown(board) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        if (board[i+1][j] === 0 || board[i+1][j] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
//判断是否能够向左移动
function canMoveLeft(board) {
  for (var i = 0; i < 4; i++) {
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {
        if (board[i][j-1] === 0 || board[i][j-1] === board[i][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
//判断垂直移动路径上是否有障碍物
function noBlockV(col,row1,row2,board) {
  for (var i = row1+1; i < row2; i++) {
    if (board[i][col] != 0) {
      return false;
    }
  }
  return true;
}
//判断水平移动路径上是否有障碍物
function noBlockH(row,col1,col2,board) {
  for (var i = col1+1; i < col2; i++) {
    if (board[row][i] != 0) {
      return false;
    }
  }
  return true;
}
//判断是不是已经无法移动了
function isCanNotMove(board) {
  if (canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)) {
    return false;
  }else {
    return true;
  }
}
