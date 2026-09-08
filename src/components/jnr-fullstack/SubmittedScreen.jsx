export default function SubmittedScreen({ submissionId }) {
  return (
    <div className="jnr-submitted-screen">
      <div className="jnr-submitted-check">✓</div>
      <div className="jnr-submitted-title">Submission Received</div>
      <p className="jnr-submitted-sub">
        Your qualifier task has been submitted. Our team at Ottermap will review your responses and
        reach out within 5–7 business days if you&apos;re selected to proceed.
      </p>
      <div className="jnr-submitted-id">Submission ID: {submissionId}</div>
    </div>
  );
}
