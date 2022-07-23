// function renderBoard(mat, selector) {
//     var strHTML = '<table border="4"><tbody>'
//     for (var i = 0; i < mat.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < mat[0].length; j++) {
//             var className = `cell cell-${i}-${j}`
//             strHTML += `<td oncontextmenu="cellClicked(this,${i},${j},event)" data-i="${i}" data-j="${j}"  class=${className} onclick="cellClicked(this,${i},${j},event)"></td>`
//         }
//         strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>'
//     const elContainer = document.querySelector(selector)
//     elContainer.innerHTML = strHTML
// }
/////////////////////////////////////////////////////////////////////////////////
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}
/////////////////////////////////////////////////////////////////////////////////
// location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     // console.log(value)
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }
/////////////////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
/////////////////////////////////////////////////////////////////////////////////
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function showModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
}
function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}
/////////////////////////////////////////////////////////////////////////////////
// function renderBoard() {
//     var strHTML = ''
//     for (var i = 0; i < gBoard.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < gBoard.length; j++) {
//             var cell = gBoard[i][j]
//             var cellBackgroundColor = gCorrectAnswer > cell ? 'orange' : 'white'
//             strHTML += `<td style="background-color:                    ${cellBackgroundColor};"
//             onclick="cellClicked(${cell})" >${cell}</td>`
//             // if (gCorrectAnswer > cell) {
//             //     strHTML.style.background = 'blue'
//             // }
//         }
//         strHTML += '</tr>'
//         console.log()
//     }
// }
// function renderBoard(board) {
//     var strHtml = ''
//     for (var i = 0; i < board.length; i++) {
//         var row = board[i]
//         strHtml += '<tr>'
//         for (var j = 0; j < row.length; j++) {
//             var cell = row[j]
//             // figure class name
//             var className = (i + j) % 2 === 0 ? '' : ''
//             var tdId = `cell-${i}-${j}`
//             strHtml += `<td id="${tdId}" onclick="cellClicked(this)" class="${className}">${cell}</td>`
//         }
//         strHtml += '</tr>'
//     }
//     var elMat = document.querySelector('.board-container')
//     elMat.innerHTML = strHtml
// }

/////////////////////////////////////////////////////////////////////////////////
function toggleGame(elBtn) {
    // console.log('gGameInterval:', gGameInterval)
    if (gGameInterval) {
        clearInterval(gGameInterval);
        gGameInterval = null;
        elBtn.innerText = 'Start';
    } else {
        gGameInterval = setInterval(play, GAME_FREQ);
        elBtn.innerText = 'Stop';
    }
}
/////////////////////////////////////////////////////////////////////////////////
// function onCellClicked(elCell, cellI, cellJ) {
//     // console.log('cellI, cellJ', cellI, cellJ)
//     console.log('elCell.dataset:', elCell.dataset)
//     if (gBoard[cellI][cellJ] === LIFE) {
//         // Model
//         gBoard[cellI][cellJ] = SUPER_LIFE

//         // DOM
//         elCell.innerText = SUPER_LIFE

//         blowUpNegs(cellI, cellJ)
//     }

//     console.table(gBoard)
// }
/////////////////////////////////////////////////////////////////////////////////
// function setMinesNegsCount(mat, cellI, cellJ) {
//     gMinesAroundCount = 0
//     console.log(typeof mat)
//     // console.log(mat)
//     for (var i = 0; i <= mat.length; i++) {
//         if (i < 0 || i >= mat.length) continue
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             var cell = mat[i][j]
//             // console.log(mat)
//             if (i === cellI && j === cellJ) continue
//             if (j < 0 || j >= mat[i].length) continue
//             if (cell.isMine) gMinesAroundCount++

//             console.log('cell:', cell)
//         }
//         console.log(gMinesAroundCount)
//     }
//     return gMinesAroundCount
// }
function setMinesNegsCount(mat, rowIdx, colIdx) {
    var minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;

            var cell = mat[i][j];
            console.log('cell:', cell);
            if (cell.isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;
}
/////////////////////////////////////////////////////////////////////////////////
function blowUpNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j] === LIFE) {
                // Model
                gBoard[i][j] = '';

                // DOM
                var elCell = renderCell(i, j, '');
                elCell.classList.remove('occupied');
            }
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////
function shuffle(items) {
    var randIdx, keep;
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}
/////////////////////////////////////////////////////////////////////////////////
function findEmptyPos() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!cell) {
                return {i, j};
            }
        }
    }

    return null;
}
/////////////////////////////////////////////////////////////////////////////////
// function countNegsAround(mat, rowIdx, colIdx) {
//     var foodCount = 0
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > mat.length - 1) continue

//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > mat[0].length - 1) continue
//             if (i === rowIdx && j === colIdx) continue

//             var cell = mat[i][j]
//             console.log('cell:', cell)
//             if (cell === gFood) foodCount++
//         }
//     }
//     return foodCount
// }
/////////////////////////////////////////////////////////////////////////////////
// function cleanBoard() {
//     var elTds = document.querySelectorAll('.mark, .selected')
//     for (var i = 0; i < elTds.length; i++) {
//         elTds[i].classList.remove('mark', 'selected')
//     }
// }
/////////////////////////////////////////////////////////////////////////////////
function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d];
        console.log(item);
    }
}
/////////////////////////////////////////////////////////////////////////////////
// printSecondaryDiagonal(mat)
function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - 1 - d];
        console.log(item);
    }
}
/////////////////////////////////////////////////////////////////////////////////
// Move the player by keyboard arrows
function handleKey(event) {
    var i = gGamerPos.i;
    var j = gGamerPos.j;

    console.log('event.key:', event.key);
    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;
    }
}
/////////////////////////////////////////////////////////////////////////////////
// Returns the class name for a specific cell
// function getClassName(location) {
//     var cellClass = 'cell-' + location.i + '-' + location.j
//     return cellClass
// }
/////////////////////////////////////////////////////////////////////////////////
function markCells(coords) {
    console.log('coords:', coords);

    // DONE: query select them one by one and add mark
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var selector = getSelector(coord);
        var elCell = document.querySelector(selector);
        elCell.classList.add('mark');
    }
}
/////////////////////////////////////////////////////////////////////////////////
// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-');
    coord.i = +parts[1];
    coord.j = +parts[2];
    return coord;
}
/////////////////////////////////////////////////////////////////////////////////
function drawNum(nums) {
    // console.log(`gNums.length:`, gNums.length)
    var num = getRandomInt(0, nums.length);
    var removedNum = nums.splice(num, 1);
    // console.log(`gNums:`, gNums)
    return removedNum;
}
/////////////////////////////////////////////////////////////////////////////////
function handleKey(event) {
    var i = gGamerPos.i;
    var j = gGamerPos.j;

    switch (event.key) {
        case 'ArrowLeft':
            if (j <= 0) moveTo(i, gBoard[i].length - 1);
            else moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            if (j >= gBoard[i].length - 1) moveTo(i, 0);
            else moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            if (i <= 0) moveTo(gBoard.length - 1, j);
            else moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            if (i >= gBoard.length - 1) moveTo(0, j);
            else moveTo(i + 1, j);
            break;
    }
}
///////////////////////////////////////////////////////////////////////////////
function playAudio() {
    var playSound = new Audio('audio/pop.mp3');
    playSound.volume = 0.1;
    playSound.play();
}
//AUDIO HTML
// ;<audio src='audio/pop.mp3' type='audio/mpeg'></audio>
///////////////////////////////////////////////////////////////////////////////

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
}
