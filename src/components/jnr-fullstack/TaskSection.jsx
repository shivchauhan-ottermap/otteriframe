export default function TaskSection({
  id,
  partLabel,
  title,
  meta,
  locked,
  active,
  lockMessage,
  children,
}) {
  return (
    <div
      id={`jnr-section-${id}`}
      className={`jnr-task-section${active ? " active jnr-section-reveal" : ""}`}
    >
      <div className="jnr-section-header">
        <div className="jnr-section-heading">
          <span className="jnr-section-tag">{partLabel}</span>
          <span className="jnr-section-title">{title}</span>
        </div>
        <span className="jnr-section-meta">{meta}</span>
      </div>

      {!locked && <div>{children}</div>}

      {locked && (
        <div className="jnr-lock-overlay">
          <span className="jnr-lock-icon">🔒</span>
          <span>{lockMessage}</span>
        </div>
      )}
    </div>
  );
}
