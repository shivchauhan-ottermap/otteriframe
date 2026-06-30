import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { SUBMIT_STEPS } from "./trraData";

export default function SubmitSection({
  answers,
  updateAnswer,
  onSubmit,
  isSubmitting,
  error,
  candidateName,
}) {
  return (
    <RevealSection id="submit">
      <SectionLabel>How to submit</SectionLabel>
      <h2>Submission checklist</h2>
      <div className="trra-submit-box">
        <h3>Before you send anything, verify:</h3>
        <ul className="trra-submit-steps">
          {SUBMIT_STEPS.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              {step}
            </li>
          ))}
        </ul>
        <div className="trra-ticket-field-label" style={{ marginTop: "0.5rem" }}>
          Email subject line
        </div>
        <div className="trra-submit-email">
          [Velocity Round 2] {candidateName || "Your Full Name"} — TER-S01 + TER-S02
        </div>
      </div>

      <div className="trra-submit-form">
        <h3>Submit your repository</h3>
        <p>Enter your GitHub link below. This is saved automatically and submitted when you click the button.</p>

        <div className="trra-field">
          <label htmlFor="trra-github">GitHub repository link</label>
          <input
            id="trra-github"
            type="url"
            value={answers.github_repo}
            onChange={(e) => updateAnswer("github_repo", e.target.value)}
            placeholder="https://github.com/your-username/velocity-zone-manager"
          />
        </div>

        <div className="trra-field">
          <label htmlFor="trra-notes">Additional notes (optional)</label>
          <textarea
            id="trra-notes"
            rows={4}
            value={answers.notes}
            onChange={(e) => updateAnswer("notes", e.target.value)}
            placeholder="Anything we should know when reviewing your submission…"
          />
        </div>

        {error && <p className="trra-form-error">{error}</p>}

        <button
          type="button"
          className="trra-register-btn"
          onClick={onSubmit}
          disabled={isSubmitting || !answers.github_repo?.trim()}
        >
          {isSubmitting ? "Submitting…" : "Submit Round 2 Task →"}
        </button>
      </div>

      <div className="trra-callout trra-callout-warn trra-callout-spaced-lg">
        <strong>No extensions will be granted.</strong> If you're facing a genuine technical blocker you cannot
        resolve, email hr@ottermap.com before the deadline — don't wait until after. Partial submissions that
        explain what's missing and why are evaluated more generously than silent no-shows.
      </div>
    </RevealSection>
  );
}
