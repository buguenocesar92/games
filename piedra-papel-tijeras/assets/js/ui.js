    // 🎨 INTERFAZ DE USUARIO
    class GameUI {
      constructor() {
        this.game = new RockPaperScissorsGame();
        this.isPlaying = false;
        this.initializeElements();
        this.bindEvents();
      }

      initializeElements() {
        this.playerScoreEl = document.getElementById('player-score');
        this.computerScoreEl = document.getElementById('computer-score');
        this.resultEl = document.getElementById('result');
        this.thinkingEl = document.getElementById('thinking-indicator');
        this.resetBtn = document.getElementById('reset-btn');
        this.vsIcon = document.getElementById('vs-icon');
        this.choiceBtns = document.querySelectorAll('.choice');
        this.computerChoices = document.querySelectorAll('.computer-choice');
      }

      bindEvents() {
        this.choiceBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            if (!this.isPlaying) {
              const choice = e.currentTarget.dataset.choice;
              this.playGame(choice);
            }
          });
        });

        this.resetBtn.addEventListener('click', () => {
          this.resetGame();
        });
      }

      async playGame(playerChoice) {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.showThinking();
        this.hideResult();
        
        // Simular delay de la computadora
        setTimeout(() => {
          const result = this.game.playRound(playerChoice);
          this.hideThinking();
          this.showResult(result);
          this.updateScores(result);
          this.highlightComputerChoice(result.computerChoice);
          this.showResetButton();
          this.isPlaying = false;
        }, 1500);
      }

      showThinking() {
        this.thinkingEl.classList.remove('hidden');
        this.vsIcon.textContent = '⏳';
      }

      hideThinking() {
        this.thinkingEl.classList.add('hidden');
        this.vsIcon.textContent = '⚡';
      }

      showResult(result) {
        const { playerChoice, computerChoice, winner } = result;
        
        let resultHTML = `
          <div class="space-y-4">
            <div class="text-6xl">
              ${this.game.getChoiceEmoji(playerChoice)} VS ${this.game.getChoiceEmoji(computerChoice)}
            </div>
        `;

        if (winner === 'tie') {
          resultHTML += `
            <div class="text-3xl text-yellow-400 font-bold">¡Empate! 🤝</div>
            <div class="text-gray-300">Ambos eligieron ${playerChoice}</div>
          `;
        } else if (winner === 'player') {
          resultHTML += `
            <div class="text-3xl text-green-400 font-bold">¡Ganaste! 🎉</div>
            <div class="text-gray-300">${this.capitalizeFirst(playerChoice)} vence a ${computerChoice}</div>
          `;
        } else {
          resultHTML += `
            <div class="text-3xl text-red-400 font-bold">¡Perdiste! 😞</div>
            <div class="text-gray-300">${this.capitalizeFirst(computerChoice)} vence a ${playerChoice}</div>
          `;
        }

        resultHTML += '</div>';
        this.resultEl.innerHTML = resultHTML;
        this.resultEl.classList.remove('hidden');
      }

      hideResult() {
        this.resultEl.innerHTML = '';
        this.resultEl.classList.add('hidden');
      }

      updateScores(result) {
        this.playerScoreEl.textContent = result.playerScore;
        this.computerScoreEl.textContent = result.computerScore;
      }

      highlightComputerChoice(computerChoice) {
        // Quitar highlight anterior
        this.computerChoices.forEach(choice => {
          choice.classList.remove('active');
        });

        // Agregar highlight a la elección de la computadora
        const computerChoiceEl = document.querySelector(`.computer-choice[data-choice="${computerChoice}"]`);
        if (computerChoiceEl) {
          computerChoiceEl.classList.add('active');
        }
      }

      showResetButton() {
        this.resetBtn.classList.remove('hidden');
      }

      resetGame() {
        this.game.resetGame();
        this.playerScoreEl.textContent = '0';
        this.computerScoreEl.textContent = '0';
        this.hideResult();
        this.resetBtn.classList.add('hidden');
        this.vsIcon.textContent = '⚡';
        
        // Quitar highlights
        this.computerChoices.forEach(choice => {
          choice.classList.remove('active');
        });
      }

      capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }

    // 🚀 INICIALIZAR EL JUEGO
    document.addEventListener('DOMContentLoaded', () => {
      new GameUI();
    });