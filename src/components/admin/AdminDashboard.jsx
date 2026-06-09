import { useEffect, useState } from "react";
import { fetchSubmissions } from "../../utils/adminApi";

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

function AnswerBlock({ label, value }) {
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

export default function AdminDashboard({ onLogout, adminEmail }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSubmissions()
      .then(setSubmissions)
      .catch((err) => setError(err.message || "Failed to load submissions."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = submissions.filter((s) => filter === "all" || s.status === filter);

  const counts = {
    all: submissions.length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    in_progress: submissions.filter((s) => s.status === "in_progress").length,
  };

  return (
    <div className="min-h-screen relative z-[1]">
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-sans font-extrabold text-[11px] tracking-[0.2em] uppercase text-accent mb-1">
            Ottermap Admin
          </div>
          <h1 className="font-sans font-extrabold text-xl text-text">Qualifier Submissions</h1>
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
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "submitted", label: `Submitted (${counts.submitted})` },
            { key: "in_progress", label: `In progress (${counts.in_progress})` },
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

        {loading && <p className="text-muted text-sm">Loading submissions…</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-muted text-sm">No submissions found.</p>
        )}

        <div className="space-y-3">
          {filtered.map((row) => {
            const isOpen = expandedId === row.id;
            return (
              <div key={row.id} className="border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : row.id)}
                  className="w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-surface2/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-sans font-bold text-text truncate">{row.name}</div>
                    <div className="text-[12px] text-muted truncate">{row.email} · {row.phone}</div>
                    <div className="text-[11px] text-accent font-mono mt-1">{row.submission_id}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
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
                      <div><span className="text-text font-semibold">Started:</span> {formatDate(row.started_at)}</div>
                      <div><span className="text-text font-semibold">Submitted:</span> {formatDate(row.submitted_at)}</div>
                      <div><span className="text-text font-semibold">Time used:</span> {row.time_used || "—"}</div>
                      <div><span className="text-text font-semibold">Phone:</span> {row.phone}</div>
                    </div>

                    <AnswerBlock label="Part A — Clarifying Questions" value={row.part_a} />
                    <AnswerBlock label="Part B — Implementation Plan" value={row.part_b} />
                    <AnswerBlock label="Part C.1 — AI Tool + Prompt" value={row.part_c1} />
                    <AnswerBlock label="Part C.2 — Trust vs. Verify" value={row.part_c2} />
                    <AnswerBlock label="Part C.3 — When AI is Wrong Tool" value={row.part_c3} />
                    <AnswerBlock label="Part D.1 — Edge Case" value={row.part_d1} />
                    <AnswerBlock label="Part D.2 — Out of Scope" value={row.part_d2} />
                    <AnswerBlock label="Part E — Async Standup" value={row.part_e} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
