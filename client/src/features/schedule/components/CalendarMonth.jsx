import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEvents } from "../../../app/store/eventsStore";
import { getIconChar, getIconColor } from "../../../app/constants/uiTokens";
import ScheduleDetailModal from "./ScheduleDetailModal";

const CAT_LS_KEY = "solan.categories.v1";

export default function CalendarMonth() {
  const { events } = useEvents();

  const calRef = useRef(null);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState(null);
  const [catFilter, setCatFilter] = useState("전체");

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  // ✅ 카테고리 목록 (필터용) — 가나다순 정렬
  const categories = useMemo(() => {
    const set = new Set();
    Object.values(events || {}).forEach((list) => {
      (list || []).forEach((ev) => set.add(ev.category || "미분류"));
    });
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
    return ["전체", ...arr];
  }, [events]);

  // 카테고리명 → 색상 매핑 (localStorage → 기본 팔레트 폴백)
  const colorByName = useMemo(() => {
    let stored = [];
    try {
      const raw = localStorage.getItem(CAT_LS_KEY);
      stored = raw ? JSON.parse(raw) : [];
    } catch {}
    const map = Object.create(null);
    (stored || []).forEach((c) => {
      if (c?.name) map[c.name] = c.color || "#868e96";
    });
    return {
      개인: map["개인"] ?? "#2f8fcb",
      업무: map["업무"] ?? "#444444",
      건강: map["건강"] ?? "#16a34a",
      금융: map["금융"] ?? "#e3b400",
      기타: map["기타"] ?? "#7a7a7a",
      미분류: map["미분류"] ?? "#adb5bd",
      ...map,
    };
  }, []);

  // 배경색에 따른 텍스트 컬러
  const pickTextColor = (hex = "#999") => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return L > 0.6 ? "#111" : "#fff";
  };

  // 이벤트 변환 + 색상 적용
  const baseEvents = useMemo(() => {
    const out = [];
    Object.keys(events || {}).forEach((dayKey) => {
      const dayNum = Number(dayKey);
      (events[dayKey] || []).forEach((ev) => {
        const ch = getIconChar(ev.icon);
        const cat = ev.category || "미분류";
        const bg = colorByName[cat] || "#868e96";
        const fg = pickTextColor(bg);
        out.push({
          id: ev.id,
          title: `${ch} ${ev.title}`,
          start: new Date(y, m, dayNum),
          allDay: true,
          backgroundColor: bg,
          borderColor: bg,
          textColor: fg,
          extendedProps: {
            day: dayNum,
            titleOnly: ev.title,
            timeLabel: ev.timeLabel,
            category: cat,
            repeat: ev.repeat || null,
            iconChar: ch,
          },
        });
      });
    });
    return out;
  }, [events, y, m, colorByName]);

  const fcEvents = useMemo(() => {
    if (catFilter === "전체") return baseEvents;
    return baseEvents.filter((e) => e.extendedProps.category === catFilter);
  }, [baseEvents, catFilter]);

  const handleDateClick = (arg) => {
    const day = arg.date.getDate();
    try {
      window.dispatchEvent(new CustomEvent("open-new-schedule", { detail: { day } }));
    } catch {}
  };

  const handleEventClick = (arg) => {
    const p = arg.event.extendedProps;
    setDetail({
      id: arg.event.id,
      day: p.day,
      title: p.titleOnly,
      timeLabel: p.timeLabel,
      category: p.category,
      repeat: p.repeat,
      icon: p.iconChar,
    });
  };

  const renderEventContent = (arg) => {
    const p = arg.event.extendedProps;
    const color = getIconColor(p.iconChar);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ color, fontWeight: p.iconChar === "★" ? 700 : 400 }}>{p.iconChar}</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.titleOnly}
        </span>
      </div>
    );
  };

  const getApi = () => calRef.current?.getApi?.();
  const goPrev = () => getApi()?.prev();
  const goNext = () => getApi()?.next();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 제목(연월) 다음에 화살표 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 2,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{title || ""}</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <GhostIconButton onClick={goPrev} ariaLabel="이전 달">‹</GhostIconButton>
          <GhostIconButton onClick={goNext} ariaLabel="다음 달">›</GhostIconButton>
        </div>
      </div>

      {/* 컨트롤 바: 카테고리 필터 + 새 일정 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          marginTop: -4,
          marginBottom: -4,
        }}
      >
        <label style={{ fontSize: 13, color: "#555" }}>
          카테고리&nbsp;
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              background: "#fff",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            try {
              window.dispatchEvent(new CustomEvent("open-new-schedule", { detail: { day: null } }));
            } catch {}
          }}
          style={{
            border: "none",
            background: "#000",
            color: "#fff",
            borderRadius: 6,
            padding: "8px 12px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          + 새 일정
        </button>
      </div>

      {/* 캘린더 */}
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        expandRows
        headerToolbar={false}
        dayMaxEventRows={3}
        events={fcEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        datesSet={(arg) => setTitle(arg.view.title)}
      />

      <ScheduleDetailModal open={!!detail} event={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function GhostIconButton({ onClick, children, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: "1px solid #cbd5e1",
        background: "#fff",
        color: "#111",
        fontSize: 18,
        lineHeight: "34px",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </button>
  );
}
