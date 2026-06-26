import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import { TIMELINE_ITEMS } from "./trraData";

export default function TimelineSection() {
  return (
    <RevealSection id="timeline">
      <SectionLabel>Schedule</SectionLabel>
      <h2>72-hour window — no extensions</h2>
      <div className="trra-timeline">
        {TIMELINE_ITEMS.map((item) => (
          <div key={item.title} className="trra-tl-item">
            <div className={`trra-tl-dot${item.active ? " active" : ""}`} />
            <div className="trra-tl-day">
              {item.day.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < item.day.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="trra-tl-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
