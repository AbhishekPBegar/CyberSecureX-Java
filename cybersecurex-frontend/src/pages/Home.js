export default function Home() {
  return (
    <div className="container">
      <h1>🔐 CyberSecureX</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
        Modern cybersecurity toolkit for personal and small business security.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <div
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#FFD700", marginBottom: "1rem" }}>
            🔍 Website Scanner
          </h3>
          <p>
            Check websites for open ports, SSL issues, and security headers.
          </p>
        </div>

        <div
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#FFD700", marginBottom: "1rem" }}>
            🛡️ Password Checker
          </h3>
          <p>Analyze strength and check against real breach databases.</p>
        </div>

        <div
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#FFD700", marginBottom: "1rem" }}>
            🖧 Network Scanner
          </h3>
          <p>Discover devices and open ports on your local network.</p>
        </div>

        <div
          style={{
            padding: "2rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#FFD700", marginBottom: "1rem" }}>
            📁 Secure File Share
          </h3>
          <p>Share files securely with password protection and expiry.</p>
        </div>
      </div>
    </div>
  );
}
