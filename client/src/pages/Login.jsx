import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall, sendJson } from "../api/helpdeskApi.js";
import "./Login.css";

export default function Login({ onLogIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiCall("/auth/login", sendJson("POST", form));
      onLogIn(data);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/tickets");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="login-page">
      <p><Link to="/">Back home</Link></p>
      <h1>Log in</h1>
      <p>Log in to see your requests and replies.</p>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>Email <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label>
        <label>Password <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" /></label>
        <button type="submit" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
      </form>
      <p>New here? <Link to="/register">Create a account</Link></p>
    </section>
  );
}
