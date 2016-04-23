var board = []; //用二维数组储存每个格子当前的数值
var score = 0; //玩家分数
var onceAgain = $(".newGame");

$(function() {
    newGame();
    onceAgain.click(function () {
      newGame();
    });
});

function newGame() {
    //初始化元素
    init();

    //test
    // board[0][0] = 2;
    // board[0][1] = 4;
    // board[0][2] = 8;
    // board[0][3] = 16;
    // board[1][0] = 32;
    // board[1][1] = 64;
    // board[1][2] = 128;
    // board[1][3] = 256;
    // board[2][0] = 512;
    // board[2][1] = 1024;
    // board[2][2] = 2048;

    //随机生成两个数字
    createOneNumber();
    createOneNumber();

}

function init() {
    //初始化board数组
    for (var i = 0; i < 4; i++) {
      board[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    updateBoardView();
}
//根据数组将数字布局到栅格中
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridcell = $("<div></div>");
            gridcell.addClass("number-cell grid-cell-common");
            gridcell.addClass("grid-cell-" + (i + 1) + "-" + (j + 1));
            $(".grid-above").append(gridcell);
            if (board[i][j] === 0) {
                gridcell.css("width", 0);
                gridcell.css("height", 0);
                gridcell.css("position", "absolute");
                gridcell.css("top", getPosTop(i)+50);
                gridcell.css("left", getPosLeft(j)+50);
            } else {
                gridcell.css("position", "absolute");
                gridcell.css("top", getPosTop(i));
                gridcell.css("left", getPosLeft(j));
                gridcell.css("backgroundColor", getGridCellColor(board[i][j]));
                gridcell.css("color",getNumberColor(board[i][j]));
                gridcell.css("font-size",getNumberSize(board[i][j]));
                gridcell.text(board[i][j]);
            }
        }
    }
}
//随机生成一个数字
function createOneNumber() {
  if (hasSpace()) {
    //随机生成位置
    var randomX = parseInt(Math.floor(Math.random()*4));
    var randomY = parseInt(Math.floor(Math.random()*4));
    while (true) {
      if (board[randomX][randomY] === 0) {
        break;
      }
      randomX = parseInt(Math.floor(Math.random()*4));
      randomY = parseInt(Math.floor(Math.random()*4));
    }
    //随机生成数字
    var randomNumFlag = Math.random();
    randomNum = randomNumFlag < 0.5 ? 2 : 4;
    if (randomNumFlag < 0.05) {
      randomNum = 8;
    }
    if (randomNumFlag < 0.01) {
      randomNum = 16;
    }
    if (randomNumFlag < 0.0001) {
      randomNum = 1024;
    }
    //在随机位置上显示随机数
    board[randomX][randomY] = randomNum;
    showNewNumber(randomX,randomY,randomNum);
  }else{
    return false;
  }
}

$(document).keydown(function (event) {
  event.preventDefault();
  switch (event.keyCode) {
    case 38://up
      if (moveUp()) {
        setTimeout("createOneNumber()",200);
        isGameOver();
      }
      break;
    case 39://right
      if (moveRight()) {
        setTimeout("createOneNumber()",200);
        isGameOver();
      }
      break;
    case 40://down
      if (moveDown()) {
        setTimeout("createOneNumber()",200);
        isGameOver();
      }
      break;
    case 37://left
      if (moveLeft()) {
        setTimeout("createOneNumber()",200);
        isGameOver();
      }
      break;
    default:
      break;
  }
});

function isGameOver() {

}

function moveUp() {
  if (!canMoveUp(board)) {
    return false;
  }else{
    for (var i = 1; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] != 0) {
          for (var k = 0; k < i; k++) {
            if (board[k][j] === board[i][j] && noBlockV(j,k,i,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              //add
              board[k][j] += board[i][j];
              board[i][j] = 0;
              break;
            }
            if (board[k][j] === 0 && noBlockV(j,k,i,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              board[k][j] = board[i][j];
              board[i][j] = 0;
              break;
            }
          }
        }
      }
    }
    setTimeout("updateBoardView()",200);
    return true;
  }
}

function moveRight() {
  if (!canMoveRight(board)) {
    return false;
  }else{
    for (var i = 0; i < 4; i++) {
      for (var j = 3; j >= 0; j--) {
        if (board[i][j] != 0) {
          for (var k = 3; k > j; k--) {
            if (board[i][k] === board[i][j] && noBlockH(i,j,k,board)) {
              //move
              showMoveAnimation(i,j,i,k);
              //add
              board[i][k] += board[i][j];
              board[i][j] = 0;
              break;
            }
            if (board[i][k] === 0 && noBlockH(i,j,k,board)) {
              //move
              showMoveAnimation(i,j,i,k);
              board[i][k] = board[i][j];
              board[i][j] = 0;
              break;
            }
          }
        }
      }
    }
    setTimeout("updateBoardView()",200);
    return true;
  }
}

function moveDown() {
  if (!canMoveDown(board)) {
    return false;
  }else{
    for (var i = 3; i >= 0; i--) {
      for (var j = 0; j < 4; j++) {
        if (board[i][j] != 0) {
          for (var k = 3; k > i; k--) {
            if (board[k][j] === board[i][j] && noBlockV(j,i,k,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              //add
              board[k][j] += board[i][j];
              board[i][j] = 0;
              continue;
            }
            if (board[k][j] === 0 && noBlockV(j,i,k,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              board[k][j] = board[i][j];
              board[i][j] = 0;
              continue;
            }
          }
        }
      }
    }
    setTimeout("updateBoardView()",200);
    return true;
  }
}

function moveLeft() {
  if (!canMoveLeft(board)) {
    return false;
  }else{
    for (var i = 0; i < 4; i++) {
      for (var j = 1; j < 4; j++) {
        if (board[i][j] != 0) {
          for (var k = 0; k < j; k++) {
            if (board[i][k] === board[i][j] && noBlockH(i,k,j,board)) {
              //move
              showMoveAnimation(i,j,i,k);
              //add
              board[i][k] += board[i][j];
              board[i][j] = 0;
              continue;
            }
            if (board[i][k] === 0 && noBlockH(i,k,j,board)) {
              //move
              showMoveAnimation(i,j,i,k);
              board[i][k] = board[i][j];
              board[i][j] = 0;
              continue;
            }
          }
        }
      }
    }
    setTimeout("updateBoardView()",200);
    return true;
  }
}
