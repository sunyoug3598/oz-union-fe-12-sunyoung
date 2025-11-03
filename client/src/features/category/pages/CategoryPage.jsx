import { CategoryProvider, useCategories } from "../../../app/store/categoryStore";
import { useEvents } from "../../../app/store/eventsStore";
import CategoryGrid from "../components/CategoryGrid";
import NewCategoryModal from "../components/NewCategoryModal";
import CategoryListModal from "../components/CategoryListModal";
import { useState, useMemo } from "react";

export default function CategoryPage() {
  // Page 내부에서만 Provider로 감싸 App 전체 손대지 않음
  return (
    <CategoryProvider>
      <CategoryPageInner />
    </CategoryProvider>
  );
}

function CategoryPageInner() {
  const { filtered, keyword, setKeyword, viewMode, setViewMode } = useCategories();
  const { events } = useEvents(); // { [day]: Event[] }
  const [openCreate, setOpenCreate] = useState(false);

  // 카드 클릭 → 카테고리별 일정 모달
  const [activeCat, setActiveCat] = useState(null); // { id, name, color }

  // 카테고리별 일정 수 계산
  const counts = useMemo(() => {
    const map = {};
    const allDays = Object.keys(events || {});
    for (const d of allDays) {
      (events[d] || []).forEach(ev => {
        const key = ev.category || "기타";
        map[key] = (map[key] || 0) + 1;
      });
    }
    return map; // { '개인': 2, '업무': 3, ...}
  }, [events]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* 상단 바 */}
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="카테고리 검색"
          style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" }}
        />
        <button
          onClick={() => setOpenCreate(true)}
          style={{ border: "none", background: "#000", color: "#fff", borderRadius: 8, padding: "10px 14px", fontWeight: 700 }}
        >
          + 새 카테고리
        </button>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" }}
        >
          <option value="cards">카드형 보기</option>
          <option value="list" disabled>목록형 (준비중)</option>
        </select>
      </header>

      {/* 카드 그리드 */}
      <CategoryGrid
        categories={filtered}
        counts={counts}
        onOpen={(cat) => setActiveCat(cat)}
      />

      {/* 새 카테고리 모달 */}
      <NewCategoryModal open={openCreate} onClose={() => setOpenCreate(false)} />

      {/* 카테고리별 일정 모달 */}
      <CategoryListModal
        open={!!activeCat}
        onClose={() => setActiveCat(null)}
        category={activeCat}
      />
    </div>
  );
}
