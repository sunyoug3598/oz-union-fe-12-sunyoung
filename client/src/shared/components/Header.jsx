import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  // TODO: 실제 인증 연동 시 교체
  const isLoggedIn = false;

  // TODO: 마이페이지 설정 기반 로드 예정
  const quotes = [
    "기록은 기억을 이깁니다.",
    "조금 늦어도 괜찮아요. 꾸준하면 돼요.",
    "오늘의 할 일은 나를 지치게 하지 않아요.",
    "나만의 일정관리 SOLAN을 사용해보세요.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  const prevQuote = () =>
    setQuoteIndex((i) => (i - 1 + quotes.length) % quotes.length);
  const nextQuote = () => setQuoteIndex((i) => (i + 1) % quotes.length);

  const goHome = () => nav("/");

  return (
    <header
      style={{
        backgroundColor: "#f7f7f7",
        borderBottom: "1px solid #ddd",
        padding: "8px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr minmax(480px, 600px) 1fr",
          alignItems: "center",
          columnGap: "12px",
          minHeight: "32px",
          lineHeight: 1.2,
        }}
      >
        {/* 로고 */}
        <div
          style={{
            justifySelf: "start",
            fontWeight: 600,
            fontSize: 14,
            color: "#000",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={goHome}
        >
          oz-union-fe-12-sunyoung
        </div>

        {/* 오늘의 문구 */}
        <div
          style={{
            justifySelf: "center",
            position: "relative",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
            padding: "8px 12px 20px",
            minWidth: "480px",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 500,
            color: "#000",
          }}
          title={quotes[quoteIndex]}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {quotes[quoteIndex]}
          </div>

          <div
            style={{
              position: "absolute",
              right: "8px",
              bottom: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#555",
              lineHeight: 1,
            }}
          >
            <span style={{ minWidth: 32, textAlign: "right" }}>
              {quoteIndex + 1}/{quotes.length}
            </span>
            <ArrowButton onClick={prevQuote} label="이전">◀</ArrowButton>
            <ArrowButton onClick={nextQuote} label="다음">▶</ArrowButton>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav
          style={{
            justifySelf: "end",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 14,
            color: "#222",
            whiteSpace: "nowrap",
          }}
        >
          <HeaderNavLink to="/" active={pathname === "/"}>캘린더</HeaderNavLink>
          <HeaderNavLink to="/notes" active={pathname.startsWith("/notes")}>메모</HeaderNavLink>
          <HeaderNavLink to="/categories" active={pathname.startsWith("/categories")}>카테고리</HeaderNavLink>

          <span style={{ color: "#aaa" }}>|</span>

          {isLoggedIn ? (
            <Link
              to="/mypage"
              style={{ textDecoration: "none", fontWeight: 600, color: "#222" }}
            >
              마이페이지
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ modal: true, from: pathname }}
              style={{ textDecoration: "none", fontWeight: 600, color: "#5f3dc4" }}
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
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: active ? "#000" : "#666",
        fontWeight: active ? 600 : 400,
      }}
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
        border: "1px solid #aaa",
        borderRadius: "3px",
        backgroundColor: "#fff",
        cursor: "pointer",
        fontSize: "11px",
        lineHeight: 1,
        padding: "2px 4px",
        color: "#444",
      }}
    >
      {children}
    </button>
  );
}
