import { create } from "zustand";

// 초기 카테고리 (필요시 더 추가/삭제 가능)
const INIT = ["개인", "업무", "건강", "금융", "기타"];

export const useCategories = create((set, get) => ({
  categories: INIT,

  // 카테고리 추가 (중복 방지)
  addCategory: (name) => {
    const n = (name || "").trim();
    if (!n) return;
    const cur = get().categories;
    if (cur.includes(n)) return;
    set({ categories: [...cur, n] });
  },

  // (옵션) 카테고리 이름 변경
  renameCategory: (oldName, newName) => {
    const n = (newName || "").trim();
    if (!oldName || !n) return;
    set((state) => ({
      categories: state.categories.map((c) => (c === oldName ? n : c)),
    }));
  },

  // (옵션) 카테고리 삭제
  removeCategory: (name) =>
    set((state) => ({
      categories: state.categories.filter((c) => c !== name),
    })),
}));
