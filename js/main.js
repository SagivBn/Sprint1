'use strict'
var gBoard = []
var gMines = 0
var gHints = 3

var gHintMode = false
var gTimer
var gStartTimer = 0
var gBestTimeScore = 0
var gSafeClicks = 3
var gFirstClick = true
var gFlags = 0
var gLives = 3

const losingGame = document.querySelector('.losing-game')
const winningGame = document.querySelector('.winning-game')

document,
    addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

const gEasyLevel = {
    SIZE: 4,
    MINES: 2
}

const gMediumLevel = {
    SIZE: 8,
    MINES: 12
}

const gHardLevel = {
    SIZE: 12,
    MINES: 30
}

function onLevelClick(level) {
    gSelectedLevel = level
    resetGame()
}

var gSelectedLevel = gEasyLevel

var cellExample = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    renderSafeClicks()
    renderHearts()
    renderHints()

    const elBestScore = document.querySelector('.best-time-score')
    gBestTimeScore = localStorage.getItem('best-score')
    if (gBestTimeScore) {
        elBestScore.innerText = gBestTimeScore
    } else {
        gBestTimeScore = 0
    }

    gBoard = buildBoard()
    renderBoard(gBoard)
}

function onSafeClick() {
    if (gSafeClicks === 0) {
        return
    }
    gSafeClicks--
    renderSafeClicks()
    var colIdx = getRandomIntInclusive(0, gBoard.length - 1)
    var rowIdx = getRandomIntInclusive(0, gBoard.length - 1)
    var cell = gBoard[rowIdx][colIdx]
    while (cell.isMine || cell.isShown) {
        colIdx = getRandomIntInclusive(0, gBoard.length - 1)
        rowIdx = getRandomIntInclusive(0, gBoard.length - 1)
        cell = gBoard[rowIdx][colIdx]
    }
    cell.isSafeClick = true
    renderBoard(gBoard)
    setTimeout(() => {
        cell.isSafeClick = false
        renderBoard(gBoard)
    }, 1000)
}

function renderSafeClicks() {
    const elSafeClick = document.querySelector('.safe-button')
    elSafeClick.innerText = gSafeClicks
}

function renderHearts() {
    var strHTML = ''
    for (var i = 0; i < gLives; i++) {
        strHTML += `<img src="img/heart.png" />`
    }
    const elHearts = document.querySelector('.hearts-container')
    elHearts.innerHTML = strHTML
}

function renderHints() {
    var strHTML = ''
    for (var i = 0; i < gHints; i++) {
        strHTML += `<img onclick="hintClick()" src="img/hint.png" />`
    }
    const elHints = document.querySelector('.hints-container')
    elHints.innerHTML = strHTML
}

function resetGame() {
    gLives = 3
    gFlags = 0
    gMines = 0
    gFirstClick = true
    gHints = 3
    gSafeClicks = 3
    clearInterval(gTimer)
    initGame()
}

function setTimer() {
    gStartTimer = Date.now()
    gTimer = setInterval(startTimer, 1)
}

function startTimer() {
    const currTime = Date.now() - gStartTimer
    const millSec = currTime % 1000
    const sec = parseInt(currTime / 1000)
    const gScreenTimer = document.querySelector('.timer')
    gScreenTimer.innerText = `${sec}:${millSec}`
}

