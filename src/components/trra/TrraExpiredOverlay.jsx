export default function TrraExpiredOverlay() {
  return (
    <div className="trra-overlay">
      <div className="trra-overlay-icon">⏱</div>
      <h2>72-Hour Window Ended</h2>
      <p>
        Your submission window has closed. The task can no longer be submitted.
        <br />
        <br />
        If you believe this is an error, contact{" "}
        <strong>hr@ottermap.com</strong>
      </p>
    </div>
  );
}
