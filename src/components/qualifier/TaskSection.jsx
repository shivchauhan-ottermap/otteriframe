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
      id={`section-${id}`}
      className={`mb-8 sm:mb-10 relative transition-opacity duration-400 ${
        active ? "opacity-100 animate-fade-slide-up" : "opacity-35"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4 sm:mb-5 pb-3 border-b border-border">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <span className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase bg-accent/8 text-accent border border-accent/20 px-2.5 py-0.5 shrink-0">
            {partLabel}
          </span>
          <span className="font-sans font-bold text-sm sm:text-base text-text min-w-0">
            {title}
          </span>
        </div>
        <span className="text-[11px] text-muted flex items-center gap-1.5 sm:ml-auto shrink-0">
          {meta}
        </span>
      </div>

      {!locked && <div>{children}</div>}

      {locked && (
        <div className="flex items-center gap-3 px-4 py-4 sm:px-6 sm:py-5 border border-dashed border-border bg-surface text-muted text-xs tracking-wide">
          <span className="text-base opacity-50 shrink-0">🔒</span>
          <span>{lockMessage}</span>
        </div>
      )}
    </div>
  );
}
