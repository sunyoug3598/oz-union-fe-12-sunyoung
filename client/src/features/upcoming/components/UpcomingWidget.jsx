import { useMemo, useState } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import { useSettings } from "../../../app/store/settingsStore";
import { getIconColor, getIconChar } from "../../../app/constants/uiTokens";
import ScheduleDetailModal from "../../schedule/components/ScheduleDetailModal";
import CategoryBadge from "../../schedule/components/CategoryBadge";

export default function UpcomingWidget() {
  const { getUpcoming, deleteEvent } = useEvents();
  const range = useSettings((s) => s.upcomingRangeDays);
  const showCompleted = useSettings((s) => s.showCompleted);
  const [detail, setDetail] = useState(null);

  const items = useMemo(() => {
    const raw = getUpcoming(range);
    const list = showCompleted ? raw : raw.filter((ev) => getIconChar(ev.icon) !== "✕");
    // 날짜 정렬 보장
    return list.slice().sort((a, b) => a.day - b.day);
  }, [getUpcoming, range, showCompleted]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Upcoming</strong>
        <span style={{ fontSize: 12, color: "#888" }}>
          다음 {range}일{showCompleted ? "" : " · 완료 숨김"}
        </span>
      </header>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 12,
          height: 240,
          overflowY: "auto",
        }}
      >
        {items.length === 0 ? (
          <div style={{ color: "#888", fontSize: 14 }}>
            {showCompleted ? "예정된 일정이 없습니다." : "표시할 예정된 일정이 없습니다.(완료 숨김 중)"}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((ev) => (
              <UpcomingCard key={ev.id} ev={ev} onClick={() => setDetail(ev)} />
            ))}
          </div>
        )}
      </div>

      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onEdit={() => alert("편집은 캘린더에서 먼저 연결하자! (다음 단계)")}
        onDelete={(ev) => {
          deleteEvent(ev.day, ev.id);
          setDetail(null);
        }}
      />
    </div>
  );
}

function UpcomingCard({ ev, onClick }) {
  const ch = getIconChar(ev.icon);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        padding: "10px 12px",
        background: "#fafafa",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
      }}
    >
      {/* 날짜/시간 */}
      <div style={{ minWidth: 70, fontSize: 12, color: "#666" }}>
        <div style={{ fontWeight: 600 }}>{formatDay(ev.day)}</div>
        <div>{ev.timeLabel || "시간 미정"}</div>
      </div>

      {/* 구분선 */}
      <div style={{ width: 1, height: 24, background: "#ddd" }} />

      {/* 아이콘 + 제목/카테고리 */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              color: getIconColor(ch),
              fontWeight: ch === "★" ? 700 : 400,
            }}
          >
            {ch}
          </span>
          <strong style={{ fontSize: 14 }}>{ev.title}</strong>
          {ev.repeat === "monthly" && <span title="매월 반복" style={{ marginLeft: 6 }}>🔁</span>}
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
          <CategoryBadge name={ev.category} />
        </div>
      </div>
    </button>
  );
}

function formatDay(day) {
  const now = new Date();
  const today = Math.min(30, Math.max(1, now.getDate()));
  if (day === today) return "오늘";
  if (day === today + 1) return "내일";
  return `정해진 날 ${String(day).padStart(2, "0")}`;
}
