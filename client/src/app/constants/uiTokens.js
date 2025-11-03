// 카테고리 색상 토큰
export const CATEGORY_COLORS = {
  개인: "#51cf66",
  업무: "#339af0",
  건강: "#ff8787",
  금융: "#845ef7",
  기타: "#868e96",
};

// 상태 아이콘 표준(키 기반)
export const STATUS_ICONS = {
  todo: { char: "•", label: "할 일" },
  done: { char: "✕", label: "완료" },
  carry: { char: "→", label: "이월" },
  memo: { char: "－", label: "메모" },
  event: { char: "○", label: "이벤트" },
  star: { char: "★", label: "중요" },
};

// 과거 문자 매핑 (예: "●" -> "•")
const LEGACY_MAP = { "●": "•" };

// 아이콘 문자 정규화
export function getIconChar(input) {
  if (!input) return STATUS_ICONS.todo.char;
  if (STATUS_ICONS[input]?.char) return STATUS_ICONS[input].char;
  if (LEGACY_MAP[input]) return LEGACY_MAP[input];
  return input;
}

// 아이콘 색상 통일(별만 노랑)
export function getIconColor(charOrKey) {
  const ch = getIconChar(charOrKey);
  return ch === "★" ? "#E3B400" : "#000";
}
