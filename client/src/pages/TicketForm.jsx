import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiCall, sendJson } from "../api/helpdeskApi.js";
import "./TicketForm.css";

const emptyForm = { title: "", category: "Account", priority: "Medium", description: "", screenshotUrl: "" };

export default function TicketForm({ session }) {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    apiCall(`/tickets/${id}`, {}, session.token)
      .then((ticket) => {
        if (ticket.status !== "Open") throw new Error("Only open tickets can be edited.");
        setForm({ title: ticket.title, category: ticket.category, priority: ticket.priority, description: ticket.description, screenshotUrl: ticket.screenshotUrl || "" });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [editing, id, session.token]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const method = editing ? "PUT" : "POST";
      const path = editing ? `/tickets/${id}` : "/tickets";
      const ticket = await apiCall(path, sendJson(method, form), session.token);
      navigate(`/tickets/${ticket._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading request…</p>;

  return (
    <section id="ticket-form-page">
      <p><Link to={editing ? `/tickets/${id}` : "/tickets"}>Back to requests</Link></p>
      <h1>{editing ? "Edit your request" : "What can we help with?"}</h1>
      <p>Share a few details and we’ll send this to the right person.</p>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>Title <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength="120" required /></label>
        <label>Category <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Account</option><option>Billing</option><option>Orders</option><option>Technical</option><option>General</option></select></label>
        <label>Priority <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
        <label>Details <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="6" maxLength="3000" required /></label>
        <label>Screenshot link (optional) <input type="url" value={form.screenshotUrl} onChange={(e) => setForm({ ...form, screenshotUrl: e.target.value })} /></label>
        <button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Send request"}</button>
      </form>
    </section>
  );
}
