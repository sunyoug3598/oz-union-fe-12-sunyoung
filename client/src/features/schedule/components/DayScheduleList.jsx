import CategoryBadge from "./CategoryBadge"; // ✅ 새 배지 import

// 상태 아이콘 규칙: ● 할 일 / ✕ 완료 / → 이월 / － 메모 / ○ 이벤트 / ★ 중요
export default function DayScheduleList({ dateLabel, items = [], onClickItem }) {
  if (!items.length) {
    return <div style={{ color: "#777" }}>해당 날짜의 일정이 없습니다.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((ev, idx) => (
        <button
          key={idx}
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
              color: ev.statusIcon === "★" ? "#E3B400" : "#000",
              fontWeight: ev.statusIcon === "★" ? 700 : 400,
            }}
          >
            {ev.statusIcon || "•"}
          </span>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{ev.title}</div>
            <div style={{ fontSize: 12, color: "#555", display: "flex", gap: 6, alignItems: "center" }}>
              <span>{ev.timeLabel || "시간 미정"}</span>
              <span>·</span>
              {/* ✅ 텍스트 대신 배지로 교체 (클릭 이동) */}
              <CategoryBadge name={ev.category} />
              {ev.repeat === "monthly" ? <span>· 🔁</span> : null}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
