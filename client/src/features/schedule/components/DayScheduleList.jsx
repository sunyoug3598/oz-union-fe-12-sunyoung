import { getIconColor, getIconChar } from "../../../app/constants/uiTokens";

export default function DayScheduleList({ dateLabel, items = [], onClickItem }) {
  if (!items.length) {
    return <div style={{ color: "#777" }}>해당 날짜의 일정이 없습니다.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((ev, idx) => (
        <button
          key={ev.id || idx}
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
              color: getIconColor(ev.statusIcon || ev.icon),
              fontWeight: getIconChar(ev.statusIcon || ev.icon) === "★" ? 700 : 400,
            }}
          >
            {getIconChar(ev.statusIcon || ev.icon) || "•"}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{ev.title}</div>
            <div style={{ fontSize: 12, color: "#555" }}>
              {ev.timeLabel || "시간 미정"} · {ev.category}
              {ev.repeat === "monthly" ? " · 🔁" : ""}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
