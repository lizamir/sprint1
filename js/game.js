'use strict'

const MINE = ' 💣 '
const EMPTY = ' '
const FLAG = '🏴‍☠️'

var gBoard = {
    minesAroundCount: 4,
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
    board[0][1] = board[1][2] = {
        minesAroundCount: 0,
        isShown: true,
        isMine: true,
        isMarked: false
    }

    board = setMinesNegsCount(board)
    console.log(board);
    console.table(board);
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td class = "occupied" data-i="${i}" data-j="${j}" onclick="cellClicked(${i},${j}
                ,this)" oncontextmenu="cellMarked(this);return false;">`
            strHTML += '';
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
            if (cell.isMine) continue
            var numOfNegs = countAllNeighbors(board, i, j)
            cell.minesAroundCount = numOfNegs;
            console.log(cell);
        }
    }
    return board;
}

function countAllNeighbors(board, idxI, idxJ) {
    var count = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= board.length - 1) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === idxJ && j === idxJ) continue
            console.log(board[i][j]);
            var neighborCell = board[i][j];
            if (neighborCell.isMine) count++;
        }
    }
    return count;
}

function cellClicked(i, j, elCell) {

    console.log('i', i, 'j', j);
    curCell = gBoard[i][j];
    if (elCell.isMine) {
        elCell.innerText = MINE;
        checkGameOver();
    } else if (elCell.)


}

// function playMsg(isWin) {

//     var elPlay = document.querySelector('.msg');
//     elPlay.innerHTML += `<h2> ${isWin}? winner: looser</h2>`
// }

function cellMarked(elCell) {


}

function checkGameOver() {
    console.log('ooppss');
}

function expandShown(board, elCell, i, j) {}