import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "280px",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        padding: "2rem 1rem",
        height: "100vh",
        borderRight: "1px solid #333",
        boxShadow: "5px 0 20px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          marginBottom: "3rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #333",
        }}
      >
        <h3
          style={{
            color: "#00ff88",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.6rem",
            textShadow: "0 0 10px rgba(0,255,136,0.5)",
          }}
        >
          🔐 CyberSecureX
        </h3>
        <p style={{ color: "#888", fontSize: "14px" }}>Security Toolkit</p>
      </div>

      <nav style={{ listStyle: "none" }}>
        <Link
          to="/"
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "1.2rem",
            background: "#00ff88",
            color: "#000",
            textDecoration: "none",
            borderRadius: "12px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(0,255,136,0.3)",
            transition: "all 0.3s ease",
          }}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/scanner"
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "1.2rem",
            background: "transparent",
            color: "#00ff88",
            textDecoration: "none",
            borderRadius: "12px",
            border: "1px solid #00ff88",
            transition: "all 0.3s ease",
          }}
        >
          🔍 Website Scanner
        </Link>

        <Link
          to="/network"
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "1.2rem",
            background: "transparent",
            color: "#00ff88",
            textDecoration: "none",
            borderRadius: "12px",
            border: "1px solid #00ff88",
            transition: "all 0.3s ease",
          }}
        >
          🖧 Network Scanner
        </Link>

        <Link
          to="/password"
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "1.2rem",
            background: "transparent",
            color: "#00ff88",
            textDecoration: "none",
            borderRadius: "12px",
            border: "1px solid #00ff88",
            transition: "all 0.3s ease",
          }}
        >
          🛡️ Password Checker
        </Link>

        <Link
          to="/files"
          style={{
            display: "block",
            marginBottom: "1rem",
            padding: "1.2rem",
            background: "transparent",
            color: "#00ff88",
            textDecoration: "none",
            borderRadius: "12px",
            border: "1px solid #00ff88",
            transition: "all 0.3s ease",
          }}
        >
          📁 Secure File Share
        </Link>
      </nav>
    </div>
  );
}
