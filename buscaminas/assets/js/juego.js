const buscaminas = (() => {
  'use strict';
  const FILAS = 8;
  const COLUMNAS = 8;
  const MINAS = 10;
  let tablero = [];
  let reveladas = 0;
  let banderas = 0;
  let juegoActivo = true;
  let timer = null;
  let segundos = 0;

  const tableroDiv = document.getElementById('tablero');
  const btnNuevo = document.getElementById('btnNuevo');
  const minasRestantes = document.getElementById('minasRestantes');
  const tiempo = document.getElementById('tiempo');
  const mensaje = document.getElementById('mensaje');

  function crearTablero() {
    tablero = [];
    for (let f = 0; f < FILAS; f++) {
      const fila = [];
      for (let c = 0; c < COLUMNAS; c++) {
        fila.push({mina: false, revelada: false, bandera: false, numero: 0});
      }
      tablero.push(fila);
    }
    // Colocar minas
    let minasColocadas = 0;
    while (minasColocadas < MINAS) {
      const f = Math.floor(Math.random() * FILAS);
      const c = Math.floor(Math.random() * COLUMNAS);
      if (!tablero[f][c].mina) {
        tablero[f][c].mina = true;
        minasColocadas++;
      }
    }
    // Calcular números
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLUMNAS; c++) {
        if (!tablero[f][c].mina) {
          let n = 0;
          for (let df = -1; df <= 1; df++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (df === 0 && dc === 0) continue;
              const nf = f + df, nc = c + dc;
              if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS && tablero[nf][nc].mina) n++;
            }
          }
          tablero[f][c].numero = n;
        }
      }
    }
  }

  function renderizarTablero() {
    tableroDiv.innerHTML = '';
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLUMNAS; c++) {
        const celda = document.createElement('div');
        celda.className = 'celda';
        if (tablero[f][c].revelada) {
          celda.classList.add('revelada');
          if (tablero[f][c].mina) {
            celda.classList.add('bomba');
            celda.textContent = '💣';
          } else if (tablero[f][c].numero > 0) {
            celda.textContent = tablero[f][c].numero;
          }
        } else if (tablero[f][c].bandera) {
          celda.classList.add('bandera');
          celda.textContent = '🚩';
        }
        celda.addEventListener('click', e => descubrir(f, c));
        celda.addEventListener('contextmenu', e => {
          e.preventDefault();
          ponerBandera(f, c);
        });
        tableroDiv.appendChild(celda);
      }
    }
  }

  function descubrir(f, c) {
    if (!juegoActivo || tablero[f][c].revelada || tablero[f][c].bandera) return;
    tablero[f][c].revelada = true;
    reveladas++;
    if (tablero[f][c].mina) {
      mostrarMensaje('¡Perdiste! Tocaste una mina.');
      revelarTodo();
      juegoActivo = false;
      detenerTimer();
      return;
    }
    if (tablero[f][c].numero === 0) {
      // Descubrir en cascada
      for (let df = -1; df <= 1; df++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nf = f + df, nc = c + dc;
          if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS && !tablero[nf][nc].revelada) {
            descubrir(nf, nc);
          }
        }
      }
    }
    if (reveladas === FILAS * COLUMNAS - MINAS) {
      mostrarMensaje('¡Ganaste! Descubriste todas las casillas.');
      juegoActivo = false;
      detenerTimer();
      revelarTodo();
      return;
    }
    renderizarTablero();
  }

  function ponerBandera(f, c) {
    if (!juegoActivo || tablero[f][c].revelada) return;
    tablero[f][c].bandera = !tablero[f][c].bandera;
    banderas = tablero.flat().filter(celda => celda.bandera).length;
    minasRestantes.textContent = `Minas: ${MINAS - banderas}`;
    renderizarTablero();
  }

  function revelarTodo() {
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLUMNAS; c++) {
        tablero[f][c].revelada = true;
      }
    }
    renderizarTablero();
  }

  function mostrarMensaje(msg) {
    mensaje.textContent = msg;
  }

  function reiniciar() {
    crearTablero();
    reveladas = 0;
    banderas = 0;
    juegoActivo = true;
    mensaje.textContent = '';
    minasRestantes.textContent = `Minas: ${MINAS}`;
    segundos = 0;
    tiempo.textContent = 'Tiempo: 0s';
    renderizarTablero();
    detenerTimer();
    timer = setInterval(() => {
      segundos++;
      tiempo.textContent = `Tiempo: ${segundos}s`;
    }, 1000);
  }

  function detenerTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  btnNuevo.addEventListener('click', reiniciar);

  // Inicializar
  reiniciar();

  return {
    nuevoJuego: reiniciar
  };
})(); 