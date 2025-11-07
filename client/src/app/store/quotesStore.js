import { create } from "zustand";

const LS_KEY = "solan.quotes.v1";

const defaultQuotes = [
  "기록은 기억을 이깁니다.",
  "조금 늦어도 괜찮아요. 꾸준하면 돼요.",
  "오늘의 할 일은 나를 지치게 하지 않아요.",
  "나만의 일정관리 SOLAN을 사용해보세요.",
];

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { quotes: defaultQuotes, mode: "sequential" };
    const parsed = JSON.parse(raw);
    return {
      quotes: Array.isArray(parsed.quotes) && parsed.quotes.length ? parsed.quotes : defaultQuotes,
      mode: parsed.mode === "random" ? "random" : "sequential",
    };
  } catch {
    return { quotes: defaultQuotes, mode: "sequential" };
  }
}

function save(s) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ quotes: s.quotes, mode: s.mode }));
  } catch {}
}

export const useQuotes = create((set) => ({
  ...load(),
  addQuote: (text) =>
    set((s) => {
      const t = (text || "").trim();
      if (!t) return s;
      const next = { ...s, quotes: [...s.quotes, t] };
      save(next);
      return next;
    }),
  updateQuote: (idx, text) =>
    set((s) => {
      const list = s.quotes.slice();
      list[idx] = (text || "").trim();
      const next = { ...s, quotes: list };
      save(next);
      return next;
    }),
  removeQuote: (idx) =>
    set((s) => {
      const list = s.quotes.slice();
      list.splice(idx, 1);
      const next = { ...s, quotes: list.length ? list : defaultQuotes };
      save(next);
      return next;
    }),
  moveQuote: (from, to) =>
    set((s) => {
      const list = s.quotes.slice();
      const [it] = list.splice(from, 1);
      list.splice(to, 0, it);
      const next = { ...s, quotes: list };
      save(next);
      return next;
    }),
  setMode: (m) =>
    set((s) => {
      const next = { ...s, mode: m === "random" ? "random" : "sequential" };
      save(next);
      return next;
    }),
}));
