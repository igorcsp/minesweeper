import { useState, useEffect } from "react";

export default function Header({ onDifficultyChange }) {
  const [difficulties] = useState([
    { difficulty: "easy", squares: 64, bombs: 10 },
    { difficulty: "medium", squares: 196, bombs: 40 },
    { difficulty: "hard", squares: 400, bombs: 63 },
  ]);

  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");

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
    <header className="header">
      <label htmlFor="difficulty-select">Difficulty:</label>
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
    </header>
  );
}
