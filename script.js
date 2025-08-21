const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;

// Paddle settings
const leftPaddle = { x: 20, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, speed: 0 };
const rightPaddle = { x: WIDTH - 20 - PADDLE_WIDTH, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT, speed: 5 };

// Ball settings
let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  speedX: 5 * (Math.random() < 0.5 ? 1 : -1),
  speedY: 4 * (Math.random() < 0.5 ? 1 : -1),
};

let leftScore = 0;
let rightScore = 0;

// Mouse controls for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2));
});

// Draw everything
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Middle line
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = '#00ffcc';
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Left paddle
  ctx.fillStyle = '#00ffcc';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

  // Right paddle
  ctx.fillStyle = '#ff0077';
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Ball
  ctx.fillStyle = '#fff';
  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function resetBall(direction = 1) {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.speedX = 5 * direction * (Math.random() < 0.5 ? 1 : -1);
  ball.speedY = 4 * (Math.random() < 0.5 ? 1 : -1);
}

// Basic AI for right paddle
function moveRightPaddle() {
  const paddleCenter = rightPaddle.y + PADDLE_HEIGHT / 2;
  if (ball.y + BALL_SIZE / 2 < paddleCenter - 10) {
    rightPaddle.y -= rightPaddle.speed;
  } else if (ball.y + BALL_SIZE / 2 > paddleCenter + 10) {
    rightPaddle.y += rightPaddle.speed;
  }
  rightPaddle.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddle.y));
}

function updateBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Top and bottom collision
  if (ball.y <= 0 || ball.y + BALL_SIZE >= HEIGHT) {
    ball.speedY *= -1;
    ball.y = Math.max(0, Math.min(HEIGHT - BALL_SIZE, ball.y));
  }

  // Left paddle collision
  if (
    ball.x <= leftPaddle.x + leftPaddle.width &&
    ball.y + BALL_SIZE >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.height
  ) {
    ball.x = leftPaddle.x + leftPaddle.width;
    ball.speedX *= -1;
    // Add paddle spin
    let impact = (ball.y + BALL_SIZE / 2) - (leftPaddle.y + PADDLE_HEIGHT / 2);
    ball.speedY += impact * 0.12;
  }

  // Right paddle collision
  if (
    ball.x + BALL_SIZE >= rightPaddle.x &&
    ball.y + BALL_SIZE >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.height
  ) {
    ball.x = rightPaddle.x - BALL_SIZE;
    ball.speedX *= -1;
    // Add paddle spin
    let impact = (ball.y + BALL_SIZE / 2) - (rightPaddle.y + PADDLE_HEIGHT / 2);
    ball.speedY += impact * 0.12;
  }

  // Score for right player
  if (ball.x < 0) {
    rightScore++;
    document.getElementById('rightScore').innerText = rightScore;
    resetBall(1);
  }

  // Score for left player
  if (ball.x + BALL_SIZE > WIDTH) {
    leftScore++;
    document.getElementById('leftScore').innerText = leftScore;
    resetBall(-1);
  }
}

function gameLoop() {
  moveRightPaddle();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

draw(); // Initial draw
gameLoop(); // Start the game