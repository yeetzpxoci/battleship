function createDOM() {
    return {
        placeShip(row, column, axis, length) {
            if (axis == 0 && column + length <= 10) {
                for (let i = 0; i < length; i++) {
                    const currentCell = document.querySelector(`.player-cell[data-row="${row}"][data-column="${column + i}"]`);               
                    currentCell.style.backgroundColor = "white";
                    currentCell.setAttribute('data-state', 'placed');
                }
            } else if (axis == 1 && row + length <= 10) {
                for (let i = 0; i < length; i++) {
                    const currentCell = document.querySelector(`.player-cell[data-row="${row + i}"][data-column="${column}"]`);
                    currentCell.style.backgroundColor = "white";
                    currentCell.setAttribute('data-state', 'placed');
                }
            }
        },

        placeShipComputer(gameboard) {
            for (let i = 0; i < gameboard.length; i++) {
                for (let j = 0; j < gameboard[i].length; j++) {
                    if (gameboard[i][j] != -1) {
                        const currentCell = document.querySelector(`.computer-cell[data-row="${i}"][data-column="${j}"]`);
                        currentCell.setAttribute('data-state', 'placed');
                    }
                }
            }
        },

        renderStartPage() {
            const div = document.createElement('div');
            div.setAttribute('id', 'start-content');

            const title = document.createElement('p');
            title.setAttribute('id', 'title');
            title.textContent = 'BATTLESHIP';

            const form = document.createElement('form');
            form.setAttribute('id', 'start-form');

            const nameInput = document.createElement('input');
            nameInput.setAttribute('type', 'text');
            nameInput.setAttribute('id', 'name-input');
            nameInput.setAttribute('name', 'name');
            nameInput.setAttribute('placeholder', 'YOUR NAME');
            nameInput.setAttribute('required', '');

            const startButton = document.createElement('button');
            startButton.setAttribute('type', 'submit');
            startButton.setAttribute('id', 'start-button');
            startButton.textContent = 'START';

            form.appendChild(nameInput);
            form.appendChild(startButton);
            div.appendChild(title);
            div.appendChild(form);

            document.body.appendChild(div);
        },

        renderGamePage(playerName) {
            const playerContainer = document.createElement('div');
            playerContainer.className = 'score-game-container';

            const computerContainer = document.createElement('div');
            computerContainer.className = 'score-game-container';

            const gameContentDiv = document.createElement('div');
            gameContentDiv.id = 'game-content';

            const axisButton = document.createElement('button');
            axisButton.id = 'axis-button';
            axisButton.innerHTML = "Horizontal"

            const playerText = document.createElement('p');
            playerText.innerHTML = playerName;
            playerText.id = 'player-name';

            const computerText = document.createElement('p');
            computerText.innerHTML = 'Computer';

            const message = document.createElement('p');
            message.id = 'message';
            message.innerText = 'Place your ships!';

            const playerGameboardDiv = document.createElement('div');
            playerGameboardDiv.className = 'gameboard';

            for (let i = 0; i < 100; i++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'player-cell';
                cellDiv.setAttribute('data-state', 'empty');
                cellDiv.setAttribute('data-row', Math.floor(i / 10));
                cellDiv.setAttribute('data-column', i % 10);
                cellDiv.addEventListener("mouseover", function () {
                    this.style.opacity = "50%";
                });
                cellDiv.addEventListener("mouseleave", function () {
                    this.style.opacity = "100%";
                });
                playerGameboardDiv.appendChild(cellDiv);
            }

            const computerGameboardDiv = document.createElement('div');
            computerGameboardDiv.className = 'gameboard';

            for (let i = 0; i < 100; i++) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'computer-cell';
                cellDiv.setAttribute('data-state', 'empty');
                cellDiv.setAttribute('data-row', Math.floor(i / 10));
                cellDiv.setAttribute('data-column', i % 10);
                cellDiv.addEventListener("mouseover", function () {
                    this.style.opacity = "50%";
                });
                cellDiv.addEventListener("mouseleave", function () {
                    this.style.opacity = "100%";
                });
                computerGameboardDiv.appendChild(cellDiv);
            }

            this.resetPage();
            playerContainer.append(playerText, playerGameboardDiv, axisButton)
            computerContainer.append(computerText, computerGameboardDiv)
            gameContentDiv.append(playerContainer, computerContainer);
            document.body.append(message, gameContentDiv);
        },

        renderEndGame() {
            const endDiv = document.createElement('div');
            endDiv.id = 'end-div';

            const againButton = document.createElement('button');
            againButton.innerText = "Play again"
            againButton.id = 'again-button';

            const backButton = document.createElement('button');
            backButton.innerText = "Back"
            backButton.id = 'back-button';

            document.body.append(endDiv, againButton, backButton);
        },

        resetPage() {
            document.body.innerHTML = '';
        },

        changeMessage(newMessage) {
            document.querySelector('#message').innerText = newMessage;
        },

        attack(cell, row, column) {
            const currentCell = document.querySelector('.' + cell + `[data-row="${row}"][data-column="${column}"]`);
            if (currentCell.dataset.state === 'placed') {
                currentCell.style.backgroundColor = 'red';
            } else {
                currentCell.style.backgroundColor = 'green';
            }
            currentCell.style.pointerEvents = "none";
            currentCell.setAttribute('data-state', 'attacked');
        }
    }
}

export { createDOM };