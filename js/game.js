'use strict'

const MINE = ' 💣 '
const EMPTY = ' '
const FLAG = '🏴‍☠️'
const LIVE = ' 💜 '
const WIN = '🥳'
const LOSE = '😵'
const START = '🤗'

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
    life: 3
};

var gGame;

function initGame() {
    clearInterval(gInterval)
    var elLose = document.querySelector('.start span')
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }

    gLevel.life = 3;
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
    //console.log(size);
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
            gLevel.life = 3;

            break;

        case 'intermediate':
            gLevel.size = 8;
            gLevel.mines = 12;
            gLevel.life = 3;

            break

        case 'expert':
            gLevel.size = 12;
            gLevel.mines = 30;
            gLevel.life = 3;

            break;

    }
    clearInterval(gInterval);
    initGame()

}

function addMines(board) {

    var numsMines = gLevel.mines

    while (numsMines) {
        var i = getRandomInt(0, gLevel.size);
        var j = getRandomInt(0, gLevel.size);
        //console.log('gBoard[i][j]', board[i][j]);
        // console.log('gBoard[i][j]', gLevel.size);

        if (!board[i][j].isMine) {
            board[i][j].isMine = true;
            numsMines--

        }
    }
}


function renderBoard(board) {
    var strHTML = '';
    // console.log('board', board);
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gLevel.size; j++) {
            //var className = 'clicked'
            strHTML += `<td  class= "cell" id= cell-${i}-${j} onclick="cellClicked(${i},${j},this)" 
            oncontextmenu="cellMarked(${i},${j},this);return false;">`

            strHTML += '</td>\n';
        }
        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;
    }
}

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = board[i][j];
            //if (cell.isMine) continue
            var numOfNegs = countAllNeighbors(board, i, j)
                // console.log('numOfNegs', numOfNegs);
            cell.minesAroundCount = numOfNegs;
            //console.log(cell);
        }
    }
    //console.log('board[i][j]', board[2][3]);
    //console.log(board.length, 'board.length');
    return board;
}


function countAllNeighbors(board, idxI, idxJ) {
    var count = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
                //if (i === idxJ && j === idxJ) continue
                //console.log(board[i][j]);
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
    if (curCell.isShown) return
        //start without mine

    if (!gGame.shownCount && curCell.isMine) {
        elCell.innerHTML = EMPTY;
        initGame()
    }

    curCell.isShown = true;
    gGame.shownCount++;
    if (curCell.isMine) {
        if (!gLevel.life) gameOver();
        gLevel.life--;
        gGame.shownCount--;
        renderCell(location, MINE)
        curCell.isShown = false;
        setTimeout(() => {
            elCell.innerHTML = EMPTY;
        }, 1000);


    } else if (curCell.minesAroundCount > 0 && !curCell.isMine) {
        var value = curCell.minesAroundCount;
        //elCell.classList.add('clicked')
        console.log(value, 'value');
        //expandShown(gBoard, i, j)
        renderCell(location, value)
    } else {
        expandShown(gBoard, i, j)
    }
    console.log(' gGame.shownCount', gGame.shownCount);
    isVictory()


}


function infoGame() {
    var elLive = document.querySelector('.live')
    elLive.innerText = LIVE + gLevel.life
}


function renderCell(location, value) {

    var elCell = document.getElementById(`cell-${location.i}-${location.j}`);
    //console.log(elCell, 'elCell');
    console.log('value', value);
    elCell.innerHTML = value;
    elCell.classList.add('clicked')
}

// function playMsg(isWin) {

//     var elPlay = document.querySelector('.msg');
//     elPlay.innerHTML += `<h2> ${isWin}? winner: looser</h2>`
// }


function cellMarked(i, j, elCell) {

    var curCell = gBoard[i][j];
    if (curCell.isShown) return
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
    isVictory()

}

function gameOver() {
    gGame.isOn = false
    var elLose = document.querySelector('.start span')
    elLose.innerText = LOSE
    console.log('ooppss');

}

function restart() {
    clearInterval(gInterval);
    gIsFirstClicked = true;
    infoGame();
    initGame();
}




function isVictory() {
    var countCellToShown = Math.pow(gLevel.size, 2) - gLevel.mines;
    if (countCellToShown === gGame.shownCount && gLevel.mines === gGame.markedCount) {
        var elLose = document.querySelector('.start span')
        elLose.innerText = WIN
        clearInterval(gInterval)
    }

}

function expandShown(board, i, j) {

    var location = { i, j }
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue
            var neg = board[i][j];
            var coord = { i: i, j: j }
            renderCell(coord, neg.minesAroundCount)
            if (!neg.isShown) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
            }

        }
    }

}