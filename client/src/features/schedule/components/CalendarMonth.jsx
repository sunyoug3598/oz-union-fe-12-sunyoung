import { useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import DayScheduleList from "./DayScheduleList";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleCreateModal from "./ScheduleCreateModal";
import { useEvents } from "../../../app/store/eventsStore";

export default function CalendarMonth() {
  const [month] = useState("2025년 11월");
  const [openDay, setOpenDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForDay, setCreateForDay] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const { getByDay, addEvent, editEvent, deleteEvent } = useEvents();

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const dayItems = useMemo(() => {
    if (!openDay) return [];
    return getByDay(openDay).map((e) => ({
      id: e.id,
      day: openDay,
      title: e.title,
      timeLabel: e.timeLabel,
      category: e.category,
      repeat: e.repeat || null,
      statusIcon: e.icon,
    }));
  }, [openDay, getByDay]);

  const handleClickDay = (day) => setOpenDay(day);

  // 추가
  const handleCreateSubmit = (data, dayNum) => {
    const id = data.id || String(Date.now());
    addEvent(dayNum, {
      id,
      icon: data.icon,
      title: data.title,
      timeLabel: data.timeLabel,
      category: data.category,
      repeat: data.repeat || null,
    });
    setCreateOpen(false);
    setCreateForDay(null);
    setOpenDay(dayNum);
  };

  // 삭제
  const handleDelete = (ev) => {
    const fromDay = ev.day ?? openDay;
    if (!fromDay) return;
    deleteEvent(fromDay, ev.id);
    setSelectedEvent(null);
  };

  // 수정
  const handleEditSubmit = (data, toDay) => {
    const id = data.id || editTarget?.id;
    const fromDay = data.fromDay ?? editTarget?.day;
    if (!id || !fromDay) return;
    editEvent(fromDay, toDay, {
      id,
      icon: data.icon,
      title: data.title,
      timeLabel: data.timeLabel,
      category: data.category,
      repeat: data.repeat || null,
    });
    setEditTarget(null);
    setCreateOpen(false);
    setOpenDay(toDay);
    setSelectedEvent(null);
  };

  return (
    <>
      <TopBar
        month={month}
        onPrev={() => {}}
        onNext={() => {}}
        onAdd={() => {
          setEditTarget(null);
          setCreateForDay(null);
          setCreateOpen(true);
        }}
      />

      <WeekHeader />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        {days.map((day) => {
          const events = getByDay(day);
          return (
            <div
              key={day}
              onClick={() => handleClickDay(day)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid #eee",
                borderRadius: "6px",
                minHeight: "110px",
                padding: "6px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <strong style={{ fontSize: "12px", color: "#222" }}>{day}</strong>

              {events.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "4px",
                    fontSize: "12px",
                    lineHeight: 1.3,
                    color: "#333",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      color: event.icon === "★" ? "#E3B400" : "#000",
                      fontWeight: event.icon === "★" ? 700 : 400,
                    }}
                  >
                    {event.icon}
                  </span>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {event.title}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 당일 리스트 모달 */}
      <Modal
        open={openDay != null}
        onClose={() => setOpenDay(null)}
        title={`${month} ${openDay ?? ""}일 일정`}
        footer={
          <>
            <button
              onClick={() => setOpenDay(null)}
              style={{ border: "1px solid #ccc", background: "#fff", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
            >
              닫기 (Esc)
            </button>
            <button
              onClick={() => {
                setCreateForDay(openDay);
                setEditTarget(null);
                setCreateOpen(true);
              }}
              style={{ border: "none", background: "#000", color: "#fff", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontWeight: 700 }}
            >
              + 새 일정
            </button>
          </>
        }
      >
        <DayScheduleList
          dateLabel={`${month} ${openDay ?? ""}일`}
          items={dayItems}
          onClickItem={(ev) => {
            setOpenDay(null);
            setSelectedEvent(ev);
          }}
        />
      </Modal>

      {/* 상세 모달 */}
      <ScheduleDetailModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onEdit={(ev) => {
          setEditTarget(ev);
          setCreateForDay(ev.day);
          setCreateOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* 추가/수정 공용 모달 */}
      <ScheduleCreateModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setCreateForDay(null);
          setEditTarget(null);
        }}
        onSubmit={editTarget ? handleEditSubmit : handleCreateSubmit}
        defaultDay={createForDay}
        initialEvent={editTarget || null}
      />
    </>
  );
}

function TopBar({ month, onPrev, onNext, onAdd }) {
  const navBtn = { background: "none", border: "1px solid #ccc", borderRadius: "4px", width: "24px", height: "24px", cursor: "pointer", fontSize: "16px", lineHeight: "20px", textAlign: "center", color: "#555" };
  const filterBtn = { border: "1px solid #ccc", borderRadius: "4px", padding: "4px 8px", backgroundColor: "#fff", fontSize: "12px", cursor: "pointer" };
  const addBtn = { border: "none", borderRadius: "4px", padding: "4px 10px", backgroundColor: "#000", color: "#fff", fontSize: "12px", cursor: "pointer", fontWeight: 600 };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onPrev} style={navBtn}>‹</button>
        <h2 style={{ fontSize: "18px", margin: 0 }}>{month}</h2>
        <button onClick={onNext} style={navBtn}>›</button>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={filterBtn}>필터</button>
        <button style={addBtn} onClick={onAdd}>＋ 새 일정</button>
      </div>
    </div>
  );
}

function WeekHeader() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "13px", color: "#666", marginBottom: "4px" }}>
      {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
        <div key={d} style={{ padding: "6px 0" }}>{d}</div>
      ))}
    </div>
  );
}
