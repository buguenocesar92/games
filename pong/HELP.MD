# 🏓 Pong - Ayuda Técnica

## Arquitectura del Juego

### Componentes Principales
- **Canvas HTML5**: Superficie de dibujo de 800x400 píxeles
- **Sistema de Física**: Detección de colisiones y movimiento realista
- **IA Simple**: CPU con dificultad adaptativa
- **Sistema de Puntuación**: Contador hasta 10 puntos

### Lógica de Física
- **Movimiento de Pelota**: Velocidad constante con rebotes
- **Detección de Colisiones**: Algoritmo AABB (Axis-Aligned Bounding Box)
- **Ángulos de Rebote**: Basados en el punto de impacto en la paleta
- **Aceleración**: La pelota aumenta velocidad gradualmente

### Inteligencia Artificial
- **Predicción**: La CPU predice la posición futura de la pelota
- **Dificultad Adaptativa**: Se ajusta según el rendimiento del jugador
- **Respuesta Humana**: Simula tiempo de reacción variable

Este juego demuestra conceptos fundamentales de desarrollo de juegos como física 2D, detección de colisiones, y IA básica. 