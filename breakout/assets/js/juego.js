(function() {
  'use strict';

  const canvas = document.getElementById('breakout-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const levelEl = document.getElementById('level');
  const messageEl = document.getElementById('game-message');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  canvas.width = 800;
  canvas.height = 600;

  let gameRunning = false;
  let gameStarted = false;
  let score = 0;
  let lives = 3;
  let level = 1;

  let paddle = {
    x: 350,
    y: 570,
    width: 100,
    height: 10,
    speed: 7
  };

  let ball = {
    x: 400,
    y: 550,
    dx: 4,
    dy: -4,
    size: 8,
    launched: false
  };

  let bricks = [];
  let keys = { left: false, right: false, a: false, d: false };

  const BRICK_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];

  function createBricks() {
    bricks = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        bricks.push({
          x: 80 + col * 80,
          y: 80 + row * 30,
          width: 75,
          height: 20,
          hits: row < 2 ? 2 : 1,
          color: BRICK_COLORS[row % BRICK_COLORS.length],
          visible: true,
          points: row < 2 ? 20 : 10
        });
      }
    }
  }

  function draw() {
    // Fondo
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar bloques
    bricks.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(brick.x, brick.y, brick.width, 3);
      }
    });

    // Dibujar paleta
    const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    paddleGradient.addColorStop(0, '#4ecdc4');
    paddleGradient.addColorStop(1, '#44a08d');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Dibujar pelota
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function updatePaddle() {
    if ((keys.left || keys.a) && paddle.x > 0) {
      paddle.x -= paddle.speed;
    }
    if ((keys.right || keys.d) && paddle.x < canvas.width - paddle.width) {
      paddle.x += paddle.speed;
    }
  }

  function updateBall() {
    if (!ball.launched) {
      ball.x = paddle.x + paddle.width / 2;
      return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Rebotes en paredes
    if (ball.x - ball.size <= 0 || ball.x + ball.size >= canvas.width) {
      ball.dx = -ball.dx;
      ball.x = Math.max(ball.size, Math.min(canvas.width - ball.size, ball.x));
    }
    
    if (ball.y - ball.size <= 0) {
      ball.dy = -ball.dy;
      ball.y = ball.size;
    }

    // Perder vida
    if (ball.y + ball.size >= canvas.height) {
      loseLife();
      return;
    }

    // Colisión con paleta
    if (ball.y + ball.size >= paddle.y && 
        ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
      
      const hitPos = (ball.x - paddle.x) / paddle.width;
      const angle = (hitPos - 0.5) * Math.PI / 3;
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      
      ball.dx = speed * Math.sin(angle);
      ball.dy = -speed * Math.cos(angle);
      ball.y = paddle.y - ball.size;
    }

    // Colisión con bloques
    bricks.forEach(brick => {
      if (brick.visible && 
          ball.x + ball.size >= brick.x && ball.x - ball.size <= brick.x + brick.width &&
          ball.y + ball.size >= brick.y && ball.y - ball.size <= brick.y + brick.height) {
        
        brick.hits--;
        if (brick.hits <= 0) {
          brick.visible = false;
          score += brick.points;
          updateStats();
        }

        // Determinar dirección del rebote
        const ballCenterX = ball.x;
        const ballCenterY = ball.y;
        const brickCenterX = brick.x + brick.width / 2;
        const brickCenterY = brick.y + brick.height / 2;

        const deltaX = ballCenterX - brickCenterX;
        const deltaY = ballCenterY - brickCenterY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
      }
    });

    checkLevelComplete();
  }

  function loseLife() {
    lives--;
    updateStats();
    
    if (lives <= 0) {
      endGame();
    } else {
      resetBall();
      showMessage(`Vidas restantes: ${lives}`, 'warning');
    }
  }

  function resetBall() {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - 20;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -4;
    ball.launched = false;
  }

  function checkLevelComplete() {
    const visibleBricks = bricks.filter(brick => brick.visible).length;
    if (visibleBricks === 0) {
      level++;
      updateStats();
      createBricks();
      resetBall();
      showMessage(`¡Nivel ${level}! Velocidad aumentada`, 'success');
      
      // Aumentar velocidad
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * 1.1;
      ball.dx = ball.dx / Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * speed;
      ball.dy = ball.dy / Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * speed;
    }
  }

  function updateStats() {
    scoreEl.textContent = score.toLocaleString();
    livesEl.textContent = lives;
    levelEl.textContent = level;
  }

  function gameLoop() {
    if (!gameRunning) return;
    
    updatePaddle();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameRunning = true;
      resetGame();
      startBtn.textContent = 'Reiniciar';
      pauseBtn.disabled = false;
      showMessage('Usa ← → o A D para mover. Espacio para lanzar', 'info');
      gameLoop();
    } else {
      resetGame();
      showMessage('Juego reiniciado', 'info');
    }
  }

  function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    paddle.x = 350;
    createBricks();
    resetBall();
    updateStats();
    draw();
    
    if (gameStarted && gameRunning) {
      gameLoop();
    }
  }

  function endGame() {
    gameRunning = false;
    gameStarted = false;
    startBtn.textContent = 'Iniciar Juego';
    pauseBtn.disabled = true;
    
    const finalStats = document.getElementById('final-stats');
    const modal = document.getElementById('game-over-modal');
    
    if (finalStats && modal) {
      finalStats.innerHTML = `
        <div>Puntuación Final: <strong>${score.toLocaleString()}</strong></div>
        <div>Nivel Alcanzado: <strong>${level}</strong></div>
        <div>Bloques Destruidos: <strong>${bricks.filter(b => !b.visible).length}</strong></div>
      `;
      modal.style.display = 'flex';
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

  function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    if (type !== 'paused' && text !== '') {
      setTimeout(() => {
        if (messageEl.textContent === text) {
          messageEl.textContent = '';
          messageEl.className = 'message';
        }
      }, 3000);
    }
  }

  // Event listeners
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

  // Modal de juego terminado
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function() {
      document.getElementById('game-over-modal').style.display = 'none';
      startGame();
    });
  }

  document.addEventListener('keydown', function(e) {
    switch(e.key.toLowerCase()) {
      case 'arrowleft':
        keys.left = true;
        e.preventDefault();
        break;
      case 'arrowright':
        keys.right = true;
        e.preventDefault();
        break;
      case 'a':
        keys.a = true;
        e.preventDefault();
        break;
      case 'd':
        keys.d = true;
        e.preventDefault();
        break;
      case ' ':
        if (!ball.launched && gameRunning) {
          ball.launched = true;
        } else if (gameStarted) {
          togglePause();
        }
        e.preventDefault();
        break;
    }
  });

  document.addEventListener('keyup', function(e) {
    switch(e.key.toLowerCase()) {
      case 'arrowleft': keys.left = false; break;
      case 'arrowright': keys.right = false; break;
      case 'a': keys.a = false; break;
      case 'd': keys.d = false; break;
    }
  });

  // Inicialización
  createBricks();
  draw();
  showMessage('Presiona "Iniciar Juego" para comenzar', 'info');

})(); 