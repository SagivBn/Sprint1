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

const gFirstLevel = {
    SIZE: 4,
    MINES: 2,
}

const gMediumLevel = {
    SIZE: 8,
    MINES: 12,
}

const gHardLevel = {
    SIZE: 12,
    MINES: 30,
}

var selectedLevel = gFirstLevel

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

const onLevelClick = (level) => {
    selectedLevel = level
    initGame()
}

function initGame() {
    console.log('Good Luck!')
    gClicks = 0
    gLives = 3
    console.log({ gLives })
    for (var i = 1; i <= gLives; i++) {
        const liveImg = document.querySelector(`.health${i}`)
        liveImg.style.display = ''
    }
    gMines = []
    gPressedMines = 0
    clearInterval(gTime)
    gFlags = []
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0,
    }
    gFirstClick = {}

    losingGame.style.display = 'none'
    winningGame.style.display = 'none'
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function buildBoard() {
    const SIZE = selectedLevel.SIZE
    const board = []
    for (var i = 0; i < SIZE; i++) {
        board[i] = []
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell(i, j)
            // console.log(board[i][j])
        }
    }
    // board[1][1] = MINE
    // board[2][2] = MINE
    // board[2][0] = MINE
    // board[3][1] = MINE
    // board[3][3].isMine = true
    // console.log(board)
    return board
}

