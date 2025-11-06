import { create } from "zustand";

// LS 키
const LS_KEY = "solan.routines.v1";

// 초기 데모 데이터
const initial = [
  { id: "d1", freq: "daily",   icon: "•", title: "아침 물 500ml 마시기" },
  { id: "d2", freq: "daily",   icon: "•", title: "10분 스트레칭" },
  { id: "d3", freq: "daily",   icon: "○", title: "오늘 우선순위 정하기" },
  { id: "w1", freq: "weekly",  icon: "•", title: "주간 회고(일)" },
  { id: "w2", freq: "weekly",  icon: "○", title: "가족 통화(수)" },
  { id: "w3", freq: "weekly",  icon: "•", title: "집안일 몰아하기(토)" },
  { id: "m1", freq: "monthly", icon: "★", title: "카드 결제 체크(25일)" },
  { id: "m2", freq: "monthly", icon: "•", title: "구독 서비스 점검(말일)" },
  { id: "m3", freq: "monthly", icon: "○", title: "월간 목표 리뷰(말일)" },
];

function loadLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

function saveLS(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
}

export const useRoutines = create((set, get) => ({
  routines: loadLS(),

  getByFreq: (freq) => get().routines.filter((r) => r.freq === freq),

  addRoutine: (data) =>
    set((state) => {
      const id = data.id || String(Date.now());
      const next = [...state.routines, { ...data, id }];
      saveLS(next);
      return { routines: next };
    }),

  updateRoutine: (id, patch) =>
    set((state) => {
      const next = state.routines.map((r) => (r.id === id ? { ...r, ...patch } : r));
      saveLS(next);
      return { routines: next };
    }),

  removeRoutine: (id) =>
    set((state) => {
      const next = state.routines.filter((r) => r.id !== id);
      saveLS(next);
      return { routines: next };
    }),
}));
