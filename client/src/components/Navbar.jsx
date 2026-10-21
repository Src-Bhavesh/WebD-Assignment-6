import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ session, onLogOut }) {
  const navigate = useNavigate();
  const isAdmin = session?.user?.role === "admin";

  function leave() {
    onLogOut();
    navigate("/");
  }

  return (
    <header id="topbar">
      <Link id="brand" to="/">Relay</Link>
      <nav aria-label="Main navigation">
        {session ? isAdmin ? <>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/tickets">Tickets</NavLink>
          <NavLink to="/admin/departments">Departments</NavLink>
        </> : <>
          <NavLink to="/tickets">My tickets</NavLink>
          <NavLink to="/tickets/new">New request</NavLink>
        </> : <>
          <a href="#how-it-works">How it works</a>
          <a href="#support">Support</a>
        </>}
      </nav>
      <div id="nav-account">
        {session ? <>
          <span>{session.user.name}</span>
          <button type="button" onClick={leave}>Log out</button>
        </> : <>
          <Link to="/login">Log in</Link>
          <Link to="/register">Create account</Link>
        </>}
      </div>
    </header>
  );
}
