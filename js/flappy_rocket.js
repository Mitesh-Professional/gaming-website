const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("game-over");
const playButton = document.getElementById("play");

const rocketImage = new Image();
rocketImage.src = "../assets/game_images/rocket_icon.png"; // Rocket Image URL

const bgImage = new Image();
bgImage.src = "../assets/game_images/rocket_bg.jpeg"; // Background Image URL

let rocket = {
    x: 150,
    y: 200,
    width: 50,
    height: 50,
    velocity: 0,  // Initial velocity
    gravity: 0.05, // Slower fall speed
    lift: -0.5,     // Slower upward speed
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let pipeSpeed = 3;
let pipeInterval = 90;
let pipeTimer = 0;
let score = 0;

let gameRunning = false; // Game state flag, set to false initially

canvas.width = 800;
canvas.height = 600;

// Function to reset game state
function resetGame() {
    rocket.y = 200;               // Reset rocket's vertical position
    rocket.velocity = 0;          // Reset rocket's velocity (stopping it from continuously accelerating)
    pipes = [];                   // Clear the pipes array
    score = 0;                    // Reset the score
    pipeTimer = 0;                // Reset the pipe spawn timer
    gameRunning = true;           // Reset game running state to true
    gameOverScreen.classList.add("hidden"); // Hide the game over screen
    gameLoop();                   // Restart the game loop
}

// Game over logic
function gameOver() {
    gameRunning = false;          // Set game running to false when game is over
    gameOverScreen.classList.remove("hidden");
}

// Draw background image on canvas
function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// Draw rocket on canvas
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Draw pipes on canvas
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        ctx.fillStyle = "#2C3E50";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    }
}

// Create new pipe
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    const pipe = {
        x: canvas.width,
        topHeight: pipeHeight,
        bottomY: pipeHeight + pipeGap,
        scored: false // Initialize scored property
    };
    pipes.push(pipe);
}

// Move pipes towards the left
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Check for collisions with rocket or boundaries
function checkCollisions() {
    if (rocket.y + rocket.height > canvas.height || rocket.y < 0) {
        gameOver();
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (
            rocket.x + rocket.width > pipe.x &&
            rocket.x < pipe.x + pipeWidth &&
            (rocket.y < pipe.topHeight || rocket.y + rocket.height > pipe.bottomY)
        ) {
            gameOver();
        }
    }
}

// Update score based on pipe position
function updateScore() {
    pipeTimer++;
    if (pipeTimer >= pipeInterval) {
        createPipe();
        pipeTimer = 0;
    }

    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth < rocket.x && !pipe.scored) {
            score++;
            pipe.scored = true; // Mark this pipe as scored
        }
    });
}

// The main game loop that runs continuously
function gameLoop() {
    if (!gameRunning) return; // Stop the loop if the game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background first
    drawBackground();

    drawRocket();
    drawPipes();
    movePipes();
    checkCollisions();
    updateScore();

    rocket.velocity += rocket.gravity;
    rocket.y += rocket.velocity;

    // Display score on the canvas
    ctx.fillStyle = "#333";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    requestAnimationFrame(gameLoop);  // Keep the game loop running
}

// Wait for images to load before starting the game
rocketImage.onload = () => {
    bgImage.onload = () => {
        // Initially hide the game over screen
        gameOverScreen.classList.add("hidden");
    };
};

// Start game when play button is clicked
playButton.addEventListener("click", () => {
    gameRunning = true; // Enable the game
    playButton.classList.add("hidden"); // Hide the play button once clicked
    resetGame(); // Start the game
});

// Make the rocket go up when pressing the space key
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && gameRunning) {
        event.preventDefault(); 
        // Slow down the rocket's upward speed
        if (rocket.velocity > rocket.lift) {
            rocket.velocity = rocket.lift;  // Slow the upward movement
        }
        rocket.velocity -= 1; // Apply gradual lift effect
    }
});

// Restart button event listener
document.getElementById('restartBtn').addEventListener('click', (event)=>{
    document.getElementById('game-over').classList.add('hidden');
    resetGame()

});
// Close Button Event Listener
document.getElementById('gameOverClose').addEventListener('click', (event)=>{
    document.getElementById('play').classList.remove('hidden');
    document.getElementById('game-over').classList.add('hidden');
});

document.addEventListener("touchstart", function (event) {
    if (gameRunning) {
        event.preventDefault(); // Prevent default touch behavior (scrolling, zooming, etc.)
        
        // Slow down the rocket's upward speed
        if (rocket.velocity > rocket.lift) {
            rocket.velocity = rocket.lift;  // Slow the upward movement
        }
        rocket.velocity -= 1; // Apply gradual lift effect
    }
});