// src/features/auth/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/store/authStore";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const loc = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
