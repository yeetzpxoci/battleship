import { Gameboard, Player } from "./gameLogic";
import { createDOM } from "./DOM"

const DOM = createDOM();

function handleCellClick(gameboard, element) {
    const currentRow = parseInt(element.dataset.row);
    const currentColumn = parseInt(element.dataset.column);
    DOM.placeShip(currentRow, currentColumn, gameboard.currentAxis, gameboard.shipLengths[gameboard.currentShipID]);
    gameboard.placeShip(currentRow, currentColumn, gameboard.currentAxis);
    console.log(gameboard);
}

function handleCellHover(gameboard, element) {
    const currentLength = gameboard.shipLengths[gameboard.currentShipID];
    const currentRow = parseInt(element.dataset.row);
    const currentColumn = parseInt(element.dataset.column);

    if (gameboard.currentAxis == 0 && currentColumn + currentLength <= 10) {
        for (let i = 0; i < currentLength; i++) {
            document.querySelector(`[data-row="${currentRow}"][data-column="${currentColumn + i}"]`).style.backgroundColor = 'white';
        }
    } else if (gameboard.currentAxis == 1 && currentRow + currentLength <= 10) {
        for (let i = 0; i < currentLength; i++) {
            document.querySelector(`[data-row="${currentRow + i}"][data-column="${currentColumn}"]`).style.backgroundColor = 'white';
        }
    }
}

function initializeGame() {
    const playerGameboard = Gameboard();

    document.querySelector('#axis-button').addEventListener('click', function () {
        if (this.innerText === 'Horizontal') {
            this.innerText = 'Vertical'
            playerGameboard.currentAxis = 1;
        } else {
            this.innerText = 'Horizontal'
            playerGameboard.currentAxis = 0;
        }
    }); 

    document.querySelectorAll('.player-cell').forEach(element => {
        element.addEventListener('click', function () {
            handleCellClick(playerGameboard, this);
            if (playerGameboard.readyToPlay()) {
                startGame(playerGameboard, computerGameboard);
            }
        });
        element.addEventListener('mouseover', () => handleCellHover(playerGameboard, element));
        element.addEventListener('mouseleave', function () {
            document.querySelectorAll('.player-cell[data-state=empty]').forEach(element => {
                element.style.backgroundColor = '';
            });
        });
    });

    const computerGameboard = Gameboard();
    computerGameboard.placeShipsRandomly();
    DOM.placeShipComputer(computerGameboard.board);
}

function enemyCellAttack(player, computer, cell) {
    const row = cell.dataset.row;
    const column = cell.dataset.column;
    player.attack(computer, row, column);
    DOM.attack('computer-cell', row, column);

    let randomRow = Math.floor(Math.random() * 10);
    let randomColumn = Math.floor(Math.random() * 10);
    while (player.gameboard.attackedCoords.some(coords => coords[0] === randomRow && coords[1] === randomColumn)) {
        randomRow = Math.floor(Math.random() * 10);
        randomColumn = Math.floor(Math.random() * 10);
    }
    computer.attack(player, randomRow, randomColumn);
    DOM.attack('player-cell', randomRow, randomColumn);

    if (player.gameboard.allShipsSunk()) {
        document.querySelector('#message').innerHTML('COMPUTER WON :(')
        endGame();
    } else if (computer.gameboard.allShipsSunk()) {
        console.log('YOU WON!')
        const playerName = document.querySelector('#player-name').innerText;
        document.querySelector('#message').innerText = playerName + ' WON! :)';
        endGame();
    }
}

function startGame(playerGameboard, computerGameboard) {
    const player = Player(playerGameboard);
    const computer = Player(computerGameboard);

    DOM.changeMessage('START!');
    
    document.querySelectorAll('.computer-cell[data-state=empty]').forEach(cell => {
        cell.addEventListener('click', () => enemyCellAttack(player, computer, cell));
    });

    document.querySelectorAll('.computer-cell[data-state=placed]').forEach(cell => {
        cell.addEventListener('click', () => enemyCellAttack(player, computer, cell));
    });
}

function endGame() {
    DOM.renderEndGame();

    document.querySelector('#again-button').addEventListener('click', function () {
        const playerName = document.querySelector('#player-name').innerText;
        DOM.resetPage();
        DOM.renderGamePage(playerName);
        initializeGame();
    });

    document.querySelector('#back-button').addEventListener('click', function () {
        DOM.resetPage();
        DOM.renderStartPage();
    });
}

const nameInput = document.querySelector('#name-input');

nameInput.oninvalid = function () {
    this.setCustomValidity("Please enter your name.");
};
nameInput.oninput = function () {
    this.setCustomValidity("");
};

const startButton = document.querySelector('#start-button');

startButton.addEventListener('click', function (event) {
    event.preventDefault(); // prevent the form from being submitted
    if (nameInput.checkValidity()) {
        // the form is valid, so execute your code here
        const playerName = document.querySelector('#name-input').value;
        DOM.renderGamePage(playerName);
        initializeGame();
    } else {
        // the form is invalid, so display an error message or take other action
        nameInput.reportValidity();
    }
});


