import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { SCORE_ROWS } from "./trraData";

export default function ScoringSection() {
  return (
    <RevealSection id="scoring">
      <SectionLabel>Evaluation</SectionLabel>
      <h2>How your submission is scored</h2>
      <p>Total: 100 points. Pass threshold: 65 points, with AI Workflow never scoring zero.</p>
      <table className="trra-score-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>Weight</th>
            <th>What we look for</th>
          </tr>
        </thead>
        <tbody>
          {SCORE_ROWS.map((row) => (
            <tr key={row.area}>
              <td>{row.area}</td>
              <td>{row.weight}</td>
              <td>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="trra-callout trra-callout-spaced">
        <strong>Shortlist criteria:</strong> We target 10–20 candidates from this round. Candidates who score 65+ with
        a specific AI Workflow section proceed to Round 3. Any submission where <code>docker compose up --build</code>{" "}
        fails is automatically disqualified — we won't debug your setup.
      </div>
    </RevealSection>
  );
}
