import { TIMELINE_HOURS } from "../../utils/saveOttermapChallenge";
// Palette: deep slate base, electric teal accent, warm amber for alerts
// Type: mono for data/labels, Inter-like sans for body
// Signature: animated countdown with satellite-scan sweep line

const ASSETS = [
  {
    id: "img",
    icon: "🛰️",
    label: "Aerial Imagery Pack",
    description: "3 high-resolution georeferenced orthophotos (.tif)",
    size: "~2.4 GB",
    url: "#",
  },
  {
    id: "layers",
    icon: "🗂️",
    label: "Feature Layers",
    description: "GeoJSON & Shapefile annotations for all 3 parcels",
    size: "~18 MB",
    url: "#",
  },
  {
    id: "brief",
    icon: "📋",
    label: "Task Brief (PDF)",
    description: "Full challenge specification and evaluation criteria",
    size: "~340 KB",
    url: "#",
  },
];

const FEATURES = [
  { icon: "🏠", label: "Buildings" },
  { icon: "🌿", label: "Turf / Grass" },
  { icon: "🌳", label: "Tree Canopy" },
  { icon: "🌱", label: "Shrubs" },
  { icon: "🅿️", label: "Parking Lots" },
  { icon: "🛣️", label: "Roads" },
  { icon: "🚶", label: "Sidewalks" },
  { icon: "💧", label: "Water Features" },
];

const DELIVERABLES = [
  { label: "GitHub Repository Link", placeholder: "https://github.com/your-username/repo" },
  { label: "Model Weights (Drive / HuggingFace Link)", placeholder: "https://drive.google.com/..." },
  { label: "Technical Summary (PDF link or upload note)", placeholder: "https://drive.google.com/..." },
  { label: "Sample Outputs Folder Link", placeholder: "https://drive.google.com/..." },
];

const CRITERIA = [
  { label: "Model Performance & Generalization", pct: 40, color: "#00d4aa" },
  { label: "Engineering Quality", pct: 20, color: "#3b9eff" },
  { label: "GIS Output Quality", pct: 15, color: "#a78bfa" },
  { label: "Technical Reasoning", pct: 15, color: "#fb923c" },
  { label: "Innovation", pct: 10, color: "#f472b6" },
];

