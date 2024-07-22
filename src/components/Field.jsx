export default function Field({ children, squares }) {
  return (
    <div
      className="field"
      style={{
        gridTemplateColumns: `repeat(${Math.sqrt(squares)}, 1fr)`,
        width: `calc(${Math.sqrt(squares)} * 30px)`,
      }}
    >
      {children}
    </div>
  );
}
