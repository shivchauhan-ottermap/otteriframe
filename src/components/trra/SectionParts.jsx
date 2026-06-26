export default function SectionLabel({ children, className = "" }) {
  return <div className={`trra-section-label${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function FeatureGrid({ children, className = "" }) {
  return <div className={`trra-feature-grid${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function FeatureBlock({ title, items }) {
  return (
    <div className="trra-feature-block">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
