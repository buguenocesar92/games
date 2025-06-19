const solitario = (() => {
  'use strict';
  const PALOS = ['C', 'D', 'H', 'S'];
  const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let mazo = [];
  let descarte = [];
  let columnas = [];
  let mazosSalida = {C: [], D: [], H: [], S: []};

  const mazoDiv = document.getElementById('mazo');
  const descarteDiv = document.getElementById('descarte');
  const columnasDiv = document.getElementById('columnas');
  const mazosSalidaDivs = document.querySelectorAll('.mazo-salida');
  const btnNuevo = document.getElementById('btnNuevo');
  const mensaje = document.getElementById('mensaje');

  function crearMazo() {
    const cartas = [];
    for (const palo of PALOS) {
      for (const valor of VALORES) {
        cartas.push({valor, palo, visible: false});
      }
    }
    return barajar(cartas);
  }

  function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function repartir() {
    columnas = [];
    let idx = 0;
    for (let i = 1; i <= 7; i++) {
      const col = [];
      for (let j = 0; j < i; j++) {
        const carta = mazo[idx++];
        carta.visible = (j === i - 1);
        col.push(carta);
      }
      columnas.push(col);
    }
    mazo = mazo.slice(idx);
  }

  function renderizar() {
    // Mazo
    mazoDiv.innerHTML = mazo.length ? '<div class="carta oculta">🂠</div>' : '';
    mazoDiv.onclick = () => {
      if (mazo.length) {
        const carta = mazo.pop();
        carta.visible = true;
        descarte.push(carta);
        renderizar();
      } else if (descarte.length) {
        // Volver a poner el descarte en el mazo
        while (descarte.length) {
          const carta = descarte.pop();
          carta.visible = false;
          mazo.unshift(carta);
        }
        renderizar();
      }
    };
    // Descarte
    descarteDiv.innerHTML = '';
    if (descarte.length) {
      const carta = descarte[descarte.length - 1];
      descarteDiv.appendChild(crearCartaDiv(carta));
    }
    // Columnas
    columnasDiv.innerHTML = '';
    columnas.forEach((col, idx) => {
      const colDiv = document.createElement('div');
      colDiv.className = 'columna';
      col.forEach((carta, i) => {
        colDiv.appendChild(crearCartaDiv(carta));
      });
      columnasDiv.appendChild(colDiv);
    });
    // Mazos de salida
    mazosSalidaDivs.forEach(div => {
      const palo = div.getAttribute('data-palo');
      div.innerHTML = '';
      if (mazosSalida[palo].length) {
        div.appendChild(crearCartaDiv(mazosSalida[palo][mazosSalida[palo].length-1]));
      }
    });
  }

  function crearCartaDiv(carta) {
    const div = document.createElement('div');
    div.className = 'carta' + (carta.palo === 'D' || carta.palo === 'H' ? ' roja' : '');
    if (!carta.visible) {
      div.classList.add('oculta');
      div.textContent = '🂠';
    } else {
      div.textContent = `${carta.valor}${carta.palo}`;
    }
    return div;
  }

  function reiniciar() {
    mazo = crearMazo();
    descarte = [];
    mazosSalida = {C: [], D: [], H: [], S: []};
    repartir();
    mensaje.textContent = '';
    renderizar();
  }

  btnNuevo.addEventListener('click', reiniciar);

  // Inicializar
  reiniciar();

  return {
    nuevoJuego: reiniciar
  };
})(); 