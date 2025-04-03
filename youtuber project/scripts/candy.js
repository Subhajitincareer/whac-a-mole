// Game configuration
const config = {
    rows: 8,
    cols: 8,
    candyTypes: ['🍬', '🍭', '🍪', '🍫', '🍡', '🍰']
};

let score = 0;
let moves = 0;
let selectedCandy = null;
let board = [];
let gameStarted = false;

// Initialize the game board
function initBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    gameStarted = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'block';

    // Create initial board array
    for (let row = 0; row < config.rows; row++) {
        board[row] = [];
        for (let col = 0; col < config.cols; col++) {
            const candy = document.createElement('div');
            candy.classList.add('candy');
            candy.dataset.row = row;
            candy.dataset.col = col;

            // Set random candy type
            const randomCandy = config.candyTypes[Math.floor(Math.random() * config.candyTypes.length)];
            candy.textContent = randomCandy;
            board[row][col] = randomCandy;

            // Add drag events
            candy.draggable = true;
            candy.addEventListener('dragstart', dragStart);
            candy.addEventListener('dragover', dragOver);
            candy.addEventListener('drop', dragDrop);
            candy.addEventListener('dragenter', dragEnter);
            candy.addEventListener('dragleave', dragLeave);

            boardElement.appendChild(candy);
        }
    }
}

// Drag functionality
let draggedElement = null;

function dragStart(e) {
    if (!gameStarted) return;
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function dragDrop(e) {
    if (!gameStarted) return;
    e.preventDefault();

    const dropTarget = e.target;
    dropTarget.classList.remove('drag-over');
    draggedElement.classList.remove('dragging');

    const row1 = parseInt(draggedElement.dataset.row);
    const col1 = parseInt(draggedElement.dataset.col);
    const row2 = parseInt(dropTarget.dataset.row);
    const col2 = parseInt(dropTarget.dataset.col);

    if (isAdjacent({ row: row1, col: col1 }, { row: row2, col: col2 })) {
        swapCandies(
            { row: row1, col: col1, element: draggedElement },
            { row: row2, col: col2, element: dropTarget }
        );
        moves++;
        document.getElementById('moves').textContent = moves;
    }

    draggedElement = null;
}

// Check if two positions are adjacent
function isAdjacent(pos1, pos2) {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Swap two candies
function swapCandies(candy1, candy2) {
    const tempText = candy1.element.textContent;
    candy1.element.textContent = candy2.element.textContent;
    candy2.element.textContent = tempText;

    const tempBoard = board[candy1.row][candy1.col];
    board[candy1.row][candy1.col] = board[candy2.row][candy2.col];
    board[candy2.row][candy2.col] = tempBoard;

    checkMatches();
}

// Check for matches after swap
function checkMatches() {
    // Horizontal matches
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols - 2; col++) {
            if (board[row][col] === board[row][col + 1] &&
                board[row][col] === board[row][col + 2]) {
                score += 10;
                document.getElementById('score').textContent = score;
                // Replace matched candies with new ones
                for (let i = 0; i < 3; i++) {
                    const newCandy = config.candyTypes[Math.floor(Math.random() * config.candyTypes.length)];
                    board[row][col + i] = newCandy;
                    document.querySelector(`[data-row="${row}"][data-col="${col + i}"]`).textContent = newCandy;
                }
            }
        }
    }

    // Vertical matches
    for (let row = 0; row < config.rows - 2; row++) {
        for (let col = 0; col < config.cols; col++) {
            if (board[row][col] === board[row + 1][col] &&
                board[row][col] === board[row + 2][col]) {
                score += 10;
                document.getElementById('score').textContent = score;
                // Replace matched candies with new ones
                for (let i = 0; i < 3; i++) {
                    const newCandy = config.candyTypes[Math.floor(Math.random() * config.candyTypes.length)];
                    board[row + i][col] = newCandy;
                    document.querySelector(`[data-row="${row + i}"][data-col="${col}"]`).textContent = newCandy;
                }
            }
        }
    }
}

// Event Listeners
document.getElementById('start-btn').addEventListener('click', () => {
    initBoard();
    score = 0;
    moves = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
});

document.getElementById('restart-btn').addEventListener('click', () => {
    score = 0;
    moves = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
    gameStarted = false;
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('restart-btn').style.display = 'none';
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '<div class="start-message">Press Start to begin!</div>';
});

// Initialize empty board when page loads
window.onload = () => {
    document.getElementById('restart-btn').style.display = 'none';
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '<div class="start-message">Press Start to begin!</div>';
};