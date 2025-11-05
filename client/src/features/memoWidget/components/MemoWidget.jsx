import { Link } from "react-router-dom";

export default function MemoWidget() {
  return (
    <section className="flex h-full flex-col gap-3">
      {/* 위젯 헤더 */}
      <header className="flex items-center justify-between">
        <Link
          to="/notes"
          className="text-[15px] font-semibold text-black hover:underline"
          title="메모 페이지로 이동"
        >
          메모
        </Link>
        {/* (선택) 우측에 더보기 버튼 자리 */}
        {/* <button className="text-sm text-gray-500 hover:text-black">더보기</button> */}
      </header>

      {/* 위젯 바디: 임시 목업 */}
      <div className="flex-1 rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-600">
        카드/리스트 보기 · 새 메모 · 해시태그 · 검색 (설정 반영 예정)
      </div>
    </section>
  );
}
