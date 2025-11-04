import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryProvider, useCategories } from "../../../app/store/categoryStore";
import { useEvents } from "../../../app/store/eventsStore";
import CategoryGrid from "../components/CategoryGrid";
import NewCategoryModal from "../components/NewCategoryModal";
import CategoryListModal from "../components/CategoryListModal";

export default function CategoryPage() {
  return (
    <CategoryProvider>
      <CategoryPageInner />
    </CategoryProvider>
  );
}

function CategoryPageInner() {
  const { filtered, keyword, setKeyword, viewMode, setViewMode } = useCategories();
  const { events } = useEvents();
  const [openCreate, setOpenCreate] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [searchParams] = useSearchParams();

  // ✅ URL 쿼리에서 filter 파라미터 읽기
  useEffect(() => {
    const q = searchParams.get("filter");
    if (q) setKeyword(q);
  }, [searchParams, setKeyword]);

  const counts = useMemo(() => {
    const map = {};
    const allDays = Object.keys(events || {});
    for (const d of allDays) {
      (events[d] || []).forEach(ev => {
        const key = ev.category || "기타";
        map[key] = (map[key] || 0) + 1;
      });
    }
    return map;
  }, [events]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
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

      <CategoryGrid
        categories={filtered}
        counts={counts}
        onOpen={(cat) => setActiveCat(cat)}
      />

      <NewCategoryModal open={openCreate} onClose={() => setOpenCreate(false)} />
      <CategoryListModal open={!!activeCat} onClose={() => setActiveCat(null)} category={activeCat} />
    </div>
  );
}
