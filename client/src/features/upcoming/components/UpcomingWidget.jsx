import { useMemo, useState } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import { useSettings } from "../../../app/store/settingsStore";
import { getIconColor, getIconChar } from "../../../app/constants/uiTokens";
import ScheduleDetailModal from "../../schedule/components/ScheduleDetailModal";
import ScheduleCreateModal from "../../schedule/components/ScheduleCreateModal";
import CategoryBadge from "../../schedule/components/CategoryBadge";

export default function UpcomingWidget() {
  const { getUpcoming, deleteEvent, editEvent, addEvent } = useEvents();
  const range = useSettings((s) => s.upcomingRangeDays);
  const showCompleted = useSettings((s) => s.showCompleted);

  const [detail, setDetail] = useState(null);
  const [editor, setEditor] = useState({ open: false, day: null, initial: null });

  const items = useMemo(() => {
    const raw = getUpcoming(range);
    const list = showCompleted ? raw : raw.filter((ev) => getIconChar(ev.icon) !== "✕");
    return list.slice().sort((a, b) => a.day - b.day);
  }, [getUpcoming, range, showCompleted]);

  const handleSubmit = (payload, targetDay) => {
    if (payload.id) {
      editEvent(payload.fromDay ?? targetDay, targetDay, {
        id: payload.id,
        title: payload.title,
        timeLabel: payload.timeLabel,
        category: payload.category,
        repeat: payload.repeat,
        icon: payload.icon,
      });
    } else {
      addEvent(targetDay, {
        title: payload.title,
        timeLabel: payload.timeLabel,
        category: payload.category,
        repeat: payload.repeat,
        icon: payload.icon,
      });
    }
    setEditor({ open: false, day: null, initial: null });
    setDetail(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      {/* 헤더 */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Upcoming</strong>
        <span style={{ fontSize: 12, color: "#888" }}>
          다음 {range}일{showCompleted ? "" : " · 완료 숨김"}
        </span>
      </header>

      {/* ✅ 내부 라운드 박스 제거: 투명 리스트 + 스크롤만 유지 */}
      <div
        style={{
          height: 240,
          overflowY: "auto",
          padding: 0,            // 내부 여백 제거
          border: "none",        // 테두리 제거
          background: "transparent",
        }}
      >
        {items.length === 0 ? (
          <div style={{ color: "#888", fontSize: 13 }}>표시할 예정된 일정이 없습니다.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
            {items.map((ev) => (
              <li key={ev.id}>
                <UpcomingRow ev={ev} onClick={() => setDetail(ev)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 상세 모달 */}
      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onEdit={(ev) => {
          setEditor({
            open: true,
            day: ev.day,
            initial: {
              id: ev.id,
              day: ev.day,
              title: ev.title,
              timeLabel: ev.timeLabel,
              category: ev.category,
              repeat: ev.repeat,
              icon: getIconChar(ev.icon),
            },
          });
        }}
        onDelete={(ev) => {
          if (confirm("정말 삭제하시겠어요?")) {
            deleteEvent(ev.day, ev.id);
            setDetail(null);
          }
        }}
      />

      {/* 편집 모달 */}
      <ScheduleCreateModal
        open={editor.open}
        onClose={() => setEditor({ open: false, day: null, initial: null })}
        onSubmit={handleSubmit}
        defaultDay={editor.day ?? undefined}
        initialEvent={editor.initial}
      />
    </div>
  );
}

/** 한 줄 아이템 (라운드 카드 X, 심플한 라인 스타일) */
function UpcomingRow({ ev, onClick }) {
  const ch = getIconChar(ev.icon);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        display: "grid",
        gridTemplateColumns: "72px 16px 1fr auto",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",                 // 얇게
        background: "transparent",
        border: "none",
        borderBottom: "1px solid #f0f0f0", // 구분선만
        cursor: "pointer",
      }}
    >
      {/* 날짜 (월 일만, 폰트 작게) */}
      <span style={{ color: "#666", fontSize: 12 }}>{formatDate(ev.day)}</span>

      {/* 불릿 아이콘 */}
      <span style={{ color: getIconColor(ch), fontWeight: ch === "★" ? 700 : 400 }}>{ch}</span>

      {/* 제목 */}
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "#222",
          fontSize: 13,
          fontWeight: 600,
        }}
        title={ev.title}
      >
        {ev.title}
      </span>

      {/* 카테고리 뱃지 (색상 동기화 보류 중 — 형태만 유지) */}
      <span>
        <CategoryBadge name={ev.category} />
      </span>
    </button>
  );
}

/** 날짜를 항상 'MM월 DD일' 형식으로 표기 */
function formatDate(day) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const dd = String(day).padStart(2, "0");
  return `${month}월 ${dd}일`;
}
