// src/components/AdminGuard.jsx
import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}