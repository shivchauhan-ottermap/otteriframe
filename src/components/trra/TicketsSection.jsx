import RevealSection from "./RevealSection";
import SectionLabel from "./SectionParts";
import TicketCard from "./TicketCard";
import { TICKETS } from "./trraData";

export default function TicketsSection() {
  return (
    <RevealSection id="tickets">
      <SectionLabel>Linear tickets</SectionLabel>
      <h2>Two tickets. 72 hours. Ship both.</h2>
      <p>
        These are structured like real Linear tickets from the Velocity backlog. Read the acceptance criteria carefully
        — they define exactly what done looks like.
      </p>
      {TICKETS.map((ticket, i) => (
        <TicketCard key={ticket.id} ticket={ticket} style={i === 0 ? { marginTop: "1.5rem" } : undefined} />
      ))}
    </RevealSection>
  );
}
