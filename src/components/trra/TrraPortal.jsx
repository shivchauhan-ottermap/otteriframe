import "./trra.css";
import { useTrraTask } from "../../hooks/useTrraTask";
import useStickyNav from "./useStickyNav";
import StickyNav from "./StickyNav";
import Hero from "./Hero";
import RegistrationSection from "./RegistrationSection";
import TrraTimerBar from "./TrraTimerBar";
import TrraExpiredOverlay from "./TrraExpiredOverlay";
import TrraSubmittedScreen from "./TrraSubmittedScreen";
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
  const task = useTrraTask();
  const navVisible = useStickyNav();
  const isActive = task.screen === "active";
  const showBrief = isActive || task.screen === "expired";

  return (
    <div className={`trra-page${isActive ? " trra-has-timer" : ""}`}>
      {isActive && (
        <TrraTimerBar
          time={task.time}
          urgentTime={task.urgentTime}
          submissionId={task.submissionId}
          elapsed={task.elapsed}
        />
      )}

      {showBrief && <StickyNav visible={navVisible} />}

      <Hero />

      <div className="trra-page-wrap">
        {task.screen === "register" && (
          <RegistrationSection
            candidateName={task.candidateName}
            setCandidateName={task.setCandidateName}
            candidateEmail={task.candidateEmail}
            setCandidateEmail={task.setCandidateEmail}
            candidatePhone={task.candidatePhone}
            setCandidatePhone={task.setCandidatePhone}
            canStart={task.canStart}
            isStarting={task.isStarting}
            isRestoring={task.isRestoring}
            error={task.error}
            startTask={task.startTask}
          />
        )}

        {showBrief && (
          <>
            <BriefSection />
            <TicketsSection />
            <StackSection />
            <AIWorkflowSection />
            <ConstraintsSection />
            <BonusSection />
            <ScoringSection />
            <TimelineSection />
            <SubmitSection
              answers={task.answers}
              updateAnswer={task.updateAnswer}
              onSubmit={task.submitTask}
              isSubmitting={task.isSubmitting}
              error={task.error}
              candidateName={task.candidateName}
            />
          </>
        )}
      </div>

      {showBrief && <TrraFooter />}

      {task.screen === "expired" && <TrraExpiredOverlay />}
      {task.screen === "submitted" && <TrraSubmittedScreen submissionId={task.submissionId} />}
    </div>
  );
}
