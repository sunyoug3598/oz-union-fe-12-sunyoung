export default function MemoWidget() {
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
        메모
      </div>

      <div style={{ fontSize: "13px", lineHeight: 1.4, color: "#333" }}>
        카드/리스트 보기 · 새 메모 · 해시태그 · 검색 · 상단고정 (설정 반영 예정)
      </div>
    </div>
  );
}
