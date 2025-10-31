// src/app/layout/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import MemoWidget from "../../features/memoWidget/components/MemoWidget";
import CategoryWidget from "../../features/categoryWidget/components/CategoryWidget";
import UpcomingWidget from "../../features/upcoming/components/UpcomingWidget";
import RoutineWidget from "../../features/routine/components/RoutineWidget";

export default function AppLayout() {
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
        style={{
          flex: 1,
          padding: "16px 20px 40px",
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "280px 1.4fr 280px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* 왼쪽 사이드 */}
        <aside style={{ display: "grid", gap: "12px" }}>
          <CardWrapper>
            <MemoWidget />
          </CardWrapper>
          <CardWrapper>
            <CategoryWidget />
          </CardWrapper>
        </aside>

        {/* 가운데 메인 */}
        <section
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "32px 36px",
            minHeight: "610px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            width: "100%",
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </section>

        {/* 오른쪽 사이드 */}
        <aside style={{ display: "grid", gap: "12px" }}>
          <CardWrapper>
            <UpcomingWidget />
          </CardWrapper>
          <CardWrapper>
            <RoutineWidget />
          </CardWrapper>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

function CardWrapper({ children }) {
  return (
    <section
      style={{
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "24px 28px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        fontSize: "14px",
        lineHeight: 1.5,
        transition: "all 0.3s ease",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {children}
    </section>
  );
}
