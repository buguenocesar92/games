(function() {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const levelEl = document.getElementById('level');
  const bestScoreEl = document.getElementById('best-score');
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
  let bestScore = parseInt(localStorage.getItem('spaceInvadersBest') || '0');

  let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 30,
    speed: 5,
    lastShoot: 0,
    shootCooldown: 300
  };

  let playerBullets = [];
  let aliens = [];
  let alienBullets = [];
  let powerUps = [];
  let particles = [];
  let stars = [];

  let keys = { left: false, right: false, a: false, d: false, space: false };

  bestScoreEl.textContent = bestScore;

  function createStars() {
    stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1
      });
    }
  }

  function createAliens() {
    aliens = [];
    const rows = 5;
    const cols = 10;
    const alienWidth = 40;
    const alienHeight = 30;
    const padding = 10;
    const offsetX = (canvas.width - (cols * (alienWidth + padding))) / 2;
    const offsetY = 50;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        aliens.push({
          x: offsetX + col * (alienWidth + padding),
          y: offsetY + row * (alienHeight + padding),
          width: alienWidth,
          height: alienHeight,
          type: row < 2 ? 'advanced' : row < 4 ? 'medium' : 'basic',
          points: row < 2 ? 30 : row < 4 ? 20 : 10,
          alive: true,
          direction: 1,
          shootChance: row < 2 ? 0.002 : row < 4 ? 0.001 : 0.0005
        });
      }
    }
  }

  function createParticle(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: color,
        life: 30,
        maxLife: 30,
        size: Math.random() * 3 + 1
      });
    }
  }

  function createPowerUp(x, y) {
    const types = ['rapidFire', 'multiShot', 'shield', 'life'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    powerUps.push({
      x: x,
      y: y,
      width: 25,
      height: 25,
      type: type,
      vy: 2,
      color: type === 'life' ? '#ff0000' : 
             type === 'rapidFire' ? '#ffff00' :
             type === 'multiShot' ? '#ff00ff' : '#00ffff'
    });
  }

  function drawStars() {
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;
  }

  function drawPlayer() {
    // Cuerpo de la nave
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x + 15, player.y + 20, 20, 10);
    
    // Cabina
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(player.x + 20, player.y + 15, 10, 5);
    
    // Alas
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y + 25, 15, 5);
    ctx.fillRect(player.x + 35, player.y + 25, 15, 5);
    
    // Cañones
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(player.x + 10, player.y + 20, 3, 8);
    ctx.fillRect(player.x + 37, player.y + 20, 3, 8);
    
    // Efectos de propulsión
    if (Math.random() > 0.5) {
      ctx.fillStyle = '#ff4500';
      ctx.fillRect(player.x + 22, player.y + 30, 6, 3);
    }
  }

  function drawAliens() {
    aliens.forEach(alien => {
      if (!alien.alive) return;
      
      let color = alien.type === 'advanced' ? '#ff0000' :
                  alien.type === 'medium' ? '#ffff00' : '#00ff00';
      
      // Cuerpo del alienígena
      ctx.fillStyle = color;
      ctx.fillRect(alien.x + 5, alien.y + 10, 30, 15);
      
      // Ojos
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(alien.x + 10, alien.y + 15, 5, 5);
      ctx.fillRect(alien.x + 25, alien.y + 15, 5, 5);
      
      // Antenas
      ctx.fillStyle = color;
      ctx.fillRect(alien.x + 12, alien.y + 5, 2, 10);
      ctx.fillRect(alien.x + 26, alien.y + 5, 2, 10);
      
      // Patas (animadas)
      const legOffset = Math.sin(Date.now() * 0.01 + alien.x * 0.1) * 2;
      ctx.fillRect(alien.x + 8, alien.y + 25, 3, 5 + legOffset);
      ctx.fillRect(alien.x + 15, alien.y + 25, 3, 5 - legOffset);
      ctx.fillRect(alien.x + 22, alien.y + 25, 3, 5 + legOffset);
      ctx.fillRect(alien.x + 29, alien.y + 25, 3, 5 - legOffset);
    });
  }

  function drawBullets() {
    // Balas del jugador
    ctx.fillStyle = '#00ff00';
    playerBullets.forEach(bullet => {
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 5;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });
    
    // Balas de los alienígenas
    ctx.fillStyle = '#ff0000';
    alienBullets.forEach(bullet => {
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 5;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });
  }

  function drawPowerUps() {
    powerUps.forEach(powerUp => {
      ctx.fillStyle = powerUp.color;
      ctx.shadowColor = powerUp.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      ctx.shadowBlur = 0;
      
      // Icono del power-up
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const icon = powerUp.type === 'rapidFire' ? 'R' :
                   powerUp.type === 'multiShot' ? 'M' :
                   powerUp.type === 'shield' ? 'S' : 'L';
      ctx.fillText(icon, powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 4);
    });
  }

  function drawParticles() {
    particles.forEach((particle, index) => {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
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

  function drawUI() {
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 5;
    ctx.fillText(`SCORE: ${score}`, 20, 40);
    ctx.fillText(`LEVEL: ${level}`, 20, 70);
    
    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${lives}`, canvas.width - 20, 40);
    ctx.fillText(`BEST: ${bestScore}`, canvas.width - 20, 70);
    ctx.shadowBlur = 0;
  }

  function draw() {
    // Fondo negro
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
    drawPlayer();
    drawAliens();
    drawBullets();
    drawPowerUps();
    drawParticles();
    drawUI();
  }

  function updateStars() {
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
  }

  function updatePlayer() {
    if ((keys.left || keys.a) && player.x > 0) {
      player.x -= player.speed;
    }
    if ((keys.right || keys.d) && player.x < canvas.width - player.width) {
      player.x += player.speed;
    }
    
    if (keys.space && Date.now() - player.lastShoot > player.shootCooldown) {
      shoot();
      player.lastShoot = Date.now();
    }
  }

  function shoot() {
    playerBullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 7
    });
    
    createParticle(player.x + player.width / 2, player.y, '#00ff00', 3);
  }

  function updateBullets() {
    // Actualizar balas del jugador
    playerBullets = playerBullets.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > -bullet.height;
    });
    
    // Actualizar balas de alienígenas
    alienBullets = alienBullets.filter(bullet => {
      bullet.y += bullet.speed;
      return bullet.y < canvas.height;
    });
  }

  function updateAliens() {
    let shouldMoveDown = false;
    const aliveAliens = aliens.filter(alien => alien.alive);
    
    // Movimiento horizontal
    aliveAliens.forEach(alien => {
      alien.x += alien.direction * (0.5 + level * 0.1);
      
      if (alien.x > canvas.width - alien.width || alien.x < 0) {
        shouldMoveDown = true;
      }
      
      // Disparo aleatorio
      if (Math.random() < alien.shootChance * level) {
        alienBullets.push({
          x: alien.x + alien.width / 2 - 2,
          y: alien.y + alien.height,
          width: 4,
          height: 8,
          speed: 3 + level * 0.5
        });
      }
    });
    
    // Movimiento hacia abajo y cambio de dirección
    if (shouldMoveDown) {
      aliens.forEach(alien => {
        if (alien.alive) {
          alien.y += 20;
          alien.direction *= -1;
        }
      });
    }
  }

  function updatePowerUps() {
    powerUps = powerUps.filter(powerUp => {
      powerUp.y += powerUp.vy;
      
      // Colisión con jugador
      if (powerUp.x < player.x + player.width &&
          powerUp.x + powerUp.width > player.x &&
          powerUp.y < player.y + player.height &&
          powerUp.y + powerUp.height > player.y) {
        
        applyPowerUp(powerUp.type);
        createParticle(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, powerUp.color, 8);
        return false;
      }
      
      return powerUp.y < canvas.height;
    });
  }

  function applyPowerUp(type) {
    switch(type) {
      case 'rapidFire':
        player.shootCooldown = 100;
        setTimeout(() => { player.shootCooldown = 300; }, 10000);
        showMessage('¡Disparo rápido activado!', 'success');
        break;
      case 'multiShot':
        showMessage('¡Disparo múltiple activado!', 'success');
        break;
      case 'shield':
        showMessage('¡Escudo activado!', 'success');
        break;
      case 'life':
        lives++;
        updateStats();
        showMessage('¡Vida extra!', 'success');
        break;
    }
  }

  function checkCollisions() {
    // Balas del jugador vs alienígenas
    playerBullets.forEach((bullet, bulletIndex) => {
      aliens.forEach(alien => {
        if (alien.alive &&
            bullet.x < alien.x + alien.width &&
            bullet.x + bullet.width > alien.x &&
            bullet.y < alien.y + alien.height &&
            bullet.y + bullet.height > alien.y) {
          
          alien.alive = false;
          score += alien.points;
          playerBullets.splice(bulletIndex, 1);
          
          createParticle(alien.x + alien.width/2, alien.y + alien.height/2, '#ffff00', 10);
          
          // Posibilidad de crear power-up
          if (Math.random() < 0.1) {
            createPowerUp(alien.x + alien.width/2, alien.y + alien.height/2);
          }
          
          updateStats();
        }
      });
    });
    
    // Balas de alienígenas vs jugador
    alienBullets.forEach((bullet, bulletIndex) => {
      if (bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y) {
        
        lives--;
        alienBullets.splice(bulletIndex, 1);
        createParticle(player.x + player.width/2, player.y + player.height/2, '#ff0000', 15);
        
        if (lives <= 0) {
          gameOver();
        } else {
          updateStats();
          showMessage(`Vidas restantes: ${lives}`, 'warning');
        }
      }
    });
    
    // Verificar si todos los alienígenas fueron destruidos
    const aliveAliens = aliens.filter(alien => alien.alive);
    if (aliveAliens.length === 0) {
      nextLevel();
    }
    
    // Verificar si los alienígenas llegaron al jugador
    aliens.forEach(alien => {
      if (alien.alive && alien.y + alien.height >= player.y) {
        gameOver();
      }
    });
  }

  function nextLevel() {
    level++;
    createAliens();
    showMessage(`¡Nivel ${level}!`, 'success');
    
    // Incrementar dificultad
    aliens.forEach(alien => {
      alien.shootChance *= 1.2;
    });
  }

  function updateStats() {
    scoreEl.textContent = score.toLocaleString();
    livesEl.textContent = lives;
    levelEl.textContent = level;
  }

  function gameLoop() {
    if (!gameRunning) return;
    
    updateStars();
    updatePlayer();
    updateBullets();
    updateAliens();
    updatePowerUps();
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
      showMessage('¡Defiende la Tierra!', 'info');
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
    
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 60;
    player.shootCooldown = 300;
    
    playerBullets = [];
    alienBullets = [];
    powerUps = [];
    particles = [];
    
    createStars();
    createAliens();
    updateStats();
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
      localStorage.setItem('spaceInvadersBest', bestScore.toString());
    }
    
    showGameOverModal();
    
    startBtn.textContent = 'Iniciar Juego';
    pauseBtn.disabled = true;
  }

  function showGameOverModal() {
    const finalStats = document.getElementById('final-stats');
    const achievementsEl = document.getElementById('achievements');
    const modal = document.getElementById('game-over-modal');
    
    if (finalStats && modal) {
      finalStats.innerHTML = `
        <div>Puntuación Final: <strong>${score.toLocaleString()}</strong></div>
        <div>Nivel Alcanzado: <strong>${level}</strong></div>
        <div>Alienígenas Eliminados: <strong>${aliens.filter(a => !a.alive).length}</strong></div>
        <div>Mejor Puntuación: <strong>${bestScore.toLocaleString()}</strong></div>
      `;
      
      // Mostrar logros
      let achievements = '';
      if (score >= 5000) achievements += '<span class="achievement">🎯</span>';
      if (level >= 10) achievements += '<span class="achievement">🚀</span>';
      if (aliens.filter(a => !a.alive).length >= 500) achievements += '<span class="achievement">💥</span>';
      
      if (achievementsEl) achievementsEl.innerHTML = achievements;
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
        keys.space = true;
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
      case ' ': keys.space = false; break;
    }
  });

  // Inicialización
  createStars();
  createAliens();
  updateStats();
  draw();
  showMessage('Presiona "Iniciar Juego" para comenzar', 'info');

})();
