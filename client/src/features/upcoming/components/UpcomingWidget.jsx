// src/features/upcoming/components/UpcomingWidget.jsx
import { useMemo, useState } from "react";
import ScheduleDetailModal from "../../schedule/components/ScheduleDetailModal";
import ScheduleCreateModal from "../../schedule/components/ScheduleCreateModal";
import CategoryBadge from "../../schedule/components/CategoryBadge"; // ✅ 공용 배지
import { useEvents } from "../../../app/store/eventsStore";

export default function UpcomingWidget() {
  const events = useEvents((s) => s.events);
  const getUpcoming = useEvents((s) => s.getUpcoming);
  const deleteEvent = useEvents((s) => s.deleteEvent);
  const editEvent = useEvents((s) => s.editEvent);

  const [detail, setDetail] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState(null);

  // 다음 7일
  const items = useMemo(() => getUpcoming(7), [getUpcoming, events]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Upcoming</strong>
        <span style={{ fontSize: 12, color: "#888" }}>다음 7일</span>
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
          <div style={{ color: "#888", fontSize: 14 }}>예정된 일정이 없습니다.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((ev) => (
              <UpcomingCard key={ev.id} ev={ev} onClick={() => setDetail(ev)} />
            ))}
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onEdit={(ev) => {
          setDetail(null);
          setEditInitial(ev);
          setEditOpen(true);
        }}
        onDelete={(ev) => {
          deleteEvent(ev.day, ev.id);
          setDetail(null);
        }}
      />

      {/* 편집 모달 (생성 모달 재사용) */}
      <ScheduleCreateModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditInitial(null);
        }}
        initialEvent={editInitial}
        defaultDay={editInitial?.day ?? null}
        onSubmit={(data, toDay) => {
          editEvent(data.fromDay, toDay, {
            id: data.id,
            icon: data.icon,
            title: data.title,
            timeLabel: data.timeLabel,
            category: data.category,
            repeat: data.repeat,
          });
          setEditOpen(false);
          setEditInitial(null);
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
          <span
            style={{
              color: ev.icon === "★" ? "#E3B400" : "#000",
              fontWeight: ev.icon === "★" ? 700 : 400,
            }}
          >
            {ev.icon}
          </span>
          <strong style={{ fontSize: 14 }}>{ev.title}</strong>
          {ev.repeat === "monthly" && (
            <span title="매월 반복" style={{ marginLeft: 6 }}>
              🔁
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
          {/* ✅ 공용 배지: 클릭 시 /categories?cat=... 이동 */}
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
