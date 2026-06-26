import RevealSection from "./RevealSection";
import SectionLabel, { FeatureGrid, FeatureBlock } from "./SectionParts";
import ApiCodeBlock from "./ApiCodeBlock";
import { STACK_FEATURES } from "./trraData";

export default function StackSection() {
  return (
    <RevealSection id="stack">
      <SectionLabel>Technical requirements</SectionLabel>
      <h2>Stack, APIs, and repo structure</h2>
      <p>These are not suggestions. Deviations on the required items will affect your score.</p>
      <FeatureGrid className="trra-feature-grid-tight">
        {STACK_FEATURES.map((block) => (
          <FeatureBlock key={block.title} title={block.title} items={block.items} />
        ))}
      </FeatureGrid>
      <SectionLabel className="trra-section-label-spaced">API contract</SectionLabel>
      <p>Minimum required endpoints. Additional endpoints are fine — don't remove any of these.</p>
      <ApiCodeBlock />
    </RevealSection>
  );
}
