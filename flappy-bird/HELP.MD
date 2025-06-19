# 🐦 Flappy Bird - Ayuda Técnica

## Arquitectura del Juego

### Componentes Principales
- **Canvas HTML5**: Superficie de dibujo de 400x600 píxeles optimizada para móvil
- **Sistema de Física**: Gravedad realista y momentum de vuelo
- **Generador Procedimental**: Tuberías con espacios aleatorios
- **Sistema de Puntuación**: Puntos por tuberías superadas y sistema de medallas

### Mecánicas de Juego
- **Gravedad Constante**: Acelera al pájaro hacia abajo constantemente
- **Impulso de Vuelo**: Click/toque aplica fuerza ascendente instantánea
- **Detección de Colisiones**: Precisión pixel-perfect con tuberías y suelo
- **Dificultad Progresiva**: Velocidad de tuberías aumenta gradualmente

### Sistema de Puntuación
- **Puntos**: +1 por cada tubería superada
- **Medallas de Logros**:
  - 🥉 Bronce: 10+ puntos
  - 🥈 Plata: 25+ puntos  
  - 🥇 Oro: 50+ puntos
  - 💎 Diamante: 100+ puntos

### Características Técnicas
- **Optimización de Rendimiento**: 60 FPS con requestAnimationFrame
- **Pool de Objetos**: Reutilización de tuberías para eficiencia de memoria
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Persistencia Local**: Guarda mejor puntuación en localStorage

### Controles
- **Escritorio**: Espacio, Click del mouse
- **Móvil**: Toque en pantalla
- **Accesibilidad**: Soporte completo para teclado

Este juego demuestra programación de física en tiempo real, optimización de rendimiento para móviles, y diseño de interfaces táctiles. 