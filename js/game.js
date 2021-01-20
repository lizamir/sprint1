'use strict'

const MINE = ' 💣 '
const EMPTY = ' '
const FLAG = '🏴‍☠️'

var gInterval;
var gMin = 0
var gSec = 0
var gMsec = 0

var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: true
};

var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
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

    // board[0][1] = board[3][3] = {
    //     minesAroundCount: 0,
    //     isShown: false,
    //     isMine: true,
    //     isMarked: false
    // }


    board = setMinesNegsCount(board)
    console.log(board);
    console.log('board[2][3]', board[2][3]);
    console.table(board);
    return board;
}

function addMines(board) {

    var numsMines = gLevel.mines

    while (numsMines) {
        var i = getRandomInt(0, gLevel.size);
        var j = getRandomInt(0, gLevel.size);
        console.log('gBoard[i][j]', board[i][j]);
        console.log('gBoard[i][j]', gLevel.size);

        if (!board[i][j].isMine) {
            board[i][j].isMine = true;
            numsMines--

        }
    }
}


function renderBoard(board) {
    var strHTML = '';
    console.log('board', board);
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < board.length; j++) {
            var className = gBoard[i][j].isMine ? 'mine' : EMPTY
            strHTML += `<td  class= "cell ${className}" id= cell-${i}-${j} onclick="cellClicked(${i},${j},this)" 
            oncontextmenu="cellMarked(${i},${j},this);return false;">`

            strHTML += '</td>\n';
        }
        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;
    }
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            //if (cell.isMine) continue
            var numOfNegs = countAllNeighbors(board, i, j)
            console.log('numOfNegs', numOfNegs);
            cell.minesAroundCount = numOfNegs;
            //console.log(cell);
        }
    }
    console.log('board[i][j]', board[2][3]);
    console.log(board.length, 'board.length');
    return board;
}


function countAllNeighbors(board, idxI, idxJ) {
    var count = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
                //if (i === idxJ && j === idxJ) continue
            console.log(board[i][j]);
            var neighborCell = board[i][j];
            if (neighborCell.isMine) count++;
        }
    }
    return count;
}

function cellClicked(i, j, elCell) {
    gInterval = setInterval(startClock, 10)
    var location = { i, j };
    console.log('elCell', elCell);
    console.log('i', i, 'j', j);
    var curCell = gBoard[i][j];
    console.log('elCell.isMine', elCell.isMine);
    console.log(' gBoard[2][3]', gBoard[2][3]);
    if (curCell.isMine) {
        curCell.isShown = true;
        renderCell(location, MINE)
        checkGameOver()
        clearInterval(gInterval)
    } else if (curCell.minesAroundCount > 0 && !curCell.isMine) {
        var value = curCell.minesAroundCount;
        console.log(value, 'value');
        curCell.isShown = true;
        renderCell(location, value)
    } else {
        console.log('no mines around')
    }
}

function renderCell(location, value) {

    var elCell = document.getElementById(`cell-${location.i}-${location.j}`);
    //console.log(elCell, 'elCell');
    elCell.innerHTML = value;
}

// function playMsg(isWin) {

//     var elPlay = document.querySelector('.msg');
//     elPlay.innerHTML += `<h2> ${isWin}? winner: looser</h2>`
// }

function cellMarked(i, j, elCell) {

    var curCell = gBoard[i][j];
    if (!curCell.isMarked) {
        elCell.innerHTML = FLAG;
        curCell.isMarked = true;
    } else {
        elCell.innerHTML = EMPTY;
        curCell.isMarked = false;
    }

}

function checkGameOver() {
    console.log('ooppss');

}

function restart() {
    document.querySelector(".clock").innerText = "0:0:000"
    gMin = 0
    gSec = 0
    gMsec = 0
    clearInterval(gInterval)
    initGame()
}

// function checkGameOver(isWin) {
//     console.log('Game Over');
//     if (!isWin) {
//         clearTimeout(cancelSuperMode);
//         cancelSuperMode = null;
//     }

//     // set modal
//     var elTxt = document.querySelector('.modal-txt')
//     elTxt.innerText = isWin ? 'You Win!' : 'Game Over!';
//     elTxt.style.color = isWin ? 'yellow' : 'red'

//     finishGame();
// }

function startClock() {

    var strHtml = ""
    var elClock = document.querySelector(".clock")
    gMsec++

    if (gMsec === 100) {
        gMsec = 0
        gSec += 1
    }
    if (gSec === 60) {
        gSec = 0
        gMin += 1
    }

    strHtml += `${gMin}:${gSec}:0${gMec}`
    elClock.innerHTML = strHtml
}

function isVictory() {

}

function expandShown(board, elCell, i, j) {}