export const NAV_LINKS = [
  { href: "#brief", label: "Brief" },
  { href: "#tickets", label: "Tickets" },
  { href: "#stack", label: "Stack" },
  { href: "#scoring", label: "Scoring" },
  { href: "#timeline", label: "Timeline" },
  { href: "#submit", label: "Submit" },
];

export const HERO_META = [
  { strong: "72 hrs", text: " to submit" },
  { strong: "6–10 hrs", text: " expected effort" },
  { strong: "React + Flask + PostgreSQL", text: "" },
  { strong: "Docker Compose required", text: "" },
  { strong: "AI workflow — mandatory section", text: "" },
];

export const BRIEF_FEATURES = [
  {
    title: "Properties",
    items: [
      'Create a Property (e.g. "Bengaluru Golf Club")',
      "Name, type, total acreage, notes",
      "Types: Golf Course / Airport / Corporate Campus / Other",
      "List view with search by name or type",
    ],
  },
  {
    title: "Zones",
    items: [
      "Draw zones as polygons on an OpenLayers map",
      "Zone types: Fairway / Rough / Perimeter / Exclusion",
      "Assigned mower count per zone",
      "Status: Active / Inactive",
      "Edit boundaries directly on the map",
    ],
  },
  {
    title: "GeoJSON workflow",
    items: [
      "Upload a GeoJSON file to pre-populate zones",
      "Save edits back to the database",
      "Download current zones as GeoJSON",
      "Zoom to extent on load",
    ],
  },
  {
    title: "Zone summary panel",
    items: [
      "Sidebar listing all zones for the selected property",
      "Acreage auto-calculated from polygon geometry",
      "Understaffed flag: <1 mower per 2 acres",
      "Total mower count across property",
    ],
  },
];

export const TICKETS = [
  {
    id: "TER-S01 · Foundation",
    title: "Build the Zone Manager — core CRUD, map, and GeoJSON workflow",
    badges: [
      { label: "High Priority", variant: "high" },
      { label: "Full-Stack", variant: "fs" },
      { label: "5pt", variant: "pt" },
    ],
    description:
      "Implement the core Zone Manager: authentication, Property CRUD, Zone CRUD with an OpenLayers map, and the full GeoJSON upload / edit / download workflow. This is the foundation everything else depends on.",
    criteria: [
      "User can sign up, log in, and log out. JWT tokens stored client-side. Protected routes redirect unauthenticated users.",
      "User can create, view, edit, and delete Properties. Each has name, type (enum), total acreage, notes.",
      "User can draw polygon zones on an OpenLayers map and assign a name, zone type, mower count, and status.",
      "User can upload a GeoJSON FeatureCollection — polygons are rendered as zones on the map and persisted.",
      "User can edit zone boundaries on the map and save changes. Changes persist across page reloads.",
      "User can download the current zones for a property as a valid GeoJSON FeatureCollection.",
      "Map zooms to the GeoJSON extent on load. If no zones exist, shows a default view centred on India.",
      "Sidebar shows all zones for the selected property with auto-calculated acreage and the understaffed flag.",
      "The entire application runs with docker compose up --build from a clean directory.",
      "A seed script or SQL file creates one demo property with 3 pre-drawn zones on first boot.",
    ],
    notes: (
      <>
        Use OpenLayers only — no Leaflet, no Mapbox, no Google Maps. For GeoJSON samples, use{" "}
        <a href="https://geojson.io" target="_blank" rel="noreferrer" style={{ color: "var(--trra-lime)" }}>
          geojson.io
        </a>
        . Geometry may be stored as PostGIS <code>geometry</code> or JSONB — justify your choice in the README.
      </>
    ),
  },
  {
    id: "TER-S02 · Business logic",
    title: "Mower coverage validator — flag understaffed zones and block invalid assignments",
    badges: [
      { label: "High Priority", variant: "high" },
      { label: "Backend-heavy", variant: "be" },
      { label: "3pt", variant: "pt" },
    ],
    description:
      "Operators sometimes assign zero mowers to a zone or set a mower count that can't reasonably cover the acreage. The system currently accepts these silently. Add server-side validation and surface the result in the UI.",
    criteria: [
      <>
        Backend: creating or updating a zone with <code>mower_count = 0</code> returns a <code>400</code> with a
        human-readable error: <em>"A zone must have at least one assigned mower."</em>
      </>,
      <>
        Backend: a zone is flagged as <code>understaffed: true</code> in the API response when its acreage exceeds{" "}
        <code>mower_count × 2</code> acres. This flag is computed, not stored.
      </>,
      'Frontend: the zone form surfaces the backend error message inline — no silent failures, no generic "Something went wrong".',
      "Frontend: understaffed zones are visually distinct in both the sidebar list and on the map (different fill colour or a warning icon — your choice).",
      <>
        A <code>GET /properties/:id/zones/summary</code> endpoint returns: total zones, total acreage, total mowers
        assigned, count of understaffed zones. Used by the sidebar header.
      </>,
      "The validation logic must not be duplicated between the create and update endpoints — share it via a helper or service function.",
    ],
    notes: (
      <>
        Don't build a separate "validator" service. Keep it in the Flask app. The acreage calculation must use the
        actual polygon geometry — not the manually entered <code>total_acreage</code> field on the Property.
      </>
    ),
  },
];

