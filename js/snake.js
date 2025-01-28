// Basic setup for Snake game
const canvas = document.getElementById("snake-game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

// Set up grid and colors
const blockSize = 20;
const rows = canvas.height / blockSize;
const columns = canvas.width / blockSize;

const snakeColor = "#00FF00";
const foodColor = "#FF0000";
const backgroundColor = "#000000";

let snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
]; // Snake starts with 3 blocks
let food = { x: 10, y: 10 };
let direction = 'RIGHT';
let score = 0;
let gameOver = false;

// Function to draw the snake
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === 'UP') head.y -= 1;
    if (direction === 'DOWN') head.y += 1;
    if (direction === 'LEFT') head.x -= 1;
    if (direction === 'RIGHT') head.x += 1;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove the last part of the snake
    }
}

// Function to check for collisions
function checkCollisions() {
    const head = snake[0];

    // Check wall collisions
    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
        gameOver = true;
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }
}

// Function to generate food at a random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows)
    };
}

// Function to reset the game
function restartGame() {
    // Remove the game over modal if it exists
    const gameOverModal = document.querySelector('.game-over-modal');
    if (gameOverModal) {
        gameOverModal.remove();
    }

    // Reset game variables
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = 'RIGHT';
    score = 0;
    gameOver = false;
    generateFood();

    // Restart the game loop
    gameLoop();
}

// Function to handle key events for controlling the snake
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Function to draw the game board
function drawBoard() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to display the game over screen
function showGameOver() {
    const gameOverModal = document.createElement('div');
    gameOverModal.className = 'game-over-modal';
    gameOverModal.innerHTML = `
        <div class="modal-content">
            <h2>Game Over</h2>
            <p>Your Score: ${score}</p>
            <button onclick="restartGame()">Restart</button>
        </div>
    `;
    document.body.appendChild(gameOverModal);
}

// Function to update the game loop
function gameLoop() {
    if (gameOver) {
        showGameOver();
        return;
    }

    drawBoard();
    drawSnake();
    drawFood();
    moveSnake();
    checkCollisions();

    setTimeout(gameLoop, 100); // Refresh the game every 100ms (speed of the snake)
}

// Start the game when the play button is clicked
document.getElementById('play').addEventListener('click', () => {
    restartGame();
});
