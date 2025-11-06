import { useState } from "react";
import { getIconChar, getIconColor } from "../../../app/constants/uiTokens";
import { useRoutines } from "../../../app/store/routineStore";
import RoutineEditModal from "./RoutineEditModal";

export default function RoutineWidget() {
  const [tab, setTab] = useState("daily"); // daily | weekly | monthly
  const getByFreq = useRoutines((s) => s.getByFreq);
  const addRoutine = useRoutines((s) => s.addRoutine);
  const updateRoutine = useRoutines((s) => s.updateRoutine);
  const removeRoutine = useRoutines((s) => s.removeRoutine);

  const data = getByFreq(tab);

  // 모달 상태
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState(null);

  const openCreate = () => {
    setInitial({ freq: tab, icon: "•", title: "" });
    setOpen(true);
  };

  const openEdit = (item) => {
    setInitial(item);
    setOpen(true);
  };

  const handleSubmit = (payload) => {
    if (payload.id) {
      updateRoutine(payload.id, payload);
    } else {
      addRoutine(payload);
    }
    setOpen(false);
    setInitial(null);
  };

  return (
    <div className="flex h-full flex-col gap-3">
      {/* 헤더 */}
      <header className="flex items-center justify-between">
        <strong className="text-[15px]">루틴 일정</strong>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <TabButton active={tab === "daily"} onClick={() => setTab("daily")}>
              Daily
            </TabButton>
            <TabButton active={tab === "weekly"} onClick={() => setTab("weekly")}>
              Weekly
            </TabButton>
            <TabButton active={tab === "monthly"} onClick={() => setTab("monthly")}>
              Monthly
            </TabButton>
          </div>
          <button
            onClick={openCreate}
            className="rounded-md bg-black px-2.5 py-1 text-xs font-semibold text-white"
            title="루틴 추가"
          >
            + 추가
          </button>
        </div>
      </header>

      {/* 리스트 카드 */}
      <div className="flex min-h-[240px] flex-1 flex-col rounded-xl border border-gray-200 bg-white p-3 text-sm">
        {data.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            등록된 루틴이 없습니다.
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {data.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="inline-block text-[14px] leading-none align-middle"
                    style={{
                      color: getIconColor(getIconChar(r.icon)),
                      fontWeight: getIconChar(r.icon) === "★" ? 700 : 400,
                    }}
                    aria-hidden
                  >
                    {getIconChar(r.icon)}
                  </span>
                  <span className="truncate">{r.title}</span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700"
                  >
                    편집
                  </button>
                  <button
                    onClick={() => removeRoutine(r.id)}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 추가/수정 모달 */}
      <RoutineEditModal
        open={open}
        onClose={() => {
          setOpen(false);
          setInitial(null);
        }}
        initial={initial?.id ? initial : initial ? { ...initial, id: undefined } : null}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className="rounded-md bg-black px-2.5 py-1 text-xs font-semibold text-white"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600"
    >
      {children}
    </button>
  );
}
