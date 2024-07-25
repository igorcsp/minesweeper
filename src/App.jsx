import { useEffect, useState } from "react";
import Field from "./components/Field";
import Header from "./components/Header";
import Square from "./components/Square";
import ConfettiExplosion from "react-confetti-explosion";

function App() {
  const [field, setField] = useState([]);
  const [difficulty, setDifficulty] = useState({
    difficulty: "fácil",
    squares: 64,
    bombs: 10,
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [confettiExplosion, setConfettiExplosion] = useState(false);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const initGameAfterFirstClick = (firstClickId) => {
    const width = Math.sqrt(difficulty.squares);
    const safeArea = [firstClickId, ...getNeighbors(firstClickId, width)];

    let bombedSquaresArr = new Array(difficulty.squares).fill(false);
    let bombsPlaced = 0;

    while (bombsPlaced < difficulty.bombs) {
      const randomIndex = Math.floor(Math.random() * difficulty.squares);
      if (!bombedSquaresArr[randomIndex] && !safeArea.includes(randomIndex)) {
        bombedSquaresArr[randomIndex] = true;
        bombsPlaced++;
      }
    }

    let newField = bombedSquaresArr.map((hasBomb, index) => ({
      id: index,
      hasBomb,
      bombsAround: "",
      exposed: false,
      flagged: false,
    }));

    setConfettiExplosion(false);
    newField = numberOfBombsAround(newField);
    setField(newField);
    setIsFirstClick(false);
    exposeSquaresWithoutBombs(firstClickId);
  };

  const initGame = () => {
    const emptyField = Array(difficulty.squares)
      .fill(null)
      .map((_, index) => ({
        id: index,
        hasBomb: false,
        bombsAround: "",
        exposed: false,
        flagged: false,
      }));

    setConfettiExplosion(false);
    setField(emptyField);
    setIsFirstClick(true);
    setGameOver(false);
    setGameWon(false);
  };

  const handleDifficultyChange = (difficultyObject) => {
    setDifficulty(difficultyObject);
  };

  const checkWinOrLose = () => {
    const bombExposed = field.some(
      (square) => square.exposed && square.hasBomb
    );
    const allSafeSquaresExposed = field.every(
      (square) => square.hasBomb || square.exposed
    );

    if (bombExposed) {
      setGameOver(true);
      setGameWon(false);
    } else if (allSafeSquaresExposed) {
      setGameOver(true);
      setGameWon(true);
      setConfettiExplosion(true);
    }
  };

  const handleExposure = (id) => {
    if (gameOver) return;
    if (field[id].flagged) return;

    if (isFirstClick) {
      initGameAfterFirstClick(id);
    } else {
      exposeSquaresWithoutBombs(id);
    }

    checkWinOrLose();
  };

  const handleFlag = (id) => {
    if (gameOver) return;

    setField((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged } : item
      )
    );
  };

  const exposeSquaresWithoutBombs = (id) => {
    const width = Math.sqrt(difficulty.squares);

    const recursiveExpose = (squareId, fieldCopy) => {
      const neighbors = getNeighbors(squareId, width);

      fieldCopy[squareId].exposed = true;

      if (
        fieldCopy[squareId].bombsAround === "" &&
        !fieldCopy[squareId].hasBomb
      ) {
        neighbors.forEach((neighborId) => {
          if (
            !fieldCopy[neighborId].exposed &&
            !fieldCopy[neighborId].hasBomb
          ) {
            recursiveExpose(neighborId, fieldCopy);
          }
        });
      }

      return fieldCopy;
    };

    setField((prevField) => {
      const newField = [...prevField];
      return recursiveExpose(id, newField);
    });
  };

  const getNeighbors = (id, width) => {
    const row = Math.floor(id / width);
    const col = id % width;
    const neighbors = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;

        if (newRow >= 0 && newRow < width && newCol >= 0 && newCol < width) {
          const neighborId = newRow * width + newCol;
          neighbors.push(neighborId);
        }
      }
    }

    return neighbors;
  };

  const numberOfBombsAround = (field) => {
    const width = Math.sqrt(difficulty.squares);

    return field.map((square) => {
      if (square.hasBomb) return square;

      let count = 0;
      const neighbors = getNeighbors(square.id, width);
      neighbors.forEach((neighborId) => {
        if (field[neighborId].hasBomb) {
          count++;
        }
      });

      return count === 0
        ? { ...square, bombsAround: "" }
        : { ...square, bombsAround: count };
    });
  };

  return (
    <div className="app">
      {confettiExplosion && <ConfettiExplosion zIndex={3} />}
      <h1>MineSweeper</h1>
      <Header
        onDifficultyChange={handleDifficultyChange}
        squares={difficulty.squares}
        initGame={() => initGame()}
      />
      <Field squares={difficulty.squares}>
        {field.map((item) => (
          <Square
            key={item.id}
            exposed={item.exposed}
            flagged={item.flagged}
            hasBomb={item.hasBomb}
            handleExposure={() => handleExposure(item.id)}
            handleFlag={() => handleFlag(item.id)}
          >
            {item.hasBomb ? "💣" : item.bombsAround}
          </Square>
        ))}
      </Field>
    </div>
  );
}

export default App;
