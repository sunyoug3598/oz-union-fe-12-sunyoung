import { useState } from "react";

export default function CalendarMonth() {
  const [month, setMonth] = useState("2025년 11월");

  // 날짜 박스용 목업 데이터 (실제 달력 데이터 아님)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const sampleEvents = {
    3: [{ icon: "●", title: "팀 회의" }],
    5: [{ icon: "★", title: "카드 결제일" }],
    12: [{ icon: "－", title: "병원 예약" }],
    14: [{ icon: "○", title: "친구 약속" }, { icon: "●", title: "헬스장" }],
    21: [{ icon: "●", title: "제출 마감" }],
    29: [{ icon: "○", title: "월간 회고" }],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 상단 컨트롤 바 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px",
        }}
      >
        {/* 왼쪽: 달 이동 */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => console.log("이전달")}
            style={navBtnStyle}
          >
            ‹
          </button>
          <h2 style={{ fontSize: "18px", margin: 0 }}>{month}</h2>
          <button
            onClick={() => console.log("다음달")}
            style={navBtnStyle}
          >
            ›
          </button>
        </div>

        {/* 오른쪽: 필터 + 새 일정 버튼 */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={filterBtnStyle}>필터</button>
          <button style={addBtnStyle}>＋ 새 일정</button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "13px",
          color: "#666",
        }}
      >
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} style={{ padding: "6px 0" }}>
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 박스 (목업 달력) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        {days.map((day) => (
          <div
            key={day}
            style={{
              backgroundColor: "#fafafa",
              border: "1px solid #eee",
              borderRadius: "6px",
              minHeight: "90px",
              padding: "6px 8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fafafa";
            }}
            onClick={() => console.log(`${day}일 일정 목록 열기`)}
          >
            <strong style={{ fontSize: "12px", color: "#222" }}>{day}</strong>

            {/* 일정 아이템 */}
            {sampleEvents[day]?.map((event, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                  fontSize: "12px",
                  lineHeight: 1.3,
                  color: "#333",
                }}
              >
                <span
                  style={{
                    color: event.icon === "★" ? "#E3B400" : "#000",
                    fontWeight: event.icon === "★" ? 600 : 400,
                  }}
                >
                  {event.icon}
                </span>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "90px",
                  }}
                >
                  {event.title}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- 스타일 공통 --- */
const navBtnStyle = {
  background: "none",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "24px",
  height: "24px",
  cursor: "pointer",
  fontSize: "16px",
  lineHeight: "20px",
  textAlign: "center",
  color: "#555",
};

const filterBtnStyle = {
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "4px 8px",
  backgroundColor: "#fff",
  fontSize: "12px",
  cursor: "pointer",
};

const addBtnStyle = {
  border: "none",
  borderRadius: "4px",
  padding: "4px 10px",
  backgroundColor: "#000",
  color: "#fff",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: 600,
};
