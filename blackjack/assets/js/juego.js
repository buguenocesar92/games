// Creamos un módulo para que el código esté "encerrado" y no ensucie el global
const miModulo = (() => {
    'use strict';

    // Baraja de cartas
    let deck = [];

    // Tipos de cartas (C = trébol, D = diamante, H = corazón, S = espada)
    const tipos = ['C','D','H','S'],
          especiales = ['A','J','Q','K']; // Cartas especiales

    // Guardará los puntos de todos los jugadores (jugador 1 y computadora)
    let puntosJugadores = [];

    // Botones de la interfaz
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    // Lugares donde se mostrarán las cartas y los puntos
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');


    // ====== FUNCIONES ======

    // Comienza un nuevo juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck(); // se crea una baraja nueva

        // Se reinician los puntos a 0
        puntosJugadores = [];
        for( let i = 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0);
        }
        
        // Mostrar 0 en pantalla
        puntosHTML.forEach( elem => elem.innerText = 0 );

        // Limpiar las cartas que estaban en pantalla
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        // Habilitar botones
        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    // Crea una baraja (mezclada)
    const crearDeck = () => {
        deck = [];

        // Agrega cartas del 2 al 10 para cada tipo
        for( let i = 2; i <= 10; i++ ) {
            for( let tipo of tipos ) {
                deck.push( i + tipo);
            }
        }

        // Agrega las cartas especiales (A, J, Q, K)
        for( let tipo of tipos ) {
            for( let esp of especiales ) {
                deck.push( esp + tipo);
            }
        }

        // Mezcla la baraja con underscore.js
        return _.shuffle( deck );
    }

    // Sacar una carta de la baraja
    const pedirCarta = () => {
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop(); // saca una carta de atrás
    }

    // Obtener el valor numérico de la carta
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1); // quita el tipo (ej: "10C" → "10")

        // Si no es número: A = 11, JQK = 10
        return ( isNaN( valor ) ) ? 
                ( valor === 'A' ) ? 11 : 10
                : valor * 1; // convierte string a número
    }

    // Suma los puntos al jugador correspondiente
    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] += valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    // Mostrar carta visualmente en pantalla
    const crearCarta = ( carta, turno ) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`; // imagen correspondiente
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append( imgCarta );
    }

    // Muestra quién ganó
    const determinarGanador = () => {
        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            if( puntosComputadora === puntosMinimos ) {
                alert('Nadie gana :(');
            } else if ( puntosMinimos > 21 ) {
                alert('Computadora gana');
            } else if( puntosComputadora > 21 ) {
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        }, 100 );
    }

    // Turno automático de la computadora
    const turnoComputadora = ( puntosMinimos ) => {
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

        determinarGanador();
    }

    // ====== EVENTOS ======

    // Cuando el jugador hace clic en "Pedir Carta"
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );
        crearCarta( carta, 0 );

        // Verificar si perdió o hizo 21
        if ( puntosJugador > 21 ) {
            console.warn('Perdiste');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );

        } else if ( puntosJugador === 21 ) {
            console.warn('21, genial!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }
    });

    // Cuando el jugador hace clic en "Detener"
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;
        turnoComputadora( puntosJugadores[0] );
    });

    // Retorna una función pública para comenzar un nuevo juego desde fuera
    return {
        nuevoJuego: inicializarJuego
    };

})();

