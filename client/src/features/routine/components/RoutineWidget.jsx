import { useState } from "react";

export default function RoutineWidget() {
  // 탭 상태: "daily" | "weekly" | "monthly"
  const [activeTab, setActiveTab] = useState("daily");

  // 목업 루틴 데이터
  // repeat: daily | weekly | monthly
  // statusIcon: ● 할 일 / ✕ 완료 / → 이월 / － 메모 / ○ 이벤트 / ★ 중요
  const routineData = [
    {
      repeat: "daily",
      title: "아침 물 500ml 마시기",
      statusIcon: "●",
    },
    {
      repeat: "daily",
      title: "10분 스트레칭",
      statusIcon: "●",
    },
    {
      repeat: "daily",
      title: "일정 체크 & 오늘 우선순위 정하기",
      statusIcon: "○",
    },

    {
      repeat: "weekly",
      title: "월요일 집 정리",
      statusIcon: "●",
    },
    {
      repeat: "weekly",
      title: "금요일 가계부 정리",
      statusIcon: "－",
    },
    {
      repeat: "weekly",
      title: "일요일 운동 1시간",
      statusIcon: "●",
    },

    {
      repeat: "monthly",
      title: "카드 사용 내역 점검",
      statusIcon: "－",
    },
    {
      repeat: "monthly",
      title: "월간 회고 작성",
      statusIcon: "○",
    },
    {
      repeat: "monthly",
      title: "정기 구독 결제일 확인",
      statusIcon: "★", // 중요 표시 가능
    },
  ];

  // 현재 탭에 맞는 루틴만 필터
  const visibleRoutines = routineData.filter(
    (item) => item.repeat === activeTab
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
      {/* 헤더 영역 */}
      <div
        style={{
          borderBottom: "1px solid #eee",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: "6px",
          }}
        >
          <span>루틴 일정</span>

          {/* 탭 스위처 (Daily / Weekly / Monthly) */}
          <TabSwitch activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* 루틴 리스트 (스크롤 영역) */}
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
        {visibleRoutines.length === 0 ? (
          <div
            style={{
              fontSize: "12px",
              lineHeight: 1.4,
              color: "#888",
              textAlign: "center",
              paddingTop: "20px",
            }}
          >
            등록된 루틴이 없습니다.
          </div>
        ) : (
          visibleRoutines.map((routine, idx) => (
            <RoutineItem key={idx} routine={routine} />
          ))
        )}
      </div>
    </div>
  );
}

// 탭 컴포넌트
function TabSwitch({ activeTab, onChange }) {
  const tabs = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        fontSize: "12px",
        lineHeight: 1.2,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              backgroundColor: isActive ? "#000" : "#fff",
              color: isActive ? "#fff" : "#555",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "12px",
              lineHeight: 1.2,
              cursor: "pointer",
              fontWeight: isActive ? 600 : 400,
              minWidth: "56px",
              transition: "all 0.12s ease",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// 루틴 한 줄
function RoutineItem({ routine }) {
  const { title, statusIcon } = routine;

  const starColor = "#E3B400";

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
        alignItems: "flex-start",
        userSelect: "none",
      }}
      onClick={() => {
        console.log("루틴 상세/편집 예정:", routine);
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
      {/* 왼쪽 상태 아이콘 (토글 가능 예정) */}
      <button
        style={{
          appearance: "none",
          background: "none",
          border: "none",
          padding: 0,
          marginRight: "8px",
          fontSize: "14px",
          lineHeight: "18px",
          minWidth: "16px",
          textAlign: "center",
          cursor: "pointer",
          color: statusIcon === "★" ? starColor : "#000",
          fontWeight: statusIcon === "★" ? 600 : 400,
        }}
        title="상태 변경 (할 일 / 완료 / 이월 / 메모 / 이벤트 / 중요)"
        onClick={(e) => {
          e.stopPropagation();
          console.log("루틴 상태 변경 토글 예정:", routine);
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
        }}
      >
        {title}
      </div>
    </div>
  );
}
