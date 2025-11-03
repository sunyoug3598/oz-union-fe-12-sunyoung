export default function CategoryListModal({ open, onClose, category }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, minWidth: 360 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>
          {category?.name} 일정 (임시)
        </div>
        <div style={{ textAlign: "right" }}>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}
