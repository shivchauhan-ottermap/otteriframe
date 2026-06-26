import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { BONUS_ITEMS } from "./trraData";

export default function BonusSection() {
  return (
    <RevealSection>
      <SectionLabel>Genuine differentiators</SectionLabel>
      <h2>Bonus — only if the core is solid</h2>
      <p>
        Don't attempt these if TER-S01 and TER-S02 aren't fully working. A complete core beats a flashy bonus every
        time.
      </p>
      <ul className="trra-bonus-list">
        {BONUS_ITEMS.map((item) => (
          <li key={item.strong}>
            <strong>{item.strong}</strong>
            {item.text}
          </li>
        ))}
      </ul>
    </RevealSection>
  );
}
