import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import "./TicketRow.css";

export default function TicketRow({ ticket, admin = false }) {
  return (
    <Link data-ticket-row to={`/tickets/${ticket._id}`}>
      <span data-priority={ticket.priority.toLowerCase()} aria-label={`${ticket.priority} priority`} />
      <span>
        <strong>{ticket.title}</strong>
        <small>{ticket.ticketCode} · {admin ? ticket.customer?.name : ticket.category}</small>
      </span>
      <span>{admin ? ticket.category : ticket.department?.name || "Unassigned"}</span>
      <StatusBadge status={ticket.status} />
      <time dateTime={ticket.updatedAt}>{new Date(ticket.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</time>
    </Link>
  );
}
