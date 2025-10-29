import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main style={{ padding: 20 }}>
      <h1>페이지를 찾을 수 없습니다</h1>
      <Link to="/">홈으로</Link>
    </main>
  );
}
