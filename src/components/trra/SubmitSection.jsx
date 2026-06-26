import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { SUBMIT_STEPS } from "./trraData";

export default function SubmitSection() {
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
        <div className="trra-submit-email">[Velocity Round 2] Your Full Name — TER-S01 + TER-S02</div>
      </div>
      <div className="trra-callout trra-callout-warn trra-callout-spaced-lg">
        <strong>No extensions will be granted.</strong> If you're facing a genuine technical blocker you cannot
        resolve, email hiring@ottermap.com before the deadline — don't wait until after. Partial submissions that
        explain what's missing and why are evaluated more generously than silent no-shows.
      </div>
    </RevealSection>
  );
}
