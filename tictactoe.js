// Tic Tac Toe

const WINNING_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Create a game board with 2d array
    // It'll look like this:
    // board = [
    //     [0, 0, 0],
    //     [0, 0, 0],
    //     [0, 0, 0]
    // ]
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
    }

    // Get the current game board
    const getBoard = () => board;

    // Add value to the selected cell
    const addValue = (row, column, player) => {
        // If the cell is already filled with a value, then stop the function
        if (board[row][column].getValue() != 0) {
            console.log("Cell already filled.");
            return;
        }

        // If not, add player's sign
        board[row][column].changeValue(player);
    };

    // For checking the value in console
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((column) => column.getValue()));
        console.log(boardWithCellValues);
    };

    return {
        getBoard,
        addValue,
        printBoard
    };
}

function Cell() {
    // Assign initial value
    // 0: Cell is not filled yet
    // 1: X sign
    // 2: O sign
    let value = 0;

    // Change cell's value to player's sign
    const changeValue = (player) => {
        value = player;
    };

    // Get value of the cell
    const getValue = () => value;

    return {
        changeValue,
        getValue
    };
}

function GameController(playerX = "Player X", playerO = "Player O") {
    let board = Gameboard();

    const players = [
        {
            name: playerX,
            value: 1
        },
        {
            name: playerO,
            value: 2
        }
    ];

    let activePlayer = players[Math.floor(Math.random() * 2)];
    let gameActive = true;

    // This function is for switching between player
    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    // Select current active player
    const getActivePlayer = () => activePlayer;

    // Helpful for checking board condition on console
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    function checkWinner(board, playerValue) {
        // Flatten the board to simplify index-based winning condition checks
        const flatBoard = board.flat().map(cell => cell.getValue());
        
        // For every winning conditions, we check the board if it fulfills any of the condition
        return WINNING_CONDITIONS.some(condition => 
            condition.every(index => flatBoard[index] === playerValue)
        );
    }

    const playRound = (row, column) => {        
        if (!gameActive) {
            console.log("Game is over. Please reset the game to play again.");
            return;
        }
        
        console.log(`Assigning ${getActivePlayer().name} into row ${row}, column ${column}...`);

        board.addValue(parseInt(row), parseInt(column), getActivePlayer().value);

        if (checkWinner(board.getBoard(), getActivePlayer().value)) {
            board.printBoard();
            console.log(`${getActivePlayer().name} wins!`);
            gameActive = false;
            return;
        } else if (board.getBoard().flat().every(element => element.getValue() !== 0)) {
            // Check if all elements' values in the board is either 1 or 2 and no winning conditions are fulfilled, AKA tie
            board.printBoard();
            console.log(`Game ties.`);
            gameActive = false;
            return;
        }
        
        switchPlayerTurn();
        printNewRound();
    };

    const resetGame = () => {
        board = Gameboard();
    }

    printNewRound();

    return {
        checkWinner,
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        printBoard: board.printBoard,
        resetGame
    }
}

function ScreenController() {
    let game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resetDiv = document.querySelector('.reset');
  
    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";
    
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const checkWinner = game.checkWinner(board, activePlayer.value);
    
        // Display player's turn
        if (checkWinner) {
            playerTurnDiv.textContent = `${activePlayer.name} win!`;
        } else if (board.flat().every(element => element.getValue() !== 0) && checkWinner === false) {
            playerTurnDiv.textContent = `Game ties.`;
        } else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
        }
        // Render board squares
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
            // Anything clickable should be a button!!
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            // Create a data attribute to identify the column
            // This makes it easier to pass into our `playRound` function 
            cellButton.dataset.row = rowIndex;
            cellButton.dataset.column = columnIndex;
            const cellValue = cell.getValue();
            cellButton.textContent = cellValue === 1 ? "X" : cellValue === 2 ? "O" : "";
            boardDiv.appendChild(cellButton);
            })
        })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        // Make sure I've clicked a column and not the gaps in between
        if (selectedRow === undefined || selectedColumn === undefined) return;
        
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Add event listener for reset button
    resetDiv.addEventListener("click", () => {
        game.resetGame();
        game = GameController();
        updateScreen();
    });
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
document.addEventListener("DOMContentLoaded", ScreenController);