export default function TrraTimerBar({ time, urgentTime, submissionId, elapsed }) {
  const progressPct = Math.max(0, Math.min(100, (1 - elapsed) * 100));

  return (
    <div className={`trra-timer-bar${urgentTime ? " urgent" : ""}`}>
      <div className="trra-timer-inner">
        <div className="trra-timer-left">
          <span className="trra-timer-label">Time remaining</span>
          <span className="trra-timer-value">
            {time.h}:{time.m}:{time.s}
          </span>
        </div>
        <div className="trra-timer-progress">
          <div className="trra-timer-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {submissionId && (
          <span className="trra-timer-id">{submissionId}</span>
        )}
      </div>
    </div>
  );
}
