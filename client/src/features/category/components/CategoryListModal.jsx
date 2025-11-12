import { useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { useEvents } from "../../../app/store/eventsStore";
import { getIconChar, getIconColor } from "../../../app/constants/uiTokens";
import ScheduleDetailModal from "../../schedule/components/ScheduleDetailModal";

export default function CategoryListModal({ open, onClose, category }) {
  const { getAll } = useEvents();
  const [detail, setDetail] = useState(null);

  const items = useMemo(() => {
    if (!category?.name) return [];
    const all = getAll?.() || {};
    const list = [];
    Object.keys(all)
      .map((d) => Number(d))
      .sort((a, b) => a - b)
      .forEach((day) => {
        (all[day] || [])
          .filter((ev) => (ev.category || "미분류") === category.name) // ← 기본값 '미분류'
          .forEach((ev) =>
            list.push({
              id: ev.id,
              day,
              title: ev.title,
              timeLabel: ev.timeLabel,
              category: ev.category,
              icon: getIconChar(ev.icon),
              repeat: ev.repeat || null,
            })
          );
      });
    return list;
  }, [getAll, category]);

  const footer = (
    <button
      onClick={onClose}
      style={{
        border: "1px solid #ccc",
        background: "#fff",
        borderRadius: 6,
        padding: "6px 10px",
        cursor: "pointer",
      }}
    >
      닫기
    </button>
  );

  if (!open) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={category?.name || "카테고리"}
        footer={footer}
      >
        {items.length === 0 ? (
          <div style={{ color: "#777", fontSize: 14 }}>해당 카테고리 일정이 없습니다.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {items.map((ev) => (
              <button
                key={`${ev.day}-${ev.id}`}
                onClick={() => setDetail(ev)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    minWidth: 56,
                    fontSize: 12,
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{String(ev.day).padStart(2, "0")}일</div>
                  <div>{ev.timeLabel || "시간 미정"}</div>
                </div>

                <div style={{ width: 1, height: 24, background: "#e8e8e8" }} />

                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <span
                    aria-hidden
                    style={{
                      color: getIconColor(ev.icon),
                      fontWeight: ev.icon === "★" ? 700 : 400,
                    }}
                  >
                    {ev.icon}
                  </span>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={ev.title}
                  >
                    {ev.title}
                  </span>
                  {ev.repeat === "monthly" && (
                    <span title="매월 반복" aria-label="매월 반복">🔁</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>

      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
      />
    </>
  );
}
