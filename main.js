//Player Factory Function: 
const Player = (marker, turn, movesArr, win) => {
    movesArr = [];
    const addPlayerMoves = (move) => {
        movesArr.push(move);
    };

    return {
        marker,
        turn,
        taken: false,
        addPlayerMoves,
        movesArr,
        win: false
    };
};
//Game Board module: 
const gameBoard = (() => {
    let xPlayer;
    let oPlayer;   
    const board = document.querySelector('.gameboard');
    const resetBtn = document.querySelector('.restart-btn');
    let win = false;
    let tie = false;
    
    let boardArr = [{
        square1: '',
        taken: false
    }, {
        square2: '',
        taken: false
    }, {
        square3: '',
        taken: false
    }, {
        square4: '',
        taken: false
    }, {
        square5: '',
        taken: false
    }, {
        square6: '',
        taken: false
    }, {
        square7: '',
        taken: false
    }, {
        square8: '',
        taken: false
    }, {
        square9: '',
        taken: false
    }];

    const addDivs = (size) => {
        for (let i = 0; i < size * size; i++) {
            let createdDiv = document.createElement('div');
            board.appendChild(createdDiv);
            createdDiv.classList.add(`square${i + 1}`);
        }
    }

    const render = (size) => {
        board.setAttribute("style",
            `grid-template-columns:repeat(${size}, 1fr);
                grid-template-rows:repeat(${size}, 1fr);`);
    };

    const renderValues = () => {
        boardArr.forEach((square, i) => {
            document.querySelector(`.square${boardArr.indexOf(square) + 1}`).innerHTML = square[`square${i + 1}`];
        });
    };

    const newGame = () => {

        let gameEnded = false;
        xPlayer = Player('X', true);
        oPlayer = Player('O', false);       
        let result;
        displayController.controller.innerHTML = `X start...`;
        
        const addMarkers = (e) => {
            let currentSquare = e.target.classList.value;
            boardArr.forEach((square, i) => {
                let boardKeys = Object.keys(boardArr[boardArr.indexOf(square)]);

                if (boardKeys.includes(currentSquare) && !square.taken) {
                    displayController.showTurn(xPlayer.marker, oPlayer.marker, xPlayer.turn);
                    if (xPlayer.turn) {
                        square[`square${i + 1}`] = xPlayer.marker;
                        xPlayer.addPlayerMoves(currentSquare);
                        xPlayer.turn = false;
                        square.taken = true;
                    } else {
                        square[`square${i + 1}`] = oPlayer.marker;
                        oPlayer.addPlayerMoves(currentSquare);
                        oPlayer.turn = false;
                        xPlayer.turn = true;
                        square.taken = true;
                    }
                }
            });
            renderValues();

        }

        const findPattern = (player, e) => {

            const WINNING_PATTERN = [
                ['square1', 'square2', 'square3'],
                ['square4', 'square5', 'square6'],
                ['square7', 'square8', 'square9'],
                ['square1', 'square4', 'square7'],
                ['square2', 'square5', 'square8'],
                ['square3', 'square6', 'square9'],
                ['square1', 'square5', 'square9'],
                ['square3', 'square5', 'square7']
            ]

            win = WINNING_PATTERN.some((pattern, i) => {
                return pattern.every((item) => {
                    return player.movesArr.includes(item);
                });
            });
            win ? player.win = true : false;
            if (!player.win && xPlayer.movesArr.length === 5) {
                tie = true;
            }
            if (oPlayer.win || xPlayer.win || tie) {
                endGame();
            }
            return win;
        }
        const endGame = () => {
            gameEnded = true;
            if (xPlayer.win) {
                result = 'X wins!';
            } else if (oPlayer.win) {
                result = 'O wins!';
            } else if (!oPlayer.win && !xPlayer.win && xPlayer.movesArr.length === 5) {
                result = 'Tie game!';
            } else {
                result = undefined;
            }
            if (result) {
                board.removeEventListener('click', addMarkers);
            }
            displayController.showResult(result);

        }
         

        const restartGame = () => {
            boardArr.forEach((square, i) => {
                square[`square${i + 1}`] = '';
                square.taken = false;
            });
            if (oPlayer.win || xPlayer.win || tie) {
                board.removeEventListener('click', addMarkers);
            }
            renderValues();
            newGame();
        }
               
            board.addEventListener('click', addMarkers);

            board.addEventListener('click', (e) => {
                findPattern(xPlayer, e);
                findPattern(oPlayer, e);
            });
     

        resetBtn.addEventListener('click', restartGame);
    }
    return {
        boardArr,
        renderValues,
        addDivs,
        render,
        newGame,
    };
})();

const displayController = (() => {

    const controller = document.querySelector('.controller > h2');
    controller.innerHTML = `X start...`;
    const showTurn = (playerOne, playerTwo, turn) => {

        if (turn) {
            return controller.innerHTML = `${playerTwo}'s turn...`;
        }
        return controller.innerHTML = `${playerOne}'s turn...`;
    }

    const showResult = (result) => {
        if (result) {
            return controller.innerHTML = result;
        }
    };

    return {
        controller,
        showTurn,
        showResult
    }
})();

gameBoard.addDivs(3);
gameBoard.render(3);
gameBoard.newGame();
// gameBoard.renderValues();