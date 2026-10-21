import { useEffect, useState } from "react";
import { apiCall, sendJson } from "../api/helpdeskApi.js";
import "./Departments.css";
import "./Departments.css";

export default function Departments({ session }) {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDepartments() {
    setDepartments(await apiCall("/departments", {}, session.token));
  }

  useEffect(() => {
    loadDepartments().catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [session.token]);

  async function saveDepartment(event) {
    event.preventDefault();
    setError("");
    try {
      const path = editingId ? `/departments/${editingId}` : "/departments";
      const method = editingId ? "PUT" : "POST";
      await apiCall(path, sendJson(method, form), session.token);
      setForm({ name: "", description: "" });
      setEditingId("");
      await loadDepartments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeDepartment(id) {
    setError("");
    try {
      await apiCall(`/departments/${id}`, { method: "DELETE" }, session.token);
      await loadDepartments();
    } catch (err) {
      setError(err.message);
    }
  }

  function editDepartment(department) {
    setEditingId(department._id);
    setForm({ name: department.name, description: department.description || "" });
  }

  return (
    <section id="departments-page">
      <header><p>Admin</p><h1>Departments</h1><p>Choose the teams that handle customer requests.</p></header>
      {error && <p role="alert">{error}</p>}
      <section>
        <h2>Teams</h2>
        {loading && <p>Loading departments…</p>}
        {!loading && departments.length === 0 && <p>No departments yet.</p>}
        {departments.map((department) => <article key={department._id}>
          <h3>{department.name}</h3><p>{department.description || "Support team"}</p>
          <button type="button" onClick={() => editDepartment(department)}>Edit</button>
          <button type="button" onClick={() => removeDepartment(department._id)}>Delete</button>
        </article>)}
      </section>
      <section>
        <h2>{editingId ? "Edit department" : "Add a department"}</h2>
        <form onSubmit={saveDepartment}>
          <label>Name <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength="80" /></label>
          <label>Description <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" /></label>
          <button type="submit">{editingId ? "Save changes" : "Add department"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(""); setForm({ name: "", description: "" }); }}>Cancel</button>}
        </form>
      </section>
    </section>
  );
}
