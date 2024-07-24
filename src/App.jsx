import { useEffect, useState } from "react";
import Field from "./components/Field";
import Header from "./components/Header";
import Square from "./components/Square";

/*
  To do:
  - Criar condição de vitória e derrota
  - Arrumar a flag para desabilitar a possibilidade de expor o campo, quando flagged === true
  - Deixar com um CSS bonitin
*/

function App() {
  const [field, setField] = useState([]);
  const [difficulty, setDifficulty] = useState({
    difficulty: "easy",
    squares: 64,
    bombs: 10,
  });

  useEffect(() => {
    initGame();
  }, [difficulty]);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

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

  const handleFlag = (id) => {
    setField((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, flagged: !item.flagged } : item
      )
    );
  };

  const handleExposure = (id) => {
    exposeSquaresWithoutBombs(id);
  };

  const exposeSquaresWithoutBombs = (id) => {
    const width = Math.sqrt(difficulty.squares);

    const recursiveExpose = (squareId, fieldCopy) => {
      const neighbors = getNeighbors(squareId, width);

      fieldCopy[squareId].exposed = true;

      if (fieldCopy[squareId].bombsAround === "") {
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
