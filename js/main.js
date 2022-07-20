'use strict'

const MINE = {
    isMine: true,
}
const EMPTY = ' '

// var gMinesAroundCount

var gBoard = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true,
}

var gLevel = {
    SIZE: 4,
    Mines: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
}

function initGame() {
    console.log('Good Luck!')
    gBoard = buildBoard()

    renderBoard(gBoard, '.board-container')
    // gMinesAroundCount = setMinesNegsCount(gBoard, i, j)
    console.log(gBoard)
}

function buildBoard() {
    const SIZE = 4
    const board = []
    for (var i = 0; i < SIZE; i++) {
        board[i] = []
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {}
        }
    }
    board[1][1] = MINE
    board[2][2] = MINE
    // board[2][0] = MINE
    // board[3][1] = MINE
    // board[3][3].isMine = true
    console.log(board)
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            if (board[i][j] !== MINE) {
                board[i][j] = {
                    minesAroundCount: setMinesNegsCount(board, i, j),
                    isShown: false,
                    isMine: false,
                    isMarked: false,
                }
            }
        }
    }
    console.log(board)
    return board
}
// const cell = {
//     gMinesAroundCount: setMinesNegsCount(gBoard, i, j),
//     isShown: true,
//     isMine: false,
//     isMarked: true,
// }
// board[i][j] = {
//   gMinesAroundCount: setMinesNegsCount(board, i, j),
//   isShown: false,
//   isMine: false,
//   isMarked: false,
// }
function cellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    document
        .getElementById('myDIV')
        .addEventListener('contextmenu', cellMarked(elCell))
    console.log('Cell clicked:', elCell, i, j)
}

function cellMarked(elCell) {
    console.log('xxx')
}
