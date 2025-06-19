const conecta4 = (() => {
  'use strict';
  const FILAS = 6;
  const COLUMNAS = 7;
  let tablero = [];
  let jugadorActual = 1;
  let juegoActivo = true;

  const tableroDiv = document.getElementById('tablero');
  const turnoSpan = document.getElementById('turno');
  const btnNuevo = document.getElementById('btnNuevo');
  const mensaje = document.getElementById('mensaje');

  function inicializar() {
    tablero = Array.from({length: FILAS}, () => Array(COLUMNAS).fill(0));
    jugadorActual = 1;
    juegoActivo = true;
    mensaje.textContent = '';
    turnoSpan.textContent = 'Turno: Jugador 1';
  }

  function renderizar() {
    tableroDiv.innerHTML = '';
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLUMNAS; c++) {
        const celda = document.createElement('div');
        celda.className = 'celda';
        celda.dataset.columna = c;
        
        if (tablero[f][c] === 1) {
          celda.classList.add('jugador1');
        } else if (tablero[f][c] === 2) {
          celda.classList.add('jugador2');
        }
        
        celda.addEventListener('click', () => soltarFicha(c));
        tableroDiv.appendChild(celda);
      }
    }
  }

  function soltarFicha(columna) {
    if (!juegoActivo) return;
    
    // Buscar la fila más baja disponible en la columna
    for (let f = FILAS - 1; f >= 0; f--) {
      if (tablero[f][columna] === 0) {
        tablero[f][columna] = jugadorActual;
        renderizar();
        
        if (verificarVictoria(f, columna, jugadorActual)) {
          mensaje.textContent = `¡Jugador ${jugadorActual} gana!`;
          resaltarGanadoras(f, columna, jugadorActual);
          juegoActivo = false;
          return;
        }
        
        if (tableroLleno()) {
          mensaje.textContent = '¡Empate! Tablero lleno.';
          juegoActivo = false;
          return;
        }
        
        jugadorActual = jugadorActual === 1 ? 2 : 1;
        turnoSpan.textContent = `Turno: Jugador ${jugadorActual}`;
        return;
      }
    }
  }

  function verificarVictoria(fila, columna, jugador) {
    const direcciones = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];
    
    for (const [df, dc] of direcciones) {
      let cuenta = 1; // Incluir la ficha actual
      
      // Contar en dirección positiva
      for (let i = 1; i < 4; i++) {
        const nf = fila + df * i;
        const nc = columna + dc * i;
        if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS && tablero[nf][nc] === jugador) {
          cuenta++;
        } else {
          break;
        }
      }
      
      // Contar en dirección negativa
      for (let i = 1; i < 4; i++) {
        const nf = fila - df * i;
        const nc = columna - dc * i;
        if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS && tablero[nf][nc] === jugador) {
          cuenta++;
        } else {
          break;
        }
      }
      
      if (cuenta >= 4) return true;
    }
    
    return false;
  }

  function resaltarGanadoras(fila, columna, jugador) {
    const direcciones = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    
    for (const [df, dc] of direcciones) {
      const fichas = [{f: fila, c: columna}];
      
      // Buscar en ambas direcciones
      for (let dir of [-1, 1]) {
        for (let i = 1; i < 4; i++) {
          const nf = fila + df * i * dir;
          const nc = columna + dc * i * dir;
          if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS && tablero[nf][nc] === jugador) {
            fichas.push({f: nf, c: nc});
          } else {
            break;
          }
        }
      }
      
      if (fichas.length >= 4) {
        fichas.forEach(pos => {
          const idx = pos.f * COLUMNAS + pos.c;
          tableroDiv.children[idx].classList.add('ganadora');
        });
        return;
      }
    }
  }

  function tableroLleno() {
    return tablero[0].every(celda => celda !== 0);
  }

  function nuevoJuego() {
    inicializar();
    renderizar();
  }

  btnNuevo.addEventListener('click', nuevoJuego);

  // Inicializar
  nuevoJuego();

  return {
    nuevoJuego: nuevoJuego
  };
})(); 