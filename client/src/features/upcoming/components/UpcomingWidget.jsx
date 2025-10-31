import { useMemo, useState } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import ScheduleDetailModal from "../../schedule/components/ScheduleDetailModal";

export default function UpcomingWidget() {
  const { getUpcoming, deleteEvent } = useEvents();
  const [detail, setDetail] = useState(null); // 클릭한 일정

  const items = useMemo(() => getUpcoming(3), [getUpcoming]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Upcoming</strong>
        <span style={{ fontSize: 12, color: "#888" }}>다음 3일</span>
      </header>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 12,
          height: 240,          // 고정 높이
          overflowY: "auto",    // 내부 스크롤
        }}
      >
        {items.length === 0 ? (
          <div style={{ color: "#888", fontSize: 14 }}>예정된 일정이 없습니다.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((ev) => (
              <UpcomingCard key={ev.id} ev={ev} onClick={() => setDetail(ev)} />
            ))}
          </div>
        )}
      </div>

      {/* 상세 모달: 위젯 로컬 상태로 제어 */}
      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onEdit={() => {
          // 캘린더의 편집 모달까지 연동은 다음 단계에서.
          alert("편집은 캘린더에서 먼저 연결하자! (다음 단계)");
        }}
        onDelete={(ev) => {
          deleteEvent(ev.day, ev.id);
          setDetail(null);
        }}
      />
    </div>
  );
}

function UpcomingCard({ ev, onClick }) {
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
          <span style={{ color: ev.icon === "★" ? "#E3B400" : "#000", fontWeight: ev.icon === "★" ? 700 : 400 }}>
            {ev.icon}
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

function CategoryBadge({ name }) {
  const palette = {
    개인: "#51cf66",
    업무: "#339af0",
    건강: "#ff8787",
    금융: "#845ef7",
    기타: "#868e96",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: (palette[name] || "#ced4da") + "22",
        color: palette[name] || "#495057",
        fontWeight: 600,
      }}
    >
      {name}
    </span>
  );
}

function formatDay(day) {
  const now = new Date();
  const today = Math.min(30, Math.max(1, now.getDate()));
  if (day === today) return "오늘";
  if (day === today + 1) return "내일";
  return `정해진 날 ${String(day).padStart(2, "0")}`;
}
