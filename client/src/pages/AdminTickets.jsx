import { useEffect, useState } from "react";
import { apiCall } from "../api/helpdeskApi.js";
import TicketRow from "../components/TicketRow.jsx";
import "./AdminTickets.css";

export default function AdminTickets({ session }) {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (category) params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    const query = params.toString();
    apiCall(`/tickets${query ? `?${query}` : ""}`, {}, session.token)
      .then(setTickets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session.token, status, priority, category, search]);

  return (
    <section id="admin-tickets-page">
      <header><div><p>Support desk</p><h1>All tickets</h1><p>Search and filter customer requests.</p></div><p>{tickets.length} tickets</p></header>
      <section>
        <h2>Requests</h2>
        <label>Search <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or ticket number" /></label>
        <label>Status <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></label>
        <label>Priority <select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All</option><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label>Category <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All</option><option>Account</option><option>Billing</option><option>Orders</option><option>Technical</option><option>General</option></select></label>
        {loading && <p>Loading tickets…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && tickets.length === 0 && <p>No tickets found.</p>}
        {tickets.map((ticket) => <TicketRow key={ticket._id} ticket={ticket} admin />)}
      </section>
    </section>
  );
}
