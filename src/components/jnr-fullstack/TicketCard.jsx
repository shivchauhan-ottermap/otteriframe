function Code({ children }) {
  return <code>{children}</code>;
}

export default function TicketCard() {
  return (
    <div className="jnr-ticket-card">
      <div className="jnr-ticket-id">OTR-218 · Priority: High · Status: Backlog</div>
      <div className="jnr-ticket-title">
        Property list filters reset when navigating to a detail page and back
      </div>
      <div className="jnr-ticket-badges">
        <span className="jnr-badge jnr-badge-high">High Priority</span>
        <span className="jnr-badge jnr-badge-react">React Frontend</span>
        <span className="jnr-badge jnr-badge-ts">TypeScript</span>
        <span className="jnr-badge jnr-badge-bug">Customer-Facing</span>
      </div>
      <div className="jnr-ticket-section">
        <div className="jnr-ticket-section-label">Description</div>
        <div className="jnr-ticket-body">
          On the <Code>/properties</Code> page, users can filter the property list by{" "}
          <strong>Service Type</strong> (e.g. Landscaping, Snow Removal), <strong>Region</strong>, and{" "}
          <strong>Area Range</strong>. When a user applies filters and then clicks into a property
          detail page (<Code>/properties/:id</Code>), returning via the browser back button or the
          &quot;← Back to Properties&quot; link resets all filters to defaults. Users are losing their
          filter state mid-session and are raising support tickets. The fix must persist filter state
          across this navigation without a full re-fetch if the filters haven&apos;t changed.
        </div>
      </div>
      <div className="jnr-ticket-section">
        <div className="jnr-ticket-section-label">Acceptance Criteria</div>
        <ul className="jnr-criteria-list">
          <li>
            Filter state (service type, region, area range) persists when navigating to a detail page
            and returning
          </li>
          <li>
            State must be stored in <strong>URL search params</strong> (not localStorage or
            sessionStorage)
          </li>
          <li>The existing &quot;Reset Filters&quot; button must still clear all filters correctly</li>
          <li>
            No unnecessary API re-fetch occurs if the user returns with the same filters already
            applied
          </li>
          <li>
            TypeScript types for filter state must be defined — no use of <Code>any</Code>
          </li>
        </ul>
      </div>
      <div className="jnr-ticket-section">
        <div className="jnr-ticket-section-label">Notes</div>
        <div className="jnr-ticket-body">
          The filter state is currently held in local <Code>useState</Code> inside the{" "}
          <Code>PropertiesPage</Code> component. The component unmounts on navigation, destroying the
          state. The tech lead has suggested using React Router&apos;s <Code>useSearchParams</Code>{" "}
          hook as the source of truth.
        </div>
      </div>
    </div>
  );
}
