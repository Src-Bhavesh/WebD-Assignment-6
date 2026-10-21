import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../api/helpdeskApi.js";
import TicketRow from "../components/TicketRow.jsx";
import "./Dashboard.css";
import "./Dashboard.css";

export default function Dashboard({ session }) {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiCall("/dashboard", {}, session.token), apiCall("/tickets", {}, session.token)])
      .then(([numbers, list]) => { setStats(numbers); setTickets(list.slice(0, 5)); })
      .catch((err) => setError(err.message));
  }, [session.token]);

  if (error) return <section id="dashboard-page"><p role="alert">{error}</p></section>;
  if (!stats) return <p>Loading dashboard…</p>;

  return (
    <section id="dashboard-page">
      <header><div><p>Support overview</p><h1>Dashboard</h1></div><Link to="/admin/tickets">Open ticket list</Link></header>
      <section>
        <h2>Ticket counts</h2>
        <ul>
          <li>Total tickets: {stats.total}</li>
          <li>Open and in progress: {stats.open}</li>
          <li>Resolved and closed: {stats.resolved}</li>
          <li>Average time to resolve: {stats.avgHours} hours</li>
        </ul>
      </section>
      <section>
        <h2>Tickets by priority</h2>
        <ul>{["High", "Medium", "Low"].map((name) => {
          const item = stats.priority.find((row) => row._id === name);
          return <li key={name}>{name}: {item?.count || 0}</li>;
        })}</ul>
      </section>
      <section>
        <h2>Tickets by category</h2>
        <ul>{stats.category.map((item) => <li key={item._id}>{item._id}: {item.count}</li>)}</ul>
      </section>
      <section>
        <h2>Recently updated</h2>
        {tickets.map((ticket) => <TicketRow key={ticket._id} ticket={ticket} admin />)}
        {tickets.length === 0 && <p>No tickets yet.</p>}
      </section>
    </section>
  );
}
