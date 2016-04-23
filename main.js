var board = []; //用二维数组储存每个格子当前的数值
var score = 0; //玩家分数
var best = 0; //玩家最高等分
var hasConflicted = []; //用二维数组储存每个格子每一轮中的合并状态，合并过为true，没有为false;

function newGame() {
    //初始化元素
    init();

    //随机生成两个数字
    createOneNumber();
    createOneNumber();

}

function init() {
    //初始化board数组和hasConflicted数组
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicted[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    // //test
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

    updateBoardView();
    score = 0;
    $("#score").text(score);
    $(".mes").css("display", "none");
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
                gridcell.css("top", getPosTop(i) + 50);
                gridcell.css("left", getPosLeft(j) + 50);
            } else {
                gridcell.css("position", "absolute");
                gridcell.css("top", getPosTop(i));
                gridcell.css("left", getPosLeft(j));
                gridcell.css("backgroundColor", getGridCellColor(board[i][j]));
                gridcell.css("color", getNumberColor(board[i][j]));
                gridcell.css("font-size", getNumberSize(board[i][j]));
                gridcell.text(board[i][j]);
            }
            hasConflicted[i][j] = false; //每一次更新数据之后更新合并状态
        }
    }
}
//随机生成一个数字
function createOneNumber() {
    if (hasSpace()) {
        //随机生成位置
        var tempObj = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    tempObj.push(i + "," + j);
                }
            }
        }
        var randNum = parseInt(Math.floor(Math.random() * tempObj.length));
        var randomX = parseInt(tempObj[randNum].split(",")[0]);
        var randomY = parseInt(tempObj[randNum].split(",")[1]);
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
        showNewNumber(randomX, randomY, randomNum);
    } else {
        return false;
    }
}

function moveUp(board) {
    if (!canMoveUp(board)) {
        return false;
    } else {
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < i; k++) {
                        if (board[k][j] === board[i][j] && noBlockV(j, k, i, board) && !hasConflicted[k][j]) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] += board[i][j];
                            score += board[k][j] * 1;
                            updateScore(score, best);;
                            board[i][j] = 0;
                            hasConflicted[k][j] = true;
                            break;
                        }
                        if (board[k][j] === 0 && noBlockV(j, k, i, board)) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    }
}

function moveRight(board) {
    if (!canMoveRight(board)) {
        return false;
    } else {
        for (var i = 0; i < 4; i++) {
            for (var j = 2; j >= 0; j--) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > j; k--) {
                        if (board[i][k] === board[i][j] && noBlockH(i, j, k, board) && !hasConflicted[i][k]) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] += board[i][j];
                            score += board[i][k] * 1;
                            updateScore(score, best);;
                            board[i][j] = 0;
                            hasConflicted[i][k] = true;
                            break;
                        }
                        if (board[i][k] === 0 && noBlockH(i, j, k, board)) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    }
}

function moveDown(board) {
    if (!canMoveDown(board)) {
        return false;
    } else {
        for (var i = 2; i >= 0; i--) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > i; k--) {
                        if (board[k][j] === board[i][j] && noBlockV(j, i, k, board) && !hasConflicted[k][j]) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            //add
                            board[k][j] += board[i][j];
                            score += board[k][j] * 1;
                            updateScore(score, best);;
                            board[i][j] = 0;
                            hasConflicted[k][j] = true;
                            continue;
                        }
                        if (board[k][j] === 0 && noBlockV(j, i, k, board)) {
                            //move
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    }
}

function moveLeft(board) {
    if (!canMoveLeft(board)) {
        return false;
    } else {
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < j; k++) {
                        if (board[i][k] === board[i][j] && noBlockH(i, k, j, board) && !hasConflicted[i][k]) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] += board[i][j];
                            score += board[i][k] * 1;
                            updateScore(score, best);;
                            board[i][j] = 0;
                            hasConflicted[i][k] = true;
                            continue;
                        }
                        if (board[i][k] === 0 && noBlockH(i, k, j, board)) {
                            //move
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    }
}

$(document).keydown(function(event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 38: //up
            if (moveUp(board)) {
                //等待移动动画完成之后再创建新元素
                setTimeout("createOneNumber()", 200);
                //等待新元素创建完毕之后再判断
                setTimeout("isGameOver()", 250);
            }
            break;
        case 39: //right
            if (moveRight(board)) {
                setTimeout("createOneNumber()", 200);
                setTimeout("isGameOver()", 250);
            }
            break;
        case 40: //down
            if (moveDown(board)) {
                setTimeout("createOneNumber()", 200);
                setTimeout("isGameOver()", 250);
            }
            break;
        case 37: //left
            if (moveLeft(board)) {
                setTimeout("createOneNumber()", 200);
                setTimeout("isGameOver()", 250);
            }
            break;
        default:
            break;
    }
});

$(function() {
    newGame();
    $(".newGame").click(function() {
        newGame();
    });
    $("#tryAgain").click(function() {
        newGame();
    });

    touch.on('.grid-container', 'touchstart', function(ev) {
        ev.preventDefault();
    });
    touch.on('.grid-container', 'swipeup', function(ev) {
      if (moveUp(board)) {
          //等待移动动画完成之后再创建新元素
          setTimeout("createOneNumber()", 200);
          //等待新元素创建完毕之后再判断
          setTimeout("isGameOver()", 250);
      }
    });
    touch.on('.grid-container', 'swiperight', function(ev) {
      if (moveRight(board)) {
          //等待移动动画完成之后再创建新元素
          setTimeout("createOneNumber()", 200);
          //等待新元素创建完毕之后再判断
          setTimeout("isGameOver()", 250);
      }
    });
    touch.on('.grid-container', 'swipeleft', function(ev) {
      if (moveLeft(board)) {
          //等待移动动画完成之后再创建新元素
          setTimeout("createOneNumber()", 200);
          //等待新元素创建完毕之后再判断
          setTimeout("isGameOver()", 250);
      }
    });
    touch.on('.grid-container', 'swipedown', function(ev) {
      if (moveDown(board)) {
          //等待移动动画完成之后再创建新元素
          setTimeout("createOneNumber()", 200);
          //等待新元素创建完毕之后再判断
          setTimeout("isGameOver()", 250);
      }
    });
});

function isGameOver() {
    // console.log("hasSpace："+hasSpace());
    // console.log("canNotMove："+isCanNotMove(board));
    if ((!hasSpace()) && isCanNotMove(board)) {
        GAMEOVER();
    }
}

function GAMEOVER() {
    $(".mes").css("display", "flex");
}
