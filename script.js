class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.winningLine = null;
        this.isDraw = false;
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draws: 0
        };

        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6] // Diagonales
        ];

        this.initializeGame();
        this.loadScores();
    }

    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('resetBtn');
        this.xWinsElement = document.getElementById('xWins');
        this.oWinsElement = document.getElementById('oWins');
        this.drawsElement = document.getElementById('draws');

        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.updateStatus();
        this.updateScoreDisplay();
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== null) {
            return;
        }

        // Agregar animación de click
        this.cells[index].style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.cells[index].style.transform = '';
        }, 150);

        // Place the mark
        this.board[index] = this.currentPlayer;
        this.updateCell(index, this.currentPlayer);

        // Check for winner or draw
        this.checkGameEnd();

        // Switch player if game is still active
        if (this.gameActive) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }

    updateCell(index, player) {
        const cell = this.cells[index];
        const content = document.createElement('span');
        content.textContent = player;
        content.className = 'cell-content';
        
        cell.appendChild(content);
        cell.classList.add(player.toLowerCase());
        cell.classList.add('disabled');
    }

    checkGameEnd() {
        // Check for winner
        const winResult = this.checkWinner();
        if (winResult.winner) {
            this.winner = winResult.winner;
            this.winningLine = winResult.line;
            this.gameActive = false;
            this.scores[this.winner]++;
            this.saveScores();
            this.highlightWinningLine();
            this.updateStatus();
            this.updateScoreDisplay();
            this.celebrateWin();
            return;
        }

        // Check for draw
        if (this.board.every(cell => cell !== null)) {
            this.isDraw = true;
            this.gameActive = false;
            this.scores.draws++;
            this.saveScores();
            this.updateStatus();
            this.updateScoreDisplay();
        }
    }

    checkWinner() {
        for (const combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                return { winner: this.board[a], line: combination };
            }
        }
        return { winner: null, line: null };
    }

    highlightWinningLine() {
        if (this.winningLine) {
            this.winningLine.forEach((index, i) => {
                setTimeout(() => {
                    this.cells[index].classList.add('winning');
                }, i * 100);
            });
        }
    }

    celebrateWin() {
        // Add confetti-like effect by animating non-winning cells
        this.cells.forEach((cell, index) => {
            if (!this.winningLine.includes(index)) {
                setTimeout(() => {
                    cell.style.transform = 'scale(0.9)';
                    cell.style.opacity = '0.7';
                }, Math.random() * 500);
            }
        });
    }

    updateStatus() {
        // Clear previous status classes
        this.statusElement.className = 'status-text';

        if (this.winner) {
            this.statusElement.textContent = `🎉 Jugador ${this.winner} ganó! 🎉`;
            this.statusElement.classList.add('winner');
        } else if (this.isDraw) {
            this.statusElement.textContent = "🤝 Empate! 🤝";
            this.statusElement.classList.add('draw');
        } else {
            this.statusElement.textContent = `Turno del jugador ${this.currentPlayer}`;
            this.statusElement.classList.add(`player-${this.currentPlayer.toLowerCase()}-turn`);
        }
    }

    updateScoreDisplay() {
        this.xWinsElement.textContent = this.scores.X;
        this.oWinsElement.textContent = this.scores.O;
        this.drawsElement.textContent = this.scores.draws;
    }

    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
        }
    }

    resetGame() {
        // Add reset animation
        this.resetButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.resetButton.style.transform = '';
        }, 150);

        // Reset game state
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.winningLine = null;
        this.isDraw = false;
        this.gameActive = true;

        // Reset UI with staggered animation
        this.cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.innerHTML = '';
                cell.className = 'cell';
                cell.style.transform = '';
                cell.style.opacity = '';
            }, index * 50);
        });

        setTimeout(() => {
            this.updateStatus();
        }, 450);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.click();
        }
    } else if (e.key === 'r' || e.key === 'R') {
        document.getElementById('resetBtn').click();
    }
});

// Add visual feedback for keyboard users
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell && !cell.classList.contains('disabled')) {
            cell.style.background = '#f1f5f9';
            setTimeout(() => {
                cell.style.background = '';
            }, 200);
        }
    }
});