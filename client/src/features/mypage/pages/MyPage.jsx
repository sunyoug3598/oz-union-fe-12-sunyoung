// src/features/mypage/pages/MyPage.jsx
import { useState } from "react";
import { CategoryProvider, useCategories } from "../../../app/store/categoryStore";
import { useSettings } from "../../../app/store/settingsStore";
import { useQuotes } from "../../../app/store/quotesStore";
import { exportAll, downloadJSON, importAll, openFileAndParseJSON } from "../../../app/utils/backup";

// Provider 래퍼
export default function MyPage() {
  return (
    <CategoryProvider>
      <MyPageInner />
    </CategoryProvider>
  );
}

function MyPageInner() {
  const { exportData: exportCats, importData: importCats } = useCategories();

  // 설정 스토어
  const {
    upcomingRangeDays,
    setUpcomingRangeDays,
    memoWidgetView,
    setMemoWidgetView,
    showCompleted,
    setShowCompleted,
    keepLocalOnLogout,
    setKeepLocalOnLogout,
    theme,
    setTheme,
  } = useSettings();

  // 오늘의 문구 스토어
  const { quotes, mode, addQuote, updateQuote, removeQuote, moveQuote, setMode } = useQuotes();
  const [newQuote, setNewQuote] = useState("");

  const handleAddQuote = () => {
    const t = (newQuote || "").trim();
    if (!t) return;
    addQuote(t);
    setNewQuote("");
  };

  const handleBackup = () => {
    const payload = exportAll(exportCats()); // 카테고리 스냅샷 포함
    downloadJSON("solan-backup.json", payload);
    alert("백업 파일을 내려받았습니다.");
  };

  const handleRestore = async () => {
    try {
      const json = await openFileAndParseJSON();
      importAll(json, importCats); // 카테고리 반영 포함
      alert("복원이 완료되었습니다.");
    } catch (e) {
      alert(e.message || "복원 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>마이페이지</h1>

      {/* 개인 설정 */}
      <Section title="개인 설정">
        <Row label="다가오는 일정 범위">
          <select value={upcomingRangeDays} onChange={(e) => setUpcomingRangeDays(Number(e.target.value))} style={input}>
            <option value={3}>3일</option>
            <option value={7}>7일</option>
            <option value={30}>30일</option>
          </select>
        </Row>

        <Row label="메모 위젯 보기 방식">
          <select value={memoWidgetView} onChange={(e) => setMemoWidgetView(e.target.value)} style={input}>
            <option value="cards">카드형</option>
            <option value="list" disabled>
              리스트형(준비중)
            </option>
          </select>
        </Row>

        <Row label="완료 일정 표시">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} /> 완료된 일정도 보이기
          </label>
        </Row>
      </Section>

      {/* 시스템 설정 */}
      <Section title="시스템 설정">
        <Row label="테마">
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={input}>
            <option value="light">라이트</option>
            <option value="dark" disabled>
              다크(준비중)
            </option>
          </select>
        </Row>

        <Row label="로그아웃 시 로컬 데이터">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={keepLocalOnLogout} onChange={(e) => setKeepLocalOnLogout(e.target.checked)} /> 유지하기
          </label>
        </Row>
      </Section>

      {/* 오늘의 문구 관리 */}
      <Section title="헤더 ‘오늘의 문구’ 관리">
        <Row label="표시 방식">
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={input}>
            <option value="sequential">순차</option>
            <option value="random">랜덤</option>
          </select>
        </Row>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="새 문구 입력"
              style={{ ...input, flex: 1, minWidth: 0 }}
            />
            <button onClick={handleAddQuote} style={btnSolid}>
              추가
            </button>
          </div>

          {/* 문구 리스트 */}
          <ol style={{ display: "grid", gap: 6, margin: 0, padding: 0, listStyle: "decimal inside" }}>
            {quotes.map((q, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 }}>
                <input
                  value={q}
                  onChange={(e) => updateQuote(i, e.target.value)}
                  style={{ ...input, width: "100%" }}
                />
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => moveQuote(i, Math.max(0, i - 1))} style={btnGhost}>
                    ↑
                  </button>
                  <button onClick={() => moveQuote(i, Math.min(quotes.length - 1, i + 1))} style={btnGhost}>
                    ↓
                  </button>
                  <button onClick={() => removeQuote(i)} style={btnDanger}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div style={{ color: "#888", fontSize: 12 }}>* 모든 변경은 자동 저장됩니다.</div>
        </div>
      </Section>

      {/* 데이터 백업/복원 */}
      <Section title="데이터 관리">
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btnOutline} onClick={handleBackup}>
            데이터 백업(JSON)
          </button>
          <button style={btnSolid} onClick={handleRestore}>
            데이터 복원(JSON)
          </button>
        </div>
      </Section>
    </div>
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

const btnGhost = {
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
};

const btnDanger = {
  border: "1px solid #f1b0b7",
  background: "#fff5f5",
  color: "#c92a2a",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
};
