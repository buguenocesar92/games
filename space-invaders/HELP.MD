# 👾 Space Invaders - Ayuda Técnica

## Arquitectura del Juego

### Componentes Principales
- **Canvas HTML5**: Superficie de dibujo de 800x600 píxeles para batalla espacial
- **Sistema de Entidades**: Manejo eficiente de jugador, alienígenas, proyectiles y power-ups
- **Motor de Colisiones**: Detección precisa entre múltiples objetos en movimiento
- **Sistema de Ondas**: Generación procedimental de oleadas de enemigos crecientes

### Mecánicas de Juego
- **Movimiento del Jugador**: Nave espacial controlable horizontalmente
- **Sistema de Disparo**: Proyectiles con cadencia controlada y munición limitada
- **IA de Enemigos**: Patrones de movimiento complejos y disparo automático
- **Progresión de Dificultad**: Velocidad y cantidad de enemigos incrementales

### Tipos de Enemigos
- **Alienígenas Básicos**: 10 puntos, movimiento simple
- **Alienígenas Medios**: 20 puntos, disparo ocasional
- **Alienígenas Avanzados**: 30 puntos, disparo frecuente
- **Nave Nodriza**: 100+ puntos, aparición aleatoria en la parte superior

### Sistema de Power-ups
- **Disparo Rápido**: Reduce tiempo de recarga entre disparos
- **Disparo Múltiple**: Permite disparar 3 proyectiles simultáneos
- **Escudo Temporal**: Protección contra impactos enemigos
- **Vida Extra**: Otorga una vida adicional

### Características Técnicas
- **Pool de Objetos**: Reutilización de proyectiles para optimizar memoria
- **Sistema de Partículas**: Efectos visuales de explosiones y estrellas
- **Audio Procedural**: Efectos de sonido generados con Web Audio API
- **Persistencia de Datos**: Guarda mejor puntuación y estadísticas

### Logros Desbloqueables
- 🎯 **Francotirador**: Precisión del 90%
- 🚀 **Ace Pilot**: Supervivir 10 oleadas
- 💥 **Destructor**: Eliminar 500 enemigos
- 🛸 **Cazador de Naves**: Destruir 5 naves nodriza

Este juego demuestra programación de sistemas complejos, optimización de rendimiento en tiempo real, y diseño de mecánicas de juego balanceadas. 