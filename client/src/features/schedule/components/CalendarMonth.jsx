import { useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import DayScheduleList from "./DayScheduleList";
import ScheduleDetailModal from "./ScheduleDetailModal";
import { useEvents } from "../../../app/store/eventsStore";
import { getIconChar, getIconColor } from "../../../app/constants/uiTokens";

export default function CalendarMonth() {
  const { events } = useEvents();              // ✅ 전역 스토어 사용
  const [month] = useState("2025년 11월");
  const [openDay, setOpenDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // 모달용 당일 아이템
  const dayItems = useMemo(() => {
    if (!openDay) return [];
    return (events[openDay] || []).map((e) => ({
      id: e.id,
      day: openDay,
      title: e.title,
      timeLabel: e.timeLabel,
      category: e.category,
      repeat: e.repeat || null,
      statusIcon: getIconChar(e.icon), // ✅ 표준화
    }));
  }, [openDay, events]);

  const handleClickDay = (day) => setOpenDay(day);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TopBar month={month} onPrev={() => {}} onNext={() => {}} />

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
          const list = events[day] || []; // ✅ 스토어에서 그 날 일정
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

              {list.slice(0, 2).map((event) => {
                const ch = getIconChar(event.icon);
                return (
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
                        color: getIconColor(ch),
                        fontWeight: ch === "★" ? 700 : 400,
                      }}
                    >
                      {ch}
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
                );
              })}
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
                window.dispatchEvent(
                  new CustomEvent("open-new-schedule", { detail: { day: openDay } })
                );
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
          items={dayItems}
          onClickItem={(ev) => {
            setOpenDay(null);
            setSelectedEvent(ev);
          }}
        />
      </Modal>

      {/* 일정 상세 모달 */}
      <ScheduleDetailModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
}

function TopBar({ month, onPrev, onNext }) {
  const navBtnStyle = {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "20px",
    textAlign: "center",
    color: "#555",
  };
  const filterBtnStyle = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px 8px",
    backgroundColor: "#fff",
    fontSize: "12px",
    cursor: "pointer",
  };
  const addBtnStyle = {
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 700,
  };

  const openNewSchedule = (day = null) => {
    window.dispatchEvent(new CustomEvent("open-new-schedule", { detail: { day } }));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        paddingBottom: "8px",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onPrev} style={navBtnStyle}>‹</button>
        <h2 style={{ fontSize: "18px", margin: 0 }}>{month}</h2>
        <button onClick={onNext} style={navBtnStyle}>›</button>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={filterBtnStyle}>필터</button>
        <button style={addBtnStyle} onClick={() => openNewSchedule(null)}>
          + 새 일정
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
        fontSize: "13px",
        color: "#666",
        marginBottom: "4px",
      }}
    >
      {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
        <div key={d} style={{ padding: "6px 0" }}>{d}</div>
      ))}
    </div>
  );
}
