        // Tu código JavaScript original con algunas mejoras visuales
        const juegoMemoria = (() => {
            'use strict';

            let cartas = [];
            let cartasVolteadas = [];
            let paresEncontrados = 0;
            let movimientos = 0;
            let juegoActivo = false;

            const simbolos = ['🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎻'];

            const btnNuevo = document.querySelector('#btnNuevo');
            const btnPista = document.querySelector('#btnPista');
            const gameBoard = document.querySelector('#gameBoard');
            const movesElement = document.querySelector('#moves');
            const pairsElement = document.querySelector('#pairs');
            const messageElement = document.querySelector('#message');

            const crearCartas = () => {
                cartas = [];
                simbolos.forEach(simbolo => {
                    cartas.push(simbolo, simbolo);
                });
                return mezclarArray(cartas);
            };

            const mezclarArray = (array) => {
                const newArray = [...array];
                for (let i = newArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
                }
                return newArray;
            };

            const crearElementoCarta = (simbolo, index) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.dataset.index = index;
                cardElement.dataset.symbol = simbolo;
                cardElement.addEventListener('click', () => voltearCarta(index));
                return cardElement;
            };

            const renderizarTablero = () => {
                gameBoard.innerHTML = '';
                cartas.forEach((simbolo, index) => {
                    const cardElement = crearElementoCarta(simbolo, index);
                    gameBoard.appendChild(cardElement);
                });
            };

            const voltearCarta = (index) => {
                if (!juegoActivo || cartasVolteadas.length >= 2) return;

                const cardElement = gameBoard.children[index];
                if (cardElement.classList.contains('flipped') || 
                    cardElement.classList.contains('matched')) return;

                cardElement.classList.add('flipped');
                cardElement.textContent = cartas[index];
                cartasVolteadas.push(index);

                if (cartasVolteadas.length === 2) {
                    movimientos++;
                    actualizarPuntuacion();
                    verificarPar();
                }
            };

            const verificarPar = () => {
                const [index1, index2] = cartasVolteadas;
                const card1 = gameBoard.children[index1];
                const card2 = gameBoard.children[index2];

                if (cartas[index1] === cartas[index2]) {
                    setTimeout(() => {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        paresEncontrados++;
                        actualizarPuntuacion();
                        cartasVolteadas = [];
                        
                        verificarVictoria();
                    }, 500);
                } else {
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        card1.textContent = '';
                        card2.textContent = '';
                        cartasVolteadas = [];
                    }, 1000);
                }
            };

            const actualizarPuntuacion = () => {
                movesElement.textContent = movimientos;
                pairsElement.textContent = paresEncontrados;
            };

            const verificarVictoria = () => {
                if (paresEncontrados === simbolos.length) {
                    juegoActivo = false;
                    mostrarMensaje(`🎉 ¡Felicidades! Completaste el juego en ${movimientos} movimientos.`, 'win');
                }
            };

            const mostrarPista = () => {
                if (!juegoActivo) return;
                
                btnPista.disabled = true;
                
                Array.from(gameBoard.children).forEach((card, index) => {
                    if (!card.classList.contains('matched')) {
                        card.classList.add('flipped');
                        card.textContent = cartas[index];
                    }
                });

                setTimeout(() => {
                    Array.from(gameBoard.children).forEach((card) => {
                        if (!card.classList.contains('matched')) {
                            card.classList.remove('flipped');
                            card.textContent = '';
                        }
                    });
                    btnPista.disabled = false;
                }, 1000);
            };

            const mostrarMensaje = (mensaje, tipo = 'info') => {
                let colorClass = 'text-memory-accent';
                let bgClass = 'bg-black/50';
                
                if (tipo === 'win') {
                    colorClass = 'text-green-400';
                    bgClass = 'bg-green-900/30';
                } else if (tipo === 'info') {
                    colorClass = 'text-blue-400';
                    bgClass = 'bg-blue-900/30';
                }
                
                messageElement.innerHTML = `
                    <div class="${bgClass} backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-memory-accent/30">
                        <p class="${colorClass} text-xl font-bold">${mensaje}</p>
                    </div>
                `;
            };

            const inicializarJuego = () => {
                cartas = crearCartas();
                cartasVolteadas = [];
                paresEncontrados = 0;
                movimientos = 0;
                juegoActivo = true;
                
                actualizarPuntuacion();
                renderizarTablero();
                mostrarMensaje('🧠 Encuentra todos los pares. ¡Buena suerte!', 'info');
            };

            btnNuevo.addEventListener('click', inicializarJuego);
            btnPista.addEventListener('click', mostrarPista);

            return {
                nuevoJuego: inicializarJuego
            };

        })();

        // Inicializar el juego al cargar la página
        juegoMemoria.nuevoJuego();