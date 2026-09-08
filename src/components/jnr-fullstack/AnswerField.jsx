export default function AnswerField({
  id,
  label,
  placeholder,
  rows = 8,
  value,
  onChange,
  disabled,
  code = false,
}) {
  return (
    <>
      <label htmlFor={`jnr-ans-${id}`} className="jnr-answer-label">
        {label}
      </label>
      <textarea
        id={`jnr-ans-${id}`}
        className={code ? "jnr-code-area" : undefined}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
      <div className="jnr-char-count">{value.length} characters</div>
    </>
  );
}
