import { useMemo, useState } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import ScheduleDetailModal from "../../schedule/components/ScheduleDetailModal";
import CategoryBadge from "../../schedule/components/CategoryBadge";
import { getIconColor } from "../../../app/constants/uiTokens";

export default function UpcomingWidget() {
  const { getUpcoming, deleteEvent } = useEvents();
  const [detail, setDetail] = useState(null);

  const items = useMemo(() => getUpcoming(7), [getUpcoming]);

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="flex items-center justify-between">
        <strong className="text-[15px]">Upcoming</strong>
        <span className="text-xs text-gray-500">다음 7일</span>
      </header>

      <div className="h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3">
        {items.length === 0 ? (
          <div className="px-2 py-3 text-sm text-gray-500">예정된 일정이 없습니다.</div>
        ) : (
          <div className="grid gap-2.5">
            {items.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setDetail(ev)}
                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-left hover:bg-gray-50"
              >
                {/* 상단: 날짜/카테고리 */}
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-xs text-gray-600">{formatDayLabel(ev.day)}</div>
                  <CategoryBadge name={ev.category} asLink />
                </div>

                {/* 제목 줄 */}
                <div className="flex items-center gap-2">
                  <span
                    style={{ color: getIconColor(ev.icon) }}
                    className={ev.icon === "★" ? "font-bold" : ""}
                  >
                    {ev.icon}
                  </span>
                  <div className="font-semibold">{ev.title}</div>
                  {ev.repeat === "monthly" && <span className="ml-auto">🔁</span>}
                </div>

                {/* 보조 정보 */}
                <div className="mt-1 text-xs text-gray-600">
                  {ev.timeLabel || "시간 미정"}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <ScheduleDetailModal
        open={!!detail}
        event={detail}
        onClose={() => setDetail(null)}
        onEdit={() => {
          alert("편집은 캘린더에서 먼저 연결하자! (다음 단계)");
        }}
        onDelete={(ev) => {
          deleteEvent(ev.day, ev.id);
          setDetail(null);
        }}
      />
    </div>
  );
}

function formatDayLabel(day) {
  const today = Math.min(30, Math.max(1, new Date().getDate()));
  if (day === today) return "오늘";
  if (day === today + 1) return "내일";
  return `정해진 날 ${String(day).padStart(2, "0")}`;
}
