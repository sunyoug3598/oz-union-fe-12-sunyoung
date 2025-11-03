import { create } from "zustand";

// 초기 목업 (1~30일 달)
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

const LS_KEY = "solan.events.v1";

const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : initialEvents;
  } catch {
    return initialEvents;
  }
};

const saveToLS = (events) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(events));
  } catch {}
};

export const useEvents = create((set, get) => ({
  events: loadFromLS(),

  // 전체 / 특정일
  getAll: () => get().events,
  getByDay: (day) => get().events[day] || [],

  // 추가
  addEvent: (day, event) =>
    set((state) => {
      const next = {
        ...state.events,
        [day]: [...(state.events[day] || []), event],
      };
      saveToLS(next);
      return { events: next };
    }),

  // 삭제
  deleteEvent: (day, eventId) =>
    set((state) => {
      const next = {
        ...state.events,
        [day]: (state.events[day] || []).filter((ev) => ev.id !== eventId),
      };
      saveToLS(next);
      return { events: next };
    }),

  // 수정(날짜 이동 포함)
  editEvent: (fromDay, toDay, updatedEvent) =>
    set((state) => {
      const next = { ...state.events };
      next[fromDay] = (next[fromDay] || []).filter((ev) => ev.id !== updatedEvent.id);
      next[toDay] = [...(next[toDay] || []), updatedEvent];
      saveToLS(next);
      return { events: next };
    }),

  // 업커밍: 다음 N일 (1~30 경계 클램프)
  getUpcoming: (rangeDays = 7) => {
    const all = get().events;
    const today = Math.min(30, Math.max(1, new Date().getDate()));
    const end = Math.min(30, today + rangeDays);
    const list = [];
    for (let d = today; d <= end; d++) {
      (all[d] || []).forEach((ev) => list.push({ ...ev, day: d }));
    }
    return list.sort((a, b) => a.day - b.day);
  },
}));
