(function() {
  'use strict';

  const canvas = document.getElementById('pong-canvas');
  const ctx = canvas.getContext('2d');
  const playerScoreEl = document.getElementById('player-score');
  const cpuScoreEl = document.getElementById('cpu-score');
  const messageEl = document.getElementById('game-message');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 12;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 12;
  const PADDLE_SPEED = 6;
  const INITIAL_BALL_SPEED = 4;
  const WINNING_SCORE = 10;

  let gameRunning = false;
  let gameStarted = false;
  let animationId = null;

  let player = {
    x: 20,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0
  };

  let cpu = {
    x: CANVAS_WIDTH - 20 - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0
  };

  let ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    size: BALL_SIZE,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED
  };

  let keys = { w: false, s: false, up: false, down: false };

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  function draw() {
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function updatePlayer() {
    if ((keys.w || keys.up) && player.y > 0) {
      player.y -= PADDLE_SPEED;
    }
    if ((keys.s || keys.down) && player.y < CANVAS_HEIGHT - player.height) {
      player.y += PADDLE_SPEED;
    }
  }

  function updateCPU() {
    const ballCenterY = ball.y;
    const paddleCenterY = cpu.y + cpu.height / 2;
    
    if (ball.dx > 0) {
      if (ballCenterY < paddleCenterY - 10 && cpu.y > 0) {
        cpu.y -= PADDLE_SPEED * 0.8;
      } else if (ballCenterY > paddleCenterY + 10 && cpu.y < CANVAS_HEIGHT - cpu.height) {
        cpu.y += PADDLE_SPEED * 0.8;
      }
    }
  }

  function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.size / 2 <= 0 || ball.y + ball.size / 2 >= CANVAS_HEIGHT) {
      ball.dy = -ball.dy;
    }

    if (checkCollision(
      { x: ball.x - ball.size / 2, y: ball.y - ball.size / 2, width: ball.size, height: ball.size },
      player
    ) && ball.dx < 0) {
      ball.dx = -ball.dx;
      ball.x = player.x + player.width + ball.size / 2;
    }

    if (checkCollision(
      { x: ball.x - ball.size / 2, y: ball.y - ball.size / 2, width: ball.size, height: ball.size },
      cpu
    ) && ball.dx > 0) {
      ball.dx = -ball.dx;
      ball.x = cpu.x - ball.size / 2;
    }

    if (ball.x < 0) {
      cpu.score++;
      updateScore();
      resetBall(1);
    } else if (ball.x > CANVAS_WIDTH) {
      player.score++;
      updateScore();
      resetBall(-1);
    }
  }

  function resetBall(direction = 1) {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.dx = INITIAL_BALL_SPEED * direction;
    ball.dy = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }

  function updateScore() {
    playerScoreEl.textContent = player.score;
    cpuScoreEl.textContent = cpu.score;
    
    if (player.score >= WINNING_SCORE) {
      endGame('¡Felicitaciones! ¡Has ganado! 🎉');
    } else if (cpu.score >= WINNING_SCORE) {
      endGame('¡La CPU ha ganado! Inténtalo de nuevo 😞');
    }
  }

  function endGame(message) {
    gameRunning = false;
    gameStarted = false;
    showMessage(message, 'victory');
    startBtn.textContent = 'Nuevo Juego';
    pauseBtn.disabled = true;
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  function gameLoop() {
    if (!gameRunning) return;
    
    updatePlayer();
    updateCPU();
    updateBall();
    draw();
    
    animationId = requestAnimationFrame(gameLoop);
  }

  function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
  }

  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameRunning = true;
      resetGame();
      startBtn.textContent = 'Reiniciar';
      pauseBtn.disabled = false;
      showMessage('¡Juego iniciado! Usa W/S o las flechas para moverte', 'info');
      gameLoop();
    } else {
      resetGame();
      showMessage('Juego reiniciado', 'info');
    }
  }

  function togglePause() {
    if (gameRunning) {
      gameRunning = false;
      pauseBtn.textContent = 'Reanudar';
      showMessage('Juego pausado', 'paused');
    } else if (gameStarted) {
      gameRunning = true;
      pauseBtn.textContent = 'Pausar';
      showMessage('', 'info');
      gameLoop();
    }
  }

  function resetGame() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    player.score = 0;
    cpu.score = 0;
    player.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    cpu.y = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    
    resetBall();
    updateScore();
    draw();
    
    if (gameStarted && gameRunning) {
      gameLoop();
    }
  }

  startBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', function() {
    gameRunning = false;
    gameStarted = false;
    resetGame();
    startBtn.textContent = 'Iniciar Juego';
    pauseBtn.disabled = true;
    showMessage('Presiona "Iniciar Juego" para comenzar', 'info');
  });

  document.addEventListener('keydown', function(e) {
    switch(e.key.toLowerCase()) {
      case 'w':
        keys.w = true;
        e.preventDefault();
        break;
      case 's':
        keys.s = true;
        e.preventDefault();
        break;
      case 'arrowup':
        keys.up = true;
        e.preventDefault();
        break;
      case 'arrowdown':
        keys.down = true;
        e.preventDefault();
        break;
      case ' ':
        if (gameStarted) {
          togglePause();
        }
        e.preventDefault();
        break;
    }
  });

  document.addEventListener('keyup', function(e) {
    switch(e.key.toLowerCase()) {
      case 'w':
        keys.w = false;
        break;
      case 's':
        keys.s = false;
        break;
      case 'arrowup':
        keys.up = false;
        break;
      case 'arrowdown':
        keys.down = false;
        break;
    }
  });

  draw();
  showMessage('Presiona "Iniciar Juego" para comenzar', 'info');

})(); 