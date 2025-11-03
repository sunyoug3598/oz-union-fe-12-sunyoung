import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { CATEGORY_COLORS } from "../constants/uiTokens";

// 초기 카테고리
const DEFAULT_CATEGORIES = [
  { id: "cat-personal", name: "개인", color: CATEGORY_COLORS?.개인 ?? "#51cf66" },
  { id: "cat-work",     name: "업무", color: CATEGORY_COLORS?.업무 ?? "#339af0" },
  { id: "cat-health",   name: "건강", color: CATEGORY_COLORS?.건강 ?? "#ff8787" },
  { id: "cat-finance",  name: "금융", color: CATEGORY_COLORS?.금융 ?? "#845ef7" },
  { id: "cat-etc",      name: "기타", color: CATEGORY_COLORS?.기타 ?? "#868e96" },
];

const CategoryCtx = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'list' (향후)

  const addCategory = useCallback((name, color) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    if (categories.some(c => c.name === trimmed)) return; // 중복방지
    const id = `cat-${Date.now()}`;
    setCategories(prev => [...prev, { id, name: trimmed, color }]);
  }, [categories]);

  const renameCategory = useCallback((id, nextName) => {
    const trimmed = (nextName || "").trim();
    if (!trimmed) return;
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, name: trimmed } : c)));
  }, []);

  const removeCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const filtered = useMemo(() => {
    const q = keyword.trim();
    if (!q) return categories;
    return categories.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  }, [categories, keyword]);

  const value = {
    categories,
    filtered,
    keyword, setKeyword,
    viewMode, setViewMode,
    addCategory, renameCategory, removeCategory,
  };

  return <CategoryCtx.Provider value={value}>{children}</CategoryCtx.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryCtx);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
}
