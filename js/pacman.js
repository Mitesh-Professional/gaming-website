// Basic setup for Pac-Man game
const canvas = document.getElementById('pacman-game');
const ctx = canvas.getContext('2d');

const pacman = {
    x: 200,
    y: 200,
    radius: 20,
    angleStart: 0.2 * Math.PI,
    angleEnd: 1.8 * Math.PI,
    speed: 2,
    color: 'yellow'
};

// Array to hold the balls (pellets)
let balls = [];

// Number of balls Pac-Man has eaten
let ballsEaten = 0;

// Create random balls within the canvas
function createRandomBall() {
    const x = Math.floor(Math.random() * (canvas.width - 10)) + 5;
    const y = Math.floor(Math.random() * (canvas.height - 10)) + 5;
    balls.push({ x, y, radius: 5, color: 'white' });
}

// Draw Pac-Man
function drawPacman() {
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, pacman.angleStart, pacman.angleEnd);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fillStyle = pacman.color;
    ctx.fill();
    ctx.closePath();
}

// Draw all the balls (pellets)
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Function to display the score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Balls Eaten: " + ballsEaten, 10, 30);
}

// Function to display the win message
function showWinMessage() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("You Win!", canvas.width / 2 - 75, canvas.height / 2);
}

// Update game elements (redraw Pac-Man and balls)
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawPacman();
    drawBalls();  // Draw all the balls
    drawScore();  // Display score
}

// Pac-Man movement logic
let moveLeft = false, moveRight = false, moveUp = false, moveDown = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveLeft = true;
        moveRight = false;
        moveUp = false;
        moveDown = false;
    }
    if (e.key === 'ArrowRight') {
        moveRight = true;
        moveLeft = false;
        moveUp = false;
        moveDown = false;
    }
    if (e.key === 'ArrowUp') {
        moveUp = true;
        moveLeft = false;
        moveRight = false;
        moveDown = false;
    }
    if (e.key === 'ArrowDown') {
        moveDown = true;
        moveLeft = false;
        moveRight = false;
        moveUp = false;
    }
});

// Move Pac-Man on the canvas
function movePacman() {
    // Left bound
    if (moveLeft && pacman.x - pacman.radius > 0) {
        pacman.x -= pacman.speed;
    }
    // Right bound
    if (moveRight && pacman.x + pacman.radius < canvas.width) {
        pacman.x += pacman.speed;
    }
    // Top bound
    if (moveUp && pacman.y - pacman.radius > 0) {
        pacman.y -= pacman.speed;
    }
    // Bottom bound
    if (moveDown && pacman.y + pacman.radius < canvas.height) {
        pacman.y += pacman.speed;
    }
}

// Check if Pac-Man eats a ball
function checkCollisions() {
    balls.forEach((ball, index) => {
        const distance = Math.sqrt((pacman.x - ball.x) ** 2 + (pacman.y - ball.y) ** 2);
        if (distance < pacman.radius + ball.radius) {
            balls.splice(index, 1);  // Remove the ball from the array
            ballsEaten += 1;  // Increment the balls eaten count
            console.log(`Balls Eaten: ${ballsEaten}`); // Log the count in the console
        }
    });
}

// Check if all balls are eaten and display win message
function checkWinCondition() {
    if (balls.length === 0) {
        showWinMessage();  // Show the win message if no balls are left
    }
}

// Start the game when the 'Play' button is clicked
document.getElementById('play').addEventListener('click', () => {
    // Create some random balls when the game starts
    for (let i = 0; i < 10; i++) {
        createRandomBall();
    }

    // Game loop: Update the game state at 60 FPS
    setInterval(() => {
        movePacman();
        checkCollisions(); // Check for Pac-Man eating balls
        updateGame();
        checkWinCondition(); // Check if the player has won
    }, 1000 / 60); // 60 FPS
});
