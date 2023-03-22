/**
 * Canvas and Context
 */
const keyPressed = {};
const canvas = document.getElementById('container');
const context = canvas.getContext('2d');
sessionStorage.setItem('winner', 'None');

/**
 * Objects
 */
const ball = {
  radius: 6,
  positionX: canvas.width / 2 + 6,
  positionY: canvas.height / 2 + 6,
  velocityX: 2,
  velocityY: 2,
  color: '#ffb3ba',
};

const leftPlayer = {
  height: 25,
  width: 10,
  positionX: 10,
  positionY: canvas.height / 2 - 100 / 2,
  color: '#bae1ff',
  player: 'user',
  score: 0,
  previousScore: 0,
  speed: 4,
};

const rightPlayer = {
  height: 25,
  width: 10,
  positionX: canvas.width - 20,
  positionY: canvas.height / 2 - 100 / 2,
  color: '#bae1ff',
  player: 'ai',
  score: 0,
  previousScore: 0,
  speed: 4,
  aiMove: function() {
    const ballPos = ball.positionY;
    const paddlePos = rightPlayer.positionY + rightPlayer.height / 2;
    const dist = ballPos - paddlePos;
    if (dist < 0 && rightPlayer.positionY > 0) {
      rightPlayer.positionY -= rightPlayer.speed;
    } else if (dist > 0 && rightPlayer.positionY + rightPlayer.height < canvas.height) {
      rightPlayer.positionY += rightPlayer.speed;
    }
  }
};

/**
 * Game
 */
const game = {
  topScore: 20,
  speedIncreaseHit: 3,
};

let activated = true;

/**
 * Key Listeners
 */
document.addEventListener(
  'keydown',
  (event) => {
    const code = event.code;

    if (code === 'KeyS') {
      keyPressed['S'] = true;
    }
    if (code === 'KeyW') {
      keyPressed['W'] = true;
    }
    if (code === 'ArrowUp') {
      keyPressed['Up'] = true;
    }
    if (code === 'ArrowDown') {
      keyPressed['Down'] = true;
    }
  },
  false
);

document.addEventListener(
  'keyup',
  (event) => {
    const code = event.code;

    if (code === 'KeyS') {
      keyPressed['S'] = false;
    }
    if (code === 'KeyW') {
      keyPressed['W'] = false;
    }
    if (code === 'ArrowUp') {
      keyPressed['Up'] = false;
    }
    if (code === 'ArrowDown') {
      keyPressed['Down'] = false;
    }
  },
  false
);

/**
 * Update and Draw
 */
function drawLeftPlayer() {
  context.beginPath();
  context.fillStyle = leftPlayer.color;
  context.rect(leftPlayer.positionX, leftPlayer.positionY, leftPlayer.width, leftPlayer.height);
  context.fill();
  context.closePath();
}

function drawRightPlayer() {
  context.beginPath();
  context.fillStyle = rightPlayer.color;
  context.rect(rightPlayer.positionX, rightPlayer.positionY, rightPlayer.width, rightPlayer.height);
  context.fill();
  context.closePath();
}

function drawBall() {
    // Check for collisions with left wall
    if (ball.positionX - ball.radius <= 0) {
      resetBall();
      rightPlayer.score++;
      updateScore();
    }
    // Check for collisions with right wall
    if (ball.positionX + ball.radius >= canvas.width) {
      resetBall();
      leftPlayer.score++;
      updateScore();
    }
    
    context.beginPath();
    context.fillStyle = ball.color;
    context.arc(ball.positionX, ball.positionY, ball.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  }
  
  function resetBall() {
    ball.positionX = canvas.width / 2 + 6;
    ball.positionY = canvas.height / 2 + 6;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
  }
  
  function updateScore() {
    const leftScore = leftPlayer.score;
    const rightScore = rightPlayer.score;
    
    if (leftScore >= game.topScore) {
      endGame('user');
    } else if (rightScore >= game.topScore) {
      endGame('ai');
    }
    
    const leftScoreElement = document.getElementById('left-score');
    const rightScoreElement = document.getElementById('right-score');
    
    leftScoreElement.textContent = leftScore;
    rightScoreElement.textContent = rightScore;
    // Display message when someone scores
  if (leftScore !== leftPlayer.previousScore) {
    alert(`${leftPlayer.player} scored a point!`);
    leftPlayer.previousScore = leftScore;
  }
  if (rightScore !== rightPlayer.previousScore) {
    alert(`${rightPlayer.player} scored a point!`);
    rightPlayer.previousScore = rightScore;
  }
}

  function endGame(winner) {
    activated = false;
    sessionStorage.setItem('winner', winner);
    alert(`${winner} wins!`);
  }
  

function draw() {
context.clearRect(0,0,canvas.width, canvas.height);
drawLeftPlayer();
drawRightPlayer();
drawBall();
updateScore();
}

function update() {
// Move ball
ball.positionX += ball.velocityX;
ball.positionY += ball.velocityY;

// Bounce ball off top and bottom
if (ball.positionY + ball.velocityY < ball.radius || ball.positionY + ball.velocityY > canvas.height - ball.radius) {
ball.velocityY = -ball.velocityY;
}

// Bounce ball off left paddle
if (
ball.positionX - ball.radius < leftPlayer.positionX + leftPlayer.width &&
ball.positionY + ball.radius > leftPlayer.positionY &&
ball.positionY - ball.radius < leftPlayer.positionY + leftPlayer.height
) {
ball.velocityX = -ball.velocityX;
hits++;
if (hits % game.speedIncreaseHit === 0) {
ball.velocityX < 0 ? (ball.velocityX -= 1) : (ball.velocityX += 1);
ball.velocityY < 0 ? (ball.velocityY -= 1) : (ball.velocityY += 1);
}
}

// Bounce ball off right paddle
if (
ball.positionX + ball.radius > rightPlayer.positionX &&
ball.positionY + ball.radius > rightPlayer.positionY &&
ball.positionY - ball.radius < rightPlayer.positionY + rightPlayer.height
) {
ball.velocityX = -ball.velocityX;
hits++;
if (hits % game.speedIncreaseHit === 0) {
ball.velocityX < 0 ? (ball.velocityX -= 1) : (ball.velocityX += 1);
ball.velocityY < 0 ? (ball.velocityY -= 1) : (ball.velocityY += 1);
}
}

// Move left paddle
if (keyPressed['W'] && leftPlayer.positionY > 0) {
leftPlayer.positionY -= leftPlayer.speed;
} else if (keyPressed['S'] && leftPlayer.positionY + leftPlayer.height < canvas.height) {
leftPlayer.positionY += leftPlayer.speed;
}

// Move right paddle
rightPlayer.aiMove();

// Check for winner
if (ball.positionX + ball.radius > canvas.width) {
leftPlayer.score++;
sessionStorage.setItem('winner', leftPlayer.player);
reset();
} else if (ball.positionX - ball.radius < 0) {
rightPlayer.score++;
sessionStorage.setItem('winner', rightPlayer.player);
reset();
}
}

function reset() {
ball.positionX = canvas.width / 2 + 6;
ball.positionY = canvas.height / 2 + 6;
ball.velocityX = -ball.velocityX;
ball.velocityY = 2;
}

/**

Start Game
*/
function startGame() {
setInterval(() => {
if (activated) {
update();
draw();
}
}, 1000 / 60);
}
startGame();