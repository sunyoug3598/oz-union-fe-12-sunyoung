import { useState, useMemo } from "react";
import Modal from "../../../shared/components/Modal";
import DayScheduleList from "./DayScheduleList";
import ScheduleDetailModal from "./ScheduleDetailModal";
import ScheduleCreateModal from "./ScheduleCreateModal";

export default function CalendarMonth() {
  const [month] = useState("2025년 11월");
  const [openDay, setOpenDay] = useState(null);         // 당일 리스트 모달
  const [selectedEvent, setSelectedEvent] = useState(null); // 상세 모달
  const [createOpen, setCreateOpen] = useState(false);  // 새 일정 모달
  const [createForDay, setCreateForDay] = useState(null);

  // 일정 저장소: 날짜(숫자) → 이벤트 배열
  const [events, setEvents] = useState({
    3: [{ icon: "●", title: "팀 회의", timeLabel: "14:00", category: "업무", repeat: "weekly" }],
    5: [{ icon: "★", title: "카드 결제일", timeLabel: "하루 종일", category: "금융", repeat: "monthly" }],
    12: [{ icon: "－", title: "병원 예약", timeLabel: "09:30", category: "건강" }],
    14: [
      { icon: "○", title: "친구 약속", timeLabel: "19:00", category: "개인" },
      { icon: "●", title: "헬스장", timeLabel: "21:00", category: "건강", repeat: "weekly" },
    ],
    21: [{ icon: "●", title: "제출 마감", timeLabel: "23:59", category: "업무" }],
    29: [{ icon: "○", title: "월간 회고", timeLabel: "20:00", category: "개인", repeat: "monthly" }],
  });

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const dayItems = useMemo(() => {
    if (!openDay) return [];
    return (events[openDay] || []).map((e) => ({
      title: e.title,
      timeLabel: e.timeLabel,
      category: e.category,
      repeat: e.repeat || null,
      statusIcon: e.icon,
    }));
  }, [openDay, events]);

  const handleClickDay = (day) => setOpenDay(day);

  const handleCreate = (data, dayNum) => {
    setEvents((prev) => {
      const arr = prev[dayNum] ? [...prev[dayNum]] : [];
      arr.push({
        icon: data.icon,
        title: data.title,
        timeLabel: data.timeLabel,
        category: data.category,
        repeat: data.repeat, // 'monthly' or null
      });
      return { ...prev, [dayNum]: arr };
    });
    setCreateOpen(false);
    setCreateForDay(null);
    // 새로 추가한 날짜 모달 다시 열어 최신 목록 보여주기 (선호 시)
    setOpenDay(dayNum);
  };

  return (
    <>
      <TopBar
        month={month}
        onPrev={() => {}}
        onNext={() => {}}
        onAdd={() => {
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
        {days.map((day) => (
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

            {(events[day] || []).slice(0, 2).map((event, idx) => (
              <div
                key={idx}
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
        ))}
      </div>

      {/* 당일 일정 리스트 모달 */}
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

      {/* 상세 모달 */}
      <ScheduleDetailModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

      {/* 새 일정 모달 */}
      <ScheduleCreateModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setCreateForDay(null);
        }}
        onCreate={handleCreate}
        defaultDay={createForDay}
      />
    </>
  );
}

/* 내부 소컴포넌트 */
function TopBar({ month, onPrev, onNext, onAdd }) {
  const navBtn = {
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
  const filterBtn = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px 8px",
    backgroundColor: "#fff",
    fontSize: "12px",
    cursor: "pointer",
  };
  const addBtn = {
    border: "none",
    borderRadius: "4px",
    padding: "4px 10px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "12px",
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
        paddingBottom: "8px",
        marginBottom: "8px",
      }}
    >
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
