import { useState, useEffect } from "react";
import Modal from "../../../shared/components/Modal";

export default function ScheduleCreateModal({
  open,
  onClose,
  onCreate,
  defaultDay, // 숫자(1~30) 또는 null
}) {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(defaultDay || "");
  const [timeLabel, setTimeLabel] = useState("");
  const [category, setCategory] = useState("개인");
  const [repeat, setRepeat] = useState("none"); // none | monthly
  const [statusIcon, setStatusIcon] = useState("●"); // ● ✕ → － ○ ★

  useEffect(() => {
    setDay(defaultDay || "");
  }, [defaultDay, open]);

  const disabled = !title || !day;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="새 일정 추가"
      footer={
        <>
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
            취소
          </button>
          <button
            onClick={() => {
              onCreate?.({
                title,
                timeLabel: timeLabel || "시간 미정",
                category,
                repeat: repeat === "monthly" ? "monthly" : null,
                icon: statusIcon,
              }, Number(day));
            }}
            disabled={disabled}
            style={{
              border: "none",
              background: disabled ? "#bbb" : "#000",
              color: "#fff",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: disabled ? "not-allowed" : "pointer",
              fontWeight: 700,
            }}
          >
            저장
          </button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Field label="제목">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            style={input}
          />
        </Field>

        <Field label="날짜">
          <input
            type="number"
            min={1}
            max={30}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="1~30"
            style={{ ...input, width: 120 }}
          />
        </Field>

        <Field label="시간">
          <input
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="예: 14:00 / 하루 종일"
            style={input}
          />
        </Field>

        <Field label="카테고리">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input}>
            <option>개인</option>
            <option>업무</option>
            <option>건강</option>
            <option>금융</option>
            <option>기타</option>
          </select>
        </Field>

        <Field label="상태 아이콘">
          <select value={statusIcon} onChange={(e) => setStatusIcon(e.target.value)} style={input}>
            <option value="●">● 할 일</option>
            <option value="✕">✕ 완료</option>
            <option value="→">→ 이월</option>
            <option value="－">－ 메모</option>
            <option value="○">○ 이벤트</option>
            <option value="★">★ 중요</option>
          </select>
        </Field>

        <Field label="반복">
          <select value={repeat} onChange={(e) => setRepeat(e.target.value)} style={input}>
            <option value="none">없음</option>
            <option value="monthly">매월</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 90, color: "#555", fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  outline: "none",
};
