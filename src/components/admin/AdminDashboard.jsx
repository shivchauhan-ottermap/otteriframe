import { useEffect, useState } from "react";
import { fetchSubmissions, fetchTrraSubmissions } from "../../utils/adminApi";

const TABS = [
  // { key: "ottermap", label: "72-Hour Challenge" },
  { key: "trra", label: "Round 2 TRRA" },
];

function StatusBadge({ status }) {
  const styles = {
    submitted: "bg-accent/10 text-accent border-accent/20",
    in_progress: "bg-warn/15 text-warn border-warn/30",
    expired: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span
      className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 border font-sans ${styles[status] || "text-muted border-border"}`}
    >
      {(status || "unknown").replace("_", " ")}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function LinkBlock({ label, value }) {
  if (!value?.trim()) return null;
  const isUrl = /^https?:\/\//i.test(value.trim());

  return (
    <div className="mb-4">
      <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1.5">{label}</div>
      {isUrl ? (
        <a
          href={value.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-accent hover:underline break-all"
        >
          {value.trim()}
        </a>
      ) : (
        <div className="text-[13px] text-[#c0c0c0] leading-relaxed whitespace-pre-wrap bg-bg/50 border border-border p-3">
          {value}
        </div>
      )}
    </div>
  );
}

function NotesBlock({ label = "Additional notes", value }) {
  if (!value?.trim()) return null;
  return (
    <div className="mb-4">
      <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1.5">{label}</div>
      <div className="text-[13px] text-[#c0c0c0] leading-relaxed whitespace-pre-wrap bg-bg/50 border border-border p-3">
        {value}
      </div>
    </div>
  );
}

function FilterBar({ filter, setFilter, counts }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: "all", label: `All (${counts.all})` },
        { key: "submitted", label: `Submitted (${counts.submitted})` },
        { key: "in_progress", label: `In progress (${counts.in_progress})` },
        { key: "expired", label: `Expired (${counts.expired})` },
      ].map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setFilter(key)}
          className={`text-[11px] tracking-wide uppercase px-3 py-1.5 border font-sans font-semibold transition-colors ${
            filter === key
              ? "bg-accent/10 text-accent border-accent/30"
              : "text-muted border-border hover:border-border-bright"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function OttermapSubmissionRow({ row, isOpen, onToggle }) {
  return (
    <div className="border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-surface2/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-text truncate">{row.name}</div>
          <div className="text-[12px] text-muted truncate">
            {row.email} · {row.phone}
          </div>
          <div className="text-[11px] text-accent font-mono mt-1">{row.submission_id}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="text-[10px] tracking-widest uppercase text-muted border border-border px-2 py-0.5">
            {row.step || "—"}
          </span>
          <StatusBadge status={row.status} />
          <span className="text-[11px] text-muted hidden sm:inline">
            {formatDate(row.submitted_at || row.started_at)}
          </span>
          <span className="text-muted text-sm">{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-[12px] text-muted">
            <div>
              <span className="text-text font-semibold">Started:</span> {formatDate(row.started_at)}
            </div>
            <div>
              <span className="text-text font-semibold">Deadline:</span> {formatDate(row.deadline_at)}
            </div>
            <div>
              <span className="text-text font-semibold">Submitted:</span> {formatDate(row.submitted_at)}
            </div>
            <div>
              <span className="text-text font-semibold">Time used:</span> {row.time_used || "—"}
            </div>
            <div>
              <span className="text-text font-semibold">Phone:</span> {row.phone}
            </div>
            <div>
              <span className="text-text font-semibold">Current step:</span> {row.step || "—"}
            </div>
          </div>

          <LinkBlock label="GitHub repository" value={row.deliverable_repo} />
          <LinkBlock label="Model weights" value={row.deliverable_weights} />
          <LinkBlock label="Technical summary" value={row.deliverable_summary} />
          <LinkBlock label="Sample outputs" value={row.deliverable_samples} />
          <NotesBlock value={row.submit_notes} />
        </div>
      )}
    </div>
  );
}

function TrraSubmissionRow({ row, isOpen, onToggle }) {
  const answers = row.answers ?? {};

  return (
    <div className="border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-surface2/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-text truncate">{row.name}</div>
          <div className="text-[12px] text-muted truncate">
            {row.email} · {row.phone}
          </div>
          <div className="text-[11px] text-accent font-mono mt-1">{row.submission_id}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <StatusBadge status={row.status} />
          <span className="text-[11px] text-muted hidden sm:inline">
            {formatDate(row.submitted_at || row.started_at)}
          </span>
          <span className="text-muted text-sm">{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-[12px] text-muted">
            <div>
              <span className="text-text font-semibold">Started:</span> {formatDate(row.started_at)}
            </div>
            <div>
              <span className="text-text font-semibold">Deadline:</span> {formatDate(row.deadline_at)}
            </div>
            <div>
              <span className="text-text font-semibold">Submitted:</span> {formatDate(row.submitted_at)}
            </div>
            <div>
              <span className="text-text font-semibold">Time used:</span> {row.time_used || "—"}
            </div>
            <div>
              <span className="text-text font-semibold">Phone:</span> {row.phone}
            </div>
            <div>
              <span className="text-text font-semibold">Email:</span> {row.email}
            </div>
          </div>

          <LinkBlock label="GitHub repository" value={answers.github_repo} />
          <NotesBlock label="Submission notes" value={answers.notes} />

          {!answers.github_repo?.trim() && !answers.notes?.trim() && (
            <p className="text-[12px] text-muted">No answers saved yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function useSubmissionList(fetcher) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetcher()
      .then(setSubmissions)
      .catch((err) => setError(err.message || "Failed to load submissions."))
      .finally(() => setLoading(false));
  }, [fetcher]);

  return { submissions, loading, error };
}

function countByStatus(submissions) {
  return {
    all: submissions.length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    in_progress: submissions.filter((s) => s.status === "in_progress").length,
    expired: submissions.filter((s) => s.status === "expired").length,
  };
}

export default function AdminDashboard({ onLogout, adminEmail }) {
  const [activeTab, setActiveTab] = useState("trra");
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const ottermap = useSubmissionList(fetchSubmissions);
  const trra = useSubmissionList(fetchTrraSubmissions);

  const current = activeTab === "trra" ? trra : ottermap;
  const filtered = current.submissions.filter((s) => filter === "all" || s.status === filter);
  const counts = countByStatus(current.submissions);

  function switchTab(key) {
    setActiveTab(key);
    setFilter("all");
    setExpandedId(null);
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-sans font-extrabold text-[11px] tracking-[0.2em] uppercase text-accent mb-1">
            Ottermap Admin
          </div>
          <h1 className="font-sans font-extrabold text-xl text-text">Submissions</h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[11px] text-muted truncate max-w-[200px]">{adminEmail}</span>
          <button
            type="button"
            onClick={onLogout}
            className="text-[11px] tracking-widest uppercase font-sans font-bold text-text border border-border px-4 py-2 hover:border-accent transition-colors shrink-0"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => switchTab(key)}
              className={`text-[11px] tracking-wide uppercase px-4 py-2 border font-sans font-semibold transition-colors ${
                activeTab === key
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "text-muted border-border hover:border-border-bright"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

        {current.loading && <p className="text-muted text-sm">Loading submissions…</p>}
        {current.error && <p className="text-danger text-sm">{current.error}</p>}

        {!current.loading && !current.error && filtered.length === 0 && (
          <p className="text-muted text-sm">No submissions found.</p>
        )}

        <div className="space-y-3">
          {filtered.map((row) => {
            const isOpen = expandedId === row.id;
            const onToggle = () => setExpandedId(isOpen ? null : row.id);

            if (activeTab === "trra") {
              return (
                <TrraSubmissionRow key={row.id} row={row} isOpen={isOpen} onToggle={onToggle} />
              );
            }

            return (
              <OttermapSubmissionRow key={row.id} row={row} isOpen={isOpen} onToggle={onToggle} />
            );
          })}
        </div>
      </main>
    </div>
  );
}
