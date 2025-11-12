import React, { createContext, useContext, useMemo, useState } from "react";

/** 이벤트 모델
 * {
 *   id: string,
 *   date: string,        // 'YYYY-MM-DD'
 *   title: string,
 *   timeLabel?: string,  // '14:00' 등
 *   category?: string,   // '업무' 등
 *   icon: '●'|'✕'|'→'|'－'|'○'|'★',
 *   repeat?: 'daily'|'weekly'|'monthly'|null
 * }
 */

const EventsCtx = createContext(null);

const seed = [
  { id: "e-3a",  date: "2025-11-03", title: "팀 회의",       timeLabel: "14:00", category: "업무", icon: "●", repeat: "weekly" },
  { id: "e-5a",  date: "2025-11-05", title: "카드 결제일",   timeLabel: "하루 종일", category: "금융", icon: "★", repeat: "monthly" },
  { id: "e-12a", date: "2025-11-12", title: "병원 예약",     timeLabel: "09:30", category: "건강", icon: "－", repeat: null },
  { id: "e-14a", date: "2025-11-14", title: "친구 약속",     timeLabel: "19:00", category: "개인", icon: "○", repeat: null },
  { id: "e-14b", date: "2025-11-14", title: "헬스장",       timeLabel: "21:00", category: "건강", icon: "●", repeat: "weekly" },
  { id: "e-21a", date: "2025-11-21", title: "제출 마감",     timeLabel: "23:59", category: "업무", icon: "●", repeat: null },
  { id: "e-29a", date: "2025-11-29", title: "월간 회고",     timeLabel: "20:00", category: "개인", icon: "○", repeat: "monthly" },
];

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(seed);

  const addEvent = (ev) => setEvents((prev) => [...prev, { ...ev, id: ev.id ?? String(Date.now()) }]);

  const updateEvent = (id, patch) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const removeEvent = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const cycleIcon = (id) => {
    const order = ["●", "✕", "→", "－", "○", "★"];
    setEvents((prev) =>
      prev.map((e) =>
        e.id !== id
          ? e
          : { ...e, icon: order[(order.indexOf(e.icon ?? "●") + 1) % order.length] }
      )
    );
  };

  // 헬퍼: 특정 'YYYY-MM'과 day로 조회
  const listByDay = (yyyyMM, day) => {
    const prefix = `${yyyyMM}-`;
    const dd = String(day).padStart(2, "0");
    return events.filter((e) => e.date.startsWith(prefix) && e.date.endsWith(dd));
  };

  // 업커밍: 설정된 범위(days) 안의 일정 반환
  // 규칙: daily/weekly는 제외, monthly만 포함(요구사항)
  const upcomingWithin = (days) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + days);

    const inRange = (d) => {
      const x = new Date(d);
      return x >= stripTime(now) && x <= stripTime(end);
    };

    // monthly만 포함, 나머지는 제외
    const base = events.filter((e) => (e.repeat === "monthly" || !e.repeat));

    // monthly는 원본 date 기준으로 이번/다음 달 발생일을 단순 계산
    const expanded = base.flatMap((e) => {
      if (e.repeat !== "monthly") return [e];
      const d = new Date(e.date);
      const cand = [];
      // 이번 달 / 다음 달 두 번만 체크 (간단화)
      for (let k = 0; k < 2; k++) {
        const copy = new Date(d);
        copy.setMonth(now.getMonth() + k);
        const occur = `${copy.getFullYear()}-${String(copy.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        cand.push({ ...e, date: occur, id: `${e.id}-m${k}` });
      }
      return cand;
    });

    return expanded
      .filter((e) => inRange(e.date))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const value = useMemo(
    () => ({ events, addEvent, updateEvent, removeEvent, cycleIcon, listByDay, upcomingWithin }),
    [events]
  );

  return <EventsCtx.Provider value={value}>{children}</EventsCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEvents = () => {
  const ctx = useContext(EventsCtx);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
};

function stripTime(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
