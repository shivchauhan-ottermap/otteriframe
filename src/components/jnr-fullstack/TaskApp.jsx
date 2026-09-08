import AnswerField from "./AnswerField";
import TaskSection from "./TaskSection";
import TicketCard from "./TicketCard";

function Code({ children }) {
  return <code>{children}</code>;
}

function SuggestedTime({ children }) {
  return <div className="jnr-part-time">⏱ {children}</div>;
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
  const activeMeta = (
    <>
      <span className="jnr-dot-active" /> ~5 min
    </>
  );

  return (
    <div className="jnr-task-app">
      <header className="jnr-header">
        <div className="jnr-header-left">
          <span className="jnr-brand">OTTERMAP</span>
          <span className="jnr-candidate-tag" title={candidateName}>
            {candidateName}
          </span>
        </div>
        <div className="jnr-timer-wrap">
          <div className="jnr-timer-label">Time Remaining</div>
          <div className={`jnr-timer-display ${timerClass}`}>{timerDisplay}</div>
        </div>
        <div className="jnr-progress-bar-wrap">
          <div
            className="jnr-progress-bar"
            style={{ width: `${progressPct}%`, background: progressColor }}
          />
        </div>
      </header>

      <main className="jnr-main-content">
        <div className="jnr-intro-block">
          <h1>
            Qualifier Task
            <br />
            <span style={{ color: "var(--jnr-accent)" }}>Junior Full Stack Developer</span>
          </h1>
          <p>
            You&apos;ve just joined Ottermap&apos;s Technology team. It&apos;s Day 1.{" "}
            <span className="jnr-highlight">No onboarding call. No walkthrough.</span> You&apos;ve
            been added to Linear and cloned the repo. The team communicates in writing. The founder is
            async. Your job starts now.
          </p>
          <p>
            Read the ticket below carefully, then work through all five parts. We&apos;re evaluating
            how you think and communicate as much as what you know.
          </p>
        </div>

        <div className="jnr-context-box">
          <h4>Context — Your working environment</h4>
          <p>
            Ottermap is a property intelligence platform serving businesses in landscaping, snow
            removal, paving, and facility management. The main product is a web app used by field
            operations teams to view, measure, and manage property data.
          </p>
          <p>
            The stack is <strong>React 19 + TypeScript + React Router v6</strong> on the frontend and{" "}
            <strong>Python / Flask + Supabase (Postgres)</strong> on the backend. State management
            uses <strong>React Context</strong> (no Redux). Work is tracked in <strong>Linear</strong>.
          </p>
          <p>
            It is <strong>Day 1</strong>. You&apos;ve been assigned the following ticket by the tech
            lead.
          </p>
        </div>

        <TicketCard />

        <TaskSection
          id="a"
          partLabel="Part A"
          title="Clarifying Questions"
          meta={activeMeta}
          locked={false}
          active={unlocked.has("a")}
        >
          <SuggestedTime>Suggested: 5 minutes</SuggestedTime>
          <div className="jnr-task-instruction">
            What would you ask before you start — and what would you assume if nobody responded?
          </div>
          <div className="jnr-task-note">
            List up to 3 clarifying questions. For each: (1) why you need that answer, and (2) what
            assumption you&apos;d make and act on if no reply came within 2 hours. Fewer than 3 is
            fine — don&apos;t pad.
          </div>
          <AnswerField
            id="a"
            label="Your answer"
            placeholder="E.g. — Q1: Are there any other pages in the app that use the same filter logic, or is this isolated to /properties? I need to know whether a shared utility already exists for URL-based filter state. Assumption if no reply: I'll treat it as isolated and build the solution within PropertiesPage, noting in the PR that a shared hook can be extracted later if needed..."
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
          meta={unlocked.has("b") ? activeMeta : "Unlocks after Part A"}
          locked={!unlocked.has("b")}
          active={unlocked.has("b")}
          lockMessage="Unlocks after you start answering Part A"
        >
          <SuggestedTime>Suggested: 10 minutes</SuggestedTime>
          <div className="jnr-task-instruction">
            Without writing code, describe exactly how you&apos;d ship this fix.
          </div>
          <div className="jnr-task-note">
            Be specific enough that another developer could execute it. Cover: what you&apos;d look at
            first, the specific change you&apos;d make and where, how you&apos;d handle the
            &quot;Reset Filters&quot; button, how you&apos;d test the fix before raising a PR, and
            what you&apos;d write in your PR description.
          </div>
          <AnswerField
            id="b"
            label="Your answer"
            placeholder="E.g. — First, I'd read PropertiesPage.tsx to understand the current useState shape for filters. Then I'd replace the useState with useSearchParams from React Router to move filter state into the URL. Each filter change would call setSearchParams(...). On mount, I'd read from searchParams to initialise filters — meaning returning users automatically restore state from the URL. For the Reset button, I'd call setSearchParams({}) to clear all params..."
            rows={10}
            value={answers.b}
            onChange={updateAnswer}
            disabled={disabled}
          />
        </TaskSection>

        <TaskSection
          id="c"
          partLabel="Part C"
          title="Code"
          meta={unlocked.has("c") ? activeMeta : "Unlocks after Part B"}
          locked={!unlocked.has("c")}
          active={unlocked.has("c")}
          lockMessage="Unlocks after you start answering Part B"
        >
          <SuggestedTime>Suggested: 15 minutes</SuggestedTime>
          <div className="jnr-task-instruction">
            Write the actual code for the key parts of this fix.
          </div>
          <div className="jnr-task-note">
            Write real TypeScript / React — not pseudocode. You won&apos;t have access to the actual
            codebase, so make reasonable assumptions about variable names and structure. Partial but
            correct code is better than complete but broken code.
          </div>

          <div className="jnr-sub-q">
            <div className="jnr-sub-q-label">C.1 — Filter Type Definition</div>
            <div className="jnr-sub-q-prompt">
              Define the TypeScript type for the filter state — covering service type, region, and
              area range.
            </div>
            <div className="jnr-code-hint">
              Assume service types are:{" "}
              <Code>&quot;Landscaping&quot; | &quot;Snow Removal&quot; | &quot;Paving&quot; | &quot;Facility&quot;</Code>
              . Area range is min/max in square feet. Region is a free string (US state abbreviation,
              e.g. <Code>&quot;CA&quot;</Code>). All fields are optional — no filter applied means the
              field is absent.
            </div>
            <AnswerField
              id="c1"
              label="Your code"
              placeholder={`// Define your TypeScript type here\ntype ServiceType = ...\n\ntype PropertyFilters = {\n  ...\n}`}
              rows={8}
              value={answers.c1}
              onChange={updateAnswer}
              disabled={disabled}
              code
            />
          </div>

          <hr className="jnr-task-divider" />

          <div className="jnr-sub-q">
            <div className="jnr-sub-q-label">C.2 — useSearchParams Hook Usage</div>
            <div className="jnr-sub-q-prompt">
              Write the hook logic that reads filter state from URL search params on mount and writes
              it back when the user changes a filter. Show at least one filter (e.g. serviceType)
              being read and written.
            </div>
            <div className="jnr-code-hint">
              You are inside a functional component. React Router v6&apos;s{" "}
              <Code>useSearchParams</Code> returns <Code>[searchParams, setSearchParams]</Code>.{" "}
              <Code>searchParams.get(&apos;key&apos;)</Code> returns <Code>string | null</Code>.
            </div>
            <AnswerField
              id="c2"
              label="Your code"
              placeholder={`import { useSearchParams } from 'react-router-dom';\n\nconst PropertiesPage = () => {\n  const [searchParams, setSearchParams] = useSearchParams();\n\n  // Read from URL on mount\n  const filters: PropertyFilters = {\n    ...\n  };\n\n  // Handler to update a filter\n  const handleFilterChange = ...\n}`}
              rows={12}
              value={answers.c2}
              onChange={updateAnswer}
              disabled={disabled}
              code
            />
          </div>

          <hr className="jnr-task-divider" />

          <div className="jnr-sub-q">
            <div className="jnr-sub-q-label">C.3 — Reset Button</div>
            <div className="jnr-sub-q-prompt">
              Write the onClick handler for the &quot;Reset Filters&quot; button that clears all
              filter params from the URL.
            </div>
            <AnswerField
              id="c3"
              label="Your code"
              placeholder={`const handleResetFilters = () => {\n  ...\n};\n\n// Button JSX\n<button onClick={handleResetFilters}>Reset Filters</button>`}
              rows={6}
              value={answers.c3}
              onChange={updateAnswer}
              disabled={disabled}
              code
            />
          </div>
        </TaskSection>

        <TaskSection
          id="d"
          partLabel="Part D"
          title="Edge Cases & Scope"
          meta={unlocked.has("d") ? activeMeta : "Unlocks after Part C"}
          locked={!unlocked.has("d")}
          active={unlocked.has("d")}
          lockMessage="Unlocks after you start answering Part C"
        >
          <SuggestedTime>Suggested: 10 minutes</SuggestedTime>

          <div className="jnr-sub-q">
            <div className="jnr-sub-q-label">D.1 — Edge Case</div>
            <div className="jnr-sub-q-prompt">
              Identify one real risk or edge case this ticket doesn&apos;t mention that you&apos;d
              flag or handle.
            </div>
            <AnswerField
              id="d1"
              label="Your answer"
              placeholder="E.g. — If a user manually edits the URL and enters an invalid service type (e.g. ?serviceType=Plumbing), the filter read would silently pass a value the backend doesn't recognise. I'd add a validation step when reading from searchParams — if the value doesn't match the ServiceType union, discard it and default to no filter..."
              rows={5}
              value={answers.d1}
              onChange={updateAnswer}
              disabled={disabled}
            />
          </div>

          <hr className="jnr-task-divider" />

          <div className="jnr-sub-q">
            <div className="jnr-sub-q-label">D.2 — Out of Scope</div>
            <div className="jnr-sub-q-prompt">
              Name one thing you would explicitly NOT change in this PR — and explain why staying in
              scope matters here.
            </div>
            <AnswerField
              id="d2"
              label="Your answer"
              placeholder="E.g. — I would not refactor the API call logic or add pagination to the filter results, even if I notice those could be improved. The ticket is a targeted state-persistence fix. Widening scope risks introducing new bugs, makes the PR harder to review, and delays a fix that customers are already blocked on..."
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
          title="Async PR Update"
          meta={unlocked.has("e") ? activeMeta : "Unlocks after Part D"}
          locked={!unlocked.has("e")}
          active={unlocked.has("e")}
          lockMessage="Unlocks after you start answering Part D"
        >
          <SuggestedTime>Suggested: 5 minutes</SuggestedTime>
          <div className="jnr-task-instruction">
            Write your async update to the tech lead once you&apos;ve raised the PR.
          </div>
          <div className="jnr-task-note">
            3–5 sentences. Assume you&apos;ve implemented the fix and opened the PR. The tech lead
            will read this asynchronously. Be specific about what you changed, how you verified it,
            and anything they should know before reviewing.
          </div>
          <AnswerField
            id="e"
            label="Your message"
            placeholder="E.g. — PR up for OTR-218. Replaced useState filter state in PropertiesPage with useSearchParams — filters now live in the URL and survive navigation. Tested by applying all three filters, navigating to /properties/42 and back — filters persisted correctly. Reset button calls setSearchParams({}) which clears the URL and re-renders with defaults. One thing I'd flag: the area range is stored as two separate params (areaMin, areaMax) — let me know if you'd prefer a single encoded param. PR: [link]"
            rows={6}
            value={answers.e}
            onChange={updateAnswer}
            disabled={disabled}
          />
        </TaskSection>

        <div style={{ height: 80 }} />
      </main>

      {showSubmit && !disabled && (
        <div className="jnr-submit-section">
          <div className="jnr-submit-info">
            <strong>Ready to submit?</strong>
            <br />
            Review all five parts before submitting. You cannot edit after submission.
          </div>
          <button
            type="button"
            className="jnr-submit-btn"
            onClick={submitTask}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit Task →"}
          </button>
        </div>
      )}
    </div>
  );
}
