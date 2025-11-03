import { useMemo } from "react";
import { useEvents } from "../../../app/store/eventsStore";
import { CATEGORY_COLORS, getIconChar, getIconColor } from "../../../app/constants/uiTokens";

export default function CategoryPage() {
  const { getAll } = useEvents();

  const grouped = useMemo(() => {
    const all = getAll();
    const result = { 개인: [], 업무: [], 건강: [], 금융: [], 기타: [] };
    Object.entries(all).forEach(([day, list]) => {
      list.forEach((ev) => {
        const key = ev.category || "기타";
        result[key].push({ ...ev, day: Number(day) });
      });
    });
    return result;
  }, [getAll]);

  return (
    <div style={{ padding: "20px 16px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>카테고리별 일정</h2>
      <div style={{ display: "grid", gap: 20 }}>
        {Object.keys(grouped).map((cat) => (
          <CategorySection key={cat} name={cat} items={grouped[cat]} />
        ))}
      </div>
    </div>
  );
}

function CategorySection({ name, items }) {
  const color = CATEGORY_COLORS[name] || "#adb5bd";

  return (
    <section
      style={{
        border: `1px solid ${color}33`,
        borderRadius: 10,
        padding: 16,
        background: "#fff",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }}></span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color }}>{name}</h3>
      </header>

      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "#777" }}>등록된 일정이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((ev) => (
            <li
              key={ev.id}
              style={{
                borderBottom: "1px solid #f1f3f5",
                padding: "6px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: getIconColor(ev.icon),
                  fontWeight: getIconChar(ev.icon) === "★" ? 700 : 400,
                }}
              >
                {getIconChar(ev.icon)}
              </span>
              <span style={{ fontSize: 14 }}>{ev.title}</span>
              <span style={{ fontSize: 12, color: "#888", marginLeft: "auto" }}>
                {ev.timeLabel || "시간 미정"} / {ev.day}일
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
