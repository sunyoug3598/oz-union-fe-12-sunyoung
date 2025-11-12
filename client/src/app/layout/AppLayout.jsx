import { Outlet } from "react-router-dom";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import MemoWidget from "../../features/memoWidget/components/MemoWidget";
import CategoryWidget from "../../features/categoryWidget/components/CategoryWidget";
import UpcomingWidget from "../../features/upcoming/components/UpcomingWidget";
import RoutineWidget from "../../features/routine/components/RoutineWidget";
import NewScheduleController from "../../features/schedule/components/NewScheduleController";

export default function AppLayout() {
  const CONTAINER_MAX = 1320; // ✅ 전체 레이아웃 폭 확장

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
        color: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <main
        className="app-container"
        style={{
          flex: 1,
          padding: "20px 0 40px",
          maxWidth: `${CONTAINER_MAX}px`,
          width: "100%",
          margin: "0 auto",
          display: "grid",
          // ✅ 중앙 칼럼 대폭 확대
          gridTemplateColumns: "220px minmax(760px, 1fr) 260px",
          columnGap: "20px",
          alignItems: "start",
          overflowX: "hidden",
        }}
      >
        {/* 왼쪽 사이드바 */}
        <aside style={{ display: "grid", gap: "12px", minWidth: 0 }}>
          <CardWrapper>
            <MemoWidget />
          </CardWrapper>
          <CardWrapper>
            <CategoryWidget />
          </CardWrapper>
        </aside>

        {/* 중앙 캘린더 섹션 */}
        <section
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px 20px",
            minHeight: "610px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Outlet />
        </section>

        {/* 오른쪽 사이드바 */}
        <aside style={{ display: "grid", gap: "12px", minWidth: 0 }}>
          <CardWrapper>
            <UpcomingWidget />
          </CardWrapper>
          <CardWrapper>
            <RoutineWidget />
          </CardWrapper>
        </aside>
      </main>

      <Footer />
      <NewScheduleController />
    </div>
  );
}

function CardWrapper({ children }) {
  return (
    <section
      className="widget-card"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "24px 28px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        fontSize: "14px",
        lineHeight: 1.5,
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        minWidth: 0,
      }}
    >
      {children}
    </section>
  );
}
