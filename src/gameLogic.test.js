const { Ship, Gameboard, Player } = require('./gameLogic')

describe('Ship', () => {
    describe('hit', () => {
        it('should increment the hitCounter by 1', () => {
            const ship = Ship(3);
            ship.hit();
            expect(ship.hitCounter).toBe(1);
        });
    });

    describe('isSunk', () => {
        it('should return false if the hitCounter is less than the length', () => {
            const ship = Ship(3);
            expect(ship.isSunk()).toBe(false);
            ship.hit();
            expect(ship.isSunk()).toBe(false);
        });

        it('should return true if the hitCounter is equal to the length', () => {
            const ship = Ship(3);
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });

        it('should set the sunk property to true if the hitCounter is equal to the length', () => {
            const ship = Ship(3);
            expect(ship.isSunk()).toBe(false);
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });
    });
});

describe('Gameboard', () => {
    describe('placeShip', () => {
        it('should place ship at given coordinates', () => {
            const board = Gameboard();
            board.placeShip(2, 2, 0);

            expect(board.board[2][2]).toBe(0);
            expect(board.board[2][3]).toBe(0);
            expect(board.board[2][4]).toBe(0);
            expect(board.board[2][5]).toBe(0);
            expect(board.board[2][6]).toBe(0);

            board.placeShip(3, 2, 0);
            expect(board.board[3][2]).toBe(1);
        });
    });  

    describe('placeShipsRandomly', () => {
        it('should place ships randomly', () => {
            const board = Gameboard();
            expect(board.readyToPlay()).toBe(false);
            board.placeShipsRandomly();
            expect(board.readyToPlay()).toBe(true);
        });
    }); 

    describe('receiveAttack', () => {
        it('should receive and register the attack to the according ship', () => {
            const board = Gameboard();
            board.placeShip(2, 2, 0);
            board.receiveAttack(2, 3);

            expect(board.board[2][2]).toBe(0);
            expect(board.board[2][3]).toBe(-1);
            expect(board.board[2][4]).toBe(0);
            expect(board.ships[0].hitCounter).toBe(1);
        });
    });

    describe('canPlaceShipAt', () => {
        it('should check if a ship with given coord, axis and length can be placed', () => {
            const board = Gameboard();

            board.placeShip(2, 2, 0);
            expect(board.canPlaceShipAt(2, 2, 0, 5)).toBe(false);
            board.receiveAttack(2, 2);
            expect(board.canPlaceShipAt(2, 2, 0, 5)).toBe(false);
            board.receiveAttack(2, 3);
            expect(board.canPlaceShipAt(2, 2, 0, 5)).toBe(false);
            board.receiveAttack(2, 4)
            expect(board.canPlaceShipAt(2, 2, 0, 5)).toBe(false);
            board.receiveAttack(2, 5)
            expect(board.canPlaceShipAt(2, 2, 0, 5)).toBe(false);
            board.receiveAttack(2, 6)
            expect(board.canPlaceShipAt(2, 2, 0, 5)).toBe(true);
        });
    });

    describe('allShipsSunk', () => {
        it('should check if all ships are sunk', () => {
            const board = Gameboard();
            board.placeShip(2, 2, 0);
            board.receiveAttack(2, 2);
            board.receiveAttack(2, 3);

            expect(board.allShipsSunk()).toBe(false);

            board.receiveAttack(2, 4);
            board.receiveAttack(2, 5);
            board.receiveAttack(2, 6);

            expect(board.allShipsSunk()).toBe(true);            
        });
    });

    describe('readyToPlay', () => {
        it('should check if a player placed all ships and gameboard is ready for the game', () => {
            const board = Gameboard();
            board.placeShip(2, 2, 0);
            expect(board.readyToPlay()).toBe(false);
            board.placeShip(3, 3, 0);
            expect(board.readyToPlay()).toBe(false);
            board.placeShip(4, 4, 0);
            expect(board.readyToPlay()).toBe(false);
            board.placeShip(5, 5, 0);
            expect(board.readyToPlay()).toBe(false);
            board.placeShip(6, 6, 0);
            expect(board.readyToPlay()).toBe(true);
        });
    });
});

describe('Player', () => {
    describe('attack', () => {
        it('should attack on enemy gameboard', () => {
            const playerGameboard = Gameboard();
            const player = Player(playerGameboard);

            const enemyGameboard = Gameboard();
            const enemy = Player(enemyGameboard);

            enemyGameboard.placeShip(2, 2, 0);
            expect(enemy.Gameboard.board[2][2]).toBe(0)
            player.attack(enemy, 2, 2);
            expect(enemy.Gameboard.board[2][2]).toBe(-1)
        })
    })
})