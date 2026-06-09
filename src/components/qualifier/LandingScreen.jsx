const RULES = [
  {
    num: "01",
    text: (
      <>
        <strong className="text-text font-semibold">45-minute window.</strong> The timer starts the
        moment you click Start. Once started, it cannot be paused or reset.
      </>
    ),
  },
  {
    num: "02",
    text: (
      <>
        <strong className="text-text font-semibold">5 parts, in order.</strong> Each part unlocks
        after the previous one. You may go back and edit earlier answers at any time.
      </>
    ),
  },
  {
    num: "03",
    text: (
      <>
        <strong className="text-text font-semibold">AI tools are allowed and expected.</strong> Be
        explicit about what you used and how — this is evaluated, not penalised.
      </>
    ),
  },
  {
    num: "04",
    text: (
      <>
        <strong className="text-text font-semibold">Do not refresh the page.</strong> Your progress
        is saved in the browser. A refresh will not reset the timer, but may clear unsaved text.
      </>
    ),
  },
  {
    num: "05",
    text: (
      <>
        <strong className="text-text font-semibold">Submit before time runs out.</strong> When the
        timer hits 0:00, the form locks and cannot be submitted.
      </>
    ),
  },
];

const inputClass =
  "w-full bg-surface border border-border-bright text-text font-mono text-base sm:text-sm px-4 py-3.5 outline-none transition-colors focus:border-accent placeholder:text-muted";

export default function LandingScreen({
  candidateName,
  setCandidateName,
  candidateEmail,
  setCandidateEmail,
  candidatePhone,
  setCandidatePhone,
  canStart,
  isStarting,
  startTask,
}) {
  const emailInvalid = candidateEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail.trim());
  const phoneDigits = candidatePhone.replace(/\D/g, "");
  const phoneInvalid = candidatePhone.trim() && (phoneDigits.length < 10 || phoneDigits.length > 15);

  return (
    <div className="fixed inset-0 z-[100] bg-bg overflow-y-auto overscroll-contain">
      <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className="font-sans font-extrabold text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-accent mb-8 sm:mb-12 flex items-center gap-2 sm:gap-3 max-w-full before:content-[''] before:hidden sm:before:block before:w-8 before:h-px before:bg-accent before:opacity-50 after:content-[''] after:hidden sm:after:block after:w-8 after:h-px after:bg-accent after:opacity-50">
          Ottermap × TerraSync · Qualifier
        </div>

        <h1 className="font-sans font-extrabold text-[1.75rem] sm:text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight mb-3 sm:mb-4 bg-linear-to-br from-white to-[#a0a0a0] bg-clip-text text-transparent px-2">
          AI-Augmented Builder
          <br />
          Qualifier Task
        </h1>

        <p className="text-muted text-xs sm:text-[13px] tracking-wide mb-8 sm:mb-12 max-w-[480px] px-2">
          Internship · Remote (India) · Batch 2026
        </p>

        <div className="border border-border bg-surface p-4 sm:p-6 md:p-8 max-w-[560px] w-full text-left mb-6 sm:mb-10">
          <h3 className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-accent mb-4 sm:mb-5">
            Before you begin
          </h3>
          {RULES.map((rule) => (
            <div key={rule.num} className="flex gap-3 sm:gap-4 mb-3 items-start">
              <span className="text-accent text-[11px] font-semibold min-w-5 pt-px shrink-0">
                {rule.num}
              </span>
              <span className="text-[#b0b0b0] text-xs sm:text-[13px] leading-relaxed">{rule.text}</span>
            </div>
          ))}
        </div>

        <div className="max-w-[560px] w-full mb-5 sm:mb-6 space-y-4">
          <div>
            <label
              htmlFor="candidate-name"
              className="block text-[11px] tracking-[0.15em] uppercase text-muted mb-2 text-left"
            >
              Your full name
            </label>
            <input
              type="text"
              id="candidate-name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="candidate-email"
              className="block text-[11px] tracking-[0.15em] uppercase text-muted mb-2 text-left"
            >
              Email address
            </label>
            <input
              type="email"
              id="candidate-email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              placeholder="e.g. priya@email.com"
              autoComplete="email"
              className={`${inputClass} ${emailInvalid ? "border-danger" : ""}`}
            />
            {emailInvalid && (
              <p className="text-[11px] text-danger mt-1 text-left">Enter a valid email address.</p>
            )}
          </div>

          <div>
            <label
              htmlFor="candidate-phone"
              className="block text-[11px] tracking-[0.15em] uppercase text-muted mb-2 text-left"
            >
              Phone number
            </label>
            <input
              type="tel"
              id="candidate-phone"
              value={candidatePhone}
              onChange={(e) => setCandidatePhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              autoComplete="tel"
              className={`${inputClass} ${phoneInvalid ? "border-danger" : ""}`}
            />
            {phoneInvalid && (
              <p className="text-[11px] text-danger mt-1 text-left">
                Enter a valid phone number (10–15 digits).
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={startTask}
          disabled={!canStart || isStarting}
          className="relative overflow-hidden bg-accent text-black border-none font-sans font-bold text-xs sm:text-[13px] tracking-[0.15em] uppercase px-8 sm:px-12 py-3.5 sm:py-4 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed w-full max-w-[560px] after:content-[''] after:absolute after:inset-0 after:bg-white/15 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
        >
          {isStarting ? "Starting…" : "Start 45-Minute Timer →"}
        </button>

        <p className="text-[11px] text-warn mt-4 tracking-wide max-w-[560px] px-2">
          ⚠ You cannot pause or restart once you begin.
        </p>
      </div>
    </div>
  );
}
