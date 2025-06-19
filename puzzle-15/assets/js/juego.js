const puzzle15 = (() => {
  'use strict';
  let tablero = [];
  let movimientos = 0;
  let espacioVacio = {f: 3, c: 3};

  const cuadriculaDiv = document.getElementById('cuadricula');
  const movimientosSpan = document.getElementById('movimientos');
  const btnNuevo = document.getElementById('btnNuevo');
  const mensaje = document.getElementById('mensaje');

  function inicializar() {
    tablero = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 0]
    ];
    espacioVacio = {f: 3, c: 3};
    movimientos = 0;
    movimientosSpan.textContent = 'Movimientos: 0';
    mensaje.textContent = '';
  }

  function barajar() {
    // Realizar movimientos aleatorios válidos para barajar
    for (let i = 0; i < 500; i++) {
      const movimientosValidos = obtenerMovimientosValidos();
      if (movimientosValidos.length > 0) {
        const movimiento = movimientosValidos[Math.floor(Math.random() * movimientosValidos.length)];
        moverFicha(movimiento.f, movimiento.c, false);
      }
    }
    movimientos = 0;
    movimientosSpan.textContent = 'Movimientos: 0';
  }

  function obtenerMovimientosValidos() {
    const movimientos = [];
    const {f, c} = espacioVacio;
    
    // Arriba
    if (f > 0) movimientos.push({f: f - 1, c: c});
    // Abajo
    if (f < 3) movimientos.push({f: f + 1, c: c});
    // Izquierda
    if (c > 0) movimientos.push({f: f, c: c - 1});
    // Derecha
    if (c < 3) movimientos.push({f: f, c: c + 1});
    
    return movimientos;
  }

  function moverFicha(f, c, contarMovimiento = true) {
    const {f: vf, c: vc} = espacioVacio;
    
    // Verificar si el movimiento es válido (adyacente al espacio vacío)
    if (Math.abs(f - vf) + Math.abs(c - vc) !== 1) return false;
    
    // Intercambiar la ficha con el espacio vacío
    tablero[vf][vc] = tablero[f][c];
    tablero[f][c] = 0;
    espacioVacio = {f: f, c: c};
    
    if (contarMovimiento) {
      movimientos++;
      movimientosSpan.textContent = `Movimientos: ${movimientos}`;
      
      if (esVictoria()) {
        mensaje.textContent = `¡Felicidades! Completaste el puzzle en ${movimientos} movimientos.`;
      }
    }
    
    return true;
  }

  function esVictoria() {
    let esperado = 1;
    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 4; c++) {
        if (f === 3 && c === 3) {
          return tablero[f][c] === 0;
        }
        if (tablero[f][c] !== esperado) return false;
        esperado++;
      }
    }
    return true;
  }

  function renderizar() {
    cuadriculaDiv.innerHTML = '';
    for (let f = 0; f < 4; f++) {
      for (let c = 0; c < 4; c++) {
        const ficha = document.createElement('div');
        ficha.className = 'ficha';
        
        if (tablero[f][c] === 0) {
          ficha.classList.add('vacia');
        } else {
          ficha.textContent = tablero[f][c];
          ficha.addEventListener('click', () => {
            moverFicha(f, c);
            renderizar();
          });
        }
        
        cuadriculaDiv.appendChild(ficha);
      }
    }
  }

  function nuevoJuego() {
    inicializar();
    barajar();
    renderizar();
  }

  btnNuevo.addEventListener('click', nuevoJuego);

  // Inicializar
  nuevoJuego();

  return {
    nuevoJuego: nuevoJuego
  };
})(); 