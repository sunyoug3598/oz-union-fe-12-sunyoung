import { useNavigate } from "react-router-dom";

export default function CategoryWidget() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}
    >
      {/* 위젯 헤더 */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ✅ 제목 클릭 시 /categories로 이동 */}
        <strong
          onClick={() => navigate("/categories")}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
          title="카테고리 페이지로 이동"
        >
          카테고리
        </strong>
      </header>

      {/* 위젯 본문 (임시 내용) */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 10,
          padding: 12,
          height: 240,
          overflowY: "auto",
        }}
      >
        <div style={{ color: "#888", fontSize: 14 }}>
          리스트 · 새 카테고리 · 검색 · 선택 시 일정 상세 (연결 예정)
        </div>
      </div>
    </div>
  );
}
