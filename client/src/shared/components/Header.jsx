import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../app/store/authStore";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export default function Header() {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);

  const quotes = [
    "기록은 기억을 이깁니다.",
    "조금 늦어도 괜찮아요. 꾸준하면 돼요.",
    "오늘의 할 일은 나를 지치게 하지 않아요.",
    "나만의 일정관리 SOLAN을 사용해보세요.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [openLogin, setOpenLogin]   = useState(false);
  const [openJoin, setOpenJoin]     = useState(false);

  // 쿼리로 로그인 유도 (예: /?login=1)
  useEffect(() => {
    const p = new URLSearchParams(search);
    if (p.get("login") === "1") setOpenLogin(true);
  }, [search]);

  const goHome = () => nav("/");

  return (
    <header style={{ backgroundColor:"#f7f7f7", borderBottom:"1px solid #ddd", padding:"8px 16px" }}>
      <div
        style={{
          maxWidth:"1200px", margin:"0 auto",
          display:"grid", gridTemplateColumns:"1fr minmax(480px, 600px) 1fr",
          alignItems:"center", columnGap:"12px", minHeight:"32px",
        }}
      >
        {/* 좌: 로고 */}
        <div style={{ fontWeight:600, fontSize:14, cursor:"pointer" }} onClick={goHome}>
          oz-union-fe-12-sunyoung
        </div>

        {/* 중: 오늘의 문구 */}
        <div
          style={{
            justifySelf:"center", position:"relative",
            background:"#fff", border:"1px solid #ccc", borderRadius:4,
            boxShadow:"0 2px 4px rgba(0,0,0,0.06)",
            padding:"8px 12px 20px", minWidth:480, maxWidth:600, width:"100%",
            textAlign:"center", fontSize:14, fontWeight:500, color:"#000",
          }}
        >
          <div style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }} title={quotes[quoteIndex]}>
            {quotes[quoteIndex]}
          </div>
          <div
            style={{
              position:"absolute", right:8, bottom:4, display:"flex", alignItems:"center",
              gap:6, fontSize:11, color:"#555",
            }}
          >
            <span style={{ minWidth:32, textAlign:"right" }}>{quoteIndex+1}/{quotes.length}</span>
            <ArrowButton onClick={() => setQuoteIndex(i => (i-1+quotes.length)%quotes.length)} label="이전">◀</ArrowButton>
            <ArrowButton onClick={() => setQuoteIndex(i => (i+1)%quotes.length)} label="다음">▶</ArrowButton>
          </div>
        </div>

        {/* 우: 내비 & 인증 */}
        <nav style={{ justifySelf:"end", display:"flex", alignItems:"center", gap:12, fontSize:14, whiteSpace:"nowrap" }}>
          <HeaderNavLink to="/" active={pathname === "/"}>캘린더</HeaderNavLink>
          <HeaderNavLink to="/notes" active={pathname.startsWith("/notes")}>메모</HeaderNavLink>
          <HeaderNavLink to="/categories" active={pathname.startsWith("/categories")}>카테고리</HeaderNavLink>
          <span style={{ color:"#aaa" }}>|</span>

          {user ? (
            <>
              <span style={{ color:"#444" }}>{user.nickname}님</span>
              <Link to="/mypage" style={{ textDecoration:"none", fontWeight:600, color:"#222" }}>마이페이지</Link>
              <button onClick={logout} style={logoutBtn}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => setOpenLogin(true)} style={loginBtn}>로그인</button>
              <button onClick={() => setOpenJoin(true)} style={joinBtn}>회원가입</button>
            </>
          )}
        </nav>
      </div>

      {/* 모달 */}
      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSwitchToSignup={() => { setOpenLogin(false); setOpenJoin(true); }}
      />
      <SignUpModal
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        onSwitchToLogin={() => { setOpenJoin(false); setOpenLogin(true); }}
      />
    </header>
  );
}

function HeaderNavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      style={{ textDecoration:"none", color: active ? "#000" : "#666", fontWeight: active ? 600 : 400 }}
    >
      {children}
    </Link>
  );
}

function ArrowButton({ onClick, children, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        border: "1px solid #aaa", borderRadius: 3,
        background:"#fff", cursor:"pointer", fontSize:11, lineHeight:1, padding:"2px 4px", color:"#444",
      }}
    >
      {children}
    </button>
  );
}

const loginBtn  = { border:"1px solid #ddd", background:"#fff", borderRadius:6, padding:"6px 10px", cursor:"pointer" };
const joinBtn   = { border:"none", background:"#000", color:"#fff", borderRadius:6, padding:"6px 10px", fontWeight:700, cursor:"pointer" };
const logoutBtn = { border:"1px solid #ddd", background:"#fff", borderRadius:6, padding:"6px 10px", cursor:"pointer" };
