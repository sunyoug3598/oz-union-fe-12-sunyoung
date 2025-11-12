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

  // 상세/편집 모달 상태
  const [detail, setDetail] = useState(null);
  const [editor, setEditor] = useState({ open: false, day: null, initial: null });

  const items = useMemo(() => {
    const raw = getUpcoming(range);
    const list = showCompleted ? raw : raw.filter((ev) => getIconChar(ev.icon) !== "✕");
    return list.slice().sort((a, b) => a.day - b.day);
  }, [getUpcoming, range, showCompleted]);

  // 편집 저장 처리
  const handleSubmit = (payload, targetDay) => {
    if (payload.id) {
      // 수정
      editEvent(payload.fromDay ?? targetDay, targetDay, {
        id: payload.id,
        title: payload.title,
        timeLabel: payload.timeLabel,
        category: payload.category,
        repeat: payload.repeat, // null | "monthly"
        icon: payload.icon,
      });
    } else {
      // 새로 추가 (이 경로는 보통 쓰이지 않지만 대비)
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

      {/* 상세 모달 */}
      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onEdit={(ev) => {
          // 위젯 안에서 바로 편집 모달 오픈
          setEditor({
            open: true,
            day: ev.day,
            initial: {
              id: ev.id,
              day: ev.day,
              title: ev.title,
              timeLabel: ev.timeLabel,
              category: ev.category,
              repeat: ev.repeat, // null | "monthly"
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

      {/* 편집 모달 (위젯 전용) */}
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
      <div style={{ minWidth: 90, fontSize: 12, color: "#666" }}>
        <div style={{ fontWeight: 600 }}>{formatDate(ev.day)}</div>
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
          {ev.repeat === "monthly" && (
            <span title="매월 반복" style={{ marginLeft: 6 }}>
              🔁
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
          <CategoryBadge name={ev.category} />
        </div>
      </div>
    </button>
  );
}

/** 날짜를 항상 'MM월 DD일' 형식으로 표기 */
function formatDate(day) {
  const now = new Date();
  const month = now.getMonth() + 1; // 1~12
  const dd = String(day).padStart(2, "0");
  return `${month}월 ${dd}일`;
}
