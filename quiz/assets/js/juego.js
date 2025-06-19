(function() {
  'use strict';

  // Elementos del DOM
  const questionText = document.getElementById('question-text');
  const answersContainer = document.getElementById('answers');
  const scoreEl = document.getElementById('score');
  const streakEl = document.getElementById('streak');
  const progressEl = document.getElementById('progress');
  const questionCounterEl = document.getElementById('question-counter');
  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const restartBtn = document.getElementById('restart-btn');
  const resultModal = document.getElementById('result-modal');
  const finalResultsEl = document.getElementById('final-results');
  const closeModalBtn = document.getElementById('close-modal');

  // Variables del juego
  let currentQuestionIndex = 0;
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let correctAnswers = 0;
  let questionStartTime = 0;
  let gameQuestions = [];
  const TOTAL_QUESTIONS = 10;
  const TIME_BONUS_THRESHOLD = 5000; // 5 segundos

  // Base de datos de preguntas
  const questionDatabase = [
    {
      question: "¿Cuál es la capital de Francia?",
      answers: ["Madrid", "París", "Roma", "Londres"],
      correct: 1,
      category: "Geografía"
    },
    {
      question: "¿En qué año llegó el hombre a la Luna?",
      answers: ["1967", "1968", "1969", "1970"],
      correct: 2,
      category: "Historia"
    },
    {
      question: "¿Cuál es el planeta más grande del sistema solar?",
      answers: ["Saturno", "Júpiter", "Urano", "Neptuno"],
      correct: 1,
      category: "Ciencia"
    },
    {
      question: "¿Quién escribió 'Don Quijote de la Mancha'?",
      answers: ["Lope de Vega", "Miguel de Cervantes", "Calderón de la Barca", "Garcilaso de la Vega"],
      correct: 1,
      category: "Literatura"
    },
    {
      question: "¿Cuál es el río más largo del mundo?",
      answers: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"],
      correct: 0,
      category: "Geografía"
    },
    {
      question: "¿Cuántos continentes hay en la Tierra?",
      answers: ["5", "6", "7", "8"],
      correct: 2,
      category: "Geografía"
    },
    {
      question: "¿Qué gas es más abundante en la atmósfera terrestre?",
      answers: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Hidrógeno"],
      correct: 2,
      category: "Ciencia"
    },
    {
      question: "¿En qué año comenzó la Segunda Guerra Mundial?",
      answers: ["1938", "1939", "1940", "1941"],
      correct: 1,
      category: "Historia"
    },
    {
      question: "¿Cuál es el océano más grande?",
      answers: ["Atlántico", "Índico", "Ártico", "Pacífico"],
      correct: 3,
      category: "Geografía"
    },
    {
      question: "¿Quién pintó 'La Mona Lisa'?",
      answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Miguel Ángel"],
      correct: 2,
      category: "Arte"
    },
    {
      question: "¿Cuál es la velocidad de la luz?",
      answers: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correct: 0,
      category: "Ciencia"
    },
    {
      question: "¿Qué país tiene más habitantes en el mundo?",
      answers: ["India", "Estados Unidos", "China", "Brasil"],
      correct: 2,
      category: "Geografía"
    },
    {
      question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
      answers: ["206", "156", "256", "306"],
      correct: 0,
      category: "Ciencia"
    },
    {
      question: "¿En qué año se descubrió América?",
      answers: ["1490", "1491", "1492", "1493"],
      correct: 2,
      category: "Historia"
    },
    {
      question: "¿Cuál es el metal más abundante en la corteza terrestre?",
      answers: ["Hierro", "Aluminio", "Cobre", "Oro"],
      correct: 1,
      category: "Ciencia"
    },
    {
      question: "¿Quién escribió 'Cien años de soledad'?",
      answers: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Pablo Neruda"],
      correct: 1,
      category: "Literatura"
    },
    {
      question: "¿Cuál es la montaña más alta del mundo?",
      answers: ["K2", "Monte Everest", "Kangchenjunga", "Makalu"],
      correct: 1,
      category: "Geografía"
    },
    {
      question: "¿Qué instrumento mide la presión atmosférica?",
      answers: ["Termómetro", "Barómetro", "Higrómetro", "Anemómetro"],
      correct: 1,
      category: "Ciencia"
    },
    {
      question: "¿En qué país se encuentra Machu Picchu?",
      answers: ["Ecuador", "Colombia", "Perú", "Bolivia"],
      correct: 2,
      category: "Geografía"
    },
    {
      question: "¿Cuántos corazones tiene un pulpo?",
      answers: ["1", "2", "3", "4"],
      correct: 2,
      category: "Ciencia"
    }
  ];

  // Función para mezclar array
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Función para inicializar el quiz
  function initializeQuiz() {
    gameQuestions = shuffleArray(questionDatabase).slice(0, TOTAL_QUESTIONS);
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    correctAnswers = 0;
    
    updateDisplay();
    showQuestion();
    
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
  }

  // Función para mostrar pregunta
  function showQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
      endQuiz();
      return;
    }

    const question = gameQuestions[currentQuestionIndex];
    questionStartTime = Date.now();
    
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';
    
    // Crear botones de respuesta
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'answer-btn';
      button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
      button.addEventListener('click', () => selectAnswer(index));
      answersContainer.appendChild(button);
    });

    // Actualizar progreso
    const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
    progressEl.style.width = `${progress}%`;
    questionCounterEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${TOTAL_QUESTIONS}`;
    
    nextBtn.style.display = 'none';
  }

  // Función para seleccionar respuesta
  function selectAnswer(selectedIndex) {
    const question = gameQuestions[currentQuestionIndex];
    const answerTime = Date.now() - questionStartTime;
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    
    // Deshabilitar todos los botones
    buttons.forEach(btn => btn.disabled = true);
    
    // Mostrar respuesta correcta e incorrecta
    buttons.forEach((btn, index) => {
      if (index === question.correct) {
        btn.classList.add('correct');
      } else if (index === selectedIndex && selectedIndex !== question.correct) {
        btn.classList.add('incorrect');
        btn.classList.add('shake');
      }
    });

    // Calcular puntuación
    if (selectedIndex === question.correct) {
      correctAnswers++;
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      
      let points = 100; // Puntos base
      
      // Bono por velocidad
      if (answerTime < TIME_BONUS_THRESHOLD) {
        points += 50;
      }
      
      // Multiplicador por racha
      if (streak >= 3) {
        points = Math.floor(points * 1.5);
      }
      
      score += points;
      
      // Efecto visual
      buttons[question.correct].classList.add('pulse');
      
    } else {
      streak = 0;
      score = Math.max(0, score - 20); // Penalización
    }
    
    updateDisplay();
    
    // Mostrar botón siguiente
    setTimeout(() => {
      nextBtn.style.display = 'inline-block';
    }, 1500);
  }

  // Función para actualizar display
  function updateDisplay() {
    scoreEl.textContent = score.toLocaleString();
    streakEl.textContent = streak;
  }

  // Función para siguiente pregunta
  function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
  }

  // Función para terminar quiz
  function endQuiz() {
    const percentage = Math.round((correctAnswers / TOTAL_QUESTIONS) * 100);
    let performance = '';
    
    if (percentage >= 90) performance = '🏆 ¡Excelente!';
    else if (percentage >= 70) performance = '🎉 ¡Muy bien!';
    else if (percentage >= 50) performance = '👍 ¡Bien!';
    else performance = '📚 ¡Sigue practicando!';
    
    finalResultsEl.innerHTML = `
      <div><strong>${performance}</strong></div>
      <div>Puntuación Final: <strong>${score.toLocaleString()}</strong></div>
      <div>Respuestas Correctas: <strong>${correctAnswers}/${TOTAL_QUESTIONS}</strong></div>
      <div>Porcentaje: <strong>${percentage}%</strong></div>
      <div>Racha Máxima: <strong>${maxStreak}</strong></div>
    `;
    
    resultModal.style.display = 'flex';
  }

  // Función para reiniciar quiz
  function restartQuiz() {
    resultModal.style.display = 'none';
    startBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    
    questionText.textContent = '¡Bienvenido al Quiz de Cultura General!';
    answersContainer.innerHTML = '<p style="text-align: center; color: #e0e0e0;">Presiona "Iniciar Quiz" para comenzar</p>';
    
    progressEl.style.width = '0%';
    questionCounterEl.textContent = 'Pregunta 0 de 10';
    
    score = 0;
    streak = 0;
    updateDisplay();
  }

  // Event listeners
  startBtn.addEventListener('click', initializeQuiz);
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartQuiz);
  closeModalBtn.addEventListener('click', () => {
    resultModal.style.display = 'none';
  });

  // Soporte para teclado
  document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    
    if (['a', 'b', 'c', 'd'].includes(key)) {
      const index = key.charCodeAt(0) - 97; // a=0, b=1, c=2, d=3
      const buttons = answersContainer.querySelectorAll('.answer-btn:not(:disabled)');
      if (buttons[index]) {
        buttons[index].click();
      }
    } else if (e.key === 'Enter') {
      if (nextBtn.style.display !== 'none') {
        nextQuestion();
      } else if (startBtn.style.display !== 'none') {
        initializeQuiz();
      }
    } else if (e.key === 'Escape' && resultModal.style.display === 'flex') {
      resultModal.style.display = 'none';
    }
  });

  // Inicialización
  restartQuiz();

})(); 