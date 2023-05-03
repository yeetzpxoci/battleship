function Ship(length) {
    return {
        length: length,
        hitCounter: 0,
        sunk: false,

        hit() {
            this.hitCounter++;
        },

        isSunk() {
            if (this.length - this.hitCounter == 0) {
                this.sunk = true;
            }
            return this.sunk;
        }
    };
}

function Gameboard() {
    // 5 4 3 3 2(5 ships in total)
    return {
        shipAmount: 5,
        shipLengths: [5, 4, 3, 3, 2],
        board: Array(10).fill(-1).map(x => Array(10).fill(-1)),
        currentShipID: 0,
        currentAxis: 0,
        ships: [],
        attackedCoords: [],

        canPlaceShipAt(row, column, axis, length) {
            if (axis == 0) {
                for (let i = 0; i < length; i++) {
                    if (column + i > 9 || this.board[row][column + i] != -1) {
                        return false;
                    }
                }
            } else {
                for (let i = 0; i < length; i++) {
                    if (row + i > 9 || this.board[row + i][column] != -1) {
                        return false;
                    }
                }
            }
            return true;
        }, 

        placeShip(row, column, axis) {
            const currentLength = this.shipLengths[this.currentShipID];
            if (this.canPlaceShipAt(row, column, axis, currentLength)) {
                const ship = Ship(currentLength);
                this.ships.push(ship);

                for (let i = 0; i < currentLength; i++) {
                    // 0 is x axis and 1 is y axis
                    if (axis == 0) {
                        this.board[row][column + i] = this.currentShipID;
                    } else {
                        this.board[row + i][column] = this.currentShipID;
                    }
                }
                this.currentShipID++;
            }
        },

        placeShipsRandomly() {
            let lengthCounter = 0;
            while (!this.readyToPlay()) {
                const randomRow = Math.floor(Math.random() * 10);
                const randomColumn = Math.floor(Math.random() * 10);
                const randomAxis = Math.round(Math.random());
                this.placeShip(randomRow, randomColumn, randomAxis);
                lengthCounter++;
            }
        },

        receiveAttack(row, column) {
            if (this.board[row][column] != -1) {
                this.ships[this.board[row][column]].hit();
                this.board[row][column] = -1;
            } 
            this.attackedCoords.push([row, column]);
        },

        allShipsSunk() {
            for (let i = 0; i < this.ships.length; i++) {
                if (!this.ships[i].isSunk()) {
                    return false;
                }
            }
            return true;
        },

        readyToPlay() {
            if (this.ships.length == this.shipAmount) {
                for (let i = 0; i < this.ships.length; i++) {
                    if (this.ships[i].hitCounter != 0) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    };
}

function Player(gameboard) {
    return {
        gameboard: gameboard,
        turn: true,

        attack(enemy, row, column) {
            enemy.gameboard.receiveAttack(row, column);
            this.turn = false;
            enemy.turn = true;
        }
    }
}

module.exports = { Ship, Gameboard, Player }