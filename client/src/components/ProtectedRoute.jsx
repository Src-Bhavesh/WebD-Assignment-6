import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ session, adminOnly = false, children }) {
  if (!session?.token) return <Navigate to="/login" replace />;
  if (adminOnly && session.user.role !== "admin") return <Navigate to="/tickets" replace />;
  return children;
}
