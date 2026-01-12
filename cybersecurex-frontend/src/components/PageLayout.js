export default function PageLayout({ children, title, subtitle }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Page Header */}
        <div
          style={{
            marginBottom: "3rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h1
            style={{
              color: "#00ff88",
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
              textShadow: "0 0 20px rgba(0,255,136,0.5)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                color: "#888",
                fontSize: "1.2rem",
                opacity: 0.8,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Page Content */}
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}
