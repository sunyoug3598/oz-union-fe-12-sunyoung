import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

// 데모: 30일 달 + 초기 목업 데이터
const initialEvents = {
  3:  [{ id: "e-3a",  icon: "●", title: "팀 회의",   timeLabel: "14:00",  category: "업무", repeat: "weekly" }],
  5:  [{ id: "e-5a",  icon: "★", title: "카드 결제일", timeLabel: "하루 종일", category: "금융", repeat: "monthly" }],
  12: [{ id: "e-12a", icon: "－", title: "병원 예약", timeLabel: "09:30",  category: "건강", repeat: null }],
  14: [
        { id: "e-14a", icon: "○", title: "친구 약속", timeLabel: "19:00", category: "개인",  repeat: null },
        { id: "e-14b", icon: "●", title: "헬스장",   timeLabel: "21:00", category: "건강", repeat: "weekly" },
      ],
  21: [{ id: "e-21a", icon: "●", title: "제출 마감", timeLabel: "23:59", category: "업무", repeat: null }],
  29: [{ id: "e-29a", icon: "○", title: "월간 회고", timeLabel: "20:00", category: "개인", repeat: "monthly" }],
};

const EventsCtx = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(initialEvents); // { [day]: Array<Event> }
  const [monthLabel] = useState("2025년 11월");        // 데모용 라벨

  // 오늘 날짜(데모): 실제 오늘 날짜 기준으로 1~30 사이 clamp
  const today = useMemo(() => {
    const d = new Date().getDate();
    return Math.min(30, Math.max(1, d));
  }, []);

  const addEvent = useCallback((dayNum, data) => {
    const id = data.id || String(Date.now());
    setEvents(prev => {
      const next = { ...prev };
      next[dayNum] = [...(next[dayNum] || []), { ...data, id }];
      return next;
    });
    return id;
  }, []);

  const editEvent = useCallback((fromDay, toDay, data) => {
    setEvents(prev => {
      const next = { ...prev };
      next[fromDay] = (next[fromDay] || []).filter(e => e.id !== data.id);
      next[toDay] = [...(next[toDay] || []), { ...data }];
      return next;
    });
  }, []);

  const deleteEvent = useCallback((dayNum, id) => {
    setEvents(prev => {
      const next = { ...prev };
      next[dayNum] = (next[dayNum] || []).filter(e => e.id !== id);
      return next;
    });
  }, []);

  // 업커밍: 다음 N일 (기본 3일), 완료(✕) 제외, 데일리/위클리 제외, 월간/단발만
  const getUpcoming = useCallback((rangeDays = 3) => {
    const end = today + rangeDays;
    const items = [];
    for (let d = today; d <= Math.min(30, end); d++) {
      (events[d] || []).forEach(ev => {
        const isDone = ev.icon === "✕";
        const isDailyWeekly = ev.repeat === "daily" || ev.repeat === "weekly";
        if (!isDone && !isDailyWeekly) {
          items.push({ ...ev, day: d });
        }
      });
    }
    // day → timeLabel 등의 보조 정렬
    return items.sort((a, b) => a.day - b.day);
  }, [events, today]);

  const value = {
    monthLabel,
    today,
    events,
    addEvent,
    editEvent,
    deleteEvent,
    getUpcoming,
  };

  return <EventsCtx.Provider value={value}>{children}</EventsCtx.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsCtx);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
