export default function CategoryGrid({ categories = [], counts = {}, onOpen }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onOpen?.(c)}
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 16,
            textAlign: "left",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: 700 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
            {counts[c.name] || 0}개 일정
          </div>
        </button>
      ))}
    </div>
  );
}
