import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiCall, sendJson } from "../api/helpdeskApi.js";
import StatusBadge from "../components/StatusBadge.jsx";
import "./TicketDetail.css";
import "./TicketDetail.css";

export default function TicketDetail({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = session.user.role === "admin";
  const [ticket, setTicket] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTicket() {
    setTicket(await apiCall(`/tickets/${id}`, {}, session.token));
  }

  useEffect(() => {
    Promise.all([loadTicket(), isAdmin ? apiCall("/departments", {}, session.token) : Promise.resolve([])])
      .then(([, list]) => setDepartments(list))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, session.token, isAdmin]);

  async function updateTicket(path, options) {
    setError("");
    try {
      await apiCall(path, options, session.token);
      await loadTicket();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addReply(event) {
    event.preventDefault();
    setError("");
    try {
      await apiCall(`/tickets/${id}/comments`, sendJson("POST", { message }), session.token);
      setMessage("");
      await loadTicket();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeTicket() {
    if (!window.confirm("Remove this open request?")) return;
    try {
      await apiCall(`/tickets/${id}`, { method: "DELETE" }, session.token);
      navigate("/tickets");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading conversation…</p>;
  if (!ticket) return <section id="ticket-detail-page"><p role="alert">{error || "Ticket not found."}</p><Link to="/tickets">Back to tickets</Link></section>;

  const ownerId = ticket.customer?._id;
  const isOwner = ownerId === session.user.id || ownerId === session.user._id;
  const canEdit = !isAdmin && isOwner && ticket.status === "Open";
  const nextStatuses = { Open: ["In Progress"], "In Progress": ["Resolved"], Resolved: ["Closed"] };

  return (
    <section id="ticket-detail-page">
      <p><Link to={isAdmin ? "/admin/tickets" : "/tickets"}>Back to tickets</Link></p>
      {error && <p role="alert">{error}</p>}
      <header>
        <p>{ticket.ticketCode} · Opened {new Date(ticket.createdAt).toLocaleDateString()}</p>
        <h1>{ticket.title}</h1>
        <p><StatusBadge status={ticket.status} /> · {ticket.priority} priority · {ticket.category}</p>
        {canEdit && <p><Link to={`/tickets/${id}/edit`}>Edit request</Link> <button type="button" onClick={removeTicket}>Delete request</button></p>}
        {!isAdmin && isOwner && ticket.status === "Resolved" && !ticket.reopenedOnce && <button type="button" onClick={() => updateTicket(`/tickets/${id}/reopen`, { method: "PATCH" })}>Reopen once</button>}
      </header>

      <section>
        <h2>Request details</h2>
        <p>Customer: {ticket.customer?.name}</p>
        <p>Department: {ticket.department?.name || "Not assigned"}</p>
        {ticket.screenshotUrl && <p><a href={ticket.screenshotUrl} target="_blank" rel="noreferrer">View screenshot</a></p>}
        {isAdmin && <>
          <label>Department <select value={ticket.department?._id || ""} onChange={(e) => updateTicket(`/tickets/${id}/assign`, sendJson("PATCH", { departmentId: e.target.value }))}><option value="">Unassigned</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select></label>
          <label>Status <select value={ticket.status} onChange={(e) => updateTicket(`/tickets/${id}/status`, sendJson("PATCH", { status: e.target.value }))}><option value={ticket.status}>{ticket.status}</option>{(nextStatuses[ticket.status] || []).map((status) => <option key={status}>{status}</option>)}</select></label>
        </>}
      </section>

      <section>
        <h2>Conversation</h2>
        <article><h3>{ticket.customer?.name} · Customer</h3><p>{ticket.description}</p><time>{new Date(ticket.createdAt).toLocaleString()}</time></article>
        {ticket.comments?.map((comment) => <article key={comment._id}><h3>{comment.user?.name} · {comment.user?.role === "admin" ? "Support team" : "Customer"}</h3><p>{comment.message}</p><time>{new Date(comment.createdAt).toLocaleString()}</time></article>)}
        {ticket.status === "Closed" ? <p>This ticket is closed and can no longer receive replies.</p> : <form onSubmit={addReply}>
          <label>Write a reply <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" maxLength="1500" required /></label>
          <button type="submit">Send reply</button>
        </form>}
      </section>
    </section>
  );
}
