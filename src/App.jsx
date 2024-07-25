import { useEffect, useState } from "react";
import Field from "./components/Field";
import Header from "./components/Header";
import Square from "./components/Square";

/*
  To do:
  - Fazer com que o primeiro clique seja sempre um grande espaço vazio
  - Deixar com um CSS bonitin
*/

function App() {
  const [field, setField] = useState([]);
  const [difficulty, setDifficulty] = useState({
    difficulty: "easy",
    squares: 64,
    bombs: 10,
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const bombedSquares = () => {
    let arr = [];
    for (let i = 0; i < difficulty.bombs; i++) {
      arr.push(true);
    }
    for (let i = 0; i < difficulty.squares - difficulty.bombs; i++) {
      arr.push(false);
    }
    return shuffle(arr);
  };

  const initGame = () => {
    const amountOfSquares = difficulty.squares;
    const bombedSquaresArr = bombedSquares();
    const arrayOfFalses = Array(difficulty.squares).fill(false);

    let arr = [];
    for (let i = 0; i < amountOfSquares; i++) {
      const squareObj = {
        id: i,
        hasBomb: bombedSquaresArr[i],
        bombsAround: "",
        exposed: arrayOfFalses[i],
        flagged: arrayOfFalses[i],
      };
      arr.push(squareObj);
    }
    setField(numberOfBombsAround(arr));
  };

  const handleDifficultyChange = (difficultyObject) => {
    setDifficulty(difficultyObject);
  };

  const handleExposure = (id) => {
    if (field[id].flagged) return;

    exposeSquaresWithoutBombs(id);

    checkWinOrLose();
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
      console.log("Você perdeu!");
    } else if (allSafeSquaresExposed) {
      setGameOver(true);
      setGameWon(true);
      console.log("Você ganhou!");
    }
  };

  const handleFlag = (id) => {
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
      <h1>MineSweeper</h1>
      <Header onDifficultyChange={handleDifficultyChange} />
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

      <button onClick={initGame}>Restart game</button>
    </div>
  );
}

export default App;
