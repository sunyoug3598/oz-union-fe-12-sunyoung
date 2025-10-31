import { useMemo, useState } from "react";
import { useEvents } from "../../../app/store/eventsContext";

const CARD = {
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  padding: "10px 12px",
  background: "#fff",
};

export default function UpcomingWidget() {
  const { upcomingWithin, cycleIcon } = useEvents();
  const [range, setRange] = useState(3); // 다음 3일

  const items = useMemo(() => upcomingWithin(range), [range, upcomingWithin]);

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>Upcoming</strong>
        <span style={{ color: "#777", fontSize: 12 }}>다음 {range}일</span>
      </header>

      <div
        style={{
          ...CARD,
          maxHeight: 280,
          overflowY: "auto",
          padding: 0,
        }}
      >
        {items.map((ev) => (
          <article key={ev.id} style={{ ...CARD, border: "none", borderBottom: "1px solid #f0f0f0", borderRadius: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#555", fontSize: 12 }}>
              <span>{formatUpcomingDate(ev.date)}</span>
              {ev.category ? (
                <small style={{ background: "#f5f5ff", border: "1px solid #e6e6ff", color: "#6b6bd6", borderRadius: 6, padding: "2px 6px" }}>
                  {ev.category}
                </small>
              ) : null}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => cycleIcon(ev.id)}
                title="아이콘 변경"
                style={{
                  width: 22,
                  height: 22,
                  lineHeight: "22px",
                  textAlign: "center",
                  borderRadius: 6,
                  border: "1px solid #e5e5e5",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: ev.icon === "★" ? 700 : 400,
                  color: ev.icon === "★" ? "#E3B400" : "#000",
                }}
              >
                {ev.icon}
              </button>
              <div style={{ fontWeight: 700 }}>{ev.title}</div>
            </div>
          </article>
        ))}

        {!items.length && (
          <div style={{ padding: 16, color: "#777", textAlign: "center" }}>예정된 일정이 없습니다.</div>
        )}
      </div>
    </section>
  );
}

function formatUpcomingDate(iso) {
  const today = new Date();
  const d = new Date(iso);
  const d0 = strip(today);
  const d1 = strip(d);

  const diff = Math.round((d1 - d0) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "오늘";
  if (diff === 1) return "내일";

  const w = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} (${w})`;
}
function strip(x) { const y = new Date(x); y.setHours(0,0,0,0); return y; }
