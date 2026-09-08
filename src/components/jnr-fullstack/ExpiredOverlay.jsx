export default function ExpiredOverlay() {
  return (
    <div className="jnr-expired-overlay">
      <div className="jnr-expired-icon">⏱</div>
      <div className="jnr-expired-title">Time&apos;s Up</div>
      <p className="jnr-expired-sub">
        The 45-minute window has closed. Your task can no longer be submitted.
        <br />
        <br />
        If you believe this is an error, contact <strong>hr@ottermap.com</strong>
      </p>
    </div>
  );
}