function renderBoard(board, selector) {
    var strHTML = '<table border="4"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var className = `cell cell-${i}-${j}`
            strHTML += `<td oncontextmenu="cellClicked(this,${i},${j},event)" data-i="${i}" data-j="${j}"  class="${className}" onclick="cellClicked(this,${i},${j},event)"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
    // console.log(strHTML)
}

function setTimer() {
    gStartTime = Date.now()
    gTime = setInterval(startTimer, 1)
}

function startTimer() {
    var currTime = Date.now() - gStartTime
    var millSec = currTime % 1000
    var sec = parseInt(currTime / 1000)
    gScreenTimer.innerText = `${sec}:${millSec}`
}

function createCell(i, j, img = '') {
    var cell = {
        i: i,
        j: j,
        img: img,
        mineNegsCount: 0,
        cellPressed: false,
        isFlagged: false,
        // isMine: false,
    }
    // console.log(cell)
    return cell
}

function cellClicked(elCell, i, j, ev) {
    // const cell = gBoard[i][j]
    if (!gClick) {
        return
    }
    gClicks++
    // console.log(gClicks)
    //first click
    if (gClicks === 1) {
        gFirstClick = { i, j }
        console.log(gFirstClick)
        randMines()
        findNeighbors()
        gGame.isOn = true
        setTimer()
    }

    // console.log('Cell clicked:', elCell, i, j)
    if (!gGame.isOn) {
        return
    }

    if (ev.which === 3) {
        console.log(ev)

        console.log(gBoard[i][j])

        // flag off
        if (gBoard[i][j].isFlagged) {
            renderCell(i, j, '<img hidden src="/img/flag.png" />')
            gBoard[i][j].isFlagged = false
            gBoard[i][j].cellPressed = false
            console.log(gBoard)
            removeFlag(i, j)
        }

        // flag on
        else if (!gBoard[i][j].cellPressed) {
            renderCell(i, j, '<img src="/img/flag.png" />')
            gBoard[i][j].cellPressed = true
            gBoard[i][j].isFlagged = true
            gFlags.push({ i, j })
            console.log(gFlags)
            gameOverCheck()
        }
    } else if (ev.which === 1 && !gBoard[i][j].isFlagged) {
        if (gBoard[i][j].mineNegsCount > 0) {
            renderCell(
                i,
                j,
                `<img  src="/img/${gBoard[i][j].mineNegsCount}.png"/>`
            )
            gBoard[i][j].cellPressed = true
            gGame.markedCount++
            gameOverCheck()
            gBoard[i][j].cellPressed = true
        } else if (
            gBoard[i][j].img === `<img src="/img/mine.png" />` &&
            !gBoard[i][j].cellPressed
        ) {
            gBoard[i][j].cellPressed = true
            renderCell(i, j, `<img src="/img/mine.png" />`)
            lostGame()
            gBoard[i][j].cellPressed = true
            gameOverCheck()
        }
        //empty cell
        else {
            elCell.classList.add('pressed')
            console.log(elCell)
            gBoard[i][j].cellPressed = true
            gGame.markedCount++
            gameOverCheck()
        }
    }
}

function renderCell(i, j, value) {
    // Select the elCell and set the value
    console.log(value)

    var elCell = document.querySelector(`.cell.cell-${i}-${j}`)
    elCell.innerHTML = value
    // console.log(elCell)
}

function gameOverCheck() {
    var flagsCount = 0
    for (var i = 0; i < gMines.length; i++) {
        for (var j = 0; j < gFlags.length; j++) {
            if (gMines[i].i === gFlags[j].i && gMines[i].j === gFlags[j].j) {
                flagsCount++
            }
        }
    }
    if (flagsCount === selectedLevel.MINES - gPressedMines) {
        victory()
    }
}

function lostGame() {
    if (gLives > 1) {
        gPressedMines++
        var lives = document.querySelector(`.health${gLives}`)
        lives.style.display = 'none'
        gLives--
    } else {
        lives = document.querySelector(`.health${gLives}`)
        lives.style.display = 'none'
        clearInterval(gTime)
        gGame.isOn = false
        losingGame.style.display = 'block'
        document.querySelector('.lost').style.display = 'inline'
        for (var i = 0; i < gMines.length; i++) {
            renderCell(gMines[i].i, gMines[i].j, `<img src="/img/mine.png" />`)
        }
    }
}

function victory() {
    clearInterval(gTime)
    gGame.isOn = false
    winningGame.style.display = 'block'
    document.querySelector('.win').style.display = 'inline'
}

function removeFlag(i, j) {
    for (var f = 0; f < gFlags.length; f++) {
        if (gFlags[f].i === i && gFlags[f].j === j) {
            gFlags.splice(f, 1)
        }
    }
}

function cleanBoard(board) {
    // console.log(board)
    var emptyCells = []
    // board[i][j] = pos
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].img) {
                emptyCells.push(board[i][j])
            }
        }
    }
    // console.log(emptyCells)
    return emptyCells
}

function randMines() {
    var emptyCells = cleanBoard(gBoard)
    for (var i = 0; i < selectedLevel.MINES; i++) {
        var randomCell = getRandomInt(0, emptyCells.length)
        var cell = emptyCells[randomCell]
        if (cell.i === gFirstClick.i && cell.j === gFirstClick.j) {
            emptyCells.splice(randomCell, 1)
            randomCell = getRandomInt(0, emptyCells.length)
            cell = emptyCells[randomCell]
        }
        // console.log(cell)
        gBoard[cell.i][cell.j].img = `<img src="/img/mine.png" />`
        console.log(gBoard[cell.i][cell.j].img)
        // console.log(gBoard[cell.i][cell.j])
        emptyCells.splice(randomCell, 1)
        gMines.push(cell)
    }
}

function countNegsAround(cell, board) {
    var neighbors = []
    // console.log(neighbors)
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
                // console.log(neighbors)
            }
        }
    }
    // console.log(neighbors)
    return neighbors
}

function findNeighbors() {
    var emptyCells = cleanBoard(gBoard)

    for (var i = 0; i < emptyCells.length; i++) {
        var cell = emptyCells[i]
        var neighbors = countNegsAround(cell, gBoard)
        var mineCount = 0
        // console.log(neighbors)
        for (var j = 0; j < neighbors.length; j++) {
            if (neighbors[j].img === `<img src="/img/mine.png" />`) {
                mineCount++
                // console.log(mineCount)
            }
            cell.mineNegsCount = mineCount
            if (mineCount > 0)
                gBoard[cell.i][cell.j].img = `<img src="img/${mineCount}.png"/>`
            else gBoard[cell.i][cell.j].img = ''
        }
    }
    // console.log(gBoard)
}
