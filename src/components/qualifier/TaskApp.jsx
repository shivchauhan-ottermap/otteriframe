import AnswerField from "./AnswerField";
import TaskSection from "./TaskSection";

function Code({ children }) {
  return (
    <code className="text-accent bg-accent/8 px-1.5 py-px break-all">{children}</code>
  );
}

export default function TaskApp({
  candidateName,
  answers,
  updateAnswer,
  unlocked,
  timerDisplay,
  timerClass,
  progressPct,
  progressColor,
  showSubmit,
  disabled,
  isSubmitting,
  submitTask,
}) {
  const activeDot = (
    <>
      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" /> ~5 min
    </>
  );

  return (
    <div className="relative z-[1] min-h-screen w-full max-w-[100vw]">
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-3 sm:py-0 sm:min-h-[60px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative">
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 min-w-0 w-full sm:w-auto">
          <span className="font-sans font-extrabold text-[11px] sm:text-[13px] tracking-wide sm:tracking-widest text-accent truncate">
            OTTERMAP × TERRASYNC
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted px-2 sm:px-2.5 py-0.5 border border-border bg-surface truncate max-w-[45%] sm:max-w-[200px] md:max-w-none shrink-0">
            {candidateName}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="text-[10px] tracking-[0.15em] uppercase text-muted">Time Remaining</div>
          <div
            className={`font-mono text-xl sm:text-[22px] font-semibold tracking-wide min-w-[72px] sm:min-w-[90px] text-right transition-colors ${timerClass}`}
          >
            {timerDisplay}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
          <div
            className={`h-full transition-all duration-1000 linear ${progressColor}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <main className="max-w-[860px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 sm:pb-32 lg:pb-24">
        <div className="mb-8 sm:mb-10 p-4 sm:p-6 md:p-8 border border-border bg-surface animate-fade-slide-up">
          <h1 className="font-sans font-extrabold text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight leading-tight mb-3">
            Qualifier Task
            <br />
            <span className="text-accent">Ottermap × TerraSync</span>
          </h1>
          <p className="text-[#a0a0a0] text-[13px] leading-relaxed max-w-[640px]">
            You&apos;ve been handed your first ticket on a live SaaS product.{" "}
            <span className="text-accent font-semibold">
              No PM. No design review. No morning standup call.
            </span>{" "}
            Everything happens in writing. The founder is in the US (EST). You work remotely from India.
          </p>
          <p className="text-[#a0a0a0] text-[13px] leading-relaxed max-w-[640px] mt-3">
            Your job is to show us how you think, communicate, and use AI tools — not to write
            production code. Read the ticket below carefully, then work through each of the five parts.
          </p>
        </div>

        <div className="border border-border bg-surface px-4 py-5 sm:px-6 sm:py-6 md:px-7 mb-6">
          <h4 className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-4">
            Context — Your working environment
          </h4>
          <p className="text-[#c0c0c0] text-[13px] leading-relaxed mb-3">
            You&apos;ve just joined <strong>TerraSync</strong> (via <strong>Ottermap</strong>) as an
            AI-Augmented Builder intern. TerraSync builds <strong>Velocity</strong> — a SaaS platform
            for Kress robotic-mower fleet optimization. The engineering team is small, async, and moves
            fast.
          </p>
          <p className="text-[#c0c0c0] text-[13px] leading-relaxed mb-3">
            The codebase is ~50,000 lines of code. The stack is{" "}
            <strong>React 19 + TypeScript</strong> on the frontend and{" "}
            <strong>Python/Flask + Supabase (Postgres)</strong> on the backend. Work is tracked in{" "}
            <strong>Linear</strong>. Communication happens in writing — not calls.
          </p>
          <p className="text-[#c0c0c0] text-[13px] leading-relaxed">
            It is <strong>Day 1</strong>. The founder (Wesley, EST) has just assigned you the following
            ticket.
          </p>
        </div>

        <div className="border border-accent bg-accent/8 px-4 py-5 sm:px-6 sm:py-6 md:px-7 mb-6 relative pt-8 sm:pt-6">
          <div className="absolute top-0 right-3 sm:-top-px sm:right-6 text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] bg-accent text-black font-bold px-2 sm:px-2.5 py-0.5 font-sans">
            LINEAR TICKET
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] text-accent font-semibold mb-1.5 tracking-wide break-words">
            TER-431 · Priority: High · Status: Backlog
          </div>
          <div className="font-sans text-base sm:text-[17px] font-bold text-text mb-4 leading-snug">
            Map-complete emails must link to production VELOCITY, not develop
          </div>
          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-0.5 font-sans bg-warn/15 text-warn border border-warn/30">
              High Priority
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-0.5 font-sans bg-accent/10 text-accent border border-accent/20">
              Python Backend
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-0.5 font-sans bg-danger/10 text-danger border border-danger/20">
              Customer-Facing
            </span>
          </div>
          <div className="mb-4">
            <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1.5">Description</div>
            <div className="text-[13px] text-[#c0c0c0] leading-relaxed">
              Customers are receiving map-completion notification emails that contain a link pointing to
              the <Code>develop</Code> environment (<Code>develop.velocity.app</Code>) instead of the
              production environment (<Code>app.velocity.app</Code>). Customers click the link and see an
              environment that doesn&apos;t match their live data — causing confusion and support tickets.
            </div>
          </div>
          <div className="mb-4">
            <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1.5">
              Acceptance Criteria
            </div>
            <ul className="list-none space-y-2">
              {[
                <>All map-complete email notifications link to <Code>app.velocity.app</Code></>,
                "The fix must not hardcode the URL as a string literal — it should be driven by an environment variable or config value",
                "No other email templates are affected by this change",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start text-[13px] text-[#c0c0c0] before:content-['▸'] before:text-accent before:text-[11px] before:min-w-3.5 before:pt-0.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1.5">Notes</div>
            <div className="text-[13px] text-[#c0c0c0] leading-relaxed">
              The email system uses the Python backend. The specific template file is not identified in
              this ticket.
            </div>
          </div>
        </div>

        <TaskSection
          id="a"
          partLabel="Part A"
          title="Clarifying Questions"
          meta={activeDot}
          locked={false}
          active={unlocked.has("a")}
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface2 border border-border px-2.5 py-0.5 mb-4">
            ⏱ Suggested: 5 minutes
          </div>
          <div className="font-sans text-sm sm:text-[15px] font-semibold text-text mb-4 leading-snug">
            What would you ask before starting — and what would you assume if no one replied?
          </div>
          <div className="text-xs text-muted mb-5 pl-3 sm:pl-4 border-l-2 border-border-bright leading-relaxed">
            List up to 3 clarifying questions. For each: (1) why you need that answer, and (2) what
            assumption you&apos;d make and run with if no one responded within 2 hours. If you have fewer
            than 3 questions, that&apos;s fine — don&apos;t pad.
          </div>
          <AnswerField
            id="a"
            label="Your answer"
            placeholder="E.g. — Q1: Is there a central email config file or is the URL set inline per-template? I need this to know whether to make one fix or N fixes. Assumption if no reply: I'll grep the codebase for the string 'develop.velocity.app' and fix all occurrences I find..."
            rows={8}
            value={answers.a}
            onChange={updateAnswer}
            disabled={disabled}
          />
        </TaskSection>

        <TaskSection
          id="b"
          partLabel="Part B"
          title="Implementation Plan"
          meta={unlocked.has("b") ? activeDot : "Unlocks after Part A"}
          locked={!unlocked.has("b")}
          active={unlocked.has("b")}
          lockMessage="Unlocks after you start answering Part A"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface2 border border-border px-2.5 py-0.5 mb-4">
            ⏱ Suggested: 15 minutes
          </div>
          <div className="font-sans text-sm sm:text-[15px] font-semibold text-text mb-4 leading-snug">
            Without writing actual code, describe exactly what you would do to ship this fix.
          </div>
          <div className="text-xs text-muted mb-5 pl-3 sm:pl-4 border-l-2 border-border-bright leading-relaxed">
            Be specific enough that another developer could execute it. Cover: where you&apos;d look first,
            how you&apos;d locate the relevant file, what change you&apos;d make, how you&apos;d verify it
            worked before raising a PR, and what you&apos;d write in your PR proof-of-work comment.
          </div>
          <AnswerField
            id="b"
            label="Your answer"
            placeholder="E.g. — First, I'd search the codebase for 'develop.velocity.app' using grep or IDE search to locate the template(s) and surrounding config. Then..."
            rows={10}
            value={answers.b}
            onChange={updateAnswer}
            disabled={disabled}
          />
        </TaskSection>

        <TaskSection
          id="c"
          partLabel="Part C"
          title="AI Workflow"
          meta={unlocked.has("c") ? activeDot : "Unlocks after Part B"}
          locked={!unlocked.has("c")}
          active={unlocked.has("c")}
          lockMessage="Unlocks after you start answering Part B"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface2 border border-border px-2.5 py-0.5 mb-4">
            ⏱ Suggested: 10 minutes
          </div>
          <div className="font-sans text-sm sm:text-[15px] font-semibold text-text mb-4 leading-snug">
            Describe exactly how you&apos;d use AI tooling to complete this ticket.
          </div>
          <div className="text-xs text-muted mb-5 pl-3 sm:pl-4 border-l-2 border-border-bright leading-relaxed">
            Be specific: what tool, what prompt or instruction, what you&apos;d trust directly from the
            output, and what you&apos;d verify yourself. Also call out at least one step where AI is NOT
            the right tool and why.
          </div>

          <div className="mb-7">
            <div className="font-sans font-bold text-xs tracking-widest uppercase text-accent mb-2.5">
              C.1 — Tool + Prompt
            </div>
            <div className="text-[13px] text-[#c0c0c0] mb-3 leading-relaxed">
              Which AI tool would you use and what would you actually type or say to it first?
            </div>
            <AnswerField
              id="c1"
              label="Your answer"
              placeholder="E.g. — I'd open Claude Code and say: 'Search this codebase for the string develop.velocity.app and any adjacent email template configuration. Show me the files and the relevant lines...'"
              rows={5}
              value={answers.c1}
              onChange={updateAnswer}
              disabled={disabled}
            />
          </div>

          <hr className="border-0 border-t border-border my-7" />

          <div className="mb-7">
            <div className="font-sans font-bold text-xs tracking-widest uppercase text-accent mb-2.5">
              C.2 — Trust vs. Verify
            </div>
            <div className="text-[13px] text-[#c0c0c0] mb-3 leading-relaxed">
              What part of the AI&apos;s output would you use directly, and what would you check yourself
              before committing?
            </div>
            <AnswerField
              id="c2"
              label="Your answer"
              placeholder="E.g. — I'd trust the file-search results but verify the actual line change myself — AI might miss a second template or get the env-var name wrong..."
              rows={5}
              value={answers.c2}
              onChange={updateAnswer}
              disabled={disabled}
            />
          </div>

          <hr className="border-0 border-t border-border my-7" />

          <div className="mb-7">
            <div className="font-sans font-bold text-xs tracking-widest uppercase text-accent mb-2.5">
              C.3 — When AI is the wrong tool
            </div>
            <div className="text-[13px] text-[#c0c0c0] mb-3 leading-relaxed">
              Name one step in this task where you would NOT use AI, and briefly explain why.
            </div>
            <AnswerField
              id="c3"
              label="Your answer"
              placeholder="E.g. — Final verification: I'd manually trigger a test email in the staging environment myself, because AI can't actually observe the sent email output..."
              rows={4}
              value={answers.c3}
              onChange={updateAnswer}
              disabled={disabled}
            />
          </div>
        </TaskSection>

        <TaskSection
          id="d"
          partLabel="Part D"
          title="Edge Case & Scope"
          meta={unlocked.has("d") ? activeDot : "Unlocks after Part C"}
          locked={!unlocked.has("d")}
          active={unlocked.has("d")}
          lockMessage="Unlocks after you start answering Part C"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface2 border border-border px-2.5 py-0.5 mb-4">
            ⏱ Suggested: 10 minutes
          </div>

          <div className="mb-7">
            <div className="font-sans font-bold text-xs tracking-widest uppercase text-accent mb-2.5">
              D.1 — Edge case
            </div>
            <div className="text-[13px] text-[#c0c0c0] mb-3 leading-relaxed">
              Identify one real risk or edge case this ticket doesn&apos;t mention that you&apos;d flag or
              handle.
            </div>
            <AnswerField
              id="d1"
              label="Your answer"
              placeholder="E.g. — If the env var is not set in production (missing from .env or deployment config), the email link would silently render as blank or throw. I'd add a fallback or assert the var is present at startup..."
              rows={5}
              value={answers.d1}
              onChange={updateAnswer}
              disabled={disabled}
            />
          </div>

          <hr className="border-0 border-t border-border my-7" />

          <div className="mb-7">
            <div className="font-sans font-bold text-xs tracking-widest uppercase text-accent mb-2.5">
              D.2 — Out of scope
            </div>
            <div className="text-[13px] text-[#c0c0c0] mb-3 leading-relaxed">
              Name one thing you would explicitly NOT touch in this task — and explain why staying in
              scope matters here.
            </div>
            <AnswerField
              id="d2"
              label="Your answer"
              placeholder="E.g. — I would not redesign the email template or change the copy. The ticket asks for one specific fix. Widening scope risks introducing new bugs and delays a simple, verifiable change..."
              rows={5}
              value={answers.d2}
              onChange={updateAnswer}
              disabled={disabled}
            />
          </div>
        </TaskSection>

        <TaskSection
          id="e"
          partLabel="Part E"
          title="Async Standup Update"
          meta={unlocked.has("e") ? activeDot : "Unlocks after Part D"}
          locked={!unlocked.has("e")}
          active={unlocked.has("e")}
          lockMessage="Unlocks after you start answering Part D"
        >
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted bg-surface2 border border-border px-2.5 py-0.5 mb-4">
            ⏱ Suggested: 5 minutes
          </div>
          <div className="font-sans text-sm sm:text-[15px] font-semibold text-text mb-4 leading-snug">
            Write your end-of-day async standup update to the founder.
          </div>
          <div className="text-xs text-muted mb-5 pl-3 sm:pl-4 border-l-2 border-border-bright leading-relaxed">
            3–5 sentences. Assume you&apos;ve implemented the fix and submitted the PR. Wesley is in the
            US, reading this in the morning. Be specific, be concise, and give him exactly what he needs
            to review your PR intelligently.
          </div>
          <AnswerField
            id="e"
            label="Your standup message"
            placeholder="E.g. — Shipped TER-431. Found the develop URL hardcoded in /backend/emails/map_complete.py line 47. Moved it to APP_BASE_URL env var, added a startup assertion. Tested locally by triggering a map-complete event against the sandbox — link renders correctly. PR is up: [link]. One thing I'd flag for you: there's a second email template (TER-map-reminder) using the same pattern — I didn't touch it but left a comment in the PR."
            rows={6}
            value={answers.e}
            onChange={updateAnswer}
            disabled={disabled}
          />
        </TaskSection>

        <div className="h-16 sm:h-20" />
      </main>

      {showSubmit && !disabled && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-bg/97 backdrop-blur-lg border-t border-border px-4 sm:px-6 lg:px-8 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-stretch sm:items-center justify-between z-40 gap-4 sm:gap-6"
          style={{ paddingLeft: "max(1rem, env(safe-area-inset-left))", paddingRight: "max(1rem, env(safe-area-inset-right))" }}
        >
          <div className="text-xs text-muted leading-relaxed text-center sm:text-left">
            <strong className="text-text">Ready to submit?</strong>
            <br className="hidden sm:block" />
            <span className="sm:ml-0"> Review all five parts before submitting. You cannot edit after submission.</span>
          </div>
          <button
            type="button"
            onClick={submitTask}
            disabled={isSubmitting}
            className="bg-accent text-black border-none font-sans font-bold text-xs tracking-[0.15em] uppercase px-8 sm:px-10 py-3.5 cursor-pointer transition-opacity hover:opacity-90 w-full sm:w-auto text-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : "Submit Task →"}
          </button>
        </div>
      )}
    </div>
  );
}
