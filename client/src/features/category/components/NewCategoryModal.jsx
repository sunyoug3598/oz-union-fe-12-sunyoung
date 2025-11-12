import { useMemo, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { useCategories } from "../../../app/store/categoryStore";
import { useEvents } from "../../../app/store/eventsStore";

export default function NewCategoryModal({ open, onClose }) {
  const { categories, addCategory } = useCategories();
  const { getAll, editEvent } = useEvents();

  const [name, setName] = useState("");
  const [color, setColor] = useState("#6c5ce7");
  const [picked, setPicked] = useState(() => new Set());
  const [err, setErr] = useState("");

  // 이벤트 전체를 '날짜 오름차순'으로 간단 정렬해서 체크리스트로 노출
  const allEvents = useMemo(() => {
    const map = getAll?.() || {};
    const list = [];
    Object.keys(map)
      .map((d) => Number(d))
      .sort((a, b) => a - b)
      .forEach((day) => {
        (map[day] || []).forEach((ev) => {
          list.push({ day, id: ev.id, title: ev.title, category: ev.category });
        });
      });
    return list;
  }, [getAll]);

  // 중복/형식 검증
  const validate = () => {
    const t = (name || "").trim();
    if (!t) return "카테고리명을 입력하세요.";
    if (t.length > 20) return "카테고리명은 20자 이내로 입력하세요.";
    const exists = (categories || []).some(
      (c) => String(c?.name || "").trim().toLowerCase() === t.toLowerCase()
    );
    if (exists) return "이미 존재하는 카테고리입니다.";
    return "";
  };

  const togglePick = (key) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleCreate = () => {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr("");

    // 1) 카테고리 생성(스토어는 color가 없던 호출과의 호환 유지됨)
    const created = addCategory(name.trim(), color);

    // 2) 선택된 이벤트 카테고리 일괄 변경
    if (picked.size > 0 && created?.name) {
      allEvents.forEach((ev) => {
        const key = `${ev.day}:${ev.id}`;
        if (picked.has(key)) {
          // 같은 날짜로 이동 + category만 갱신
          editEvent(ev.day, ev.day, {
            ...ev,
            category: created.name,
          });
        }
      });
    }

    // 닫고 초기화
    setName("");
    setColor("#6c5ce7");
    setPicked(new Set());
    onClose?.();
  };

  const footer = (
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
        onClick={handleCreate}
        style={{
          border: "none",
          background: "#000",
          color: "#fff",
          borderRadius: 6,
          padding: "6px 12px",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        생성
      </button>
    </>
  );

  return (
    <Modal open={open} onClose={onClose} title="새 카테고리" footer={footer}>
      <div style={{ display: "grid", gap: 12 }}>
        {/* 이름 */}
        <Field label="이름" hint="20자 이내, 기존 이름과 중복 불가">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 공부, 취미, 모임 등"
            style={input(!!err)}
          />
          {err ? <div style={{ color: "#e03131", fontSize: 12, marginTop: 6 }}>{err}</div> : null}
        </Field>

        {/* 색상 */}
        <Field label="카테고리 색상">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: 36,
                height: 28,
                padding: 0,
                border: "1px solid #ddd",
                borderRadius: 6,
                background: "#fff",
                cursor: "pointer",
              }}
              aria-label="카테고리 색상"
              title="카테고리 색상"
            />
            <code style={{ fontSize: 12, color: "#555" }}>{color}</code>
          </div>
        </Field>

        {/* 즉시 배정(선택) */}
        <Field label="일정 배정" hint="새 카테고리에 즉시 포함할 일정을 선택(선택사항)">
          {allEvents.length === 0 ? (
            <div style={{ color: "#888", fontSize: 13 }}>등록된 일정이 없습니다.</div>
          ) : (
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                maxHeight: 160,
                overflowY: "auto",
                padding: 8,
                display: "grid",
                gap: 6,
                background: "#fafafa",
              }}
            >
              {allEvents.map((ev) => {
                const key = `${ev.day}:${ev.id}`;
                const checked = picked.has(key);
                return (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePick(key)}
                    />
                    <span style={{ color: "#666", minWidth: 40 }}>{String(ev.day).padStart(2, "0")}일</span>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ev.title}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#777",
                        border: "1px solid #ddd",
                        borderRadius: 999,
                        padding: "2px 6px",
                        background: "#fff",
                      }}
                    >
                      {ev.category || "미분류"}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontWeight: 600, color: "#333" }}>
        {label}{" "}
        {hint ? <span style={{ fontWeight: 400, fontSize: 12, color: "#888" }}>· {hint}</span> : null}
      </div>
      {children}
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
