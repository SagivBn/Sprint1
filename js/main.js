'use strict'

//rightClick Menu Disable
document,
    addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

const MINE = 'MINE'
const losingGame = document.querySelector('.losing-game')
const winningGame = document.querySelector('.winning-game')
const elContainer = document.querySelector('.board-container')

var gFirstLevel = {
    SIZE: 4,
    MINES: 2,
}
var gClick = true
var gClicks
var gMines = []
var gPressedMines
var gFirstClick
var gStartTime
var gTime
var gScreenTimer = document.querySelector('.timer')
var gFlags
var gLives
// var gMinesAroundCount

var gBoard = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true,
}

var gGame

function initGame() {
    console.log('Good Luck!')
    gClicks = 0
    gLives = 3
    gMines = []
    gPressedMines = 0
    gFlags = []
    clearInterval(gTime)
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0,
    }
    gFirstClick = {}
    losingGame.style.display = 'none'
    winningGame.style.display = 'none'
    // elContainer.style.backgroundColor = 'white'
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

    // gMinesAroundCount = setMinesNegsCount(gBoard, i, j)
    countNegsAround(gBoard)
    console.log(gBoard)
}

function buildBoard() {
    const SIZE = 4
    const board = []
    for (var i = 0; i < SIZE; i++) {
        board[i] = []
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell(i, j)
        }
    }
    // board[1][1] = MINE
    // board[2][2] = MINE
    // board[2][0] = MINE
    // board[3][1] = MINE
    // board[3][3].isMine = true
    console.log(board)
    return board
}

function setTimer() {
    gStartTime = Date.now()
    gTime = setInterval(startTimer, 1)
}

function startTimer() {
    var currTime = Date.now() - gTime
    var millSec = currTime % 1000
    var sec = parseInt(currTime / 1000)
    gScreenTimer.innerText = `${sec}:${millSec}`
}

function createCell(i, j) {
    var cell = {
        i: i,
        j: j,
        mineNegsCount: 0,
        cellPressed: false,
        isFlagged: false,
        isMine: false,
        isNumber: true,
    }
    return cell
}
function renderCell(location, value = '') {
    // Select the elCell and set the value
    // console.log(value)
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}
function cellClicked(elCell, i, j, ev) {
    // const cell = gBoard[i][j]
    if (!gClick) {
        return
    }
    gClicks++
    //first click
    if (gFirstClick === 1) {
        gFirstClick = { i, j }
        gGame.isOn = true
        randMines(gBoard)
        findNeighbors(gBoard)
        setTimer()
    }

    console.log('Cell clicked:', elCell, i, j)
    if (!gGame.isOn) return

    if (ev === 3) {
        console.log(ev)
        if (gBoard[i][j].cellPressed) {
            return
        }

        // flag off
        if (gBoard[i][j].isFlagged) {
            renderCell(i, j, '<img hidden src="/img/flag.png" />')
            gBoard[i][j].isFlagged = false
            removeFlag(i, j)
        }

        // flag on
        else {
            renderCell(i, j, '<img hidden src="/img/flag.png" />')
            gBoard[i][j].isFlagged = true
            gFlags.push({ i, j })
            gameOverCheck()
        }
    } else if (ev === 1 && !gBoard[i][j].isFlagged) {
        if (gBoard[i][j].mineNeighborsCount > 0) {
            renderCell(
                i,
                j,
                `<img src=/img/${gBoard[i][j].mineNegsCount}.png"/>`
            )
            gBoard[i][j].cellPressed = true
            gGame.markedCount++
            gameOverCheck()
            gBoard[i][j].cellPressed = true
        }
    }
}

function gameOverCheck() {
    var flagsCount = 0
    for (var i = 0; i < gMines.length; i++) {
        for (var j = 0; j > gFlags.length; j++) {
            if (gMines[i].i === gFlags[j].i && gMines[i].k === gFlags[j].k) {
                flagsCount++
            }
        }
    }
    if (
        flagsCount === gFirstLevel.MINES - gPressedMines &&
        gGame.markedCount === gFirstLevel.SIZE ** 2 - 2
    ) {
        victory()
    }
}

function lostGame() {
    if (gLives !== 1) {
        gPressedMines++
        var lives = document.querySelector(`.health${gLives}`)
        lives.style.display = 'none'
        gLives--
    } else {
        lives = document.querySelector(`.health${gLives}`)
        lives.style.display = 'none'
        clearInterval(gStartTime)
        gGame.isOn = false
        losingGame.style.display = 'block'
        document.querySelector('.lost').style.display = 'inline'
        document.querySelector('.smile').style.display = 'none'
        for (var i = 0; i < gMines.length; i++) {
            renderCell(gMines[i].i, gMines[i].j, `<img src="/img/mine.png`)
        }
    }
}

function victory() {
    clearInterval(gStartTime)
    gGame.isOn = false
    winningTitle.style.display = 'block'
    document.querySelector('.win').style.display = 'inline'
    document.querySelector('.smile').style.display = 'none'
}

function removeFlag(i, j) {
    for (var f = 0; f < gFlags.length; f++) {
        if (gFlags[f].i === i && gFlags[k].j) {
            gFlags.splice(f, 1)
        }
    }
}

function cleanBoard(board) {
    var cells = []
    // board[i][j] = pos
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === false) {
                cells.push(board[i][j])
            }
        }
    }
    return cells
}

function cellMarked(elCell) {
    console.log('xxx')
}

function randMines(board) {
    var emptyCells = cleanBoard(gBoard)
    for (var i = 0; i < gFirstLevel.Mines; i++) {
        var randomCell = getRandomInt(0, emptyCells.length)
        var cell = emptyCells[randomCell]
        // console.log(cell)
        gBoard[cell.i][cell.j].isMine = true
        console.log(gBoard[cell.i][cell.j])
    }
}

function countNegsAround(cell, board) {
    var neighbors = []
    var rowIdx = cell.i
    var colIdx = cell.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (rowIdx === i && colIdx === j) {
                continue
            }
            if (board[i][j]) {
                neighbors.push(board[i][j])
            }
        }
    }
    console.log(neighbors)
    return neighbors
}
function renderBoard(mat, selector) {
    var strHTML = '<table border="4"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var className = `cell cell-${i}-${j}`
            strHTML += `<td oncontextmenu="cellClicked(this,${i},${j},event)" data-i="${i}" data-j="${j}"  class=${className} onclick="cellClicked(this,${i},${j},event)"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}
function findNeighbors() {
    var emptyCells = cleanBoard(gBoard)

    for (var i = 0; i < emptyCells.length; i++) {
        var cell = emptyCells[i]
        var neighbors = countNegsAround(cell, gBoard)
        var mineCount = 0
        for (var j = 0; j < neighbors.length; j++) {
            if (neighbors[j].isMine === true) {
                mineCount++
                console.log(mineCount)
            }
            cell.mineNeighborsCount = mineCount
            if (mineCount > 0) gBoard[cell.i][cell.j].mineNegsCount = mineCount
            else gBoard[cell.i][cell.j].mineCount = 0
        }
    }
    console.log(gBoard)
}
