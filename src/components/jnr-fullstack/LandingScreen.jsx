import { isValidEmail, isValidPhone } from "../../utils/validation";

const RULES = [
  {
    num: "01",
    text: (
      <>
        <strong>45-minute window.</strong> The timer starts the moment you click Start. It cannot be
        paused or reset.
      </>
    ),
  },
  {
    num: "02",
    text: (
      <>
        <strong>5 parts, in order.</strong> Each part unlocks after the previous one. You may revisit
        earlier answers at any time.
      </>
    ),
  },
  {
    num: "03",
    text: (
      <>
        <strong>Part C requires real code.</strong> Write actual JavaScript / TypeScript — pseudocode
        will not score. Correctness matters more than completeness.
      </>
    ),
  },
  {
    num: "04",
    text: (
      <>
        <strong>Do not refresh the page.</strong> Progress is stored in the browser session. Refresh
        won&apos;t reset the timer, but may clear unsaved text.
      </>
    ),
  },
  {
    num: "05",
    text: (
      <>
        <strong>Submit before time runs out.</strong> When the timer hits 0:00, the form locks and
        cannot be submitted.
      </>
    ),
  },
];

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
  const emailInvalid = candidateEmail.trim() && !isValidEmail(candidateEmail);
  const phoneInvalid = candidatePhone.trim() && !isValidPhone(candidatePhone);

  return (
    <div className="jnr-landing">
      <div className="jnr-landing-inner">
      <div className="jnr-logo-mark">Ottermap · Hiring · 2026</div>
      <h1 className="jnr-landing-title">
        Junior Full Stack
        <br />
        Developer
        <br />
        Qualifier Task
      </h1>
      <p className="jnr-landing-sub">Full-Time · Remote / Hybrid · India</p>

      <div className="jnr-rules-box">
        <h3>Before you begin</h3>
        {RULES.map((rule) => (
          <div key={rule.num} className="jnr-rule-item">
            <span className="jnr-rule-num">{rule.num}</span>
            <span className="jnr-rule-text">{rule.text}</span>
          </div>
        ))}
      </div>

      <div className="jnr-fields">
        <div className="jnr-field">
          <label htmlFor="jnr-candidate-name">Your full name</label>
          <input
            type="text"
            id="jnr-candidate-name"
            className="jnr-name-input"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="e.g. Arjun Mehta"
            autoComplete="name"
          />
        </div>

        <div className="jnr-field">
          <label htmlFor="jnr-candidate-email">Email address</label>
          <input
            type="email"
            id="jnr-candidate-email"
            className={`jnr-name-input${emailInvalid ? " invalid" : ""}`}
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            placeholder="e.g. arjun@email.com"
            autoComplete="email"
          />
          {emailInvalid && <p className="jnr-field-error">Enter a valid email address.</p>}
        </div>

        <div className="jnr-field">
          <label htmlFor="jnr-candidate-phone">Phone number</label>
          <input
            type="tel"
            id="jnr-candidate-phone"
            className={`jnr-name-input${phoneInvalid ? " invalid" : ""}`}
            value={candidatePhone}
            onChange={(e) => setCandidatePhone(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            autoComplete="tel"
          />
          {phoneInvalid && (
            <p className="jnr-field-error">Enter a valid phone number (10–15 digits).</p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="jnr-start-btn"
        onClick={startTask}
        disabled={!canStart || isStarting}
      >
        {isStarting ? "Starting…" : "Start 45-Minute Timer →"}
      </button>
      <p className="jnr-warning-text">⚠ You cannot pause or restart once you begin.</p>
      </div>
    </div>
  );
}