// ── Design tokens ──────────────────────────────────────────────
export default function OttermapPortal({
  step,
  applicant,
  setApplicant,
  errors,
  time,
  elapsed,
  urgentTime,
  deliverables,
  submitNote,
  isStarting,
  isSubmitting,
  isRestoring,
  toast,
  scanY,
  handleRegister,
  handleSubmit,
  goToStep,
  updateDeliverable,
  updateSubmitNote,
}) {

  // ── STYLES ────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #080d14;
      color: #c8d6e8;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
    }

    .mono { font-family: 'JetBrains Mono', monospace; }

    /* ── Layout ── */
    .shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ── Top bar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 56px;
      border-bottom: 1px solid #1a2535;
      background: #080d14cc;
      backdrop-filter: blur(8px);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 0.05em;
    }
    .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: #00d4aa; }
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background: #00d4aa18;
      color: #00d4aa;
      border: 1px solid #00d4aa44;
      padding: 3px 10px;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }

    /* ── Hero ── */
    .hero {
      position: relative;
      overflow: hidden;
      padding: 64px 32px 48px;
      text-align: center;
      border-bottom: 1px solid #1a2535;
    }
    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(#1a253520 1px, transparent 1px),
        linear-gradient(90deg, #1a253520 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #00d4aa88, transparent);
      pointer-events: none;
      transition: top 0.03s linear;
    }
    .hero-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #00d4aa;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .hero-title {
      font-size: clamp(24px, 4vw, 42px);
      font-weight: 700;
      color: #fff;
      line-height: 1.15;
      max-width: 700px;
      margin: 0 auto 12px;
    }
    .hero-title span { color: #00d4aa; }
    .hero-sub {
      font-size: 15px;
      color: #6b84a0;
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* ── Main ── */
    .main {
      flex: 1;
      max-width: 860px;
      width: 100%;
      margin: 0 auto;
      padding: 40px 24px 80px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* ── Card ── */
    .card {
      background: #0d1622;
      border: 1px solid #1a2535;
      border-radius: 10px;
      overflow: hidden;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid #1a2535;
      background: #0a1219;
    }
    .card-icon {
      font-size: 16px;
    }
    .card-title {
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #3b9eff;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .card-body {
      padding: 24px 20px;
    }

    /* ── Form ── */
    .form-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    .form-label {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: #6b84a0;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .form-input {
      background: #060b11;
      border: 1px solid #1e2e42;
      border-radius: 6px;
      color: #c8d6e8;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      padding: 10px 14px;
      outline: none;
      transition: border-color 0.15s;
      width: 100%;
    }
    .form-input:focus { border-color: #00d4aa66; }
    .form-input.error { border-color: #ef444466; }
    .form-error { font-size: 12px; color: #f87171; margin-top: 2px; }

    /* ── Countdown ── */
    .countdown-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      padding: 24px 20px;
    }
    .time-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .time-digits {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(36px, 8vw, 64px);
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .time-digits.urgent { color: #f87171; }
    .time-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #3b536b;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .time-sep {
      font-family: 'JetBrains Mono', monospace;
      font-size: clamp(28px, 6vw, 52px);
      color: #1e2e42;
      padding: 0 8px;
      margin-bottom: 16px;
    }
    .progress-bar-wrap {
      padding: 0 20px 20px;
    }
    .progress-track {
      height: 3px;
      background: #1a2535;
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 2px;
      background: linear-gradient(90deg, #00d4aa, #3b9eff);
      transition: width 1s linear;
    }
    .progress-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }
    .progress-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #3b536b;
    }

    /* ── Asset row ── */
    .asset-list { display: flex; flex-direction: column; gap: 10px; }
    .asset-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      background: #060b11;
      border: 1px solid #1a2535;
      border-radius: 8px;
    }
    .asset-icon { font-size: 22px; flex-shrink: 0; }
    .asset-info { flex: 1; min-width: 0; }
    .asset-name { font-size: 14px; font-weight: 500; color: #c8d6e8; margin-bottom: 2px; }
    .asset-desc { font-size: 12px; color: #4a6278; }
    .asset-size {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #3b536b;
      flex-shrink: 0;
    }
    .dl-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #00d4aa18;
      color: #00d4aa;
      border: 1px solid #00d4aa44;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      padding: 6px 14px;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .dl-btn:hover { background: #00d4aa28; }

    /* ── Feature chips ── */
    .chip-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #0a1219;
      border: 1px solid #1a2535;
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 12px;
      color: #8aa4be;
    }

    /* ── Criteria bars ── */
    .criteria-list { display: flex; flex-direction: column; gap: 14px; }
    .criteria-row { display: flex; flex-direction: column; gap: 6px; }
    .criteria-top { display: flex; justify-content: space-between; align-items: baseline; }
    .criteria-label { font-size: 13px; color: #8aa4be; }
    .criteria-pct {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #fff;
      font-weight: 600;
    }
    .criteria-track {
      height: 4px;
      background: #1a2535;
      border-radius: 2px;
      overflow: hidden;
    }
    .criteria-fill {
      height: 100%;
      border-radius: 2px;
    }

    /* ── Deliverables form ── */
    .deliverable-list { display: flex; flex-direction: column; gap: 16px; }
    .deliverable-label { font-size: 13px; color: #8aa4be; margin-bottom: 6px; }
    textarea.form-input {
      resize: vertical;
      min-height: 80px;
      font-family: 'Inter', sans-serif;
    }

    /* ── Buttons ── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #00d4aa;
      color: #080d14;
      border: none;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 700;
      padding: 12px 28px;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      width: 100%;
      letter-spacing: 0.01em;
    }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: transparent;
      color: #3b9eff;
      border: 1px solid #3b9eff44;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 28px;
      cursor: pointer;
      transition: background 0.15s;
      width: 100%;
    }
    .btn-secondary:hover { background: #3b9eff10; }

    /* ── Section label ── */
    .section-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #3b536b;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    /* ── Info pill ── */
    .info-pill {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #3b9eff0d;
      border: 1px solid #3b9eff22;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 13px;
      color: #6b84a0;
      line-height: 1.5;
    }
    .warn-pill {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: #fb923c0d;
      border: 1px solid #fb923c22;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 13px;
      color: #9a7060;
      line-height: 1.5;
    }

    /* ── Timeline steps ── */
    .timeline { display: flex; flex-direction: column; gap: 0; position: relative; }
    .tl-item {
      display: flex;
      gap: 16px;
      padding-bottom: 24px;
      position: relative;
    }
    .tl-item:last-child { padding-bottom: 0; }
    .tl-left { display: flex; flex-direction: column; align-items: center; width: 32px; flex-shrink: 0; }
    .tl-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00d4aa;
      margin-top: 5px;
      flex-shrink: 0;
    }
    .tl-line {
      flex: 1;
      width: 1px;
      background: #1a2535;
      margin-top: 4px;
    }
    .tl-item:last-child .tl-line { display: none; }
    .tl-hour {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #00d4aa;
      margin-bottom: 2px;
    }
    .tl-desc { font-size: 13px; color: #8aa4be; line-height: 1.5; }

    /* ── Done screen ── */
    .done-screen {
      text-align: center;
      padding: 60px 24px;
    }
    .done-icon { font-size: 56px; margin-bottom: 20px; }
    .done-title { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .done-sub { font-size: 14px; color: #6b84a0; max-width: 440px; margin: 0 auto; line-height: 1.6; }

    /* ── Applicant tag ── */
    .applicant-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #6b84a0;
    }
    .applicant-tag strong { color: #c8d6e8; }

    .toast {
      position: fixed;
      top: 72px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      max-width: min(520px, calc(100vw - 32px));
      background: #1a1210;
      border: 1px solid #ef444466;
      color: #fca5a5;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.5;
      box-shadow: 0 12px 40px #00000066;
    }

    .loading-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b84a0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 600px) {
      .topbar { padding: 0 16px; }
      .hero { padding: 40px 16px 32px; }
      .main { padding: 24px 16px 60px; }
      .asset-row { flex-wrap: wrap; }
    }
  `;

  if (isRestoring) {
    return (
      <>
        <style>{css}</style>
        <div className="loading-screen">Restoring session...</div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      {toast && <div className="toast" role="alert">{toast.message}</div>}
      <div className="shell">

        {/* Top bar */}
        <header className="topbar">
          <div className="logo">
            <div className="logo-dot" />
            OTTERMAP
          </div>
          {step !== "register" && (
            <span className="applicant-tag">
              <strong>{applicant.name}</strong> · {applicant.email}
            </span>
          )}
          <span className="badge">INTERN EVAL</span>
        </header>

        {/* Hero */}
        <div className="hero">
          <div className="hero-grid" />
          <div
            className="scan-line"
            style={{ top: `${scanY}%` }}
          />
          <div className="hero-eyebrow">Open Vision / ML Engineer</div>
          <h1 className="hero-title">
            72-Hour Technical <span>Challenge</span>
          </h1>
          <p className="hero-sub">
            Build a computer vision pipeline that detects geospatial features from aerial imagery and delivers GIS-compatible outputs.
          </p>
        </div>

        <main className="main">

          {/* ── REGISTER ── */}
          {step === "register" && (
            <>
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">👤</span>
                  <span className="card-title">Applicant Registration</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: 13, color: "#6b84a0", marginBottom: 24, lineHeight: 1.6 }}>
                    Register below to unlock the challenge assets and start your 72-hour clock. Your submission window begins the moment you confirm registration.
                  </p>
                  <div className="form-row">
                    <label className="form-label">Full Name</label>
                    <input
                      className={`form-input${errors.name ? " error" : ""}`}
                      placeholder="Jane Smith"
                      value={applicant.name}
                      onChange={e => setApplicant(a => ({ ...a, name: e.target.value }))}
                    />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-row">
                    <label className="form-label">Email Address</label>
                    <input
                      className={`form-input${errors.email ? " error" : ""}`}
                      placeholder="jane@example.com"
                      type="email"
                      value={applicant.email}
                      onChange={e => setApplicant(a => ({ ...a, email: e.target.value }))}
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                  <div className="form-row">
                    <label className="form-label">Phone Number</label>
                    <input
                      className={`form-input${errors.phone ? " error" : ""}`}
                      placeholder="+1 555 123 4567"
                      type="tel"
                      value={applicant.phone}
                      onChange={e => setApplicant(a => ({ ...a, phone: e.target.value }))}
                    />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                  <div className="warn-pill" style={{ marginBottom: 24 }}>
                    <span>⚠️</span>
                    <span>Your 72-hour window starts immediately upon confirmation. Late submissions will not be evaluated.</span>
                  </div>
                  <button className="btn-primary" onClick={handleRegister} disabled={isStarting}>
                    {isStarting ? "Starting..." : "Confirm & Start Challenge →"}
                  </button>
                </div>
              </div>

              {/* Preview: what's inside */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📦</span>
                  <span className="card-title">What You'll Receive</span>
                </div>
                <div className="card-body">
                  <div className="asset-list">
                    {ASSETS.map(a => (
                      <div className="asset-row" key={a.id}>
                        <span className="asset-icon">{a.icon}</span>
                        <div className="asset-info">
                          <div className="asset-name">{a.label}</div>
                          <div className="asset-desc">{a.description}</div>
                        </div>
                        <span className="asset-size">{a.size}</span>
                        <span style={{ fontSize: 12, color: "#3b536b", fontFamily: "JetBrains Mono", border: "1px solid #1a2535", padding: "5px 12px", borderRadius: 6 }}>Locked 🔒</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── CHALLENGE ── */}
          {step === "challenge" && (
            <>
              {/* Countdown */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">⏱️</span>
                  <span className="card-title">Time Remaining</span>
                </div>
                <div className="countdown-wrap">
                  <div className="time-block">
                    <div className={`time-digits mono${urgentTime ? " urgent" : ""}`}>{time.h}</div>
                    <div className="time-label">Hours</div>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block">
                    <div className={`time-digits mono${urgentTime ? " urgent" : ""}`}>{time.m}</div>
                    <div className="time-label">Minutes</div>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block">
                    <div className={`time-digits mono${urgentTime ? " urgent" : ""}`}>{time.s}</div>
                    <div className="time-label">Seconds</div>
                  </div>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${elapsed * 100}%` }} />
                  </div>
                  <div className="progress-labels">
                    <span className="progress-label">Challenge Start</span>
                    <span className="progress-label">72 hr Deadline</span>
                  </div>
                </div>
              </div>

              {/* Assets */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📦</span>
                  <span className="card-title">Challenge Assets</span>
                </div>
                <div className="card-body">
                  <div className="info-pill" style={{ marginBottom: 16 }}>
                    <span>ℹ️</span>
                    <span>Download all assets before beginning. Do not share these files externally.</span>
                  </div>
                  <div className="asset-list">
                    {ASSETS.map(a => (
                      <div className="asset-row" key={a.id}>
                        <span className="asset-icon">{a.icon}</span>
                        <div className="asset-info">
                          <div className="asset-name">{a.label}</div>
                          <div className="asset-desc">{a.description}</div>
                        </div>
                        <span className="asset-size">{a.size}</span>
                        <a className="dl-btn" href={a.url}>
                          ↓ Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature classes */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">🗺️</span>
                  <span className="card-title">Feature Classes</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: 13, color: "#6b84a0", marginBottom: 16, lineHeight: 1.6 }}>
                    Your model must detect and segment the following features. All classes are present in the provided data layers — additional features may be included depending on the parcel.
                  </p>
                  <div className="chip-grid">
                    {FEATURES.map(f => (
                      <div className="chip" key={f.label}>
                        <span>{f.icon}</span> {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📅</span>
                  <span className="card-title">Recommended Timeline</span>
                </div>
                <div className="card-body">
                  <div className="timeline">
                    {[
                      { h: "Hr 00–20", t: "Data Preparation", d: "Load imagery and GeoJSON layers · Rasterize masks · Tile into 256×512px patches · Augment · Train/val split" },
                      { h: "Hr 20–44", t: "Model Training", d: "Fine-tune a pretrained architecture (YOLOv8-seg, U-Net, SegFormer, SAM) · Log mIoU + per-class metrics · Save best checkpoint" },
                      { h: "Hr 44–60", t: "Generalization Testing", d: "Source 2–3 new aerial images from a different location · Run inference · Produce overlay PNGs and GeoJSON outputs · Document successes and failure cases" },
                      { h: "Hr 60–72", t: "Packaging & Submission", d: "Structure GitHub repo · Write README with setup + inference command · Complete validation_report.json · Submit link via this portal" },
                    ].map(tl => (
                      <div className="tl-item" key={tl.h}>
                        <div className="tl-left">
                          <div className="tl-dot" />
                          <div className="tl-line" />
                        </div>
                        <div>
                          <div className="tl-hour mono">{tl.h} — {tl.t}</div>
                          <div className="tl-desc">{tl.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evaluation */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📊</span>
                  <span className="card-title">Evaluation Criteria</span>
                </div>
                <div className="card-body">
                  <div className="criteria-list">
                    {CRITERIA.map(c => (
                      <div className="criteria-row" key={c.label}>
                        <div className="criteria-top">
                          <span className="criteria-label">{c.label}</span>
                          <span className="criteria-pct">{c.pct}%</span>
                        </div>
                        <div className="criteria-track">
                          <div
                            className="criteria-fill"
                            style={{ width: `${c.pct}%`, background: c.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key notes */}
              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📌</span>
                  <span className="card-title">Key Notes</span>
                </div>
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Pretrained weights and transfer learning are strongly encouraged — do not train from scratch.",
                    "A working, runnable pipeline scores higher than impressive metrics with broken code.",
                    "Limited training data is intentional. How you handle data scarcity is part of the evaluation.",
                    "Document your decisions. Clear technical reasoning counts as much as results.",
                    "We will run: python inference.py --image our_test_image.tif on imagery you've never seen.",
                  ].map((note, i) => (
                    <div className="info-pill" key={i}>
                      <span style={{ color: "#3b9eff", flexShrink: 0 }}>→</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={() => goToStep("submit")}>
                Next →
              </button>
            </>
          )}

          {/* ── SUBMIT ── */}
          {step === "submit" && (
            <>
              {time && !time.expired && (
                <div className="card">
                  <div className="card-header">
                    <span className="card-icon">⏱️</span>
                    <span className="card-title">Time Remaining</span>
                  </div>
                  <div className="countdown-wrap" style={{ padding: "16px 20px" }}>
                    <div className="time-block">
                      <div className={`time-digits mono${urgentTime ? " urgent" : ""}`} style={{ fontSize: "clamp(28px,5vw,44px)" }}>{time.h}</div>
                      <div className="time-label">h</div>
                    </div>
                    <div className="time-sep" style={{ fontSize: "clamp(22px,4vw,36px)" }}>:</div>
                    <div className="time-block">
                      <div className={`time-digits mono${urgentTime ? " urgent" : ""}`} style={{ fontSize: "clamp(28px,5vw,44px)" }}>{time.m}</div>
                      <div className="time-label">m</div>
                    </div>
                    <div className="time-sep" style={{ fontSize: "clamp(22px,4vw,36px)" }}>:</div>
                    <div className="time-block">
                      <div className={`time-digits mono${urgentTime ? " urgent" : ""}`} style={{ fontSize: "clamp(28px,5vw,44px)" }}>{time.s}</div>
                      <div className="time-label">s</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="card-header">
                  <span className="card-icon">📤</span>
                  <span className="card-title">Submission</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: 13, color: "#6b84a0", marginBottom: 24, lineHeight: 1.6 }}>
                    Paste the links to your deliverables below. All fields are required. Ensure your GitHub repo is public or shared with the Ottermap team before submitting.
                  </p>
                  <div className="deliverable-list">
                    {DELIVERABLES.map((d, i) => (
                      <div key={i}>
                        <div className="deliverable-label">{d.label}</div>
                        <input
                          className="form-input"
                          placeholder={d.placeholder}
                          value={deliverables[i]}
                          onChange={e => updateDeliverable(i, e.target.value)}
                        />
                      </div>
                    ))}
                    <div>
                      <div className="deliverable-label">Additional Notes (optional)</div>
                      <textarea
                        className="form-input"
                        placeholder="Known limitations, architecture choice rationale, anything you'd like the team to know..."
                        value={submitNote}
                        onChange={e => updateSubmitNote(e.target.value)}
                      />
                    </div>
                  </div>
                  {errors.submit && <div className="form-error" style={{ marginBottom: 16 }}>{errors.submit}</div>}
                  <div className="warn-pill" style={{ margin: "20px 0" }}>
                    <span>⚠️</span>
                    <span>Submission is final. Verify all links are accessible before confirming.</span>
                  </div>
                  <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Confirm Submission ✓"}
                  </button>
                  <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => goToStep("challenge")}>
                    ← Back to Challenge
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── DONE ── */}
          {step === "done" && (
            <div className="card">
              <div className="done-screen">
                <div className="done-icon">✅</div>
                <div className="done-title">Submission Received</div>
                <p className="done-sub">
                  Thank you, <strong style={{ color: "#c8d6e8" }}>{applicant.name}</strong>. Your deliverables have been logged and the Ottermap team will evaluate your model on held-out imagery. You'll hear back within 3–5 business days.
                </p>
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
                  {DELIVERABLES.map((d, i) => deliverables[i] ? (
                    <div key={i} style={{ fontSize: 12, color: "#4a6278", textAlign: "left" }}>
                      <span style={{ color: "#3b536b", fontFamily: "JetBrains Mono" }}>{d.label}:</span>
                      <br />
                      <span style={{ color: "#00d4aa", wordBreak: "break-all" }}>{deliverables[i]}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
