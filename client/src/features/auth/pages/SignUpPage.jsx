// src/features/auth/pages/SignUpPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/store/authStore";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const nav = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!emailRe.test(email)) return setErr("올바른 이메일 형식이 아닙니다.");
    if (nickname.trim().length < 2) return setErr("닉네임은 2자 이상 입력하세요.");
    if (pw.length < 8) return setErr("비밀번호는 8자 이상이어야 합니다.");
    if (pw !== pw2) return setErr("비밀번호가 일치하지 않습니다.");

    try {
      signup({ email, nickname: nickname.trim(), password: pw });
      setOk("가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => nav("/login"), 800);
    } catch (e) {
      setErr(e.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <main style={wrap}>
      <section style={card}>
        <h1 style={title}>회원가입</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <Field label="이메일">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={input}
              type="email"
              required
            />
          </Field>

          <Field label="닉네임">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="떠니"
              style={input}
              required
              minLength={2}
            />
          </Field>

          <Field label="비밀번호">
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="********"
              style={input}
              type="password"
              required
              minLength={8}
            />
          </Field>

          <Field label="비밀번호 확인">
            <input
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="********"
              style={input}
              type="password"
              required
            />
          </Field>

          {err && <div style={error}>{err}</div>}
          {ok && <div style={okBox}>{ok}</div>}

          <button type="submit" style={btnPrimary}>회원가입</button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          이미 계정이 있나요?{" "}
          <Link to="/login" style={link}>
            로그인
          </Link>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

const wrap = { display: "grid", placeItems: "center", padding: 20 };
const card = { width: "100%", maxWidth: 420, background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 20 };
const title = { margin: "0 0 10px 0" };
const input = { border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" };
const btnPrimary = { border: "none", background: "#000", color: "#fff", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 700 };
const link = { color: "#5f3dc4", textDecoration: "none", fontWeight: 600 };
const error = { color: "#d9480f", background: "#fff4e6", border: "1px solid #ffd8a8", padding: "8px 10px", borderRadius: 8 };
const okBox = { color: "#2b8a3e", background: "#ebfbee", border: "1px solid #b2f2bb", padding: "8px 10px", borderRadius: 8 };