function buildBoard() {
    const size = gSelectedLevel.SIZE
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isHint: false,
                safeClick: false
            }
        }
    }
    for (var i = 0; i < gSelectedLevel.MINES; i++) {
        var colIdx = getRandomIntInclusive(0, board.length - 1)
        var rowIdx = getRandomIntInclusive(0, board.length - 1)

        if (board[rowIdx][colIdx].isMine) {
            i--
        }

        board[rowIdx][colIdx].isMine = true
    }
    board = setMinesNegsCount(board)
    return board
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                if (i > 0) {
                    if (j > 0) {
                        board[i - 1][j - 1].minesAroundCount++
                    }

                    board[i - 1][j].minesAroundCount++

                    if (j < board[i].length - 1) {
                        board[i - 1][j + 1].minesAroundCount++
                    }
                }
                if (j > 0) {
                    board[i][j - 1].minesAroundCount++
                }
                if (j < board[i].length - 1) {
                    board[i][j + 1].minesAroundCount++
                }
                if (i < board.length - 1) {
                    board[i + 1][j].minesAroundCount++
                    if (j < board[i].length - 1) {
                        board[i + 1][j + 1].minesAroundCount++
                    }

                    if (j > 0) {
                        board[i + 1][j - 1].minesAroundCount++
                    }
                }
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '<tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]

            const classes = ['cell', `cell-${i}-${j}`]
            if (cell.isSafeClick) {
                classes.push('cell-safe-click')
            }

            if (
                !cell.isMarked &&
                !cell.isMine &&
                cell.minesAroundCount === 0 &&
                (cell.isShown || cell.isHint)
            ) {
                classes.push('cell-empty')
            }

            const className = classes.join(' ')

            if (i === 2 && cell.minesAroundCount === 0) {
                const { isMarked, isMine, minesAroundCount, isShown } = cell
                console.log({ isMarked, isMine, minesAroundCount, isShown })
            }
            if (cell.isShown || cell.isHint || cell.isSafeClick) {
                if (cell.isMarked) {
                    strHTML += renderCell(className, i, j, 'flag')
                } else if (cell.isMine) {
                    strHTML += renderCell(className, i, j, 'mine')
                } else if (cell.minesAroundCount > 0) {
                    strHTML += renderCell(
                        className,
                        i,
                        j,
                        cell.minesAroundCount
                    )
                } else {
                    strHTML += renderCell(className, i, j)
                }
            } else {
                strHTML += renderCell(className, i, j)
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody>'
    var elContainer = document.querySelector('.board-container')
    elContainer.innerHTML = strHTML
}

function renderCell(className, row, col, img = null) {
    var strHTML = `<td oncontextmenu="cellMarked(this)" data-i="${row}" data-j="${col}"  class="${className}" onclick="cellClicked(this,${row},${col})">`
    if (img) {
        strHTML += `<img src="img/${img}.png" />`
    }
    strHTML += `</td>`
    return strHTML
}

function cellClicked(elCell, i, j) {
    console.log({ i, j })
    if (gHintMode) {
        hintCheck(i, j)
        return
    }
    if (gFirstClick) {
        setTimer()
        gFirstClick = false
    }
    if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        gLives--
        gMines++
        renderHearts()
    }
    gBoard[i][j].isShown = true
    renderBoard(gBoard)
    checkGameOver()
}
function cellMarked(elCell) {
    const dataset = elCell.dataset
    const row = dataset.i
    const col = dataset.j
    if (gBoard[row][col].isMarked) {
        gBoard[row][col].isMarked = false
        gBoard[row][col].isShown = false
        elCell.innerHTML = null
        return
    }

    elCell.innerHTML = `<img src="img/flag.png" />`
    gBoard[row][col].isMarked = true
    gBoard[row][col].isShown = true
    gFlags++
    checkGameOver()
}
function checkGameOver() {
    if (gLives === 0) {
        clearInterval(gTimer)
        losingGame.style.display = 'inline'
    } else if (gSelectedLevel.MINES === gFlags + gMines) {
        var isAllShown = true
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (!gBoard[i][j].isShown) {
                    isAllShown = false
                }
            }
        }
        if (isAllShown) {
            winningGame.style.display = 'inline'
            clearInterval(gTimer)
            const gScreenTimer = document.querySelector('.timer')
            const currentScoreStr = gScreenTimer.innerHTML
            const currentScore = +currentScoreStr.replace(':', '.')
            if (currentScore < gBestTimeScore) {
                localStorage.setItem('best-score', currentScore)
            }
        }
    }
}

function expandShown(board, elCell, i, j) {
    if (board[i][j].minesAroundCount > 0) {
        return
    }
    elCell.style.backgroundColor = 'black'
    // const nextCell = document.querySelector(`.cell-${i+1}-${j+1}`)
    expandShown(board)
}
function hintClick() {
    if (gHintMode) {
        return
    }
    gHintMode = true
    gHints--
}

function hintCheck(i, j) {
    gHintMode = false
    changeShownInNegsCells(gBoard, true, i, j)
    setTimeout(() => {
        changeShownInNegsCells(gBoard, false, i, j)
        renderHints()
    }, 1000)
}
function changeShownInNegsCells(board, isShown, i, j) {
    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            if (
                row < 0 ||
                row >= board.length ||
                col < 0 ||
                col >= board[row].length
            ) {
                continue
            }
            board[row][col].isHint = isShown
        }
    }
    renderBoard(board)
}
