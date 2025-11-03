import { useMemo, useState } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import { useCategories } from "../../../app/store/categoriesStore";
import { CATEGORY_COLORS, getIconChar, getIconColor } from "../../../app/constants/uiTokens";
import Modal from "../../../shared/components/Modal";

/**
 * UI 개요
 * - 상단 바: 검색, 보기 토글(전체/카드), 새 카테고리 버튼
 * - 카드 그리드: 카테고리별 카드(이름/색/건수). 클릭 시 모달로 일정 리스트 표시
 */
export default function CategoryPage() {
  const { getAll } = useEvents();
  const { categories, addCategory } = useCategories();

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("cards"); // 'cards' | 'all'
  const [activeCat, setActiveCat] = useState(null); // 모달로 띄울 카테고리

  const all = getAll();

  // 카테고리별 일정 묶기
  const grouped = useMemo(() => {
    const result = {};
    categories.forEach((c) => (result[c] = []));
    Object.entries(all).forEach(([day, list]) => {
      list.forEach((ev) => {
        const cat = ev.category || "기타";
        if (!result[cat]) result[cat] = [];
        result[cat].push({ ...ev, day: Number(day) });
      });
    });
    return result;
  }, [all, categories]);

  // 검색 필터
  const filteredCats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, query]);

  // '전체보기' 모드용: 한 번에 리스트 나열
  if (mode === "all") {
    return (
      <div style={{ padding: "20px 16px", display: "grid", gap: 16 }}>
        <HeaderBar
          query={query}
          onQuery={setQuery}
          mode={mode}
          onMode={setMode}
          onCreate={() => {
            const name = window.prompt("새 카테고리 이름을 입력하세요.");
            if (name) addCategory(name);
          }}
        />
        {filteredCats.map((cat) => (
          <CategorySection key={cat} name={cat} items={grouped[cat] || []} />
        ))}
      </div>
    );
  }

  // '카드' 모드
  return (
    <div style={{ padding: "20px 16px", display: "grid", gap: 16 }}>
      <HeaderBar
        query={query}
        onQuery={setQuery}
        mode={mode}
        onMode={setMode}
        onCreate={() => {
          const name = window.prompt("새 카테고리 이름을 입력하세요.");
          if (name) addCategory(name);
        }}
      />

      {/* 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat( auto-fill, minmax(220px, 1fr) )",
          gap: 16,
        }}
      >
        {filteredCats.map((cat) => {
          const count = (grouped[cat] || []).length;
          return (
            <CategoryCard
              key={cat}
              name={cat}
              count={count}
              onClick={() => setActiveCat(cat)}
            />
          );
        })}
      </div>

      {/* 카테고리 클릭 → 모달로 해당 일정 목록 */}
      <Modal
        open={!!activeCat}
        onClose={() => setActiveCat(null)}
        title={`${activeCat ?? ""} 일정`}
      >
        <CategoryList name={activeCat ?? ""} items={grouped[activeCat ?? ""] || []} />
      </Modal>
    </div>
  );
}

/* ───────── 구성 요소들 ───────── */

function HeaderBar({ query, onQuery, mode, onMode, onCreate }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        alignItems: "center",
        gap: 12,
      }}
    >
      <input
        placeholder="카테고리 검색…"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          outline: "none",
        }}
      />

      <div
        style={{
          display: "inline-flex",
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <ToggleBtn active={mode === "cards"} onClick={() => onMode("cards")}>
          카드별 보기
        </ToggleBtn>
        <ToggleBtn active={mode === "all"} onClick={() => onMode("all")}>
          전체 보기
        </ToggleBtn>
      </div>

      <button
        onClick={onCreate}
        style={{
          border: "none",
          borderRadius: 8,
          padding: "10px 14px",
          background: "#000",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        + 새 카테고리
      </button>
    </div>
  );
}

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        background: active ? "#000" : "#fff",
        color: active ? "#fff" : "#333",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

function CategoryCard({ name, count, onClick }) {
  const color = CATEGORY_COLORS[name] || "#adb5bd";
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        border: `1px solid ${color}33`,
        background: "#fff",
        borderRadius: 12,
        padding: "16px 14px",
        cursor: "pointer",
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        <strong style={{ fontSize: 16, color }}>{name}</strong>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#666",
            border: "1px solid #eee",
            padding: "2px 8px",
            borderRadius: 999,
            background: "#fafafa",
          }}
        >
          {count}개 일정
        </span>
      </div>
      <div style={{ fontSize: 12, color: "#777" }}>눌러서 상세 일정 보기</div>
    </button>
  );
}

function CategoryList({ name, items }) {
  if (!items || items.length === 0) {
    return <div style={{ color: "#777" }}>등록된 일정이 없습니다.</div>;
  }
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
      {items.map((ev) => (
        <li
          key={ev.id}
          style={{
            border: "1px solid #eaeaea",
            borderRadius: 8,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fafafa",
          }}
        >
          <span
            style={{
              color: getIconColor(ev.icon),
              fontWeight: getIconChar(ev.icon) === "★" ? 700 : 400,
              minWidth: 16,
              textAlign: "center",
            }}
          >
            {getIconChar(ev.icon)}
          </span>
          <span style={{ fontSize: 14 }}>{ev.title}</span>
          <span style={{ fontSize: 12, color: "#888", marginLeft: "auto" }}>
            {ev.timeLabel || "시간 미정"} / {ev.day}일
          </span>
        </li>
      ))}
    </ul>
  );
}

function CategorySection({ name, items }) {
  const color = CATEGORY_COLORS[name] || "#adb5bd";
  return (
    <section
      style={{
        border: `1px solid ${color}33`,
        borderRadius: 10,
        padding: 16,
        background: "#fff",
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color }}>{name}</h3>
      </header>

      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "#777" }}>등록된 일정이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((ev) => (
            <li
              key={ev.id}
              style={{
                borderBottom: "1px solid #f1f3f5",
                padding: "6px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: getIconColor(ev.icon),
                  fontWeight: getIconChar(ev.icon) === "★" ? 700 : 400,
                }}
              >
                {getIconChar(ev.icon)}
              </span>
              <span style={{ fontSize: 14 }}>{ev.title}</span>
              <span style={{ fontSize: 12, color: "#888", marginLeft: "auto" }}>
                {ev.timeLabel || "시간 미정"} / {ev.day}일
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
