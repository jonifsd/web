const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const winnerOverlayElement = document.getElementById('winnerOverlay');
let circleTurn;
let gameOver;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    gameOver = false;
    winnerOverlayElement.classList.remove('show');
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    if (gameOver) return;
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    gameOver = true;
    if (draw) {
        winningMessageTextElement.innerText = 'תיקו!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "עיגול" : "איקס"} מנצח!`;
        showWinnerOverlay(circleTurn ? CIRCLE_CLASS : X_CLASS);
    }
    winningMessageElement.classList.add('show');
    restartButton.addEventListener('click', startGame, { once: true });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function showWinnerOverlay(winnerClass) {
    winnerOverlayElement.classList.add('show');
    winnerOverlayElement.style.backgroundImage = winnerClass === X_CLASS ? "url('x.jpg')" : "url('circle.jpg')";
}

// YouTube API integration
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'W5xqaIXYh4g', // Replace with your YouTube video ID
        events: {
            'onReady': onPlayerReady
        },
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': 'W5xqaIXYh4g' // Repeat the video ID for looping
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}
