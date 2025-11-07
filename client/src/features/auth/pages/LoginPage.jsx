// src/features/auth/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/store/authStore";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!emailRe.test(email)) return setErr("올바른 이메일 형식이 아닙니다.");
    if (pw.length < 8) return setErr("비밀번호는 8자 이상이어야 합니다.");

    try {
      login({ email, password: pw, rememberMe: remember });
      const to = loc.state?.from || "/";
      nav(to, { replace: true });
    } catch (e) {
      setErr(e.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <main style={wrap}>
      <section style={card}>
        <h1 style={title}>로그인</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={row}>
            <span style={label}>이메일</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={input}
              type="email"
              required
            />
          </label>

          <label style={row}>
            <span style={label}>비밀번호</span>
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="********"
              style={input}
              type="password"
              required
              minLength={8}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            자동 로그인
          </label>

          {err && <div style={error}>{err}</div>}

          <button type="submit" style={btnPrimary}>로그인</button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          아직 계정이 없나요?{" "}
          <Link to="/signup" style={link}>
            회원가입
          </Link>
        </div>
      </section>
    </main>
  );
}

const wrap = { display: "grid", placeItems: "center", padding: 20 };
const card = { width: "100%", maxWidth: 420, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 20 };
const title = { margin: "0 0 10px 0" };
const row = { display: "grid", gap: 6 };
const label = { fontSize: 13, color: "#555", fontWeight: 600 };
const input = { border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" };
const btnPrimary = { border: "none", background: "#000", color: "#fff", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 700 };
const link = { color: "#5f3dc4", textDecoration: "none", fontWeight: 600 };
const error = { color: "#d9480f", background: "#fff4e6", border: "1px solid #ffd8a8", padding: "8px 10px", borderRadius: 8 };
