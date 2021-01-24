'use strict'

const MINE = ' 💣 '
const EMPTY = ' '
const FLAG = '🏁'
const LIVE = ' 💜 '
const WIN = '🥳'
const LOSE = '😵'
const START = '🤗'
const HINT = '🎁'

var gIsFirstClicked;
var gInterval;
var timer = 0;

var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: true
};

var gLevel = {
    size: 4,
    mines: 2,
    life: 1
};

var gGame;

function initGame() {
    clearInterval(gInterval)
    var elLose = document.querySelector('.start span')
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    setLife(gLevel.size)

    infoGame()

    elLose.innerText = START;
    gIsFirstClicked = true;
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    timerOn()
}


function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var piece = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = piece
        }
    }

    addMines(board)
    console.log(board);
    board = setMinesNegsCount(board)
    console.table(board);
    return board;
}


function setLevel(level) {
    switch (level) {

        case 'beginner':
            gLevel.size = 4;
            gLevel.mines = 2;
            gLevel.life = 1;

            break;

        case 'intermediate':
            gLevel.size = 8;
            gLevel.mines = 12;
            gLevel.life = 2;

            break

        case 'expert':
            gLevel.size = 12;
            gLevel.mines = 30;
            gLevel.life = 3;

            break;

    }
    clearInterval(gInterval);
    initGame();

}



function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gLevel.size; j++) {

            strHTML += `<td  class= "cell" id= cell-${i}-${j} onclick="cellClicked(${i},${j},this)" 
            oncontextmenu="cellMarked(${i},${j},this);return false;">`

            strHTML += '</td>\n';
        }
        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;
    }
}

function countAllNeighbors(board, idxI, idxJ) {
    var count = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue;
            var neighborCell = board[i][j];
            if (neighborCell.isMine) count++;
        }
    }
    return count;
}

function cellClicked(i, j, elCell) {
    infoGame();
    var location = { i, j };
    var curCell = gBoard[i][j];
    if (!gGame.isOn) return;
    if (curCell.isShown) return;

    if (gIsFirstClicked && curCell.isMine) {
        renderCell(location, EMPTY);
        gIsFirstClicked = false;
        restart();
    } else {
        gIsFirstClicked = false;
        curCell.isShown = true;
        gGame.shownCount++;
        if (curCell.isMine) {
            if (!gLevel.life) gameOver();
            else {
                gLevel.life--;
                gGame.shownCount--;
                renderCell(location, MINE)
                curCell.isShown = false;
                // setTimeout(() => {
                //     elCell.innerHTML = EMPTY;
                // }, 1000);
            }



        } else if (curCell.minesAroundCount > 0 && !curCell.isMine) {
            var value = curCell.minesAroundCount;
            //elCell.classList.add('clicked')
            console.log(value, 'value');
            //expandShown(gBoard, i, j)
            renderCell(location, value);
        } else {
            expandShown(gBoard, i, j);
        }
    }
    console.log(' gGame.shownCount', gGame.shownCount);
    isVictory();

}

function infoGame() {
    var elLive = document.querySelector('.live');
    elLive.innerText = LIVE + gLevel.life;
}


function renderCell(location, value) {

    var elCell = document.getElementById(`cell-${location.i}-${location.j}`);
    console.log('value', value);
    elCell.innerHTML = value;
    elCell.classList.add('clicked')
}


function cellMarked(i, j, elCell) {

    var curCell = gBoard[i][j];
    if (curCell.isShown) return;
    if (!curCell.isMarked) {
        elCell.innerHTML = FLAG;
        curCell.isMarked = true;
        gGame.markedCount++;

    } else {
        elCell.innerHTML = EMPTY;
        curCell.isMarked = false;
        gGame.markedCount--;

    }
    console.log('gGame.markedCount', gGame.markedCount);
    isVictory();

}

function gameOver() {
    gGame.isOn = false;
    var elLose = document.querySelector('.start span');
    var mine = findMines();
    for (var i = 0; i < mine.length; i++) {
        renderCell(mine[i], MINE)
    }
    clearInterval(gInterval);
    gInterval = null;
    elLose.innerText = LOSE;

}

function restart() {
    clearInterval(gInterval);
    gIsFirstClicked = true;
    infoGame();
    gLevel.life = +setLife(gLevel.size);
    console.log(gLevel.life, 'gLevel.life');
    initGame();
}

function setLife(size) {
    if (size === 4) gLevel.life = 1;
    else if (size === 8) gLevel.life = 2;
    else gLevel.life = 3;
    return gLevel.life;
}

function isVictory() {
    var countCellToShown = Math.pow(gLevel.size, 2) - gLevel.mines;
    if (countCellToShown === gGame.shownCount && gLevel.mines === gGame.markedCount) {
        var elLose = document.querySelector('.start span');
        elLose.innerText = WIN;
        clearInterval(gInterval);
    }

}

function expandShown(board, i, j) {

    var location = { i, j };
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue;
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue;
            var neg = board[i][j];
            var coord = { i: i, j: j }
            renderCell(coord, neg.minesAroundCount)
            if (!neg.isShown) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
            }
            // if (!neg.minesAroundCount) expandShown(board, i, j)

        }
    }
    // return
}