const HORIZONTAL_LINES = Array.from({ length: 17 }, (_, i) => 60 + i * 50);

export default function MowCanvas() {
  return (
    <svg
      className="trra-mow-canvas"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {HORIZONTAL_LINES.map((y) => (
        <line key={y} className="trra-mow-stripe" x1="0" y1={y} x2="1440" y2={y} />
      ))}
      <line
        className="trra-mow-stripe"
        x1="60"
        y1="0"
        x2="60"
        y2="900"
        strokeWidth="0.4"
        opacity="0.4"
      />
      <line
        className="trra-mow-stripe"
        x1="1380"
        y1="0"
        x2="1380"
        y2="900"
        strokeWidth="0.4"
        opacity="0.4"
      />
    </svg>
  );
}
