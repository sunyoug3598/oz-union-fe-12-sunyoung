// src/features/schedule/components/CategoryBadge.jsx
import { useNavigate } from "react-router-dom";

export default function CategoryBadge({
  name,
  to,                 // 외부에서 주면 우선
  stopPropagation = true,
}) {
  const nav = useNavigate();

  const palette = {
    개인: "#51cf66",
    업무: "#339af0",
    건강: "#ff8787",
    금융: "#845ef7",
    기타: "#868e96",
  };

  const fg = palette[name] || "#495057";
  const bg = (palette[name] || "#ced4da") + "22";
  const href = to ?? `/categories?filter=${encodeURIComponent(name || "")}`;

  return (
    <span
      role="link"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        nav(href);
      }}
      title={`${name} 카테고리 보기`}
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
      {name}
    </span>
  );
}
