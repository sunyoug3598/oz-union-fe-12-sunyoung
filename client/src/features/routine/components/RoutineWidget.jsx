import { getIconColor } from "../../../app/constants/uiTokens";

export default function RoutineWidget() {
  // 목업 루틴 (아이콘은 상태 아이콘 표준 사용: •=할 일, ○=이벤트, ★=중요 등)
  const daily = [
    { icon: "•", title: "아침 물 500ml 마시기" },
    { icon: "•", title: "10분 스트레칭" },
    { icon: "○", title: "일정 체크 & 오늘 우선순위 정하기" },
  ];

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="flex items-center justify-between">
        <strong className="text-[15px]">루틴 일정</strong>
        <div className="flex gap-1">
          <button className="rounded-md bg-black px-2.5 py-1 text-xs font-semibold text-white">Daily</button>
          <button className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600">Weekly</button>
          <button className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600">Monthly</button>
        </div>
      </header>

      <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3 text-sm">
        <ul className="flex flex-col gap-2">
          {daily.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              {/* ✅ 공통 아이콘 규격: 글리프 기준 색상/두께/크기 통일 */}
              <span
                className="inline-block text-[14px] leading-none align-middle"
                style={{
                  color: getIconColor(r.icon),
                  fontWeight: r.icon === "★" ? 700 : 400,
                }}
              >
                {r.icon || "•"}
              </span>
              <span>{r.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
