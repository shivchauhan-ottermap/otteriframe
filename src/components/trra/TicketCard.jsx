const BADGE_CLASS = {
  high: "trra-badge-high",
  be: "trra-badge-be",
  fs: "trra-badge-fs",
  pt: "trra-badge-pt",
};

export default function TicketCard({ ticket, style }) {
  return (
    <div className="trra-ticket" style={style}>
      <div className="trra-ticket-header">
        <div className="trra-ticket-id-wrap">
          <span className="trra-ticket-id">{ticket.id}</span>
          <span className="trra-ticket-title">{ticket.title}</span>
        </div>
        <div className="trra-ticket-badges">
          {ticket.badges.map((badge) => (
            <span key={badge.label} className={`trra-badge ${BADGE_CLASS[badge.variant]}`}>
              {badge.label}
            </span>
          ))}
        </div>
      </div>
      <div className="trra-ticket-body">
        <div>
          <div className="trra-ticket-field-label">Description</div>
          <div className="trra-ticket-field-value">{ticket.description}</div>
        </div>
        <div>
          <div className="trra-ticket-field-label">Acceptance criteria</div>
          <ul className="trra-criteria-list">
            {ticket.criteria.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="trra-ticket-field-label">Notes</div>
          <div className="trra-ticket-field-value">{ticket.notes}</div>
        </div>
      </div>
    </div>
  );
}
