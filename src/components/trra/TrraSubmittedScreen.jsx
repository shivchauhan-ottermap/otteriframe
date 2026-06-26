export default function TrraSubmittedScreen({ submissionId }) {
  return (
    <div className="trra-overlay">
      <div className="trra-overlay-icon success">✓</div>
      <h2>Submission Received</h2>
      <p>
        Your Round 2 submission has been recorded. Our team will review your work and reach out if you are shortlisted
        for Round 3.
      </p>
      <div className="trra-submission-id">Submission ID: {submissionId}</div>
    </div>
  );
}
