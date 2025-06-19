(function() {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestScoreEl = document.getElementById('best-score');
  const messageEl = document.getElementById('game-message');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  canvas.width = 400;
  canvas.height = 600;

  let gameRunning = false;
  let gameStarted = false;
  let score = 0;
  let bestScore = parseInt(localStorage.getItem('flappyBestScore') || '0');

  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const PIPE_WIDTH = 50;
  const PIPE_GAP = 150;
  const PIPE_SPEED = 2;
  const GROUND_HEIGHT = 50;

  let bird = {
    x: 80,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    rotation: 0
  };

  let pipes = [];
  let particles = [];

  bestScoreEl.textContent = bestScore;

  function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - PIPE_GAP - GROUND_HEIGHT - 50;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
      x: canvas.width,
      topHeight: height,
      bottomY: height + PIPE_GAP,
      bottomHeight: canvas.height - height - PIPE_GAP - GROUND_HEIGHT,
      passed: false,
      width: PIPE_WIDTH
    });
  }

  function createParticle(x, y, color) {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: color,
        life: 30,
        maxLife: 30
      });
    }
  }

  function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
    ctx.rotate(bird.rotation);
    
    // Cuerpo del pájaro
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bird.width);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.7, '#FFA500');
    gradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width/2, bird.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ojo
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(3, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(4, -4, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // Pico
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(bird.width/2 - 5, 0);
    ctx.lineTo(bird.width/2 + 5, 2);
    ctx.lineTo(bird.width/2 - 5, 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  function drawPipes() {
    pipes.forEach(pipe => {
      // Tubería superior
      ctx.fillStyle = '#228B22';
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      ctx.fillStyle = '#006400';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
      
      // Tubería inferior
      ctx.fillStyle = '#228B22';
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
      ctx.fillStyle = '#006400';
      ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
    });
  }

  function drawGround() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.fillRect(i, canvas.height - GROUND_HEIGHT + 10, 10, 5);
    }
  }

  function drawBackground() {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height - GROUND_HEIGHT);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
    
    // Nubes simples
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const x = (i * 150 + Date.now() * 0.01) % (canvas.width + 50) - 50;
      const y = 50 + i * 30;
      
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawParticles() {
    particles.forEach((particle, index) => {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, 3, 3);
      ctx.restore();
      
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2;
      particle.life--;
      
      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });
  }

  function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeText(score.toString(), canvas.width / 2, 50);
    ctx.fillText(score.toString(), canvas.width / 2, 50);
  }

  function draw() {
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawParticles();
    drawScore();
  }

  function updateBird() {
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    
    bird.rotation = Math.min(Math.PI / 6, bird.velocity * 0.1);
    
    if (bird.y + bird.height >= canvas.height - GROUND_HEIGHT) {
      bird.y = canvas.height - GROUND_HEIGHT - bird.height;
      gameOver();
    }
    
    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }
  }

  function updatePipes() {
    pipes.forEach((pipe, index) => {
      pipe.x -= PIPE_SPEED;
      
      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        score++;
        updateScore();
        createParticle(bird.x, bird.y, '#FFD700');
      }
      
      if (pipe.x + pipe.width < 0) {
        pipes.splice(index, 1);
      }
    });
    
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
      createPipe();
    }
  }

  function checkCollisions() {
    pipes.forEach(pipe => {
      if (bird.x + bird.width > pipe.x && 
          bird.x < pipe.x + pipe.width && 
          bird.y < pipe.topHeight) {
        gameOver();
      }
      
      if (bird.x + bird.width > pipe.x && 
          bird.x < pipe.x + pipe.width && 
          bird.y + bird.height > pipe.bottomY) {
        gameOver();
      }
    });
  }

  function updateScore() {
    scoreEl.textContent = score;
    scoreEl.classList.add('score-up');
    setTimeout(() => scoreEl.classList.remove('score-up'), 500);
  }

  function jump() {
    if (gameRunning) {
      bird.velocity = JUMP_FORCE;
      bird.rotation = -Math.PI / 6;
      createParticle(bird.x, bird.y + bird.height, '#87CEEB');
    }
  }

  function gameLoop() {
    if (!gameRunning) return;
    
    updateBird();
    updatePipes();
    checkCollisions();
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
      showMessage('¡Toca para volar!', 'info');
      gameLoop();
    } else {
      resetGame();
      showMessage('Juego reiniciado', 'info');
    }
  }

  function resetGame() {
    score = 0;
    bird.x = 80;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    bird.rotation = 0;
    
    pipes = [];
    particles = [];
    
    updateScore();
    draw();
    
    if (gameStarted && gameRunning) {
      gameLoop();
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

  function gameOver() {
    gameRunning = false;
    gameStarted = false;
    
    if (score > bestScore) {
      bestScore = score;
      bestScoreEl.textContent = bestScore;
      localStorage.setItem('flappyBestScore', bestScore.toString());
    }
    
    createParticle(bird.x + bird.width/2, bird.y + bird.height/2, '#FF0000');
    
    showGameOverModal();
    
    startBtn.textContent = 'Iniciar Juego';
    pauseBtn.disabled = true;
  }

  function showGameOverModal() {
    const finalStats = document.getElementById('final-stats');
    const medalsEl = document.getElementById('medals');
    const modal = document.getElementById('game-over-modal');
    
    if (finalStats && modal) {
      finalStats.innerHTML = `
        <div>Puntuación: <strong>${score}</strong></div>
        <div>Mejor Puntuación: <strong>${bestScore}</strong></div>
        <div>Tuberías Superadas: <strong>${score}</strong></div>
      `;
      
      let medals = '';
      if (score >= 100) medals += '<span class="medal">💎</span>';
      else if (score >= 50) medals += '<span class="medal">🥇</span>';
      else if (score >= 25) medals += '<span class="medal">🥈</span>';
      else if (score >= 10) medals += '<span class="medal">🥉</span>';
      
      if (medalsEl) medalsEl.innerHTML = medals;
      modal.style.display = 'flex';
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

  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function() {
      document.getElementById('game-over-modal').style.display = 'none';
      startGame();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    }
  });

  canvas.addEventListener('click', function(e) {
    e.preventDefault();
    if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  });

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  });

  // Inicialización
  draw();
  showMessage('Presiona "Iniciar Juego" para comenzar', 'info');

})(); 