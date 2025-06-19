# 🧠 Quiz de Cultura General - Ayuda Técnica

## Arquitectura del Juego

### Componentes Principales
- **Base de Datos de Preguntas**: Array con 50+ preguntas categorizadas
- **Sistema de Puntuación**: Algoritmo que considera velocidad y precisión
- **Generador Aleatorio**: Selección de preguntas sin repetición
- **Sistema de Progreso**: Barra visual y contador de preguntas

### Lógica de Puntuación
- **Respuesta Correcta**: Base de 100 puntos
- **Bono de Velocidad**: +50 puntos si se responde en menos de 5 segundos
- **Multiplicador de Racha**: x1.5 por cada 3 respuestas consecutivas correctas
- **Penalización**: -20 puntos por respuesta incorrecta

### Categorías de Preguntas
- **Historia**: Eventos históricos importantes
- **Ciencia**: Física, química, biología básica
- **Geografía**: Países, capitales, características geográficas
- **Cultura**: Literatura, arte, música
- **Deportes**: Eventos deportivos y récords famosos

Este juego demuestra manejo de arrays, lógica condicional, temporizadores y manipulación del DOM dinámico. 