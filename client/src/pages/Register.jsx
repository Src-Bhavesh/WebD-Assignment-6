import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall, sendJson } from "../api/helpdeskApi.js";
import "./Register.css";

export default function Register({ onLogIn }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiCall("/auth/register", sendJson("POST", form));
      onLogIn(data);
      navigate("/tickets/new");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="register-page">
      <p><Link to="/">Back home</Link></p>
      <h1>Create an account</h1>
      <p>Open a request and keep track of the replies here.</p>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>Name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" maxLength="80" /></label>
        <label>Email <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label>
        <label>Password <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength="8" autoComplete="new-password" /></label>
        <button type="submit" disabled={loading}>{loading ? "Creating accout" : "Create account"}</button>
      </form>
      <p>Already registered? <Link to="/login">Log in</Link></p>
    </section>
  );
}
