const Gameboard = (() => {
  let boardArray = [1, 2, 3, 4, 6, 7, 8, 9];
  const gameboardDivs = document.querySelectorAll(".board-div");

  const clear = () => {
    gameboardDivs.forEach((div) => {
      div.innerHTML = "";
    });
  };
  const getBoardArray = () => boardArray;

  gameboardDivs.forEach((div) => {
    div.addEventListener("click", () => GameController.playerClick(div), false);
  });

  return {
    getBoardArray,
    clear,
  };
})();

const Player = (name, symbol) => {
  let turns = 3;
  const getName = () => name;
  const getTurns = () => turns;
  const getSymbol = () => symbol;
  const subtractTurn = () => (turns -= 1);
  return { getName, getTurns, getSymbol, subtractTurn };
};

const playerOne = Player("Player One", "X");
const playerTwo = Player("Player Two", "O");

const GameController = (() => {
  const playerArray = [playerOne, playerTwo];
  let activePlayer = "";
  const setActivePlayer = () => {
    if (activePlayer === "") {
      index = Math.floor(Math.random() * playerArray.length);
      activePlayer = playerArray[index];
    } else if (activePlayer.getName() === playerOne.getName()) {
      activePlayer = playerTwo;
    } else if (activePlayer.getName() === playerTwo.getName()) {
      activePlayer = playerOne;
    }
    DisplayController.displayTurn();
  };
  const checkWin = () => {
    let winCombArray = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];
    let array = Gameboard.getBoardArray();
    for (let i = 0; i < winCombArray.length; i++) {
      const [a, b, c] = winCombArray[i];
      if (array[a] === array[b] && array[b] === array[c]) {
        DisplayController.text(`${activePlayer.getName()} wins!`);
        return true;
      }
    }
  };

  const getActivePlayer = () => activePlayer;
  const playerClick = (div) => {
    let index = div.getAttribute("data");
    let array = Gameboard.getBoardArray();
    array[index] = GameController.getActivePlayer().getSymbol();
    GameController.getActivePlayer().subtractTurn();
    div.innerHTML = array[index];
    GameController.checkWin();
    if (!GameController.checkWin()) {
      GameController.setActivePlayer();
    }
  };

  return {
    getActivePlayer,
    setActivePlayer,
    checkWin,
    playerClick,
  };
})();

const DisplayController = (() => {
  const scoreBoard = document.querySelector("#display");
  const displayTurn = () => {
    scoreBoard.innerHTML =
      GameController.getActivePlayer().getName() + "'s turn.";
  };
  const text = (string) => {
    scoreBoard.innerHTML = string;
  };

  return {
    text,
    displayTurn,
  };
})();

GameController.setActivePlayer();
DisplayController.displayTurn();
