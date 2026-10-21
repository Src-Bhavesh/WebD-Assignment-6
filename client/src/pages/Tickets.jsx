import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../api/helpdeskApi.js";
import TicketRow from "../components/TicketRow.jsx";
import "./Tickets.css";

export default function Tickets({ session }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All requests");

  useEffect(() => {
    apiCall("/tickets/my", {}, session.token)
      .then(setTickets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session.token]);

  const visibleTickets = tickets.filter((ticket) => {
    const text = `${ticket.title} ${ticket.ticketCode} ${ticket.category}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (status === "All requests" || ticket.status === status);
  });

  return (
    <section id="tickets-page">
      <header>
        <div><p>Your support space</p><h1>Your requests idhar hai</h1><p>Check the latest updates from the support team.</p></div>
        <Link to="/tickets/new">New request</Link>
      </header>
      <section>
        <h2>Recent requests ({visibleTickets.length})</h2>
        <label>search <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or ticket number" /></label>
        <label>Status <select value={status} onChange={(e) => setStatus(e.target.value)}><option>All requests</option><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></label>
        {loading && <p>Loading your requests…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && visibleTickets.length === 0 && <p>No requests found. <Link to="/tickets/new">Create a request</Link></p>}
        {visibleTickets.map((ticket) => <TicketRow key={ticket._id} ticket={ticket} />)}
      </section>
    </section>
  );
}
