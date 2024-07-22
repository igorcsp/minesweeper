export default function Square({ children, hasBomb }) {
  function handleLeftClick() {
    console.log("left click");
  }

  function handleRightClick() {
    console.log("right click");
  }

  return (
    <div
      className="square"
      onClick={handleLeftClick}
      onAuxClick={handleRightClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{ background: hasBomb ? "black" : "white" }}
    >
      {children}
    </div>
  );
}
