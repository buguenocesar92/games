const adivinaNumero = (() => {
  'use strict';
  let numeroSecreto = 0;
  let intentos = 0;
  let juegoActivo = false;

  const inputNumero = document.getElementById('inputNumero');
  const btnIntentar = document.getElementById('btnIntentar');
  const btnNuevo = document.getElementById('btnNuevo');
  const mensaje = document.getElementById('mensaje');
  const intentosDiv = document.getElementById('intentos');

  const iniciarJuego = () => {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    intentos = 0;
    juegoActivo = true;
    mensaje.textContent = '';
    intentosDiv.textContent = 'Intentos: 0';
    inputNumero.value = '';
    inputNumero.disabled = false;
    btnIntentar.disabled = false;
    inputNumero.focus();
  };

  const intentar = () => {
    if (!juegoActivo) return;
    const valor = parseInt(inputNumero.value, 10);
    if (isNaN(valor) || valor < 1 || valor > 100) {
      mensaje.textContent = 'Introduce un número válido entre 1 y 100.';
      return;
    }
    intentos++;
    intentosDiv.textContent = `Intentos: ${intentos}`;
    if (valor === numeroSecreto) {
      mensaje.textContent = `¡Correcto! El número era ${numeroSecreto}. Lo lograste en ${intentos} intentos.`;
      juegoActivo = false;
      inputNumero.disabled = true;
      btnIntentar.disabled = true;
    } else if (valor < numeroSecreto) {
      mensaje.textContent = 'El número es mayor.';
    } else {
      mensaje.textContent = 'El número es menor.';
    }
    inputNumero.value = '';
    inputNumero.focus();
  };

  btnIntentar.addEventListener('click', intentar);
  btnNuevo.addEventListener('click', iniciarJuego);
  inputNumero.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') intentar();
  });

  // Inicializar al cargar
  iniciarJuego();

  return {
    nuevoJuego: iniciarJuego
  };
})(); 