import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../../app/store/authStore";

export default function LoginModal({ open, onClose, onSwitchToSignup }) {
  const login = useAuth(s => s.login);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    try {
      await login({ email, password: pw, remember });
      onClose?.();
    } catch (e) {
      setErr(e.message || "로그인 실패");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="로그인"
      footer={
        <>
          <button onClick={onClose} style={btnGhost}>취소</button>
          <button onClick={submit} style={btnPrimary}>로그인</button>
        </>
      }
    >
      <div style={{ display:"grid", gap:12 }}>
        <div>
          <div style={label}>이메일</div>
          <input style={input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <div style={label}>비밀번호</div>
          <input style={input} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="********" />
        </div>
        <label style={{ fontSize:12, color:"#555" }}>
          <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> 자동 로그인
        </label>
        {err && <div style={{ color:"#c92a2a", fontSize:12 }}>{err}</div>}

        <div style={{ fontSize:12, color:"#666" }}>
          아직 계정이 없나요?{" "}
          <button onClick={onSwitchToSignup} style={linkBtn}>회원가입</button>
        </div>
      </div>
    </Modal>
  );
}

const label = { fontSize:12, color:"#555", marginBottom:6 };
const input = { width:"100%", padding:"8px 10px", border:"1px solid #ddd", borderRadius:6, outline:"none" };
const btnGhost = { border:"1px solid #ccc", background:"#fff", borderRadius:6, padding:"6px 10px", cursor:"pointer" };
const btnPrimary = { border:"none", background:"#000", color:"#fff", borderRadius:6, padding:"6px 12px", fontWeight:700, cursor:"pointer" };
const linkBtn = { border:"none", background:"transparent", color:"#5f3dc4", cursor:"pointer", textDecoration:"underline" };
