(function() {
  'use strict';

  const palabras = [
    'JAVASCRIPT', 'PROGRAMAR', 'COMPUTADORA', 'INTERNET', 'DESARROLLO',
    'CODIGO', 'FUNCIONES', 'VARIABLES', 'OBJETOS', 'ARRAYS',
    'ALGORITMO', 'BROWSER', 'FRONTEND', 'BACKEND', 'DATABASE',
    'SERVIDOR', 'CLIENTE', 'PROTOCOLO', 'FRAMEWORK', 'BIBLIOTECA',
    'RESPONSIVE', 'ANIMATION', 'INTERFACE', 'USUARIO', 'EXPERIENCIA',
    'CREATIVIDAD', 'INNOVACION', 'TECNOLOGIA', 'SOLUCION', 'PROYECTO'
  ];

  const dibujos = [
    '',
    '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  |   |\n      |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  |   |\n  O   |\n      |\n      |\n=========',
    '  +---+\n  |   |\n  |   |\n  O   |\n  |   |\n      |\n=========',
    '  +---+\n  |   |\n  |   |\n  O   |\n /|   |\n      |\n=========',
    '  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n      |\n=========',
    '  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n /    |\n=========',
    '  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n / \\  |\n========='
  ];

  let palabraActual = '';
  let letrasAdivinadas = [];
  let letrasIncorrectas = [];
  let intentosFallidos = 0;
  const maxIntentos = 6;
  let juegoTerminado = false;

  // Elementos del DOM
  const dibujoEl = document.getElementById('dibujo');
  const palabraEl = document.getElementById('palabra');
  const tecladoEl = document.getElementById('teclado');
  const intentosEl = document.getElementById('intentos');
  const mensajeEl = document.getElementById('mensaje');
  const btnNuevo = document.getElementById('btnNuevo');

  function inicializarJuego() {
    palabraActual = palabras[Math.floor(Math.random() * palabras.length)];
    letrasAdivinadas = [];
    letrasIncorrectas = [];
    intentosFallidos = 0;
    juegoTerminado = false;
    
    actualizarDisplay();
    crearTeclado();
    mostrarMensaje('¡Adivina la palabra!', 'info');
  }

  function crearTeclado() {
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    tecladoEl.innerHTML = '';
    
    for (let letra of letras) {
      const tecla = document.createElement('button');
      tecla.className = 'tecla';
      tecla.textContent = letra;
      tecla.addEventListener('click', () => manejarClick(letra));
      tecladoEl.appendChild(tecla);
    }
  }

  function manejarClick(letra) {
    if (juegoTerminado) return;
    
    const tecla = [...tecladoEl.children].find(t => t.textContent === letra);
    if (tecla.classList.contains('usada')) return;
    
    tecla.classList.add('usada');
    
    if (palabraActual.includes(letra)) {
      letrasAdivinadas.push(letra);
      tecla.classList.add('correcta');
      
      if (palabraCompleta()) {
        juegoTerminado = true;
        mostrarMensaje('¡Felicitaciones! ¡Has ganado! 🎉', 'exito');
      }
    } else {
      letrasIncorrectas.push(letra);
      intentosFallidos++;
      tecla.classList.add('incorrecta');
      
      if (intentosFallidos >= maxIntentos) {
        juegoTerminado = true;
        mostrarMensaje(`¡Has perdido! 😞 La palabra era: ${palabraActual}`, 'error');
      }
    }
    
    actualizarDisplay();
  }

  function palabraCompleta() {
    return palabraActual.split('').every(letra => letrasAdivinadas.includes(letra));
  }

  function actualizarDisplay() {
    // Actualizar dibujo
    dibujoEl.textContent = dibujos[intentosFallidos];
    
    // Actualizar palabra
    const palabraMostrada = palabraActual
      .split('')
      .map(letra => letrasAdivinadas.includes(letra) ? letra : '_')
      .join(' ');
    palabraEl.textContent = palabraMostrada;
    
    // Actualizar intentos
    intentosEl.textContent = `Intentos: ${intentosFallidos}/${maxIntentos}`;
    
    // Cambiar color según los intentos
    if (intentosFallidos >= 4) {
      intentosEl.style.color = '#d32f2f';
    } else if (intentosFallidos >= 2) {
      intentosEl.style.color = '#f57c00';
    } else {
      intentosEl.style.color = '#666';
    }
  }

  function mostrarMensaje(texto, tipo) {
    mensajeEl.textContent = texto;
    mensajeEl.className = `mensaje ${tipo}`;
  }

  function reiniciarJuego() {
    inicializarJuego();
  }

  // Event listeners
  btnNuevo.addEventListener('click', reiniciarJuego);

  // Soporte para teclado físico
  document.addEventListener('keydown', function(e) {
    const letra = e.key.toUpperCase();
    if (letra >= 'A' && letra <= 'Z') {
      manejarClick(letra);
    } else if (letra === 'Ñ') {
      manejarClick('Ñ');
    } else if (e.key === 'Enter') {
      if (juegoTerminado) {
        reiniciarJuego();
      }
    }
  });

  // Inicializar el juego
  inicializarJuego();

})(); 