import { useEffect, useState } from "react";
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
  // date 입력용 ISO 문자열 (YYYY-MM-DD)
  const [dateISO, setDateISO] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [category, setCategory] = useState("개인");
  const [repeat, setRepeat] = useState("none"); // none | daily | weekly | monthly
  const [statusIcon, setStatusIcon] = useState("•");
  const [errors, setErrors] = useState({});

  // 오늘(문구용)
  const todayISO = new Date().toISOString().split("T")[0];

  // defaultDay(1~30)를 ISO로 바꿔서 초기 세팅
  const dayToISO = (dayNum) => {
    if (!dayNum) return "";
    const d = new Date();
    d.setDate(dayNum);
    return d.toISOString().split("T")[0];
  };
  // ISO를 day(1~31)로 환산
  const isoToDay = (iso) => {
    try {
      return new Date(iso).getDate();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      setTitle(initialEvent?.title ?? "");
      // 기존 구조: day(1~30)만 있었음 -> ISO로 변환
      setDateISO(initialEvent?.dateISO || dayToISO(initialEvent?.day));
      setTimeLabel(initialEvent?.timeLabel ?? "");
      setCategory(initialEvent?.category ?? "개인");
      setRepeat(initialEvent?.repeat ?? "none");
      setStatusIcon(getIconChar(initialEvent?.icon ?? "•"));
    } else {
      setTitle("");
      setDateISO(defaultDay ? dayToISO(defaultDay) : "");
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
    if (!(title || "").trim()) next.title = "제목을 입력하세요.";
    if (!dateISO) next.day = "날짜를 선택하세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const day = isoToDay(dateISO);
    const payload = {
      id: initialEvent?.id,
      title: (title || "").trim(),
      timeLabel: (timeLabel || "").trim() || "하루 종일",
      category,
      repeat: repeat === "none" ? null : repeat, // none은 null 저장
      icon: getIconChar(statusIcon),
      fromDay: initialEvent?.day ?? null,
    };

    onSubmit?.(payload, day);

    try {
      window.dispatchEvent(new CustomEvent("focus-day", { detail: { day } }));
    } catch (e) {
      console.error(e);
    }
  };

  const disabled = !title || !dateISO;

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
        {/* 제목 */}
        <Field label="제목" error={errors.title}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            style={input(!!errors.title)}
          />
        </Field>

        {/* 날짜: 달력 */}
        <Field label="날짜" error={errors.day}>
          <input
            type="date"
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            min={todayISO}
            style={{ ...input(!!errors.day), width: 180 }}
          />
        </Field>

        {/* 시간: 스크롤 선택 + 안내 */}
        <Field label="시간" error={errors.time}>
          <input
            type="time"
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            step="300" // 5분 간격
            style={{ ...input(!!errors.time), width: 140 }}
          />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            미입력 시 <b>하루 종일</b>로 표시됩니다.
          </div>
        </Field>

        {/* 카테고리: 기존 드롭다운 그대로(Provider 없이 안정 운영) */}
        <Field label="카테고리">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={input()}
          >
            <option>개인</option>
            <option>업무</option>
            <option>건강</option>
            <option>금융</option>
            <option>기타</option>
            <option>미분류</option>
          </select>
        </Field>

        {/* 상태 아이콘 */}
        <Field label="상태 아이콘">
          <select
            value={statusIcon}
            onChange={(e) => setStatusIcon(e.target.value)}
            style={input()}
          >
            <option value="•">• 할 일</option>
            <option value="✕">✕ 완료</option>
            <option value="→">→ 이월</option>
            <option value="－">－ 메모</option>
            <option value="○">○ 이벤트</option>
            <option value="★">★ 중요</option>
          </select>
        </Field>

        {/* 반복 옵션 확장 */}
        <Field label="반복">
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            style={input()}
          >
            <option value="none">없음</option>
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
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
