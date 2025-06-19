# 🧱 Breakout - Ayuda Técnica

## Arquitectura del Juego

### Componentes Principales
- **Canvas HTML5**: Superficie de dibujo de 800x600 píxeles
- **Sistema de Física**: Detección de colisiones precisa para pelota y bloques
- **Generador de Niveles**: Patrones algorítmicos de bloques con dificultad creciente
- **Sistema de Potenciadores**: Power-ups que caen de bloques especiales

### Mecánicas de Juego
- **Detección de Colisiones**: Algoritmo AABB optimizado para múltiples objetos
- **Física de Rebotes**: Ángulos realistas basados en punto de impacto
- **Sistema de Vidas**: 3 vidas iniciales con posibilidad de ganar más
- **Progresión de Niveles**: Velocidad y dificultad incrementales

### Tipos de Bloques
- **Normales**: Requieren 1 golpe (10 puntos)
- **Resistentes**: Requieren 2 golpes (20 puntos)
- **Especiales**: Sueltan power-ups (50 puntos)
- **Indestructibles**: No se pueden romper

### Power-ups Disponibles
- **Paleta Expandida**: Aumenta el tamaño de la paleta
- **Vida Extra**: Otorga una vida adicional
- **Pelota Multiball**: Divide la pelota en múltiples pelotas
- **Velocidad Lenta**: Reduce temporalmente la velocidad de la pelota

Este juego demuestra programación de física 2D, detección de colisiones complejas, y sistemas de progresión en videojuegos. 