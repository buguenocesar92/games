(function() {
  'use strict';

  let secuencia = [];
  let jugadorSecuencia = [];
  let nivel = 0;
  let juegoActivo = false;
  let mostrandoSecuencia = false;

  // Elementos del DOM
  const botonesEl = document.getElementById('botones');
  const nivelEl = document.getElementById('nivel');
  const mensajeEl = document.getElementById('mensaje');
  const btnIniciar = document.getElementById('btnIniciar');
  const botones = Array.from(botonesEl.children);

  // Colores disponibles
  const colores = ['verde', 'rojo', 'azul', 'amarillo'];

  // Sonidos (usando Web Audio API para generar tonos)
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const frecuencias = {
    verde: 329.63,    // E4
    rojo: 261.63,     // C4
    azul: 220.00,     // A3
    amarillo: 196.00  // G3
  };

  function reproducirSonido(color, duracion = 300) {
    const oscilador = audioContext.createOscillator();
    const ganancia = audioContext.createGain();
    
    oscilador.connect(ganancia);
    ganancia.connect(audioContext.destination);
    
    oscilador.frequency.setValueAtTime(frecuencias[color], audioContext.currentTime);
    oscilador.type = 'sine';
    
    ganancia.gain.setValueAtTime(0.1, audioContext.currentTime);
    ganancia.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duracion / 1000);
    
    oscilador.start(audioContext.currentTime);
    oscilador.stop(audioContext.currentTime + duracion / 1000);
  }

  function inicializarJuego() {
    secuencia = [];
    jugadorSecuencia = [];
    nivel = 0;
    juegoActivo = true;
    mostrandoSecuencia = false;
    
    btnIniciar.textContent = 'Reiniciar';
    btnIniciar.disabled = false;
    
    habilitarBotones(true);
    actualizarDisplay();
    mostrarMensaje('¡Memoriza la secuencia!', 'info');
    
    // Pequeña pausa antes de comenzar
    setTimeout(() => {
      siguienteNivel();
    }, 1000);
  }

  function siguienteNivel() {
    if (!juegoActivo) return;
    
    nivel++;
    jugadorSecuencia = [];
    
    // Agregar un color aleatorio a la secuencia
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    secuencia.push(colorAleatorio);
    
    actualizarDisplay();
    mostrarSecuencia();
  }

  function mostrarSecuencia() {
    mostrandoSecuencia = true;
    habilitarBotones(false);
    botonesEl.classList.add('mostrando-secuencia');
    
    mostrarMensaje('¡Observa la secuencia!', 'jugando');
    
    let index = 0;
    const intervalo = setInterval(() => {
      if (index < secuencia.length) {
        iluminarBoton(secuencia[index]);
        index++;
      } else {
        clearInterval(intervalo);
        setTimeout(() => {
          mostrandoSecuencia = false;
          botonesEl.classList.remove('mostrando-secuencia');
          habilitarBotones(true);
          mostrarMensaje('¡Repite la secuencia!', 'info');
        }, 500);
      }
    }, 800);
  }

  function iluminarBoton(color) {
    const boton = document.querySelector(`[data-color="${color}"]`);
    boton.classList.add('iluminado');
    reproducirSonido(color);
    
    setTimeout(() => {
      boton.classList.remove('iluminado');
    }, 400);
  }

  function manejarClickBoton(color) {
    if (!juegoActivo || mostrandoSecuencia) return;
    
    // Efecto visual del click
    const boton = document.querySelector(`[data-color="${color}"]`);
    boton.classList.add('activo');
    reproducirSonido(color, 200);
    
    setTimeout(() => {
      boton.classList.remove('activo');
    }, 200);
    
    // Agregar a la secuencia del jugador
    jugadorSecuencia.push(color);
    
    // Verificar si es correcto
    const indiceActual = jugadorSecuencia.length - 1;
    
    if (jugadorSecuencia[indiceActual] !== secuencia[indiceActual]) {
      // Error - fin del juego
      juegoTerminado(false);
      return;
    }
    
    // Si completó la secuencia correctamente
    if (jugadorSecuencia.length === secuencia.length) {
      if (nivel >= 20) {
        // Ganó el juego completo
        juegoTerminado(true);
      } else {
        // Siguiente nivel
        mostrarMensaje(`¡Correcto! Nivel ${nivel} completado`, 'exito');
        setTimeout(() => {
          siguienteNivel();
        }, 1500);
      }
    }
  }

  function juegoTerminado(gano) {
    juegoActivo = false;
    mostrandoSecuencia = false;
    habilitarBotones(false);
    botonesEl.classList.remove('mostrando-secuencia');
    
    if (gano) {
      mostrarMensaje('¡Felicitaciones! ¡Completaste todos los niveles! 🎉', 'exito');
      reproducirSonidoVictoria();
    } else {
      mostrarMensaje(`¡Juego terminado! Llegaste al nivel ${nivel} 😞`, 'error');
      reproducirSonidoError();
    }
    
    btnIniciar.textContent = 'Jugar de Nuevo';
    btnIniciar.disabled = false;
  }

  function reproducirSonidoVictoria() {
    const melodia = ['verde', 'azul', 'amarillo', 'verde'];
    melodia.forEach((color, index) => {
      setTimeout(() => {
        reproducirSonido(color, 400);
      }, index * 200);
    });
  }

  function reproducirSonidoError() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        reproducirSonido('rojo', 200);
      }, i * 150);
    }
  }

  function habilitarBotones(habilitar) {
    botones.forEach(boton => {
      if (habilitar) {
        boton.classList.remove('deshabilitado');
      } else {
        boton.classList.add('deshabilitado');
      }
    });
  }

  function actualizarDisplay() {
    nivelEl.textContent = `Nivel: ${nivel}`;
  }

  function mostrarMensaje(texto, tipo) {
    mensajeEl.textContent = texto;
    mensajeEl.className = `mensaje ${tipo}`;
  }

  function reiniciarJuego() {
    if (juegoActivo && !mostrandoSecuencia) {
      const confirmar = confirm('¿Estás seguro de que quieres reiniciar el juego?');
      if (!confirmar) return;
    }
    
    inicializarJuego();
  }

  // Event listeners
  btnIniciar.addEventListener('click', reiniciarJuego);

  botones.forEach(boton => {
    boton.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      manejarClickBoton(color);
    });
  });

  // Soporte para teclado
  document.addEventListener('keydown', function(e) {
    if (!juegoActivo || mostrandoSecuencia) return;
    
    let color = null;
    switch(e.key.toLowerCase()) {
      case '1':
      case 'q':
        color = 'verde';
        break;
      case '2':
      case 'w':
        color = 'rojo';
        break;
      case '3':
      case 'a':
        color = 'azul';
        break;
      case '4':
      case 's':
        color = 'amarillo';
        break;
      case ' ':
      case 'enter':
        if (!juegoActivo) {
          reiniciarJuego();
        }
        break;
    }
    
    if (color) {
      e.preventDefault();
      manejarClickBoton(color);
    }
  });

  // Inicialización
  mostrarMensaje('¡Presiona "Iniciar" para comenzar!', 'info');
  actualizarDisplay();
  habilitarBotones(false);

})(); 