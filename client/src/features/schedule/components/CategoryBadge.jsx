import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// 카테고리 색상을 localStorage에서 읽어오는 헬퍼 (Provider 없어도 OK)
function getColorFromLS(name) {
  if (!name) return null;
  try {
    const raw = localStorage.getItem("solan.categories.v1");
    const arr = raw ? JSON.parse(raw) : null;
    const found = Array.isArray(arr) ? arr.find((c) => c?.name === name) : null;
    return found?.color || null;
  } catch {
    return null;
  }
}

export default function CategoryBadge({
  name,
  to,                 // 외부에서 경로를 주면 우선
  stopPropagation = true,
}) {
  const nav = useNavigate();

  const color = useMemo(() => {
    return (
      getColorFromLS(name) ??
      "#87919c" // fallback
    );
  }, [name]);

  const href = to ?? `/categories?filter=${encodeURIComponent(name || "")}`;
  const bg = `${color}22`;

  return (
    <span
      role="link"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        nav(href);
      }}
      title={`${name || "미분류"} 카테고리 보기`}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${color}33`,
        fontWeight: 600,
        fontSize: 12,
        lineHeight: "18px",
        cursor: "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {name || "미분류"}
    </span>
  );
}
