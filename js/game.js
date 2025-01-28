// Basic setup for Tetris game
const canvas = document.getElementById("tetris-game");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 600;

// Set up colors, block size, etc.
const rowCount = 20;
const columnCount = 10;
const blockSize = 30;

const colors = [
    "#00FFFF", "#FF6347", "#FFD700", "#32CD32", "#FF69B4", "#8A2BE2", "#FF4500"
];

const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]]  // J
];

let board = Array.from({ length: rowCount }, () => Array(columnCount).fill(0));
let currentTetromino, currentX, currentY, randomIndex;
let gameOver = false;  // Flag to indicate if the game is over

// Function to draw the game board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < columnCount; col++) {
            if (board[row][col]) {
                ctx.fillStyle = colors[board[row][col] - 1];
                ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
                ctx.strokeStyle = "#fff";
                ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
}

// Function to create a new Tetromino
function newTetromino() {
    randomIndex = Math.floor(Math.random() * tetrominos.length);  // Generate a random index for tetrominos
    currentTetromino = tetrominos[randomIndex];
    currentX = Math.floor(columnCount / 2) - Math.floor(currentTetromino[0].length / 2);
    currentY = 0;
}

// Draw the current tetromino
function drawTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                ctx.fillStyle = colors[randomIndex];  // Use randomIndex to get the correct color
                ctx.fillRect((currentX + col) * blockSize, (currentY + row) * blockSize, blockSize, blockSize);
                ctx.strokeStyle = "#fff";
                ctx.strokeRect((currentX + col) * blockSize, (currentY + row) * blockSize, blockSize, blockSize);
            }
        }
    }
}

// Move the tetromino down and check for collisions
function moveTetromino() {
    currentY++;
    if (collision()) {
        currentY--;
        placeTetromino();
        clearLines(); // Clear any completed lines after placing the tetromino
        newTetromino();
        if (collision()) {
            gameOver = true;  // Game over if the new tetromino collides at the start
            showGameOver();  // Show the game over modal
        }
    }
}

// Check for collisions
function collision() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                const x = currentX + col;
                const y = currentY + row;

                if (x < 0 || x >= columnCount || y >= rowCount || board[y][x]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place the tetromino on the board
function placeTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                board[currentY + row][currentX + col] = 1;
            }
        }
    }
}

// Rotate the tetromino
function rotateTetromino() {
    const rotatedTetromino = currentTetromino[0].map((_, index) =>
        currentTetromino.map(row => row[index])
    ).reverse();

    const previousTetromino = currentTetromino;
    currentTetromino = rotatedTetromino;

    if (collision()) {
        currentTetromino = previousTetromino; // Undo the rotation if there's a collision
    }
}

// Handle key events (Arrow Keys and Space)
document.addEventListener('keydown', (e) => {
    if (gameOver) return;  // Prevent actions if the game is over

    if (e.key === 'ArrowLeft') {
        currentX--;
        if (collision()) currentX++;
    } else if (e.key === 'ArrowRight') {
        currentX++;
        if (collision()) currentX--;
    } else if (e.key === 'ArrowDown') {
        moveTetromino();
    } else if (e.key === ' ') {
        e.preventDefault();
        rotateTetromino();
    }
});

// Clear completed lines and shift the board down
function clearLines() {
    for (let row = rowCount - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {  // Check if the row is full
            board.splice(row, 1);  // Remove the full row
            board.unshift(Array(columnCount).fill(0));  // Add a new empty row at the top
        }
    }
}

// Show the "Game Over" modal
function showGameOver() {
    const gameOverModal = document.createElement('div');
    gameOverModal.className = 'game-over-modal';
    gameOverModal.innerHTML = `
        <div class="modal-content">
            <h2>Game Over</h2>
            <p>Sorry, you lost!</p>
            <button onclick="restartGame()">Restart</button>
        </div>
    `;
    document.body.appendChild(gameOverModal);
}

// Restart the game
function restartGame() {
    document.querySelector('.game-over-modal').remove();
    board = Array.from({ length: rowCount }, () => Array(columnCount).fill(0));
    gameOver = false;
    newTetromino();
    gameLoop();
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    drawBoard();
    drawTetromino();
    moveTetromino();
    setTimeout(gameLoop, 500);
}
document.getElementById('play').addEventListener('click',()=>{
    // Start the game
    newTetromino();
    gameLoop();
})



