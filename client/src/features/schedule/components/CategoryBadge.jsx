import { useNavigate } from "react-router-dom";
import { CATEGORY_COLORS } from "../../../app/constants/uiTokens";

export default function CategoryBadge({ name }) {
  const navigate = useNavigate();

  const color = CATEGORY_COLORS[name] || "#868e96";

  return (
    <span
      onClick={() => navigate(`/categories?filter=${encodeURIComponent(name)}`)}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: color + "22",
        color,
        fontWeight: 600,
        fontSize: 12,
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      title={`${name} 카테고리 보기`}
    >
      {name}
    </span>
  );
}
