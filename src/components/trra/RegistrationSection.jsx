const RULES = [
  {
    num: "01",
    text: (
      <>
        <strong>72-hour window.</strong> The timer starts the moment you register. Once started, it cannot be paused or
        reset.
      </>
    ),
  },
  {
    num: "02",
    text: (
      <>
        <strong>Read the full brief first.</strong> Sections unlock after registration. Review tickets, stack, and
        scoring before you write code.
      </>
    ),
  },
  {
    num: "03",
    text: (
      <>
        <strong>AI tools are allowed and expected.</strong> Document your AI workflow in the README — it is scored.
      </>
    ),
  },
  {
    num: "04",
    text: (
      <>
        <strong>One registration per candidate.</strong> Email and phone number must be unique. Duplicates are rejected.
      </>
    ),
  },
  {
    num: "05",
    text: (
      <>
        <strong>Submit before the deadline.</strong> After 72 hours the task locks and cannot be submitted.
      </>
    ),
  },
];

export default function RegistrationSection({
  candidateName,
  setCandidateName,
  candidateEmail,
  setCandidateEmail,
  candidatePhone,
  setCandidatePhone,
  canStart,
  isStarting,
  isRestoring,
  error,
  startTask,
}) {
  const emailInvalid =
    candidateEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail.trim());
  const phoneDigits = candidatePhone.replace(/\D/g, "");
  const phoneInvalid =
    candidatePhone.trim() && (phoneDigits.length < 10 || phoneDigits.length > 15);

  return (
    <section className="trra-section trra-registration" id="register">
      <div className="trra-section-label">Before you begin</div>
      <h2>Register to unlock the task brief</h2>
      <p>
        Enter your details to start the 72-hour clock. Once registered, you can read the full brief, tickets, and
        submission requirements below.
      </p>

      <div className="trra-register-rules">
        <h3>Rules</h3>
        <ul>
          {RULES.map((rule) => (
            <li key={rule.num}>
              <span className="rule-num">{rule.num}</span>
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="trra-register-form">
        <div className="trra-field">
          <label htmlFor="trra-name">Your full name</label>
          <input
            id="trra-name"
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            autoComplete="name"
            disabled={isRestoring || isStarting}
          />
        </div>

        <div className="trra-field">
          <label htmlFor="trra-email">Email address</label>
          <input
            id="trra-email"
            type="email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            placeholder="e.g. priya@email.com"
            autoComplete="email"
            className={emailInvalid ? "invalid" : ""}
            disabled={isRestoring || isStarting}
          />
          {emailInvalid && <p className="trra-field-error">Enter a valid email address.</p>}
        </div>

        <div className="trra-field">
          <label htmlFor="trra-phone">Phone number</label>
          <input
            id="trra-phone"
            type="tel"
            value={candidatePhone}
            onChange={(e) => setCandidatePhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            autoComplete="tel"
            className={phoneInvalid ? "invalid" : ""}
            disabled={isRestoring || isStarting}
          />
          {phoneInvalid && (
            <p className="trra-field-error">Enter a valid phone number (10–15 digits).</p>
          )}
        </div>

        {error && <p className="trra-form-error">{error}</p>}

        <button
          type="button"
          className="trra-register-btn"
          onClick={startTask}
          disabled={!canStart || isStarting || isRestoring}
        >
          {isRestoring ? "Restoring session…" : isStarting ? "Starting…" : "Start 72-Hour Window →"}
        </button>

        <p className="trra-register-warn">You cannot pause or restart once you begin.</p>
      </div>
    </section>
  );
}
