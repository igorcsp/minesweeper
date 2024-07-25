import { useState, useEffect } from "react";

export default function Header({ onDifficultyChange, squares, initGame }) {
  const [difficulties] = useState([
    { difficulty: "fácil", squares: 64, bombs: 10 },
    { difficulty: "médio", squares: 196, bombs: 40 },
    { difficulty: "difícil", squares: 400, bombs: 99 },
  ]);

  const [selectedDifficulty, setSelectedDifficulty] = useState("médio");

  useEffect(() => {
    const selectedObject = difficulties.find(
      (d) => d.difficulty === selectedDifficulty
    );
    onDifficultyChange(selectedObject);
  }, [selectedDifficulty, difficulties, onDifficultyChange]);

  const handleChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  return (
    <header
      className="header"
      style={{
        width: `calc(${Math.sqrt(squares)} * 20px)`,
      }}
    >
      <select
        id="difficulty-select"
        value={selectedDifficulty}
        onChange={handleChange}
      >
        {difficulties.map((diff) => (
          <option key={diff.difficulty} value={diff.difficulty}>
            {diff.difficulty.charAt(0).toUpperCase() + diff.difficulty.slice(1)}
          </option>
        ))}
      </select>
      <button className="restart-btn" onClick={() => initGame()}>
        Restart game
      </button>
    </header>
  );
}
