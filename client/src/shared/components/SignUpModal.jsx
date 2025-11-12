import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "../../app/store/authStore";

export default function SignUpModal({ open, onClose, onSwitchToLogin }) {
  const { validateNickname, validatePassword } = useAuth.getState();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [nick, setNick] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    try {
      if (!validateNickname(nick)) throw new Error("닉네임: 2~12자 / 한글·영문·숫자");
      if (!validatePassword(pw)) throw new Error("비밀번호: 8~20자 / 소문자+숫자 필수");
      await useAuth.getState().signup({ email, password: pw, nickname: nick });
      onClose?.();
    } catch (e) {
      setErr(e.message || "회원가입 실패");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="회원가입"
      footer={
        <>
          <button onClick={onClose} style={btnGhost}>취소</button>
          <button onClick={submit} style={btnPrimary}>가입하기</button>
        </>
      }
    >
      <div style={{ display:"grid", gap:12 }}>
        <div>
          <div style={label}>이메일</div>
          <input style={input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <div style={label}>닉네임</div>
          <input style={input} value={nick} onChange={e=>setNick(e.target.value)} placeholder="2~12자, 특수문자 불가" />
        </div>
        <div>
          <div style={label}>비밀번호</div>
          <input style={input} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="소문자+숫자 필수" />
        </div>
        {err && <div style={{ color:"#c92a2a", fontSize:12 }}>{err}</div>}

        <div style={{ fontSize:12, color:"#666" }}>
          이미 계정이 있나요?{" "}
          <button onClick={onSwitchToLogin} style={linkBtn}>로그인</button>
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
