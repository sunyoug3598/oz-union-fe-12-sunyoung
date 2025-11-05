// src/features/category/components/CategoryGrid.jsx
import { useCategories } from "../../../app/store/categoryStore";

export default function CategoryGrid({ categories = [], counts = {}, onOpen }) {
  // 삭제/이름변경은 Provider의 액션 사용
  const { renameCategory, removeCategory } = useCategories();

  if (!categories.length) {
    return (
      <div className="text-center text-sm text-gray-500 border border-gray-200 rounded-xl py-10">
        등록된 카테고리가 없습니다. 우측 상단의 <b>+ 새 카테고리</b>로 추가해보세요.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          cat={cat}
          count={counts[cat.name] || 0}
          onOpen={() => onOpen?.(cat)}
          onRename={(next) => renameCategory(cat.id, next)}
          onRemove={() => removeCategory(cat.id)}
        />
      ))}
    </div>
  );
}

function CategoryCard({ cat, count, onOpen, onRename, onRemove }) {
  const handleRename = (e) => {
    e.stopPropagation();
    const next = window.prompt("카테고리 이름을 수정하세요.", cat.name);
    if (!next) return;
    onRename?.(next);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (window.confirm(`'${cat.name}' 카테고리를 삭제할까요? (일정 데이터는 유지)`)) {
      onRemove?.();
    }
  };

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition flex flex-col gap-3"
    >
      {/* 상단: 이름/카운트/색점 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: cat.color }}
            aria-hidden
          />
          <span className="font-semibold truncate">{cat.name}</span>
        </div>
        <span className="text-xs text-gray-500">{count}개</span>
      </div>

      {/* 하단: 액션 */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleRename}
          className="px-2.5 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
        >
          이름변경
        </button>
        <button
          onClick={handleRemove}
          className="px-2.5 py-1 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </button>
  );
}
