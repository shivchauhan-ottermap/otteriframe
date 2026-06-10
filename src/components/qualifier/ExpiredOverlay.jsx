export default function ExpiredOverlay() {
  return (
    <div className="fixed inset-0 z-[200] bg-bg/97 flex flex-col items-center justify-center text-center p-4 sm:p-8 overflow-y-auto">
      <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">⏱</div>
      <div className="font-sans font-extrabold text-2xl sm:text-4xl text-danger mb-3">
        Time&apos;s Up
      </div>
      <p className="text-muted text-sm max-w-[400px] leading-relaxed px-2">
        The 45-minute window has closed. Your task can no longer be submitted.
        <br />
        <br />
        If you believe this is an error, contact{" "}
        <strong className="text-text break-all">hr@ottermap.com</strong>
      </p>
    </div>
  );
}
