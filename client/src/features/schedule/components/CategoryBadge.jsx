import { useNavigate } from "react-router-dom";

export default function CategoryBadge({
  name,
  to,
  stopPropagation = true,
}) {
  const nav = useNavigate();

  const label = name || "미분류"; // ← 기본 라벨
  const palette = {
    개인:   "#51cf66",
    업무:   "#339af0",
    건강:   "#ff8787",
    금융:   "#845ef7",
    기타:   "#868e96",
    미분류: "#adb5bd",
  };

  const fg = palette[label] || "#495057";
  const bg = (palette[label] || "#ced4da") + "22";
  const href = to ?? `/categories?filter=${encodeURIComponent(label)}`;

  return (
    <span
      role="link"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        nav(href);
      }}
      title={`${label} 카테고리 보기`}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontWeight: 600,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {label}
    </span>
  );
}
