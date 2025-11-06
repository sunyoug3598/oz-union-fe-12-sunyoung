import { Link } from "react-router-dom";
import { useNotes } from "../../../app/store/notesStore";

export default function MemoWidget() {
  const getPinned = useNotes((s) => s.getPinned);
  const getRecent = useNotes((s) => s.getRecent);
  const pinned = getPinned(5);
  const recent = getRecent(5);

  // 고정이 있으면 고정만, 없으면 최신 5개
  const items = pinned.length ? pinned : recent;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <header style={{ display: "flex", alignItems: "center" }}>
        <strong style={{ fontSize: 14 }}>메모</strong>
        <Link
          to="/notes"
          style={{ marginLeft: "auto", fontSize: 12, textDecoration: "none", color: "#555" }}
        >
          전체 보기 →
        </Link>
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "grid", gap: 8, maxHeight: 240, overflowY: "auto" }}>
          {items.map((n) => (
            <MemoItem key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        border: "1px dashed #ddd",
        borderRadius: 8,
        padding: "16px 12px",
        color: "#777",
        fontSize: 13,
      }}
    >
      아직 메모가 없습니다.{" "}
      <Link to="/notes" style={{ color: "#333" }}>
        메모 페이지
      </Link>
      에서 새 메모를 작성해 보세요.
    </div>
  );
}

function MemoItem({ note }) {
  return (
    <Link
      to="/notes"
      style={{
        display: "block",
        border: "1px solid #eee",
        borderRadius: 8,
        padding: "10px 12px",
        textDecoration: "none",
        background: "#fafafa",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {note.pinned ? <span title="고정">📌</span> : null}
        <strong style={{ color: "#111", fontSize: 13 }}>
          {note.title || "(제목 없음)"}
        </strong>
      </div>
      <div
        style={{
          marginTop: 4,
          color: "#666",
          fontSize: 12,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {note.body || "(내용 없음)"}
      </div>
      {note.tags?.length ? (
        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {note.tags.map((t) => (
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
    </Link>
  );
}
