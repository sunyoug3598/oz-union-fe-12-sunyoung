import { useState, useMemo } from "react";
import { useCategories } from "../../../app/store/categoryStore";

export default function CategoryManager() {
  const {
    categories,
    keyword,
    setKeyword,
    addCategory,
    renameCategory,
    setColor,
    removeCategory,
  } = useCategories();

  // 새 카테고리 입력
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#8b8b8b");

  // 인라인 편집 상태
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 검색 결과
  const list = useMemo(() => {
    const q = (keyword || "").trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, keyword]);

  const onCreate = () => {
    if (!newName.trim()) return;
    addCategory(newName, newColor);
    setNewName("");
    setNewColor("#8b8b8b");
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditingName(c.name);
  };

  const saveEdit = (id) => {
    if (!editingName.trim()) return;
    renameCategory(id, editingName);
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* 상단: 검색 + 새 카테고리 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="카테고리 검색"
          style={{
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #eee",
            borderRadius: 8,
            padding: "8px 10px",
            background: "#fafafa",
          }}
        >
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            aria-label="새 카테고리 색"
            style={{ width: 28, height: 28, border: "none", background: "transparent" }}
          />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="새 카테고리 이름"
            style={{
              width: 180,
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "8px 10px",
            }}
          />
          <button
            onClick={onCreate}
            style={{
              border: "none",
              background: "#000",
              color: "#fff",
              borderRadius: 6,
              padding: "8px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + 추가
          </button>
        </div>
      </div>

      {/* 목록 */}
      <section
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 12,
          display: "grid",
          gap: 8,
          background: "#fff",
        }}
      >
        {list.length === 0 ? (
          <div style={{ color: "#777", padding: "8px 4px" }}>
            해당하는 카테고리가 없습니다.
          </div>
        ) : (
          list.map((c) => (
            <article
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: 10,
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "10px 12px",
                background: "#fafafa",
              }}
            >
              {/* 색상 선택 */}
              <input
                type="color"
                value={c.color}
                onChange={(e) => setColor(c.id, e.target.value)}
                aria-label={`${c.name} 색상`}
                style={{ width: 28, height: 28, border: "none", background: "transparent" }}
              />

              {/* 이름(보기/편집) */}
              <div>
                {editingId === c.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      padding: "6px 8px",
                      width: 220,
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: 700, color: "#222" }}>{c.name}</span>
                )}
              </div>

              {/* 액션 버튼들 */}
              <div style={{ display: "flex", gap: 6 }}>
                {editingId === c.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(c.id)}
                      style={btnPrimary}
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      style={btnGhost}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(c)} style={btnGhost}>
                      이름 변경
                    </button>
                    <button
                      onClick={() => removeCategory(c.id)}
                      style={btnDanger}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

const btnGhost = {
  border: "1px solid #ccc",
  background: "#fff",
  color: "#333",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
};

const btnPrimary = {
  border: "none",
  background: "#000",
  color: "#fff",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 700,
};

const btnDanger = {
  border: "1px solid #f03e3e",
  background: "#fff5f5",
  color: "#e03131",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
};
