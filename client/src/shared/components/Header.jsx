import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/store/authStore";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { isLoggedIn, logout, user } = useAuth();

  const quotes = [
    "기록은 기억을 이깁니다.",
    "조금 늦어도 괜찮아요. 꾸준하면 돼요.",
    "오늘의 할 일은 나를 지치게 하지 않아요.",
    "나만의 일정관리 SOLAN을 사용해보세요.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  return (
    <header style={{ backgroundColor:"#f7f7f7", borderBottom:"1px solid #ddd", padding:"8px 16px" }}>
      <div style={{
        maxWidth:"1200px", margin:"0 auto", display:"grid",
        gridTemplateColumns:"1fr minmax(480px,600px) 1fr", alignItems:"center", columnGap:"12px",
        minHeight:"32px", lineHeight:1.2
      }}>
        {/* 로고 */}
        <div onClick={() => nav("/")} style={{ justifySelf:"start", fontWeight:600, fontSize:14, color:"#000", cursor:"pointer", whiteSpace:"nowrap" }}>
          oz-union-fe-12-sunyoung
        </div>

        {/* 문구 */}
        <div style={{
          justifySelf:"center", position:"relative", background:"#fff", border:"1px solid #ccc",
          borderRadius:4, boxShadow:"0 2px 4px rgba(0,0,0,0.06)", padding:"8px 12px 20px",
          minWidth:"480px", maxWidth:"600px", width:"100%", textAlign:"center", fontSize:14, fontWeight:500, color:"#000"
        }}>
          <div style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }} title={quotes[quoteIndex]}>
            {quotes[quoteIndex]}
          </div>
          <div style={{ position:"absolute", right:8, bottom:4, display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#555", lineHeight:1 }}>
            <span style={{ minWidth:32, textAlign:"right" }}>{quoteIndex+1}/{quotes.length}</span>
            <ArrowButton onClick={() => setQuoteIndex(i => (i-1+quotes.length)%quotes.length)} label="이전">◀</ArrowButton>
            <ArrowButton onClick={() => setQuoteIndex(i => (i+1)%quotes.length)} label="다음">▶</ArrowButton>
          </div>
        </div>

        {/* 네비 */}
        <nav style={{ justifySelf:"end", display:"flex", alignItems:"center", gap:12, fontSize:14, color:"#222", whiteSpace:"nowrap" }}>
          <HeaderNavLink to="/" active={pathname === "/"}>캘린더</HeaderNavLink>
          <HeaderNavLink to="/notes" active={pathname.startsWith("/notes")}>메모</HeaderNavLink>
          <HeaderNavLink to="/categories" active={pathname.startsWith("/categories")}>카테고리</HeaderNavLink>
          <span style={{ color:"#aaa" }}>|</span>

          {isLoggedIn ? (
            <>
              <Link to="/mypage" style={{ textDecoration:"none", fontWeight:600, color:"#222" }}>
                {user?.name || "마이페이지"}
              </Link>
              <button
                onClick={logout}
                style={{ border:"1px solid #ddd", background:"#fff", borderRadius:6, padding:"4px 8px", cursor:"pointer" }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              state={{ modal: true, from: pathname }}
              style={{ textDecoration:"none", fontWeight:600, color:"#5f3dc4" }}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeaderNavLink({ to, active, children }) {
  return (
    <Link to={to} style={{ textDecoration:"none", color: active ? "#000" : "#666", fontWeight: active ? 600 : 400 }}>
      {children}
    </Link>
  );
}

function ArrowButton({ onClick, children, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ border:"1px solid #aaa", borderRadius:3, background:"#fff", cursor:"pointer", fontSize:11, lineHeight:1, padding:"2px 4px", color:"#444" }}
    >
      {children}
    </button>
  );
}
