const serpiente = (() => {
  'use strict';
  const TAM = 20;
  const CELDA = 20;
  let serp = [];
  let direccion = 'RIGHT';
  let manzana = {x: 0, y: 0};
  let puntuacion = 0;
  let juegoActivo = true;
  let intervalo = null;
  let velocidad = 150;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const btnNuevo = document.getElementById('btnNuevo');
  const puntuacionSpan = document.getElementById('puntuacion');
  const mensaje = document.getElementById('mensaje');

  function iniciarJuego() {
    serp = [ {x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10} ];
    direccion = 'RIGHT';
    puntuacion = 0;
    juegoActivo = true;
    velocidad = 150;
    generarManzana();
    puntuacionSpan.textContent = 'Puntuación: 0';
    mensaje.textContent = '';
    clearInterval(intervalo);
    intervalo = setInterval(bucle, velocidad);
  }

  function bucle() {
    mover();
    dibujar();
  }

  function mover() {
    if (!juegoActivo) return;
    const cabeza = {...serp[0]};
    if (direccion === 'UP') cabeza.y--;
    if (direccion === 'DOWN') cabeza.y++;
    if (direccion === 'LEFT') cabeza.x--;
    if (direccion === 'RIGHT') cabeza.x++;
    // Colisión con bordes
    if (cabeza.x < 0 || cabeza.x >= TAM || cabeza.y < 0 || cabeza.y >= TAM) {
      finJuego();
      return;
    }
    // Colisión consigo misma
    if (serp.some(seg => seg.x === cabeza.x && seg.y === cabeza.y)) {
      finJuego();
      return;
    }
    serp.unshift(cabeza);
    // Comer manzana
    if (cabeza.x === manzana.x && cabeza.y === manzana.y) {
      puntuacion++;
      puntuacionSpan.textContent = `Puntuación: ${puntuacion}`;
      generarManzana();
      if (velocidad > 60) {
        velocidad -= 5;
        clearInterval(intervalo);
        intervalo = setInterval(bucle, velocidad);
      }
    } else {
      serp.pop();
    }
  }

  function generarManzana() {
    let nueva;
    do {
      nueva = {
        x: Math.floor(Math.random() * TAM),
        y: Math.floor(Math.random() * TAM)
      };
    } while (serp.some(seg => seg.x === nueva.x && seg.y === nueva.y));
    manzana = nueva;
  }

  function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibujar serpiente
    ctx.fillStyle = '#22c55e';
    serp.forEach((seg, i) => {
      ctx.fillRect(seg.x * CELDA, seg.y * CELDA, CELDA-2, CELDA-2);
    });
    // Dibujar manzana
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(manzana.x * CELDA + CELDA/2, manzana.y * CELDA + CELDA/2, CELDA/2-2, 0, 2*Math.PI);
    ctx.fill();
  }

  function finJuego() {
    juegoActivo = false;
    mensaje.textContent = `¡Fin del juego! Puntuación final: ${puntuacion}`;
    clearInterval(intervalo);
  }

  function cambiarDireccion(e) {
    if (!juegoActivo) return;
    if (e.key === 'ArrowUp' && direccion !== 'DOWN') direccion = 'UP';
    if (e.key === 'ArrowDown' && direccion !== 'UP') direccion = 'DOWN';
    if (e.key === 'ArrowLeft' && direccion !== 'RIGHT') direccion = 'LEFT';
    if (e.key === 'ArrowRight' && direccion !== 'LEFT') direccion = 'RIGHT';
  }

  btnNuevo.addEventListener('click', iniciarJuego);
  document.addEventListener('keydown', cambiarDireccion);

  // Inicializar
  iniciarJuego();

  return {
    nuevoJuego: iniciarJuego
  };
})(); 