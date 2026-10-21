import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketForm from "./pages/TicketForm.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import AdminTickets from "./pages/AdminTickets.jsx";
import Departments from "./pages/Departments.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("helpdeskSession")) || null; }
    catch { return null; }
  });

  function logIn(data) {
    localStorage.setItem("helpdeskSession", JSON.stringify(data));
    setSession(data);
  }

  function logOut() {
    localStorage.removeItem("helpdeskSession");
    setSession(null);
  }

  return (
    <>
      <Navbar session={session} onLogOut={logOut} />
      <main id="page-wrap">
        <Routes>
          <Route path="/" element={<Home session={session} />} />
          <Route path="/login" element={session ? <Navigate to="/tickets" /> : <Login onLogIn={logIn} />} />
          <Route path="/register" element={session ? <Navigate to="/tickets" /> : <Register onLogIn={logIn} />} />
          <Route path="/tickets" element={<ProtectedRoute session={session}><Tickets session={session} /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute session={session}><TicketForm session={session} /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute session={session}><TicketDetail session={session} /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute session={session}><TicketForm session={session} /></ProtectedRoute>} />
          <Route path="/admin/tickets" element={<ProtectedRoute session={session} adminOnly><AdminTickets session={session} /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute session={session} adminOnly><Departments session={session} /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute session={session} adminOnly><Dashboard session={session} /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>Relay hellpdesk · A little help goes a long way.</footer>
    </>
  );
}

export default App;
