(function() {
  'use strict';

  // Configuración del tablero
  const FILAS = 20;
  const COLUMNAS = 10;
  const TAMAÑO_CELDA = 30;
  const CANVAS_WIDTH = COLUMNAS * TAMAÑO_CELDA;
  const CANVAS_HEIGHT = FILAS * TAMAÑO_CELDA;

  // Elementos del DOM
  const canvas = document.getElementById('tetris-canvas');
  const ctx = canvas.getContext('2d');
  const nextCanvas = document.getElementById('next-canvas');
  const nextCtx = nextCanvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const linesEl = document.getElementById('lines');
  const levelEl = document.getElementById('level');
  const gameOverModal = document.getElementById('game-over');
  const finalScoreEl = document.getElementById('final-score');
  const finalLinesEl = document.getElementById('final-lines');
  const finalLevelEl = document.getElementById('final-level');

  // Configurar canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  nextCanvas.width = 120;
  nextCanvas.height = 120;

  // Colores de las piezas
  const COLORES = {
    I: '#00f5ff',  // Cyan
    O: '#ffff00',  // Yellow
    T: '#a000ff',  // Purple
    S: '#00ff00',  // Green
    Z: '#ff0000',  // Red
    J: '#0000ff',  // Blue
    L: '#ff7f00',  // Orange
    vacio: '#000000',
    borde: '#333333'
  };

  // Definición de las piezas
  const PIEZAS = {
    I: [
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]]
    ],
    O: [
      [[1, 1],
       [1, 1]]
    ],
    T: [
      [[0, 1, 0],
       [1, 1, 1]],
      [[1, 0],
       [1, 1],
       [1, 0]],
      [[1, 1, 1],
       [0, 1, 0]],
      [[0, 1],
       [1, 1],
       [0, 1]]
    ],
    S: [
      [[0, 1, 1],
       [1, 1, 0]],
      [[1, 0],
       [1, 1],
       [0, 1]]
    ],
    Z: [
      [[1, 1, 0],
       [0, 1, 1]],
      [[0, 1],
       [1, 1],
       [1, 0]]
    ],
    J: [
      [[1, 0, 0],
       [1, 1, 1]],
      [[1, 1],
       [1, 0],
       [1, 0]],
      [[1, 1, 1],
       [0, 0, 1]],
      [[0, 1],
       [0, 1],
       [1, 1]]
    ],
    L: [
      [[0, 0, 1],
       [1, 1, 1]],
      [[1, 0],
       [1, 0],
       [1, 1]],
      [[1, 1, 1],
       [1, 0, 0]],
      [[1, 1],
       [0, 1],
       [0, 1]]
    ]
  };

  // Variables del juego
  let tablero = [];
  let piezaActual = null;
  let siguientePieza = null;
  let score = 0;
  let lineasCompletadas = 0;
  let nivel = 1;
  let velocidadCaida = 1000;
  let juegoActivo = false;
  let ultimoTiempo = 0;
  let intervalId = null;

  // Inicializar el tablero
  function inicializarTablero() {
    tablero = [];
    for (let fila = 0; fila < FILAS; fila++) {
      tablero[fila] = [];
      for (let col = 0; col < COLUMNAS; col++) {
        tablero[fila][col] = null;
      }
    }
  }

  // Crear una nueva pieza
  function crearPieza() {
    const tipos = Object.keys(PIEZAS);
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    return {
      tipo: tipo,
      forma: PIEZAS[tipo][0],
      rotacion: 0,
      x: Math.floor(COLUMNAS / 2) - Math.floor(PIEZAS[tipo][0][0].length / 2),
      y: 0
    };
  }

  // Verificar si una posición es válida
  function esPosicionValida(pieza, deltaX = 0, deltaY = 0, nuevaForma = null) {
    const forma = nuevaForma || pieza.forma;
    const nuevaX = pieza.x + deltaX;
    const nuevaY = pieza.y + deltaY;

    for (let fila = 0; fila < forma.length; fila++) {
      for (let col = 0; col < forma[fila].length; col++) {
        if (forma[fila][col]) {
          const x = nuevaX + col;
          const y = nuevaY + fila;

          // Verificar límites
          if (x < 0 || x >= COLUMNAS || y >= FILAS) {
            return false;
          }

          // Verificar colisión con piezas existentes
          if (y >= 0 && tablero[y][x]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // Rotar pieza
  function rotarPieza() {
    if (!piezaActual || !juegoActivo) return;

    const siguienteRotacion = (piezaActual.rotacion + 1) % PIEZAS[piezaActual.tipo].length;
    const nuevaForma = PIEZAS[piezaActual.tipo][siguienteRotacion];

    if (esPosicionValida(piezaActual, 0, 0, nuevaForma)) {
      piezaActual.forma = nuevaForma;
      piezaActual.rotacion = siguienteRotacion;
      dibujar();
    }
  }

  // Mover pieza
  function moverPieza(direccion) {
    if (!piezaActual || !juegoActivo) return;

    const deltaX = direccion === 'izquierda' ? -1 : direccion === 'derecha' ? 1 : 0;
    const deltaY = direccion === 'abajo' ? 1 : 0;

    if (esPosicionValida(piezaActual, deltaX, deltaY)) {
      piezaActual.x += deltaX;
      piezaActual.y += deltaY;
      dibujar();
      return true;
    }
    return false;
  }

  // Caída rápida
  function caidaRapida() {
    if (!piezaActual || !juegoActivo) return;

    while (moverPieza('abajo')) {
      score += 2;
    }
    actualizarStats();
  }

  // Fijar pieza en el tablero
  function fijarPieza() {
    if (!piezaActual) return;

    for (let fila = 0; fila < piezaActual.forma.length; fila++) {
      for (let col = 0; col < piezaActual.forma[fila].length; col++) {
        if (piezaActual.forma[fila][col]) {
          const x = piezaActual.x + col;
          const y = piezaActual.y + fila;
          if (y >= 0) {
            tablero[y][x] = piezaActual.tipo;
          }
        }
      }
    }

    // Verificar líneas completadas
    verificarLineasCompletadas();

    // Crear nueva pieza
    piezaActual = siguientePieza;
    siguientePieza = crearPieza();

    // Verificar game over
    if (!esPosicionValida(piezaActual)) {
      finalizarJuego();
    }
  }

  // Verificar líneas completadas
  function verificarLineasCompletadas() {
    let lineasEliminadas = 0;
    
    for (let fila = FILAS - 1; fila >= 0; fila--) {
      let lineaCompleta = true;
      for (let col = 0; col < COLUMNAS; col++) {
        if (!tablero[fila][col]) {
          lineaCompleta = false;
          break;
        }
      }

      if (lineaCompleta) {
        // Eliminar la línea
        tablero.splice(fila, 1);
        tablero.unshift(Array(COLUMNAS).fill(null));
        lineasEliminadas++;
        fila++; // Volver a verificar esta fila
      }
    }

    if (lineasEliminadas > 0) {
      // Calcular puntos
      const puntosPorLinea = [0, 100, 300, 500, 800];
      score += puntosPorLinea[lineasEliminadas] * nivel;
      lineasCompletadas += lineasEliminadas;

      // Aumentar nivel cada 10 líneas
      const nuevoNivel = Math.floor(lineasCompletadas / 10) + 1;
      if (nuevoNivel > nivel) {
        nivel = nuevoNivel;
        velocidadCaida = Math.max(100, 1000 - (nivel - 1) * 100);
      }

      actualizarStats();
    }
  }

  // Dibujar el juego
  function dibujar() {
    // Limpiar canvas
    ctx.fillStyle = COLORES.vacio;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dibujar grid
    ctx.strokeStyle = COLORES.borde;
    ctx.lineWidth = 1;
    for (let fila = 0; fila <= FILAS; fila++) {
      ctx.beginPath();
      ctx.moveTo(0, fila * TAMAÑO_CELDA);
      ctx.lineTo(CANVAS_WIDTH, fila * TAMAÑO_CELDA);
      ctx.stroke();
    }
    for (let col = 0; col <= COLUMNAS; col++) {
      ctx.beginPath();
      ctx.moveTo(col * TAMAÑO_CELDA, 0);
      ctx.lineTo(col * TAMAÑO_CELDA, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Dibujar piezas fijas
    for (let fila = 0; fila < FILAS; fila++) {
      for (let col = 0; col < COLUMNAS; col++) {
        if (tablero[fila][col]) {
          dibujarCelda(col, fila, COLORES[tablero[fila][col]]);
        }
      }
    }

    // Dibujar pieza actual
    if (piezaActual) {
      for (let fila = 0; fila < piezaActual.forma.length; fila++) {
        for (let col = 0; col < piezaActual.forma[fila].length; col++) {
          if (piezaActual.forma[fila][col]) {
            const x = piezaActual.x + col;
            const y = piezaActual.y + fila;
            if (y >= 0) {
              dibujarCelda(x, y, COLORES[piezaActual.tipo]);
            }
          }
        }
      }
    }

    // Dibujar siguiente pieza
    dibujarSiguientePieza();
  }

  // Dibujar una celda
  function dibujarCelda(x, y, color) {
    const pixelX = x * TAMAÑO_CELDA;
    const pixelY = y * TAMAÑO_CELDA;

    ctx.fillStyle = color;
    ctx.fillRect(pixelX + 1, pixelY + 1, TAMAÑO_CELDA - 2, TAMAÑO_CELDA - 2);

    // Efecto 3D
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(pixelX + 1, pixelY + 1, TAMAÑO_CELDA - 2, 3);
    ctx.fillRect(pixelX + 1, pixelY + 1, 3, TAMAÑO_CELDA - 2);
  }

  // Dibujar siguiente pieza
  function dibujarSiguientePieza() {
    nextCtx.fillStyle = COLORES.vacio;
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (siguientePieza) {
      const forma = siguientePieza.forma;
      const tamañoCelda = 20;
      const offsetX = (nextCanvas.width - forma[0].length * tamañoCelda) / 2;
      const offsetY = (nextCanvas.height - forma.length * tamañoCelda) / 2;

      for (let fila = 0; fila < forma.length; fila++) {
        for (let col = 0; col < forma[fila].length; col++) {
          if (forma[fila][col]) {
            const x = offsetX + col * tamañoCelda;
            const y = offsetY + fila * tamañoCelda;

            nextCtx.fillStyle = COLORES[siguientePieza.tipo];
            nextCtx.fillRect(x, y, tamañoCelda - 1, tamañoCelda - 1);

            // Efecto 3D
            nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            nextCtx.fillRect(x, y, tamañoCelda - 1, 2);
            nextCtx.fillRect(x, y, 2, tamañoCelda - 1);
          }
        }
      }
    }
  }

  // Actualizar estadísticas
  function actualizarStats() {
    scoreEl.textContent = score.toLocaleString();
    linesEl.textContent = lineasCompletadas;
    levelEl.textContent = nivel;
  }

  // Loop principal del juego
  function gameLoop() {
    if (!juegoActivo) return;

    if (!moverPieza('abajo')) {
      fijarPieza();
    }
  }

  // Inicializar juego
  function inicializarJuego() {
    inicializarTablero();
    piezaActual = crearPieza();
    siguientePieza = crearPieza();
    score = 0;
    lineasCompletadas = 0;
    nivel = 1;
    velocidadCaida = 1000;
    juegoActivo = true;

    actualizarStats();
    dibujar();
    gameOverModal.style.display = 'none';
    
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(gameLoop, velocidadCaida);

    document.getElementById('iniciar').textContent = 'Reiniciar';
    document.getElementById('pausar').disabled = false;
  }

  // Finalizar juego
  function finalizarJuego() {
    juegoActivo = false;
    
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    finalScoreEl.textContent = score.toLocaleString();
    finalLinesEl.textContent = lineasCompletadas;
    finalLevelEl.textContent = nivel;
    
    gameOverModal.style.display = 'flex';
    
    document.getElementById('iniciar').textContent = 'Iniciar';
    document.getElementById('pausar').disabled = true;
  }

  // Pausar/reanudar juego
  function pausarReanudar() {
    if (!piezaActual) return;
    
    if (juegoActivo) {
      juegoActivo = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.getElementById('pausar').textContent = 'Reanudar';
    } else {
      juegoActivo = true;
      intervalId = setInterval(gameLoop, velocidadCaida);
      document.getElementById('pausar').textContent = 'Pausar';
    }
  }

  // Event listeners
  document.getElementById('iniciar').addEventListener('click', inicializarJuego);
  document.getElementById('pausar').addEventListener('click', pausarReanudar);
  document.getElementById('restart-btn').addEventListener('click', inicializarJuego);

  // Controles de teclado
  document.addEventListener('keydown', function(e) {
    if (!juegoActivo) return;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moverPieza('izquierda');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moverPieza('derecha');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moverPieza('abajo');
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotarPieza();
        break;
      case ' ':
        e.preventDefault();
        caidaRapida();
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        pausarReanudar();
        break;
    }
  });

  // Inicialización
  inicializarTablero();
  dibujar();
  actualizarStats();
  document.getElementById('pausar').disabled = true;

})(); 