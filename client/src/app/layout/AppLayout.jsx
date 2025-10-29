import { Outlet } from "react-router-dom";
import Header from "../../shared/components/Header";
import Footer from "../../shared/components/Footer";
import MemoWidget from "../../features/memoWidget/components/MemoWidget";
import CategoryWidget from "../../features/categoryWidget/components/CategoryWidget";
import UpcomingWidget from "../../features/upcoming/components/UpcomingWidget";
import RoutineWidget from "../../features/routine/components/RoutineWidget";

export default function AppLayout() {
  // 임시 목업들 (사이드 미리보기용 그대로 둬도 됨)
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f7", // 페이지 전체 배경 살짝 톤
        color: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 상단 헤더 */}
      <Header />

      {/* 메인 영역 */}
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
        {/* 왼쪽 사이드바 */}
        <aside style={{ display: "grid", gap: "12px" }}>
          <CardWrapper>
            <MemoWidget />
          </CardWrapper>

          <CardWrapper>
            <CategoryWidget />
          </CardWrapper>
        </aside>

        {/* 메인 컨텐츠 */}
        <section
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "32px 36px",
            minHeight: "610px", // 세로 더 크게
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            width: "100%",
            maxWidth: "960px", // 가로도 살짝 존재감 주기
            margin: "0 auto", // 가운데 정렬
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </section>

        {/* 오른쪽 사이드바 */}
        <aside style={{ display: "grid", gap: "12px" }}>
          <CardWrapper>
            <UpcomingWidget />
          </CardWrapper>

          <CardWrapper>
            <RoutineWidget />
          </CardWrapper>
        </aside>
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
}

/**
 * CardWrapper:
 * 사이드바 위젯들을 똑같은 스타일 박스 안에 넣어서
 * "대시보드 카드"처럼 보이게 통일해 주는 재사용 래퍼.
 * (여기서만 style 통일하고 각 위젯은 내용만 책임지게)
 */
function CardWrapper({ children }) {
  return (
    <section
      style={{
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px 20px",

        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        fontSize: "14px",
        lineHeight: 1.5,
        transition: "all 0.3s ease",

        // 고정 높이 + 내부 스크롤 허용 구조
        height: "300px",        // ✅ 딱 고정
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",     // ✅ 자식이 넘칠 때 바깥은 커지지 않게
      }}
    >
      {children}
    </section>
  );
}

