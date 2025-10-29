import { useEffect, useRef, useState } from "react";

export default function NotesManager({
  mode = "cards",
  pinned = [],
  items = [],
  onCreate,
  onOpen,
  onSearch,
  onTogglePin,
}) {
  // 검색 입력 상태 (로컬 UI 상태)
  const [keyword, setKeyword] = useState("");
  const debounceRef = useRef(null);

  // 검색어 변경 시 300ms 후 onSearch 호출
  useEffect(() => {
    if (!onSearch) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onSearch(keyword);
    }, 300);
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [keyword, onSearch]);

  // pinned 상단 5개까지만
  const displayedPinned = pinned.slice(0, 5);

  return (
    <section
      style={{
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: 16,
        maxWidth: "800px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
      }}
    >
      {/* 상단 헤더 바 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 18 }}>메모</div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              fontSize: 14,
              border: "1px solid #aaa",
              background: "white",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
            }}
            onClick={onCreate}
          >
            새 메모
          </button>
        </div>
      </div>

      {/* 검색창 */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="메모 검색..."
          style={{
            width: "100%",
            fontSize: 14,
            padding: "8px 10px",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
      </div>

      {/* 고정 메모 섹션 */}
      {displayedPinned.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>고정된 메모</span>
            <span
              style={{
                backgroundColor: "#ffc107",
                color: "#000",
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 4px",
                borderRadius: 4,
                lineHeight: 1.2,
              }}
            >
              핀
            </span>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {displayedPinned.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                onOpen={onOpen}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        </div>
      )}

      {/* 일반 메모 리스트 / 카드 */}
      {mode === "cards" ? (
        <CardGrid
          items={items}
          onOpen={onOpen}
          onTogglePin={onTogglePin}
        />
      ) : (
        <ListView
          items={items}
          onOpen={onOpen}
          onTogglePin={onTogglePin}
        />
      )}
    </section>
  );
}

/* 개별 노트 한 줄 (리스트 스타일 / 고정 메모 영역) */
function NoteRow({ note, onOpen, onTogglePin }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 4,
        padding: "8px 10px",
        fontSize: 14,
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#fafafa",
      }}
      onClick={() => onOpen && onOpen(note.id)}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {note.title && (
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {note.title}
          </div>
        )}
        <div
          style={{
            color: "#555",
            fontSize: 13,
            whiteSpace: "pre-line",
            lineHeight: 1.4,
          }}
        >
          {note.body}
        </div>
      </div>

      <button
        style={{
          marginLeft: 8,
          border: "1px solid #aaa",
          background: "white",
          borderRadius: 4,
          padding: "2px 6px",
          fontSize: 12,
          cursor: "pointer",
          lineHeight: 1.2,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin && onTogglePin(note.id);
        }}
      >
        핀 해제
      </button>
    </div>
  );
}

/* 카드 뷰 (2열 그리드) */
function CardGrid({ items, onOpen, onTogglePin }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(2, minmax(0,1fr))",
      }}
    >
      {items.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: "10px 12px",
            fontSize: 14,
            cursor: "pointer",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            minHeight: 80,
          }}
          onClick={() => onOpen && onOpen(note.id)}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {note.title || "제목 없음"}
            </div>
            <button
              style={{
                border: "1px solid #aaa",
                background: "white",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 12,
                cursor: "pointer",
                lineHeight: 1.2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin && onTogglePin(note.id);
              }}
            >
              핀
            </button>
          </div>

          <div
            style={{
              color: "#555",
              fontSize: 13,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {note.body}
          </div>

          {Array.isArray(note.tags) && note.tags.length > 0 && (
            <div style={{ marginTop: "auto", fontSize: 12, color: "#888" }}>
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#f2f2f2",
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    padding: "2px 6px",
                    marginRight: 4,
                    marginTop: 4,
                    lineHeight: 1.2,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* 리스트 뷰 (세로 나열) */
function ListView({ items, onOpen, onTogglePin }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((note) => (
        <div
          key={note.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: "8px 10px",
            fontSize: 14,
            cursor: "pointer",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
          onClick={() => onOpen && onOpen(note.id)}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {note.title || "제목 없음"}
            </div>
            <div
              style={{
                color: "#555",
                fontSize: 13,
                lineHeight: 1.4,
                maxHeight: "3.6em",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {note.body}
            </div>

            {Array.isArray(note.tags) && note.tags.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-block",
                      backgroundColor: "#f2f2f2",
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      padding: "2px 6px",
                      marginRight: 4,
                      marginTop: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            style={{
              marginLeft: 8,
              border: "1px solid #aaa",
              background: "white",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 12,
              cursor: "pointer",
              lineHeight: 1.2,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin && onTogglePin(note.id);
            }}
          >
            핀
          </button>
        </div>
      ))}
    </div>
  );
}
