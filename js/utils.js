'use strict'
var gallSec;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function timerOn() {
    var startTime = Date.now();
    gInterval = setInterval(renderTime, 1000, startTime);
}


function renderTime(startTime) {
    var elapsedTime = Date.now() - startTime;
    document.querySelector('.timer span').innerText = (elapsedTime / 1000).toFixed(0);
}

// function printBoard() {
//     var str = '';

//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard[i].length; j++) {
//             var cell = gBoard[i][j];
//             str += cell.isMine ? MINE : cell.minesAroundCount;
//             str += ' ';
//         }
//         str += '\n';
//     }
//     console.log(str);
// }