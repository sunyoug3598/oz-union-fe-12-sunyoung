import { useEffect, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { STATUS_ICONS, getIconChar } from "../../../app/constants/uiTokens";

export default function RoutineEditModal({ open, onClose, initial, onSubmit }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState("");
  const [freq, setFreq] = useState("daily"); // daily | weekly | monthly
  const [icon, setIcon] = useState("•");

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setTitle(initial?.title || "");
      setFreq(initial?.freq || "daily");
      setIcon(getIconChar(initial?.icon) || "•");
    } else {
      setTitle("");
      setFreq("daily");
      setIcon("•");
    }
  }, [open, isEdit, initial]);

  const disabled = !title?.trim();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "루틴 수정" : "루틴 추가"}
      footer={
        <>
          <button
            onClick={onClose}
            style={{ border: "1px solid #ccc", background: "#fff", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
          >
            취소
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              onSubmit?.({
                id: initial?.id,
                title: title.trim(),
                freq,
                icon: getIconChar(icon),
              });
            }}
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
            {isEdit ? "저장" : "추가"}
          </button>
        </>
      }
    >
      <div className="grid gap-3">
        <Field label="아이콘">
          <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
            {Object.values(STATUS_ICONS).map((opt) => (
              <option key={opt.char} value={opt.char}>
                {opt.char} {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="주기">
          <select value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="daily">Daily(매일)</option>
            <option value="weekly">Weekly(매주)</option>
            <option value="monthly">Monthly(매월)</option>
          </select>
        </Field>

        <Field label="제목">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="루틴 이름"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-sm font-semibold text-gray-600">{label}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
