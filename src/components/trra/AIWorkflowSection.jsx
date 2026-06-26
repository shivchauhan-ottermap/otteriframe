import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { AI_QUESTIONS } from "./trraData";

export default function AIWorkflowSection() {
  return (
    <RevealSection>
      <SectionLabel>Mandatory — not optional</SectionLabel>
      <h2>The AI Workflow section in your README</h2>
      <p>
        Your README must include a section titled <code>## AI Workflow</code>. This is evaluated — not a formality.
      </p>
      <div className="trra-ai-section">
        <h3>Answer all four of these, specifically:</h3>
        <ul className="trra-ai-q-list">
          {AI_QUESTIONS.map((question, i) => (
            <li key={i}>
              <span className="q-num">Q{i + 1}</span>
              {question}
            </li>
          ))}
        </ul>
      </div>
      <div className="trra-callout trra-callout-warn trra-callout-spaced">
        <strong>Scoring note:</strong> A vague AI Workflow section ("I used Claude to speed up development") scores
        the same as no section at all — zero. A candidate who cannot articulate when they over-rode AI output is not the
        profile we're hiring for. This section is 10% of your total score and is a hard filter regardless of how good
        the code is.
      </div>
    </RevealSection>
  );
}
