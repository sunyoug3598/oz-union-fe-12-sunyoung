export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #eee", background: "transparent" }}>
      <div className="app-container" style={{ padding: 16 }}>
        <small>© {new Date().getFullYear()} Sunyoung</small>
      </div>
    </footer>
  );
}
