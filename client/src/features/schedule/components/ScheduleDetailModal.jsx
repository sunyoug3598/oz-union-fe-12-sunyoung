import Modal from "../../../shared/components/Modal";

/**
 * 일정 상세 모달
 * props:
 *  - open: boolean  모달 열림 여부
 *  - onClose: () => void  닫기 핸들러
 *  - event: {
 *      title: string,
 *      timeLabel?: string,
 *      category?: string,
 *      repeat?: "daily" | "weekly" | "monthly" | null,
 *      statusIcon?: "●" | "✕" | "→" | "－" | "○" | "★",
 *      memo?: string
 *    } | null
 */
export default function ScheduleDetailModal({ open, onClose, event }) {
  if (!event) return null;

  const { title, timeLabel, category, repeat, statusIcon, memo } = event;

  const repeatLabel =
    repeat === "daily"
      ? "매일"
      : repeat === "weekly"
      ? "매주"
      : repeat === "monthly"
      ? "매월"
      : "없음";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="일정 상세보기"
      footer={
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => console.log("수정 기능 예정:", event)}
            style={outlineBtn}
          >
            수정
          </button>
          <button
            onClick={() => console.log("삭제 기능 예정:", event)}
            style={dangerBtn}
          >
            삭제
          </button>
          <button onClick={onClose} style={outlineBtn}>
            닫기
          </button>
        </div>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Row label="제목">
          <strong>{title}</strong>
        </Row>
        <Row label="시간">{timeLabel || "시간 미정"}</Row>
        <Row label="카테고리">{category || "-"}</Row>
        <Row label="반복">{repeatLabel}</Row>
        <Row label="상태">
          <span
            style={{
              color: statusIcon === "★" ? "#E3B400" : "#000",
              fontWeight: statusIcon === "★" ? 700 : 400,
            }}
          >
            {statusIcon || "•"}
          </span>
        </Row>
        {memo ? (
          <Row label="메모">
            <div
              style={{
                whiteSpace: "pre-wrap",
                background: "#fafafa",
                border: "1px solid #eee",
                borderRadius: 6,
                padding: "8px 10px",
              }}
            >
              {memo}
            </div>
          </Row>
        ) : null}
      </div>
    </Modal>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ width: 80, color: "#555", fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

/* ---- buttons ---- */
const outlineBtn = {
  border: "1px solid #ccc",
  background: "#fff",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
};

const dangerBtn = {
  border: "none",
  background: "#E74C3C",
  color: "#fff",
  borderRadius: 6,
  padding: "6px 12px",
  cursor: "pointer",
};
