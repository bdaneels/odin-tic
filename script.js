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

  const reset = () => {
    boardArray = [1, 2, 3, 4, 6, 7, 8, 9];
    gameboardDivs.forEach((div) => {
      div.innerHTML = "";
    });
  };

  return {
    getBoardArray,
    clear,
    reset,
  };
})();

const Player = (name, symbol) => {
  let turns = 4;
  const getName = () => name;
  const getTurns = () => turns;
  const setTurns = (number) => (turns = number);
  const getSymbol = () => symbol;
  const subtractTurn = () => (turns -= 1);
  return { getName, getTurns, getSymbol, subtractTurn, setTurns };
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
      activePlayer.setTurns(5);
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
        setTimeout(() => {
          DisplayController.newGameQuery();
        }, 900);
        return "win";
      }
    }
    if (playerOne.getTurns() === 0 && playerTwo.getTurns() === 0) {
      return "draw";
    }
  };

  const getActivePlayer = () => activePlayer;
  const playerClick = (div) => {
    let index = div.getAttribute("data");
    let array = Gameboard.getBoardArray();
    if (array[index] === "X" || array[index] === "O") {
      DisplayController.text("Can't click here, try again on an empty tile.");
    } else {
      array[index] = GameController.getActivePlayer().getSymbol();
      GameController.getActivePlayer().subtractTurn();
      div.innerHTML = array[index];
      GameController.checkWin();
      if (!GameController.checkWin()) {
        GameController.setActivePlayer();
      }
      if (GameController.checkWin() === "draw") {
        DisplayController.text(
          "It's a draw! click 'new game' to start a new game!"
        );
      }
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
  const newGameDiv = document.querySelector("#new-game");
  const newGameConfirmBtn = document.querySelector("#new-game-btn");
  const newGameCancelBtn = document.querySelector("#new-game-btn-cancel");

  const closeQuery = () => {
    newGameDiv.classList.add("hidden");
    newGameDiv.classList.remove("flex");
    newGameDiv.classList.remove("absolute");
  };

  newGameCancelBtn.addEventListener("click", () => closeQuery(), false);

  newGameConfirmBtn.addEventListener("click", () => {
    playerOne.setTurns(4);
    playerTwo.setTurns(4);
    GameController.setActivePlayer();
    Gameboard.reset();
    closeQuery();
  });

  const displayTurn = () => {
    scoreBoard.innerHTML =
      GameController.getActivePlayer().getName() + "'s turn.";
  };
  const text = (string) => {
    scoreBoard.innerHTML = string;
  };

  const newGameQuery = () => {
    newGameDiv.classList.remove("hidden");
    newGameDiv.classList.add("flex");
    newGameDiv.classList.add("absolute");
  };

  return {
    text,
    displayTurn,
    newGameQuery,
  };
})();

GameController.setActivePlayer();
DisplayController.displayTurn();
