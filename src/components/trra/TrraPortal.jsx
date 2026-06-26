import "./trra.css";
import useStickyNav from "./useStickyNav";
import StickyNav from "./StickyNav";
import Hero from "./Hero";
import BriefSection from "./BriefSection";
import TicketsSection from "./TicketsSection";
import StackSection from "./StackSection";
import AIWorkflowSection from "./AIWorkflowSection";
import ConstraintsSection from "./ConstraintsSection";
import BonusSection from "./BonusSection";
import ScoringSection from "./ScoringSection";
import TimelineSection from "./TimelineSection";
import SubmitSection from "./SubmitSection";
import TrraFooter from "./TrraFooter";

export default function TrraPortal() {
  const navVisible = useStickyNav();

  return (
    <div className="trra-page">
      <StickyNav visible={navVisible} />
      <Hero />
      <div className="trra-page-wrap">
        <BriefSection />
        <TicketsSection />
        <StackSection />
        <AIWorkflowSection />
        <ConstraintsSection />
        <BonusSection />
        <ScoringSection />
        <TimelineSection />
        <SubmitSection />
      </div>
      <TrraFooter />
    </div>
  );
}
