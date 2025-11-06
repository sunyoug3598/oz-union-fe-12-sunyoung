import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../app/store/authStore";

export default function ProtectedRoute({ children }) {
  const user = useAuth(s => s.user);
  const loc = useLocation();
  if (!user) {
    // 로그인 안 되어 있으면 홈으로 보내고 쿼리로 알려주기(선택)
    return <Navigate to={`/?login=1`} state={{ from: loc.pathname }} replace />;
  }
  return children;
}
