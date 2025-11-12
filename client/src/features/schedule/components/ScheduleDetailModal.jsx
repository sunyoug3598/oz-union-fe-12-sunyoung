import Modal from "../../../shared/components/Modal";

export default function ScheduleDetailModal({ open, onClose, event, onEdit, onDelete }) {
  if (!event) return null;

  const { title, timeLabel, category, repeat, icon } = event;
  const repeatLabel = repeat === "monthly" ? "매월" : "없음";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="일정 상세보기"
      footer={
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onEdit?.(event)} style={outlineBtn}>수정</button>
          <button onClick={() => onDelete?.(event)} style={dangerBtn}>삭제</button>
          <button onClick={onClose} style={outlineBtn}>닫기</button>
        </div>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Row label="제목"><strong>{title}</strong></Row>
        <Row label="시간">{timeLabel || "시간 미정"}</Row>
        <Row label="카테고리">{category || "-"}</Row>
        <Row label="반복">{repeatLabel}</Row>
        <Row label="상태">
          <span style={{ color: icon === "★" ? "#E3B400" : "#000", fontWeight: icon === "★" ? 700 : 400 }}>
            {icon || "•"}
          </span>
        </Row>
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

const outlineBtn = { border: "1px solid #ccc", background: "#fff", borderRadius: 6, padding: "6px 10px", cursor: "pointer" };
const dangerBtn = { border: "none", background: "#E74C3C", color: "#fff", borderRadius: 6, padding: "6px 12px", cursor: "pointer" };
