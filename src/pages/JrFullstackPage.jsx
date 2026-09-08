import { useEffect } from "react";
import { useJrFullstackTask } from "../hooks/useJrFullstackTask";
import LandingScreen from "../components/jnr-fullstack/LandingScreen";
import TaskApp from "../components/jnr-fullstack/TaskApp";
import ExpiredOverlay from "../components/jnr-fullstack/ExpiredOverlay";
import SubmittedScreen from "../components/jnr-fullstack/SubmittedScreen";
import "../components/jnr-fullstack/jnr-fullstack.css";

export default function JrFullstackPage() {
  const task = useJrFullstackTask();

  useEffect(() => {
    document.title = "Ottermap — Junior Full Stack Developer Qualifier Task";
    document.body.classList.add("jnr-fullstack-active");
    return () => document.body.classList.remove("jnr-fullstack-active");
  }, []);

  return (
    <div className="jnr-page">
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
    </div>
  );
}
