import { useState, useEffect, useCallback } from "react";
import Modal from "../../../shared/components/Modal";

export default function ScheduleCreateModal({
  open,
  onClose,
  onSubmit,      // (data, dayNum) => void
  defaultDay,    // number | null
  initialEvent,  // { id, day, title, timeLabel, category, repeat, icon } | null
}) {
  const isEdit = !!initialEvent;

  // 상태: day는 number | "" 로 관리 (빈값 허용)
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(defaultDay ?? "");
  const [timeLabel, setTimeLabel] = useState("");
  const [category, setCategory] = useState("개인");
  const [repeat, setRepeat] = useState("none"); // "none" | "monthly"
  const [statusIcon, setStatusIcon] = useState("●");

  // 숫자 -> 1~31로 보정
  const clampDay = (n) => Math.min(31, Math.max(1, n));

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setTitle(initialEvent?.title ?? "");
      if (initialEvent?.day === "" || initialEvent?.day == null) {
        setDay("");
      } else {
        setDay(clampDay(Number(initialEvent.day)));
      }
      setTimeLabel(initialEvent?.timeLabel ?? "");
      setCategory(initialEvent?.category ?? "개인");
      setRepeat(initialEvent?.repeat === "monthly" ? "monthly" : "none");
      setStatusIcon(initialEvent?.icon ?? "●");
    } else {
      setTitle("");
      setDay(typeof defaultDay === "number" ? clampDay(defaultDay) : "");
      setTimeLabel("");
      setCategory("개인");
      setRepeat("none");
      setStatusIcon("●");
    }
  }, [open, isEdit, initialEvent, defaultDay]);

  const disabled = !title || day === "" || Number.isNaN(Number(day));

  // Enter로 저장
  const trySubmit = useCallback(() => {
    if (disabled) return;
    const dayNum = clampDay(Number(day));
    onSubmit?.(
      {
        id: initialEvent?.id,                            // 수정이면 유지
        title: title.trim(),
        timeLabel: (timeLabel || "시간 미정").trim(),
        category,
        repeat: repeat === "monthly" ? "monthly" : null, // 부모가 null/문자열 처리
        icon: statusIcon,                                // 상태 아이콘
        fromDay: initialEvent?.day ?? null,              // 수정 시 원래 날짜
      },
      dayNum
    );
  }, [disabled, day, onSubmit, initialEvent, title, timeLabel, category, repeat, statusIcon]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "일정 수정" : "새 일정 추가"}
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
            onClick={trySubmit}
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
            {isEdit ? "수정 저장" : "저장"}
          </button>
        </>
      }
    >
      <div
        style={{ display: "grid", gap: 12 }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            trySubmit();
          }
        }}
      >
        <Field label="제목">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            style={input}
            maxLength={60}
          />
        </Field>

        <Field label="날짜">
          <input
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") return setDay("");
              const n = Number(v);
              if (Number.isNaN(n)) return;
              setDay(clampDay(n));
            }}
            placeholder="1~31"
            style={{ ...input, width: 120 }}
          />
        </Field>

        <Field label="시간">
          <input
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="예: 14:00 / 하루 종일"
            style={input}
            maxLength={40}
          />
        </Field>

        <Field label="카테고리">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={input}
          >
            <option>개인</option>
            <option>업무</option>
            <option>건강</option>
            <option>금융</option>
            <option>기타</option>
          </select>
        </Field>

        <Field label="상태 아이콘">
          <select
            value={statusIcon}
            onChange={(e) => setStatusIcon(e.target.value)}
            style={input}
          >
            <option value="●">● 할 일</option>
            <option value="✕">✕ 완료</option>
            <option value="→">→ 이월</option>
            <option value="－">－ 메모</option>
            <option value="○">○ 이벤트</option>
            <option value="★">★ 중요</option>
          </select>
        </Field>

        <Field label="반복">
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            style={input}
          >
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
