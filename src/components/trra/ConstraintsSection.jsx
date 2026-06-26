import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { DONT_ITEMS } from "./trraData";

export default function ConstraintsSection() {
  return (
    <RevealSection>
      <SectionLabel>Hard constraints</SectionLabel>
      <h2>What not to do</h2>
      <ul className="trra-dont-list">
        {DONT_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </RevealSection>
  );
}
