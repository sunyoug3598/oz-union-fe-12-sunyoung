import { Link } from "react-router-dom";
import { CATEGORY_COLORS } from "../../../app/constants/uiTokens";

export default function CategoryBadge({ name, asLink = false }) {
  const color = CATEGORY_COLORS?.[name] || "#868e96";
  const bg = `${color}22`;

  const content = (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold"
      style={{ background: bg, color }}
    >
      {name}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      to={`/categories?cat=${encodeURIComponent(name)}`}
      title={`${name} 카테고리 보기`}
      className="hover:opacity-80"
    >
      {content}
    </Link>
  );
}
