import RevealSection from "./RevealSection";
import SectionLabel, { FeatureGrid, FeatureBlock } from "./SectionParts";
import { BRIEF_FEATURES } from "./trraData";

export default function BriefSection() {
  return (
    <RevealSection id="brief">
      <SectionLabel>The brief</SectionLabel>
      <h2>What you're building — and why it exists</h2>
      <p>
        TerraSync's Velocity platform manages fleets of electric robotic mowers across commercial turf properties —
        golf courses, airports, corporate campuses. Mowers are assigned to <strong>zones</strong>: named areas defined by
        GeoJSON polygons drawn on a map. Operators create and manage zones through a web dashboard, assign mower counts,
        and monitor coverage.
      </p>
      <p>
        Your task is to build a simplified but real-feeling version of the <strong>Zone Manager</strong> — a core
        surface in Velocity. The patterns, API design, and database decisions you make here are exactly the kind of
        thing you'd ship on week one.
      </p>
      <FeatureGrid>
        {BRIEF_FEATURES.map((block) => (
          <FeatureBlock key={block.title} title={block.title} items={block.items} />
        ))}
      </FeatureGrid>
    </RevealSection>
  );
}
