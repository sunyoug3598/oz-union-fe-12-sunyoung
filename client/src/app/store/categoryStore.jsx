import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { CATEGORY_COLORS } from "../constants/uiTokens";

const LS_KEY = "solan.categories.v1";

// 기본 카테고리
const DEFAULT_CATEGORIES = [
  { id: "cat-personal", name: "개인",  color: CATEGORY_COLORS?.개인  ?? "#51cf66" },
  { id: "cat-work",     name: "업무",  color: CATEGORY_COLORS?.업무  ?? "#339af0" },
  { id: "cat-health",   name: "건강",  color: CATEGORY_COLORS?.건강  ?? "#ff8787" },
  { id: "cat-finance",  name: "금융",  color: CATEGORY_COLORS?.금융  ?? "#845ef7" },
  { id: "cat-etc",      name: "기타",  color: CATEGORY_COLORS?.기타  ?? "#868e96" },
];

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function saveToLS(categories) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(categories));
  } catch {}
}

const CategoryCtx = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(loadFromLS());
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'list'(예정)

  // ✅ 카테고리 변경 시 자동 저장
  useEffect(() => {
    saveToLS(categories);
  }, [categories]);

  // 새 카테고리 추가
  const addCategory = useCallback((name, color) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name === trimmed)) return; // 중복 방지
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { id, name: trimmed, color: color || "#888888" }]);
  }, [categories]);

  // 이름 변경
  const renameCategory = useCallback((id, nextName) => {
    const trimmed = (nextName || "").trim();
    if (!trimmed) return;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)));
  }, []);

  // 색상 변경
  const setColor = useCallback((id, newColor) => {
    if (!newColor) return;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, color: newColor } : c)));
  }, []);

  // 삭제
  const removeCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // 검색 필터
  const filtered = useMemo(() => {
    const q = keyword.trim();
    if (!q) return categories;
    const lower = q.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(lower));
  }, [categories, keyword]);

  const value = {
    categories,
    filtered,
    keyword, setKeyword,
    viewMode, setViewMode,
    addCategory,
    renameCategory,
    setColor,
    removeCategory,
  };

  return <CategoryCtx.Provider value={value}>{children}</CategoryCtx.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryCtx);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
}
