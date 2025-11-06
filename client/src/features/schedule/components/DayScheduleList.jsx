import CategoryBadge from "./CategoryBadge";
import { getIconChar, getIconColor } from "../../../app/constants/uiTokens";

export default function DayScheduleList({ items = [], onClickItem }) {
  if (!items.length) {
    return <div style={{ color: "#777" }}>해당 날짜의 일정이 없습니다.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((ev) => {
        const ch = getIconChar(ev.statusIcon);
        return (
          <button
            key={ev.id}
            onClick={() => onClickItem?.(ev)}
            style={{
              textAlign: "left",
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              padding: "10px 12px",
              background: "#fafafa",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                minWidth: 16,
                color: getIconColor(ch),
                fontWeight: ch === "★" ? 700 : 400,
              }}
            >
              {ch}
            </span>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "#555", display: "flex", gap: 6, alignItems: "center" }}>
                <span>{ev.timeLabel || "시간 미정"}</span>
                <span>·</span>
                <CategoryBadge name={ev.category} />
                {ev.repeat === "monthly" ? <span>· 🔁</span> : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
