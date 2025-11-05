// src/features/schedule/components/CategoryBadge.jsx
import { useNavigate } from "react-router-dom";

export default function CategoryBadge({
  name,
  to = `/categories?cat=${encodeURIComponent(name || "")}`,
  stopPropagation = true, // ✅ 기본적으로 버블링 막기
}) {
  const nav = useNavigate();

  const palette = {
    개인: "#51cf66",
    업무: "#339af0",
    건강: "#ff8787",
    금융: "#845ef7",
    기타: "#868e96",
  };

  const bg = ((palette[name] || "#ced4da") + "22");
  const fg = (palette[name] || "#495057");

  return (
    <span
      role="link"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation(); // ✅ 부모 버튼으로 이벤트 안 올라가게
        nav(to);
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
