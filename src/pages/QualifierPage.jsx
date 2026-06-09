import { useEffect } from "react";
import { useQualifierTask } from "../hooks/useQualifierTask";
import LandingScreen from "../components/qualifier/LandingScreen";
import TaskApp from "../components/qualifier/TaskApp";
import ExpiredOverlay from "../components/qualifier/ExpiredOverlay";
import SubmittedScreen from "../components/qualifier/SubmittedScreen";

export default function QualifierPage() {
  const task = useQualifierTask();

  useEffect(() => {
    document.title = "Ottermap × TerraSync — AI Builder Qualifier Task";
  }, []);

  return (
    <>
      {task.screen === "landing" && (
        <LandingScreen
          candidateName={task.candidateName}
          setCandidateName={task.setCandidateName}
          candidateEmail={task.candidateEmail}
          setCandidateEmail={task.setCandidateEmail}
          candidatePhone={task.candidatePhone}
          setCandidatePhone={task.setCandidatePhone}
          canStart={task.canStart}
          isStarting={task.isStarting}
          startTask={task.startTask}
        />
      )}

      {(task.screen === "task" || (task.screen === "expired" && task.showTaskContent)) && (
        <TaskApp {...task} />
      )}

      {task.screen === "expired" && <ExpiredOverlay />}

      {task.screen === "submitted" && (
        <SubmittedScreen submissionId={task.submissionId} />
      )}
    </>
  );
}
