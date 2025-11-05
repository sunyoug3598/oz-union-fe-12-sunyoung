import { Link } from "react-router-dom";

export default function CategoryWidget() {
  return (
    <section className="flex h-full flex-col gap-3">
      {/* 위젯 헤더 */}
      <header className="flex items-center justify-between">
        <Link
          to="/categories"
          className="text-[15px] font-semibold text-black hover:underline"
          title="카테고리 페이지로 이동"
        >
          카테고리
        </Link>
      </header>

      {/* 위젯 바디: 임시 목업 */}
      <div className="flex-1 rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-600">
        리스트 · 새 카테고리 · 검색 · 선택 시 일정 상세 (연결 예정)
      </div>
    </section>
  );
}
