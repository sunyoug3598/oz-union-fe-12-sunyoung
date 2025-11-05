import { useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import DayScheduleList from "./DayScheduleList";
import ScheduleDetailModal from "./ScheduleDetailModal";
import { useEvents } from "../../../app/store/eventsStore";
import { getIconColor } from "../../../app/constants/uiTokens";

export default function CalendarMonth() {
  const { events, addEvent, editEvent, deleteEvent } = useEvents();

  const [month] = useState("2025년 11월");
  const [openDay, setOpenDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ 이벤트로부터 카테고리 자동 수집 (컨텍스트 의존 X)
  const allCatNames = useMemo(() => {
    const set = new Set();
    Object.values(events || {}).forEach((arr) => {
      (arr || []).forEach((ev) => ev?.category && set.add(ev.category));
    });
    return Array.from(set); // ["개인","업무",...]
  }, [events]);

  // ✅ 로컬 필터 상태 (빈 집합 = 전체보기)
  const [selectedCats, setSelectedCats] = useState(new Set());

  // 30일 달(데모)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const getDayItems = (day) => {
    const list = events[day] || [];
    if (selectedCats.size === 0) return list;
    return list.filter((e) => selectedCats.has(e.category));
  };

  const dayItems = useMemo(() => {
    if (!openDay) return [];
    return (getDayItems(openDay) || []).map((e) => ({
      ...e,
      day: openDay,
      statusIcon: e.icon,
      repeat: e.repeat || null,
    }));
  }, [openDay, events, selectedCats]);

  const handleDelete = (ev) => {
    const dayNum = ev.day ?? openDay;
    if (!dayNum) return;
    deleteEvent(dayNum, ev.id);
    setSelectedEvent(null);
  };

  const handleEdit = (fromDay, toDay, updated) => {
    editEvent(fromDay, toDay, updated);
    setSelectedEvent(null);
    setOpenDay(toDay);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <TopBar month={month} onPrev={() => {}} onNext={() => {}} />

      {/* ✅ 카테고리 필터 바 (로컬) */}
      <CategoryFilterBar
        all={allCatNames}
        selected={selectedCats}
        onToggle={(name) => {
          setSelectedCats((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
          });
        }}
        onClear={() => setSelectedCats(new Set())}
      />

      <WeekHeader />

      {/* 날짜 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        {days.map((day) => {
          const list = getDayItems(day);
          return (
            <div
              key={day}
              onClick={() => setOpenDay(day)}
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

              {/* 칸 안 미리보기 최대 2개 (필터 적용) */}
              {list.slice(0, 2).map((event) => (
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
                      color: getIconColor(event.icon),
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
          const next = { ...ev }; // 편집 UI는 다음 단계
          handleEdit(ev.day, ev.day, next);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}

/* 상단 바 */
function TopBar({ month, onPrev, onNext }) {
  const btn = {
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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        paddingBottom: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={onPrev} style={btn}>‹</button>
        <h2 style={{ fontSize: "18px", margin: 0 }}>{month}</h2>
        <button onClick={onNext} style={btn}>›</button>
      </div>
      <div />
    </div>
  );
}

/* 요일 헤더 */
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
      }}
    >
      {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
        <div key={d} style={{ padding: "6px 0" }}>{d}</div>
      ))}
    </div>
  );
}

/* 카테고리 필터 바 (로컬) */
function CategoryFilterBar({ all = [], selected, onToggle, onClear }) {
  if (!all.length) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: "8px 10px",
        background: "#fafafa",
      }}
    >
      <span style={{ fontSize: 12, color: "#666", marginRight: 4 }}>카테고리:</span>
      {all.map((name) => {
        const active = selected.has(name);
        return (
          <label
            key={name}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              border: active ? "1px solid #333" : "1px solid #ddd",
              background: "#fff",
              color: "#222",
              borderRadius: 999,
              padding: "4px 10px",
              cursor: "pointer",
              userSelect: "none",
              fontSize: 12,
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(name)}
            />
            {name}
          </label>
        );
      })}
      <button
        onClick={onClear}
        style={{
          marginLeft: "auto",
          border: "1px solid #ddd",
          background: "#fff",
          borderRadius: 999,
          padding: "4px 10px",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        전체보기
      </button>
    </div>
  );
}
