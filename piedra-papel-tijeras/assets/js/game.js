    // 🎮 LÓGICA DEL JUEGO
    class RockPaperScissorsGame {
      constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.choices = ['piedra', 'papel', 'tijeras'];
        this.choiceEmojis = {
          piedra: '🪨',
          papel: '📄',
          tijeras: '✂️'
        };
      }

      getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
      }

      determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
          return 'tie';
        }

        const winConditions = {
          piedra: 'tijeras',
          papel: 'piedra',
          tijeras: 'papel'
        };

        return winConditions[playerChoice] === computerChoice ? 'player' : 'computer';
      }

      playRound(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const winner = this.determineWinner(playerChoice, computerChoice);

        if (winner === 'player') {
          this.playerScore++;
        } else if (winner === 'computer') {
          this.computerScore++;
        }

        return {
          playerChoice,
          computerChoice,
          winner,
          playerScore: this.playerScore,
          computerScore: this.computerScore
        };
      }

      resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
      }

      getChoiceEmoji(choice) {
        return this.choiceEmojis[choice];
      }
    }