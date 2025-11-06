import { useMemo, useState } from "react";
import { useNotes } from "../../../app/store/notesStore";

export default function NotesPage() {
  const notes = useNotes((s) => s.notes);
  const addNote = useNotes((s) => s.addNote);
  const updateNote = useNotes((s) => s.updateNote);
  const deleteNote = useNotes((s) => s.deleteNote);
  const togglePin = useNotes((s) => s.togglePin);

  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsText, setTagsText] = useState("");

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const inTitle = (n.title || "").toLowerCase().includes(q);
      const inBody = (n.body || "").toLowerCase().includes(q);
      const inTags = (n.tags || []).some((t) => (t || "").toLowerCase().includes(q));
      return inTitle || inBody || inTags;
    });
  }, [notes, keyword]);

  const onCreate = () => {
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!title.trim() && !body.trim()) {
      alert("제목 또는 내용을 입력하세요.");
      return;
    }
    addNote({ title, body, tags });
    setTitle("");
    setBody("");
    setTagsText("");
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>메모</h1>

      {/* 검색/추가 */}
      <section
        style={{
          display: "grid",
          gap: 12,
          border: "1px solid #eee",
          borderRadius: 10,
          padding: "12px 14px",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색(제목/내용/태그)"
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 (선택)"
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="내용 (필수)"
            rows={4}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", resize: "vertical" }}
          />
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="태그(콤마로 구분: 예) 공부,일정)"
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px" }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={onCreate}
              style={{
                border: "none",
                background: "#000",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + 새 메모
            </button>
          </div>
        </div>
      </section>

      {/* 목록 */}
      <section style={{ display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ color: "#777" }}>메모가 없습니다.</div>
        ) : (
          filtered
            .slice()
            .sort((a, b) => {
              // 핀 먼저, 그 다음 최근 업데이트
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return b.updatedAt - a.updatedAt;
            })
            .map((n) => (
              <article
                key={n.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: "12px 14px",
                  background: "#fff",
                }}
              >
                <header
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  {n.pinned ? <span title="고정">📌</span> : null}
                  <strong style={{ fontSize: 14 }}>{n.title || "(제목 없음)"}</strong>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#888" }}>
                    {new Date(n.updatedAt).toLocaleString()}
                  </span>
                </header>
                <div style={{ color: "#333", fontSize: 13, whiteSpace: "pre-wrap" }}>{n.body}</div>
                {n.tags?.length ? (
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {n.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 11,
                          background: "#f1f3f5",
                          color: "#495057",
                          borderRadius: 999,
                          padding: "2px 8px",
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => togglePin(n.id)}
                    style={{
                      border: "1px solid #ddd",
                      background: "#fff",
                      borderRadius: 6,
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {n.pinned ? "고정 해제" : "고정"}
                  </button>
                  <button
                    onClick={() => {
                      const nextTitle = prompt("제목 수정", n.title || "");
                      if (nextTitle == null) return;
                      const nextBody = prompt("내용 수정", n.body || "");
                      if (nextBody == null) return;
                      updateNote(n.id, { title: nextTitle, body: nextBody });
                    }}
                    style={{
                      border: "1px solid #ddd",
                      background: "#fff",
                      borderRadius: 6,
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("이 메모를 삭제할까요?")) deleteNote(n.id);
                    }}
                    style={{
                      border: "none",
                      background: "#e03131",
                      color: "#fff",
                      borderRadius: 6,
                      padding: "6px 10px",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </div>
              </article>
            ))
        )}
      </section>
    </div>
  );
}
