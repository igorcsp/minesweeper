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
      <div className="cover" />
      <div
        className="square"
        onClick={() => handleExposure()}
        onAuxClick={() => handleFlag()}
        onContextMenu={(e) => e.preventDefault()}
        style={{ background: hasBomb ? "black" : "white" }}
      >
        <div
          className="cover"
          style={{
            // background: flagged ? "red" : "green",
            zIndex: exposed ? "-1" : "1",
          }}
        />
        {children}
      </div>
    </>
  );
}
