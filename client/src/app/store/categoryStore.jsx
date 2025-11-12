import { createContext, useContext, useMemo, useState } from "react";

const CategoryCtx = createContext();
const LS_KEY = "solan.categories.v1";

// 기본 카테고리(색상 포함) + '미분류' 분리
const defaultCategories = [
  { id: 1, name: "개인",   color: "#2f8fcb" },
  { id: 2, name: "업무",   color: "#444444" },
  { id: 3, name: "건강",   color: "#16a34a" },
  { id: 4, name: "금융",   color: "#e3b400" },
  { id: 5, name: "기타",   color: "#7a7a7a" },
  { id: 6, name: "미분류", color: "#adb5bd" }, // ← 별도 취급
];

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const base = raw ? JSON.parse(raw) : defaultCategories;
    // '미분류'가 없었던 오래된 저장값 보정
    const hasUncategorized = (base || []).some((c) => c.name === "미분류");
    return hasUncategorized ? base : [...base, { id: Date.now(), name: "미분류", color: "#adb5bd" }];
  } catch {
    return defaultCategories;
  }
}

function saveToLS(cats) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cats));
  } catch (error){
    console.error(error)
  }
}

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(loadFromLS());
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const q = (keyword || "").trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [categories, keyword]);

  const addCategory = (name, color = "#7a7a7a") => {
    const id = Date.now();
    const item = { id, name, color };
    const next = [...categories, item];
    setCategories(next);
    saveToLS(next);
    return item;
  };

  const removeCategory = (id) => {
    // '미분류'는 삭제 금지
    const target = categories.find((c) => c.id === id);
    if (target?.name === "미분류") return;
    const next = categories.filter((c) => c.id !== id);
    setCategories(next);
    saveToLS(next);
  };

  const renameCategory = (id, nextName) => {
    const target = categories.find((c) => c.id === id);
    if (target?.name === "미분류") return; // 예약어 보호
    const next = categories.map((c) => (c.id === id ? { ...c, name: nextName } : c));
    setCategories(next);
    saveToLS(next);
  };

  const recolorCategory = (id, nextColor) => {
    const next = categories.map((c) => (c.id === id ? { ...c, color: nextColor } : c));
    setCategories(next);
    saveToLS(next);
  };

  const value = {
    categories,
    filtered,
    keyword,
    setKeyword,
    addCategory,
    removeCategory,
    renameCategory,
    recolorCategory,
  };

  return <CategoryCtx.Provider value={value}>{children}</CategoryCtx.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryCtx);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
}
