// 카테고리 색상 (badge, 캘린더 등에서 공통 사용)
export const CATEGORY_COLORS = {
  개인: "#51cf66",
  업무: "#339af0",
  건강: "#ff8787",
  금융: "#845ef7",
  기타: "#868e96",
};

// 상태 아이콘 규칙(라벨/설명 포함 가능)
export const STATUS_ICONS = {
  todo:  { char: "●", label: "할 일" },
  done:  { char: "✕", label: "완료" },
  carry: { char: "→", label: "이월" },
  memo:  { char: "－", label: "메모" },
  event: { char: "○", label: "이벤트" },
  star:  { char: "★", label: "중요" },
};

// 아이콘 색 (별은 노란색 고정)
export const getIconColor = (char) => (char === "★" ? "#E3B400" : "#000");
