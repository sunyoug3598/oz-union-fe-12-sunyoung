import { create } from "zustand";

const LS_KEY = "solan.notes.v1";

const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveToLS = (notes) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  } catch {}
};

// Note: { id, title, body, tags: string[], pinned: boolean, updatedAt: number }
export const useNotes = create((set, get) => ({
  notes: loadFromLS(),

  // 목록
  list: () => get().notes,

  // 고정 메모 상단 N개
  getPinned: (limit = 5) => {
    const arr = [...get().notes].filter(n => n.pinned);
    arr.sort((a, b) => b.updatedAt - a.updatedAt);
    return arr.slice(0, limit);
  },

  // 최신순 N개
  getRecent: (limit = 5) => {
    const arr = [...get().notes];
    arr.sort((a, b) => b.updatedAt - a.updatedAt);
    return arr.slice(0, limit);
  },

  // 검색(제목/본문/태그 부분 일치)
  search: (keyword) => {
    const q = (keyword || "").trim().toLowerCase();
    if (!q) return get().notes;
    return get().notes.filter(n => {
      const inTitle = (n.title || "").toLowerCase().includes(q);
      const inBody = (n.body || "").toLowerCase().includes(q);
      const inTags = (n.tags || []).some(t => (t || "").toLowerCase().includes(q));
      return inTitle || inBody || inTags;
    });
  },

  // 생성
  addNote: ({ title = "", body = "", tags = [] }) =>
    set((state) => {
      const now = Date.now();
      const note = {
        id: "note-" + now,
        title: title.trim(),
        body: body.trim(),
        tags: (tags || []).map(t => String(t).trim()).filter(Boolean),
        pinned: false,
        updatedAt: now,
      };
      const next = [note, ...state.notes];
      saveToLS(next);
      return { notes: next };
    }),

  // 수정
  updateNote: (id, patch) =>
    set((state) => {
      const next = state.notes.map(n =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n
      );
      saveToLS(next);
      return { notes: next };
    }),

  // 삭제
  deleteNote: (id) =>
    set((state) => {
      const next = state.notes.filter(n => n.id !== id);
      saveToLS(next);
      return { notes: next };
    }),

  // 핀 토글 (최대 5개 제한 로직 포함)
  togglePin: (id) =>
    set((state) => {
      const pinnedCount = state.notes.filter(n => n.pinned).length;
      const next = state.notes.map(n => {
        if (n.id !== id) return n;
        const willPin = !n.pinned;
        if (willPin && pinnedCount >= 5) {
          alert("고정 메모는 최대 5개까지만 가능합니다.");
          return n;
        }
        return { ...n, pinned: willPin, updatedAt: Date.now() };
      });
      saveToLS(next);
      return { notes: next };
    }),
}));
