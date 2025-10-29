import NotesManager from "../components/NotesManager.jsx";

export default function NotesPage() {
  // 임시 데이터 (mock data)
  const mockPinned = [
    {
      id: "p1",
      title: "고정 메모 예시",
      body: "이건 중요한 메모예요. 상단에 항상 고정됩니다.",
    },
    {
      id: "p2",
      title: "UI 개선 아이디어",
      body: "메모 검색바에 태그 자동완성 기능 넣기",
    },
  ];

  const mockItems = [
    {
      id: "n1",
      title: "장보기 목록",
      body: "달걀, 우유, 버터, 커피 필터",
      tags: ["집", "일상"],
    },
    {
      id: "n2",
      title: "스터디 메모",
      body: "React Router 구조 이해하기\nIndexedDB 연습하기",
      tags: ["공부", "react"],
    },
    {
      id: "n3",
      title: "프로젝트 아이디어",
      body: "메모 고정 기능 + 검색 UX 개선하기",
      tags: ["solan", "UX"],
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <NotesManager
        mode="cards"
        pinned={mockPinned}
        items={mockItems}
        onCreate={() => console.log("새 메모 만들기")}
        onOpen={(id) => console.log("메모 열기:", id)}
        onSearch={(q) => console.log("검색:", q)}
        onTogglePin={(id) => console.log("핀 토글:", id)}
      />
    </div>
  );
}
