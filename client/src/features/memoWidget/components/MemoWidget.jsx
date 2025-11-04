import { useNavigate } from "react-router-dom";

export default function MemoWidget() {
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
        {/* ✅ 제목 클릭 시 /notes 이동 */}
        <strong
          onClick={() => navigate("/notes")}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
          title="메모 페이지로 이동"
        >
          메모
        </strong>
      </header>

      {/* 메모 내용 (임시 목업) */}
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
          카드/리스트 보기 · 새 메모 · 해시태그 · 검색 · 상단고정 (설정 반영 예정)
        </div>
      </div>
    </div>
  );
}
