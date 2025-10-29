export default function CategoryWidget() {
  return (
    <div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px",
          marginBottom: "8px",
        }}
      >
        카테고리
      </div>

      <div style={{ fontSize: "13px", lineHeight: 1.4, color: "#333" }}>
        리스트 · 새 카테고리 · 검색 · 선택 시 일정 상세 (연결 예정)
      </div>
    </div>
  );
}
