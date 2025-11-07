import { useSettings } from "../../../app/store/settingsStore";
import { useQuotes } from "../../../app/store/quotesStore";
import { useState } from "react";

export default function MyPage() {
  const {
    upcomingRangeDays, setUpcomingRangeDays,
    memoWidgetView, setMemoWidgetView,
    showCompleted, setShowCompleted,
    keepLocalOnLogout, setKeepLocalOnLogout,
    theme, setTheme,
  } = useSettings();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>마이페이지</h1>

      {/* 개인 설정 */}
      <Section title="개인 설정">
        <Row label="다가오는 일정 범위">
          <select
            value={upcomingRangeDays}
            onChange={(e) => setUpcomingRangeDays(Number(e.target.value))}
            style={input}
          >
            <option value={3}>3일</option>
            <option value={7}>7일</option>
            <option value={30}>30일</option>
          </select>
        </Row>

        <Row label="메모 위젯 보기 방식">
          <select
            value={memoWidgetView}
            onChange={(e) => setMemoWidgetView(e.target.value)}
            style={input}
          >
            <option value="cards">카드형</option>
            <option value="list" disabled>리스트형(준비중)</option>
          </select>
        </Row>

        <Row label="완료 일정 표시">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
            완료된 일정도 보이기
          </label>
        </Row>
      </Section>

      {/* 시스템 설정 */}
      <Section title="시스템 설정">
        <Row label="테마">
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={input}>
            <option value="light">라이트</option>
            <option value="dark" disabled>다크(준비중)</option>
          </select>
        </Row>

        <Row label="로그아웃 시 로컬 데이터">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={keepLocalOnLogout}
              onChange={(e) => setKeepLocalOnLogout(e.target.checked)}
            />
            유지하기
          </label>
        </Row>
      </Section>

      {/* 데이터 백업/복원 (초안 버튼만) */}
      <Section title="데이터 관리">
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnOutline} onClick={() => alert("백업은 다음 단계에서!")}>
            데이터 백업(JSON)
          </button>
          <button style={btnSolid} onClick={() => alert("복원은 다음 단계에서!")}>
            데이터 복원(JSON)
          </button>
        </div>
      </Section>

      {/* ✅ 추가: 헤더 ‘오늘의 문구’ 관리 */}
      <QuoteManager />
    </div>
  );
}

function QuoteManager() {
  const quotes = useQuotes((s) => s.quotes);
  const mode = useQuotes((s) => s.mode);
  const addQuote = useQuotes((s) => s.addQuote);
  const updateQuote = useQuotes((s) => s.updateQuote);
  const removeQuote = useQuotes((s) => s.removeQuote);
  const moveQuote = useQuotes((s) => s.moveQuote);
  const setMode = useQuotes((s) => s.setMode);

  const [draft, setDraft] = useState("");

  return (
    <Section title="헤더 ‘오늘의 문구’ 관리">
      <Row label="표시 방식">
        <select value={mode} onChange={(e) => setMode(e.target.value)} style={input}>
          <option value="sequential">순차</option>
          <option value="random">랜덤</option>
        </select>
      </Row>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="새 문구 입력"
          style={{ ...input, flex: 1 }}
        />
        <button
          onClick={() => {
            if (draft.trim()) {
              addQuote(draft.trim());
              setDraft("");
            }
          }}
          style={btnSolid}
        >
          추가
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {quotes.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 20, color: "#666" }}>{i + 1}.</span>
            <input
              value={q}
              onChange={(e) => updateQuote(i, e.target.value)}
              style={{ ...input, flex: 1 }}
            />
            <button disabled={i === 0} onClick={() => moveQuote(i, i - 1)} style={btnOutline}>↑</button>
            <button
              disabled={i === quotes.length - 1}
              onClick={() => moveQuote(i, i + 1)}
              style={btnOutline}
            >
              ↓
            </button>
            <button onClick={() => removeQuote(i)} style={{ ...btnOutline, borderColor: "#f03e3e", color: "#f03e3e" }}>
              삭제
            </button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "#777" }}>* 모든 변경은 자동 저장됩니다.</div>
    </Section>
  );
}

function Section({ title, children }) {
  return (
    <section
      style={{
        border: "1px solid #eee",
        borderRadius: 10,
        padding: "14px 16px",
        background: "#fff",
        display: "grid",
        gap: 12,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", gap: 12 }}>
      <div style={{ color: "#555", fontWeight: 600 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

const input = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: "8px 10px",
  minWidth: 160,
};

const btnOutline = {
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
};

const btnSolid = {
  border: "none",
  background: "#000",
  color: "#fff",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
};
