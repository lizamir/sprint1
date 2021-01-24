function addMines(board) {

    var numsMines = gLevel.mines

    while (numsMines) {
        var i = getRandomInt(0, gLevel.size);
        var j = getRandomInt(0, gLevel.size);

        if (!board[i][j].isMine) {
            board[i][j].isMine = true;
            numsMines--;

        }
    }
}

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = board[i][j];
            var numOfNegs = countAllNeighbors(board, i, j);
            cell.minesAroundCount = numOfNegs;
        }
    }

    return board;
}

function findMines() {
    var mines = [];
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var coord = { i: i, j: j }
            if (gBoard[i][j].isMine) mines.push(coord)
        }
    }
    return mines;

}