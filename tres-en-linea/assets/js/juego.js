const tresEnLinea = (() => {
  'use strict';
  let tablero = Array(9).fill('');
  let turno = 'X';
  let juegoActivo = true;
  let modoCPU = false;

  const tableroDiv = document.getElementById('tablero');
  const btnNuevo = document.getElementById('btnNuevo');
  const modoJuego = document.getElementById('modoJuego');
  const mensaje = document.getElementById('mensaje');

  const combinacionesGanadoras = [
    [0,1,2],[3,4,5],[6,7,8], // filas
    [0,3,6],[1,4,7],[2,5,8], // columnas
    [0,4,8],[2,4,6]          // diagonales
  ];

  const renderizarTablero = () => {
    tableroDiv.innerHTML = '';
    tablero.forEach((valor, idx) => {
      const celda = document.createElement('div');
      celda.className = 'celda';
      celda.textContent = valor;
      celda.dataset.idx = idx;
      celda.addEventListener('click', () => jugar(idx));
      tableroDiv.appendChild(celda);
    });
  };

  const jugar = (idx) => {
    if (!juegoActivo || tablero[idx]) return;
    tablero[idx] = turno;
    renderizarTablero();
    if (verificarVictoria(turno)) {
      mostrarMensaje(`¡${turno} gana!`);
      resaltarGanadoras(turno);
      juegoActivo = false;
      return;
    }
    if (tablero.every(c => c)) {
      mostrarMensaje('¡Empate!');
      juegoActivo = false;
      return;
    }
    turno = turno === 'X' ? 'O' : 'X';
    mostrarMensaje(`Turno de ${turno}`);
    if (modoCPU && turno === 'O' && juegoActivo) {
      setTimeout(jugadaCPU, 500);
    }
  };

  const jugadaCPU = () => {
    // IA simple: elige la primera casilla libre
    const idx = tablero.findIndex(c => !c);
    if (idx !== -1) jugar(idx);
  };

  const verificarVictoria = (jugador) => {
    return combinacionesGanadoras.some(comb =>
      comb.every(idx => tablero[idx] === jugador)
    );
  };

  const resaltarGanadoras = (jugador) => {
    combinacionesGanadoras.forEach(comb => {
      if (comb.every(idx => tablero[idx] === jugador)) {
        comb.forEach(idx => {
          tableroDiv.children[idx].classList.add('ganadora');
        });
      }
    });
  };

  const mostrarMensaje = (msg) => {
    mensaje.textContent = msg;
  };

  const reiniciar = () => {
    tablero = Array(9).fill('');
    turno = 'X';
    juegoActivo = true;
    renderizarTablero();
    mostrarMensaje('Turno de X');
  };

  btnNuevo.addEventListener('click', reiniciar);
  modoJuego.addEventListener('change', () => {
    modoCPU = modoJuego.value === 'cpu';
    reiniciar();
  });

  // Inicializar
  modoCPU = modoJuego.value === 'cpu';
  reiniciar();

  return {
    nuevoJuego: reiniciar
  };
})(); 