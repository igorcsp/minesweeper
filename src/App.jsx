import { useEffect, useState } from "react";
import Field from "./components/Field";
import Header from "./components/Header";
import Square from "./components/Square";

function App() {
  const [field, setField] = useState([]);
  const [difficulty, setDifficulty] = useState({
    difficulty: "medium",
    squares: 196,
    bombs: 40,
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
        id: i + 1,
        hasBomb: bombedSquaresArr[i],
        bombsAround: "", // number > essa aqui é foda
        exposed: arrayOfFalses[i],
        flaged: arrayOfFalses[i],
      };
      arr.push(squareObj);
    }
    setField(arr);
  };

  const handleDifficultyChange = (difficultyObject) => {
    setDifficulty(difficultyObject);
  };

  console.log(field);

  /*
    - Criar uma função para contar o número de bombas em volta e retornar esse valor
  */

  return (
    <div className="app">
      <h1>MineSweeper</h1>
      <Header onDifficultyChange={handleDifficultyChange} />
      <Field squares={difficulty.squares}>
        {field.map((item) => (
          <Square key={item.id} hasBomb={item.hasBomb}></Square>
        ))}
      </Field>

      <button onClick={initGame}>Restart game</button>
    </div>
  );
}

export default App;
