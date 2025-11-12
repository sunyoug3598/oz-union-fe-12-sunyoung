import { useEffect, useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { getIconChar } from "../../../app/constants/uiTokens";

export default function ScheduleCreateModal({
  open,
  onClose,
  onSubmit,
  defaultDay,
  initialEvent,
}) {
  const isEdit = !!initialEvent;

  const [title, setTitle] = useState("");
  const [day, setDay] = useState(defaultDay || "");
  const [timeLabel, setTimeLabel] = useState("");
  const [category, setCategory] = useState("개인");
  const [repeat, setRepeat] = useState("none");
  const [statusIcon, setStatusIcon] = useState("•");

  const [errors, setErrors] = useState({}); // {title, day, time}

  // 오늘(1~30 범위로 보정)
  const today = useMemo(() => Math.min(30, Math.max(1, new Date().getDate())), []);

  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      setTitle(initialEvent?.title ?? "");
      setDay(initialEvent?.day ?? "");
      setTimeLabel(initialEvent?.timeLabel ?? "");
      setCategory(initialEvent?.category ?? "개인");
      setRepeat(initialEvent?.repeat === "monthly" ? "monthly" : "none");
      setStatusIcon(getIconChar(initialEvent?.icon ?? "•"));
    } else {
      setTitle("");
      setDay(defaultDay || "");
      setTimeLabel("");
      setCategory("개인");
      setRepeat("none");
      setStatusIcon("•");
    }
    setErrors({});
  }, [open, isEdit, initialEvent, defaultDay]);

  // 간단 검증
  const validate = () => {
    const next = {};
    const t = (title || "").trim();

    // 제목
    if (!t) next.title = "제목을 입력하세요.";

    // 날짜 (1~30)
    const n = Number(day);
    if (!n || !Number.isInteger(n)) next.day = "날짜는 숫자여야 해요.";
    else if (n < 1 || n > 30) next.day = "1~30 사이로 입력하세요.";

    // 시간: 비어있으면 허용, 값이 있으면 HH:MM 또는 '하루 종일' 허용
    const time = (timeLabel || "").trim();
    if (time) {
      const re = /^([01]\d|2[0-3]):[0-5]\d$/; // 00:00 ~ 23:59
      if (time !== "하루 종일" && !re.test(time)) {
        next.time = "시간은 HH:MM 또는 '하루 종일' 형식으로 입력하세요.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const nDay = Number(day);

    // 과거 날짜 경고 (이번 달 가정)
    if (!isEdit && nDay < today) {
      const ok = confirm(`선택한 날짜가 오늘(${today}일)보다 이전입니다. 저장할까요?`);
      if (!ok) return;
    }

    const payload = {
      id: initialEvent?.id,
      title: (title || "").trim(),
      timeLabel: (timeLabel || "").trim() || "시간 미정",
      category,
      repeat: repeat === "monthly" ? "monthly" : null,
      icon: getIconChar(statusIcon),
      fromDay: initialEvent?.day ?? null,
    };

    onSubmit?.(payload, nDay);

    // 저장 후 캘린더로 스크롤/하이라이트 시그널
    try {
      window.dispatchEvent(new CustomEvent("focus-day", { detail: { day: nDay } }));
    } catch {}
  };

  const disabled = !title || !day;

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
            onClick={handleSave}
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
      <div style={{ display: "grid", gap: 12 }}>
        <Field label="제목" error={errors.title}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            style={input(errors.title)}
          />
        </Field>

        <Field label="날짜" error={errors.day}>
          <input
            type="number"
            min={1}
            max={30}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="1~30"
            style={{ ...input(errors.day), width: 120 }}
          />
          <span style={{ color: "#888", fontSize: 12, marginLeft: 6 }}>
            오늘은 {today}일
          </span>
        </Field>

        <Field label="시간" error={errors.time}>
          <input
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="예: 14:00 / 하루 종일 (미입력 가능)"
            style={input(errors.time)}
          />
        </Field>

        <Field label="카테고리">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={input()}>
            <option>개인</option>
            <option>업무</option>
            <option>건강</option>
            <option>금융</option>
            <option>기타</option>
          </select>
        </Field>

        <Field label="상태 아이콘">
          <select value={statusIcon} onChange={(e) => setStatusIcon(e.target.value)} style={input()}>
            <option value="•">• 할 일</option>
            <option value="✕">✕ 완료</option>
            <option value="→">→ 이월</option>
            <option value="－">－ 메모</option>
            <option value="○">○ 이벤트</option>
            <option value="★">★ 중요</option>
          </select>
        </Field>

        <Field label="반복">
          <select value={repeat} onChange={(e) => setRepeat(e.target.value)} style={input()}>
            <option value="none">없음</option>
            <option value="monthly">매월</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 90, color: "#555", fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1 }}>
        {children}
        {error ? (
          <div style={{ marginTop: 6, fontSize: 12, color: "#e03131" }}>{error}</div>
        ) : null}
      </div>
    </div>
  );
}

const input = (hasError = false) => ({
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: `1px solid ${hasError ? "#e03131" : "#ddd"}`,
  outline: "none",
  background: "#fff",
});
