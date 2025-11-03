import { useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import DayScheduleList from "./DayScheduleList";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleCreateModal from "./ScheduleCreateModal";
import { useEvents } from "../../../app/store/eventsStore";
import { getIconColor, getIconChar } from "../../../app/constants/uiTokens";

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
    return (getByDay(openDay) || []).map((e) => ({
      id: e.id,
      day: openDay,
      title: e.title,
      timeLabel: e.timeLabel,
      category: e.category,
      repeat: e.repeat || null,
      statusIcon: e.icon,
    }));
  }, [openDay, getByDay]);

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

  const handleDelete = (ev) => {
    const fromDay = ev.day ?? openDay;
    if (!fromDay) return;
    deleteEvent(fromDay, ev.id);
    setSelectedEvent(null);
  };

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
          gap: 8,
          fontSize: 13,
        }}
      >
        {days.map((day) => {
          const list = getByDay(day);
          return (
            <div
              key={day}
              onClick={() => setOpenDay(day)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
              style={{
                backgroundColor: "#fafafa",
                border: "1px solid #eee",
                borderRadius: 6,
                minHeight: 110,
                padding: "6px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <strong style={{ fontSize: 12, color: "#222" }}>{day}</strong>

              {list.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                    fontSize: 12,
                    lineHeight: 1.3,
                    color: "#333",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      color: getIconColor(event.icon),
                      fontWeight: getIconChar(event.icon) === "★" ? 700 : 400,
                    }}
                  >
                    {getIconChar(event.icon)}
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

      <Modal
        open={openDay != null}
        onClose={() => setOpenDay(null)}
        title={`${month} ${openDay ?? ""}일 일정`}
        footer={
          <>
            <button
              onClick={() => setOpenDay(null)}
              style={{
                border: "1px solid #ccc",
                background: "#fff",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              닫기 (Esc)
            </button>
            <button
              onClick={() => {
                setCreateForDay(openDay);
                setEditTarget(null);
                setCreateOpen(true);
              }}
              style={{
                border: "none",
                background: "#000",
                color: "#fff",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: 700,
              }}
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
  const navBtn = {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 4,
    width: 24,
    height: 24,
    cursor: "pointer",
    fontSize: 16,
    lineHeight: "20px",
    textAlign: "center",
    color: "#555",
  };
  const filterBtn = {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "4px 8px",
    backgroundColor: "#fff",
    fontSize: 12,
    cursor: "pointer",
  };
  const addBtn = {
    border: "none",
    borderRadius: 4,
    padding: "4px 10px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        paddingBottom: 8,
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onPrev} style={navBtn}>
          ‹
        </button>
        <h2 style={{ fontSize: 18, margin: 0 }}>{month}</h2>
        <button onClick={onNext} style={navBtn}>
          ›
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={filterBtn}>필터</button>
        <button style={addBtn} onClick={onAdd}>
          ＋ 새 일정
        </button>
      </div>
    </div>
  );
}

function WeekHeader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        textAlign: "center",
        fontWeight: 600,
        fontSize: 13,
        color: "#666",
        marginBottom: 4,
      }}
    >
      {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
        <div key={d} style={{ padding: "6px 0" }}>
          {d}
        </div>
      ))}
    </div>
  );
}
