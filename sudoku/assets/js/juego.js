const sudoku = (() => {
  'use strict';
  let tablero = [];
  let solucion = [];
  let celdas = [];

  const cuadriculaDiv = document.getElementById('cuadricula');
  const btnNuevo = document.getElementById('btnNuevo');
  const btnResolver = document.getElementById('btnResolver');
  const mensaje = document.getElementById('mensaje');

  function generarTableroBase() {
    const base = [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ];
    // Mezclar filas y columnas para variedad
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * 9);
      const b = Math.floor(Math.random() * 9);
      [base[a], base[b]] = [base[b], base[a]];
    }
    return base.map(fila => [...fila]);
  }

  function crearPuzzle(dificultad = 40) {
    solucion = generarTableroBase();
    tablero = solucion.map(fila => [...fila]);
    
    // Eliminar números para crear el puzzle
    let eliminados = 0;
    while (eliminados < dificultad) {
      const f = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (tablero[f][c] !== 0) {
        tablero[f][c] = 0;
        eliminados++;
      }
    }
  }

  function validarPosicion(f, c, num) {
    // Validar fila
    for (let i = 0; i < 9; i++) {
      if (i !== c && tablero[f][i] === num) return false;
    }
    // Validar columna
    for (let i = 0; i < 9; i++) {
      if (i !== f && tablero[i][c] === num) return false;
    }
    // Validar subcuadrícula 3x3
    const startF = Math.floor(f / 3) * 3;
    const startC = Math.floor(c / 3) * 3;
    for (let i = startF; i < startF + 3; i++) {
      for (let j = startC; j < startC + 3; j++) {
        if ((i !== f || j !== c) && tablero[i][j] === num) return false;
      }
    }
    return true;
  }

  function esCompleto() {
    for (let f = 0; f < 9; f++) {
      for (let c = 0; c < 9; c++) {
        if (tablero[f][c] === 0) return false;
      }
    }
    return true;
  }

  function renderizar() {
    cuadriculaDiv.innerHTML = '';
    celdas = [];
    for (let f = 0; f < 9; f++) {
      for (let c = 0; c < 9; c++) {
        const celda = document.createElement('div');
        celda.className = 'celda';
        
        if (solucion[f][c] === tablero[f][c] && tablero[f][c] !== 0) {
          celda.classList.add('fija');
          celda.textContent = tablero[f][c];
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'celda-input';
          input.maxLength = 1;
          input.value = tablero[f][c] === 0 ? '' : tablero[f][c];
          input.addEventListener('input', (e) => {
            const valor = parseInt(e.target.value) || 0;
            if (valor >= 1 && valor <= 9) {
              tablero[f][c] = valor;
              if (!validarPosicion(f, c, valor)) {
                celda.classList.add('error');
              } else {
                celda.classList.remove('error');
              }
              if (esCompleto()) {
                mensaje.textContent = '¡Felicidades! Has completado el Sudoku.';
              }
            } else {
              tablero[f][c] = 0;
              celda.classList.remove('error');
              e.target.value = '';
            }
          });
          celda.appendChild(input);
        }
        cuadriculaDiv.appendChild(celda);
        celdas.push(celda);
      }
    }
  }

  function resolver() {
    tablero = solucion.map(fila => [...fila]);
    renderizar();
    mensaje.textContent = 'Puzzle resuelto automáticamente.';
  }

  function nuevoPuzzle() {
    crearPuzzle();
    mensaje.textContent = '';
    renderizar();
  }

  btnNuevo.addEventListener('click', nuevoPuzzle);
  btnResolver.addEventListener('click', resolver);

  // Inicializar
  nuevoPuzzle();

  return {
    nuevoJuego: nuevoPuzzle
  };
})(); 