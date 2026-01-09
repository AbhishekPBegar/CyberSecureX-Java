import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "🏠 Dashboard", activePath: "/" },
    { path: "/scanner", label: "🔍 Website Scanner", activePath: "/scanner" },
    { path: "/network", label: "🖧 Network Scanner", activePath: "/network" },
    {
      path: "/password",
      label: "🛡️ Password Checker",
      activePath: "/password",
    },
    { path: "/files", label: "📁 Secure File Share", activePath: "/files" },
  ];

  const isActive = (itemPath) => location.pathname === itemPath;

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
        <p style={{ color: "#888", fontSize: "14px" }}>Security Toolkit v2.0</p>
      </div>

      <nav style={{ listStyle: "none" }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "block",
              marginBottom: "1rem",
              padding: "1.2rem",
              background: isActive(item.activePath) ? "#00ff88" : "transparent",
              color: isActive(item.activePath) ? "#000" : "#00ff88",
              textDecoration: "none",
              borderRadius: "12px",
              border: `1px solid ${
                isActive(item.activePath) ? "#00ff88" : "#00ff88"
              }`,
              transition: "all 0.3s ease",
              fontWeight: isActive(item.activePath) ? "700" : "500",
              boxShadow: isActive(item.activePath)
                ? "0 4px 15px rgba(0,255,136,0.4)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.activePath)) {
                e.currentTarget.style.background = "rgba(0,255,136,0.1)";
                e.currentTarget.style.transform = "translateX(4px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.activePath)) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
