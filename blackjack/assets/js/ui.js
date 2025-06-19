// Código UI para el Blackjack

console.log(miModulo);

document.querySelector('#btnNuevo').addEventListener('click', () => {
    miModulo.nuevoJuego();

    // Limpiar mensaje de resultado
    document.getElementById('mensaje-resultado').innerHTML = `
        <div class="bg-black/50 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-gold/30">
            <p class="text-gold text-xl font-bold">¡Juego iniciado! ¡Buena suerte!</p>
        </div>
    `;
});

// Función para mostrar mensajes bonitos
function mostrarMensaje(mensaje, tipo = 'info') {
    const mensajeDiv = document.getElementById('mensaje-resultado');
    let colorClass = 'text-gold';
    let bgClass = 'bg-black/50';
    let emoji = '🎮';

    if (tipo === 'win') {
        colorClass = 'text-green-400';
        bgClass = 'bg-green-900/30';
        emoji = '🎉';
    } else if (tipo === 'lose') {
        colorClass = 'text-red-400';
        bgClass = 'bg-red-900/30';
        emoji = '😔';
    } else if (tipo === 'tie') {
        colorClass = 'text-yellow-400';
        bgClass = 'bg-yellow-900/30';
        emoji = '🤝';
    }

    mensajeDiv.innerHTML = `
        <div class="${bgClass} backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-gold/30">
            <p class="${colorClass} text-xl font-bold">${emoji} ${mensaje}</p>
        </div>
    `;
}

// Sobrescribir alert() para mostrar mensajes bonitos
const originalAlert = window.alert;
window.alert = function(message) {
    if (message.includes('Computadora gana')) {
        mostrarMensaje('¡La computadora gana!', 'lose');
    } else if (message.includes('Jugador Gana')) {
        mostrarMensaje('¡Felicidades, ganaste!', 'win');
    } else if (message.includes('Nadie gana')) {
        mostrarMensaje('¡Es un empate!', 'tie');
    } else {
        mostrarMensaje(message, 'info');
    }
};
