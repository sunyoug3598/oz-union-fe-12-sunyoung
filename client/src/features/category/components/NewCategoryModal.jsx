export default function NewCategoryModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, minWidth: 320 }}>
        새 카테고리 (임시)
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}
