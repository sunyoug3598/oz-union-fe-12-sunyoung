import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useEvents } from "../../../app/store/eventsStore";

const LS_KEY = "solan.categories.v1";

const DEFAULT_CATEGORIES = [
  { id: 1, name: "개인",   color: "#2f8fcb" },
  { id: 2, name: "업무",   color: "#444444" },
  { id: 3, name: "건강",   color: "#16a34a" },
  { id: 4, name: "금융",   color: "#e3b400" },
  { id: 5, name: "기타",   color: "#7a7a7a" },
  { id: 6, name: "미분류", color: "#adb5bd" },
];

function loadCategoriesSafely() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const base = raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
    const hasUncategorized = (base || []).some((c) => c.name === "미분류");
    return hasUncategorized ? base : [...base, { id: Date.now(), name: "미분류", color: "#adb5bd" }];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export default function CategoryWidget() {
  const { getAll } = useEvents();

  const categories = useMemo(() => loadCategoriesSafely(), []);
  const counts = useMemo(() => {
    const map = {};
    const all = getAll?.() || {};
    Object.keys(all).forEach((d) => {
      (all[d] || []).forEach((ev) => {
        const key = ev.category || "미분류";
        map[key] = (map[key] || 0) + 1;
      });
    });
    return map;
  }, [getAll]);

  return (
    <section className="flex h-full flex-col gap-3">
      {/* 헤더 */}
      <header className="flex items-center justify-between">
        <Link
          to="/categories"
          className="text-[15px] font-semibold text-black hover:underline"
          title="카테고리 페이지로 이동"
        >
          카테고리
        </Link>
        <Link
          to="/categories"
          className="text-xs text-gray-500 hover:text-gray-700"
          title="전체 보기"
        >
          전체 보기 →
        </Link>
      </header>

      {/* 바디: 카테고리 카드들 */}
      <div className="grid grid-cols-1 gap-2 text-sm">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/categories?filter=${encodeURIComponent(c.name)}`}
            className="rounded-md bg-white px-3 py-2 transition hover:shadow-sm"
            style={{
              border: `2px solid ${c.color || "#ddd"}`, // 테두리 = 카테고리 색
              color: "#111", // 글자 = 검정
            }}
            title={`${c.name} 카테고리로 이동`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-block size-2.5 rounded-[3px]"
                  style={{ background: c.color || "#ddd" }}
                />
                <span className="font-medium">{c.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {counts[c.name] ? `${counts[c.name]}개` : "0개"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
