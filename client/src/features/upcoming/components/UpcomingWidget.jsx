import { useMemo } from "react";

export default function UpcomingWidget() {
  // 카테고리 → 색상 매핑
  const CATEGORY_COLORS = {
    업무: { bg: "#E6ECFF", text: "#4A6CF7" },   // 파랑계
    건강: { bg: "#E8F8EC", text: "#2BA24C" },   // 초록계
    금융: { bg: "#F5E9FF", text: "#8E44D6" },   // 보라계
    개인: { bg: "#F2F2F2", text: "#555555" },   // 회색계
  };

  // 목업 일정 데이터
  // repeat: "daily" | "weekly" | "monthly" | null
  // 월간 반복만 업커밍에 뜬다고 정했지? (monthly, null)
  const mockEvents = [
    {
      whenLabel: "오늘 14:00",
      title: "팀 프로젝트 미팅",
      statusIcon: "★", // 중요
      category: "업무",
      repeat: "weekly", // <- weekly는 실제로는 루틴 위젯 전용이어야 함
    },
    {
      whenLabel: "내일 09:30",
      title: "건강검진 예약",
      statusIcon: "○",
      category: "건강",
      repeat: null,
    },
    {
      whenLabel: "10.29 (수)",
      title: "카드 결제일",
      statusIcon: "－",
      category: "금융",
      repeat: "monthly", // monthly → Upcoming에 보여도 된다 (정기 결제일)
    },
    {
      whenLabel: "11.05",
      title: "프로젝트 마감일",
      statusIcon: "★",
      category: "업무",
      repeat: null,
    },
    {
      whenLabel: "11.11",
      title: "서류 제출하기",
      statusIcon: "●",
      category: "개인",
      repeat: null,
    },
    {
      whenLabel: "내일 07:00",
      title: "아침 물 500ml 마시기",
      statusIcon: "●",
      category: "개인",
      repeat: "daily", // daily는 Upcoming에서 빼야 한다
    },
  ];

  // ✅ 업커밍에 보여줄 것만 필터:
  //  - 단발성(null)
  //  - monthly 반복
  const visibleEvents = mockEvents.filter(
    (ev) => ev.repeat === null || ev.repeat === "monthly"
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          borderBottom: "1px solid #eee",
          paddingBottom: "6px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span>Upcoming</span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 400,
            color: "#777",
            lineHeight: 1.2,
          }}
        >
          다음 3일
        </span>
      </div>

      {/* 리스트 영역 (스크롤) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "grid",
          rowGap: "8px",
          paddingRight: "4px",
        }}
      >
        {visibleEvents.map((ev, idx) => (
          <UpcomingCard
            key={idx}
            event={ev}
            categoryColors={CATEGORY_COLORS}
          />
        ))}
      </div>
    </div>
  );
}

function UpcomingCard({ event, categoryColors }) {
  const { whenLabel, title, statusIcon, category, repeat } = event;

  // 카테고리 색상 (배지용)
  const colors =
    categoryColors[category] || {
      bg: "#eee",
      text: "#555",
    };

  const starColor = "#eacd59";

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "6px",
        padding: "10px 12px",
        backgroundColor: "#fafafa",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        cursor: "pointer",
        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        fontSize: "13px",
        lineHeight: 1.45,
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
      onClick={() => {
        console.log("일정 상세 모달 열 예정:", event);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f5f5f5";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fafafa";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)";
      }}
    >
      {/* 1행: 왼쪽은 날짜/시간, 오른쪽은 카테고리 배지 (🔁 없음) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          marginBottom: "6px",
          color: "#444",
          fontSize: "12px",
          lineHeight: 1.3,
          fontWeight: 500,
        }}
      >
        <span>{whenLabel}</span>

        {/* 카테고리 배지 */}
        <span
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            borderRadius: "4px",
            fontSize: "11px",
            lineHeight: 1.2,
            padding: "2px 4px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {category}
        </span>
      </div>

      {/* 2행: 상태 아이콘 + 제목 ... 🔁 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        {/* 왼쪽: 상태 아이콘 + 제목 묶음 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flex: 1,
            minWidth: 0,
            gap: "8px",
          }}
        >
          {/* 상태 아이콘 (●, ✕, →, －, ○, ★ 등) */}
          <button
            style={{
              appearance: "none",
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "14px",
              lineHeight: "18px",
              minWidth: "16px",
              textAlign: "center",
              cursor: "pointer",
              color: statusIcon === "★" ? "#E3B400" : "#000",
              fontWeight: statusIcon === "★" ? 600 : 400,
            }}
            title="상태 변경 (할 일 / 완료 / 이월 / 메모 / 이벤트 / 중요)"
            onClick={(e) => {
              e.stopPropagation();
              console.log("상태 변경 토글 예정:", event);
            }}
          >
            {statusIcon || "•"}
          </button>

          {/* 제목 */}
          <div
            style={{
              flex: 1,
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.4,
              color: "#000",
              wordBreak: "keep-all",
              minWidth: 0,
            }}
          >
            {title}
          </div>
        </div>

        {/* 오른쪽 끝: 🔁 (monthly 반복만) */}
        {repeat === "monthly" && (
          <span
            style={{
              fontSize: "13px",
              lineHeight: 1.2,
              color: "#555",
              flexShrink: 0,
            }}
            title="반복 일정"
          >
            🔁
          </span>
        )}
      </div>
    </div>
  );
}
