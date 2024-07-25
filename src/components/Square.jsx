export default function Square({
  children,
  hasBomb,
  exposed,
  flagged,
  handleExposure,
  handleFlag,
}) {
  return (
    <>
      <button
        className="square"
        onClick={() => handleExposure()}
        onAuxClick={() => handleFlag()}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          background: hasBomb ? "#201a00" : "#a89128",
          border: "0.5px solid #6b4e10",
        }}
      >
        <div
          className="cover"
          style={{
            background: "#41b325",
            zIndex: exposed ? "-1" : "1",
          }}
        >
          {flagged ? "🚩" : ""}
        </div>
        {children === 1 ? (
          <p style={{ color: "blue" }}>{children}</p>
        ) : children === 2 ? (
          <p style={{ color: "green" }}>{children}</p>
        ) : children === 3 ? (
          <p style={{ color: "red" }}>{children}</p>
        ) : children === 4 ? (
          <p style={{ color: "purple" }}>{children}</p>
        ) : children === 5 ? (
          <p style={{ color: "orange" }}>{children}</p>
        ) : children === 6 ? (
          <p style={{ color: "yellow" }}>{children}</p>
        ) : children === 7 ? (
          <p style={{ color: "pink" }}>{children}</p>
        ) : (
          <p>{children}</p>
        )}
      </button>
    </>
  );
}