export const STACK_FEATURES = [
  {
    title: "Frontend — required",
    items: [
      "React 18+ with TypeScript (strict mode)",
      "OpenLayers for all map rendering",
      "Tailwind CSS for styling",
      "Axios or native fetch for API calls",
      "No UI component libraries for the map",
    ],
  },
  {
    title: "Backend — required",
    items: [
      "Python Flask REST API",
      "PostgreSQL — not SQLite",
      "Flask-SQLAlchemy or raw psycopg2",
      "JWT authentication",
      "GeoJSON as PostGIS geometry or JSONB",
    ],
  },
  {
    title: "Infrastructure — required",
    items: [
      "Docker Compose: 3 services (frontend, backend, postgres)",
      "Runs with docker compose up --build",
      "Seed data on first boot",
      "README with honest setup instructions",
    ],
  },
  {
    title: "Repo structure — required",
    items: ["/frontend", "/backend", "docker-compose.yml", "README.md"],
  },
];

export const AI_QUESTIONS = [
  "Which AI tool(s) did you use, and what specifically did you use each one for? (Not \"I used Claude to help write code\" — what did you use it for, exactly?)",
  "Give one concrete example of AI output you accepted with no changes. Paste the prompt you gave and the output you used.",
  "Give one concrete example of AI output you rejected or significantly edited. What was wrong with it? What did you change?",
  "Name one part of this task where AI was not useful and you did it yourself. Why wasn't AI the right tool there?",
];

export const DONT_ITEMS = [
  "Use Leaflet, Mapbox, Google Maps, or any mapping library other than OpenLayers",
  "Use SQLite — PostgreSQL is required for this task",
  "Use a pre-built map component that abstracts OpenLayers away from you",
  "Submit without running docker compose up --build from a clean directory and verifying it works end to end",
  'Submit a README that says "works on my machine" without a working Docker setup',
  "Spend time on animations, dark mode, or visual polish — we evaluate engineering, not aesthetics",
  "Leave the AI Workflow section vague or empty",
];

export const BONUS_ITEMS = [
  {
    strong: "Mowing path simulation:",
    text: " given a zone polygon, render a back-and-forth stripe pattern as a LineString overlay on the map. No physics — just a visual approximation that a mower would realistically follow.",
  },
  {
    strong: "Zone conflict detection:",
    text: " highlight zones that overlap on the map. Use PostGIS ST_Intersects on the backend or compute it on the frontend — either approach is valid, justify your choice.",
  },
  {
    strong: "Property search + filter",
    text: " by type and/or acreage range on the property list view.",
  },
  {
    strong: "GeoJSON validation",
    text: " on upload — reject files that aren't valid FeatureCollections or contain non-polygon geometry. Return a descriptive error.",
  },
  {
    strong: "Unit tests",
    text: " for at least 2 Flask endpoints using pytest. Tests must pass inside Docker.",
  },
];

export const SCORE_ROWS = [
  {
    area: "Map + GeoJSON workflow",
    weight: "25%",
    detail:
      "Draw, edit, save, reload polygons correctly. GeoJSON round-trips cleanly. Zoom-to-extent works. Import and export both function.",
  },
  {
    area: "API design",
    weight: "20%",
    detail:
      "RESTful, consistent error shapes, correct HTTP status codes, auth middleware applied correctly, validation in TER-S02 works as specified.",
  },
  {
    area: "Database design",
    weight: "15%",
    detail:
      "Schema makes sense for the domain. Geometry stored correctly (PostGIS or JSONB — justified in README). No obvious N+1 patterns.",
  },
  {
    area: "Code quality",
    weight: "15%",
    detail:
      "TypeScript types used meaningfully (not any everywhere). Flask routes are clean. Business logic separated from route handlers.",
  },
  {
    area: "Docker + setup",
    weight: "15%",
    detail:
      "docker compose up --build works first try from a clean directory. README is honest. Seed data is present.",
  },
  {
    area: "AI workflow documentation",
    weight: "10%",
    detail:
      'All four questions answered specifically. Evidence of judgment — not just "I used AI." One example of AI rejection is documented.',
  },
];

export const TIMELINE_ITEMS = [
  {
    day: "Day 0\nMonday AM",
    title: "Task sent",
    description:
      "You receive this link. The 72-hour window opens. Read everything before you write a line of code.",
    active: true,
  },
  {
    day: "Day 1\n~6–8 hrs in",
    title: "Recommended checkpoint",
    description:
      "Docker Compose running, auth working, at least one Property endpoint live. If you're not here by end of Day 1, re-scope.",
  },
  {
    day: "Day 2\n~8–10 hrs in",
    title: "Core complete",
    description:
      "TER-S01 and TER-S02 both working. Map draws, saves, exports. Understaffed flag visible. Now decide if you tackle any bonus items.",
  },
  {
    day: "Day 3\nWednesday 11:59 PM IST",
    title: "Submission deadline",
    description:
      "Hard deadline. Run docker compose up --build one final time from a clean directory. Write your AI Workflow section. Submit the GitHub link.",
  },
  {
    day: "Day 5\nFriday EOD",
    title: "Results communicated",
    description:
      "Shortlisted candidates hear from Ottermap by Friday evening. Shortlist target: 10–20 candidates from the 40 submissions.",
  },
  {
    day: "Following Monday",
    title: "Round 3 begins",
    description:
      "Communication screen — 15-minute async voice note. Shortlisted candidates receive instructions separately.",
  },
];

export const SUBMIT_STEPS = [
  <>
    Run <code>docker compose up --build</code> from a completely clean directory (no local node_modules, no .env
    pre-loaded). It must work.
  </>,
  "Confirm the seed data creates the demo property with 3 zones on first boot.",
  "Test the GeoJSON upload → edit → download round-trip manually.",
  "Confirm TER-S02 validation: try submitting a zone with 0 mowers — the error must appear inline.",
  <>
    Write your <code>## AI Workflow</code> section in the README — all four questions answered specifically.
  </>,
  <>
    Make the GitHub repo public OR add <code>@ottermap-hiring</code> as a collaborator.
  </>,
  "Email the link to hiring@ottermap.com with subject line exactly as shown below.",
];
