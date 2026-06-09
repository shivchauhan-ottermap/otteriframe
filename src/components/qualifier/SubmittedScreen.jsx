export default function SubmittedScreen({ submissionId }) {
  return (
    <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center text-center p-4 sm:p-8 overflow-y-auto">
      <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-accent/15 border-2 border-accent flex items-center justify-center text-2xl sm:text-[32px] mb-6 sm:mb-8 animate-scale-in shrink-0">
        ✓
      </div>
      <div className="font-sans font-extrabold text-2xl sm:text-3xl text-text mb-3 px-2">
        Submission Received
      </div>
      <p className="text-muted text-sm max-w-[440px] leading-relaxed mb-6 sm:mb-8 px-2">
        Your qualifier task has been submitted successfully. Our team at Ottermap will review your
        responses and reach out within 5–7 business days if you are selected to proceed to the next
        stage.
      </p>
      <div className="font-mono text-[10px] sm:text-xs text-accent border border-accent/20 bg-accent/8 px-4 sm:px-5 py-2 tracking-widest max-w-full break-all mx-4">
        Submission ID: {submissionId}
      </div>
    </div>
  );
}
