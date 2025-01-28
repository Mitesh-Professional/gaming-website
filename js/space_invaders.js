const canvas = document.getElementById('space-invaders');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 30,
    speed: 5,
    color: 'green',
};

const bullets = [];
const invaders = [];
let score = 0;
let gameOver = false;
let invaderDirection = 1; // 1 for right, -1 for left
let invaderMoveSpeed = 0.2;
let invaderVerticalMoveSpeed = 2;
let invaderInterval;
let gameInterval;

// Generate a random color for invaders
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Create random invader at a random position at the top
function createRandomInvader() {
    const col = Math.floor(Math.random() * 8); // Random column
    const heightOffset = Math.floor(Math.random() * canvas.height * 0.5); // Random height within the top half of the canvas
    invaders.push({
        x: 50 + col * 60,
        y: heightOffset,
        width: 40,
        height: 40,
        color: getRandomColor(),
    });
}

// Create invaders at the top
function createInitialInvaders() {
    invaders.length = 0; // Clear any existing invaders
    score = 0; // Reset score
    gameOver = false; // Reset game over flag
    invaderDirection = 1; // Reset invader direction to right
    invaderMoveSpeed = 0.2; // Reset invader horizontal speed
    invaderVerticalMoveSpeed = 2; // Reset invader vertical speed

    // Create 5 invaders initially at random heights
    for (let i = 0; i < 5; i++) {
        createRandomInvader();
    }

    // After 5 seconds, continue adding invaders at intervals
    invaderInterval = setInterval(() => {
        createRandomInvader();
    }, 5000); // New invader every 5 seconds
}

// Draw Player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw Bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'white';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Draw Invaders
function drawInvaders() {
    invaders.forEach(invader => {
        ctx.fillStyle = invader.color;
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
    });
}

// Move Player
function movePlayer() {
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
    if (rightPressed && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Move Bullets
function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });

    // Remove bullets that are out of bounds
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y <= 0) {
            bullets.splice(i, 1);
        }
    }
}

// Move Invaders
function moveInvaders() {
    let edgeReached = false;

    invaders.forEach(invader => {
        invader.x += invaderDirection * invaderMoveSpeed; // Horizontal movement

        // Check if invader hits the edge of the canvas
        if (invader.x + invader.width > canvas.width || invader.x < 0) {
            edgeReached = true;
        }
    });

    if (edgeReached) {
        // When edge is reached, move all invaders down and reverse direction
        invaders.forEach(invader => {
            invader.y += invaderVerticalMoveSpeed;
        });
        invaderDirection *= -1; // Reverse the direction
    }
}

// Check for collisions between bullets and invaders
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach((invader, invaderIndex) => {
            if (
                bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y
            ) {
                invaders.splice(invaderIndex, 1); // Remove invader from the array
                bullets.splice(bulletIndex, 1); // Remove the bullet from the array
                score += 10;
            }
        });
    });
}

// Check if the game is over
function checkGameOver() {
    invaders.forEach(invader => {
        if (invader.y + invader.height >= player.y) {
            gameOver = true; // Game Over if invaders reach player level
        }
    });
}

// Draw Score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Draw Game Over message
function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
}

// Game Update
function updateGame() {
    if (gameOver) {
        drawGameOver();
        clearInterval(invaderInterval); // Stop creating invaders after game over
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawInvaders();
    drawScore();
    movePlayer();
    moveBullets();
    moveInvaders();
    checkCollisions();
    checkGameOver();
}

// Player Movement
let leftPressed = false, rightPressed = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    }
    if (e.key === 'w' && bullets.length < 3 && !gameOver) {  // Replaced space with 'w' key
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 15,
            speed: 7,
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    }
});

// Start Game on Play Button Click
document.getElementById('play').addEventListener('click', () => {
    createInitialInvaders();
    score = 0; // Ensure the score is reset only when game starts
    gameOver = false; // Ensure the game over flag is reset
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(updateGame, 1000 / 60); // Start the game loop
});
