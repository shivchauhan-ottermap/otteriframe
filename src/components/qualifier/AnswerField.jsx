export default function AnswerField({ id, label, placeholder, rows = 8, value, onChange, disabled }) {
  return (
    <>
      <label
        htmlFor={`ans-${id}`}
        className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2"
      >
        {label}
      </label>
      <textarea
        id={`ans-${id}`}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full max-w-full bg-surface border border-border-bright text-text font-mono text-base sm:text-[13px] leading-relaxed p-3 sm:p-4 resize-y min-h-[120px] sm:min-h-[140px] outline-none transition-colors focus:border-accent placeholder:text-muted placeholder:opacity-60 disabled:opacity-50 break-words"
      />
      <div className="text-[11px] text-muted text-right mt-1.5">{value.length} characters</div>
    </>
  );
}
