import { create } from "zustand";

const LS_KEY = "solan.settings.v1";

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const defaults = {
  upcomingRangeDays: 7,   // 3 | 7 | 30
  memoWidgetView: "cards",// "cards" | "list" (예비)
  showCompleted: false,   // 완료 일정 보이기 여부(전역)
  keepLocalOnLogout: true,// 로그아웃 시 로컬 유지
  theme: "light",         // "light" | "dark" (예비)
};

const initial = { ...defaults, ...(load() || {}) };

const save = (state) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
};

export const useSettings = create((set, get) => ({
  ...initial,

  setUpcomingRangeDays: (days) =>
    set((s) => {
      const next = { ...s, upcomingRangeDays: days };
      save(next);
      return next;
    }),

  setMemoWidgetView: (view) =>
    set((s) => {
      const next = { ...s, memoWidgetView: view };
      save(next);
      return next;
    }),

  setShowCompleted: (v) =>
    set((s) => {
      const next = { ...s, showCompleted: !!v };
      save(next);
      return next;
    }),

  setKeepLocalOnLogout: (v) =>
    set((s) => {
      const next = { ...s, keepLocalOnLogout: !!v };
      save(next);
      return next;
    }),

  setTheme: (t) =>
    set((s) => {
      const next = { ...s, theme: t };
      save(next);
      return next;
    }),
}));
