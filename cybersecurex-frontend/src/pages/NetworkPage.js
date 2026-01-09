import { useState } from "react";

export default function NetworkPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/network/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network scan failed" });
    } finally {
      setLoading(false);
    }
  };

  if (result?.status === "error") {
    return (
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <h2>🖧 Network Security Scanner</h2>
        <button
          onClick={scan}
          disabled={loading}
          style={{
            padding: "1.2rem 3rem",
            background: "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
          }}
        >
          {loading ? "🔍 Scanning..." : "🚀 Start Network Scan"}
        </button>

        <div
          style={{
            marginTop: "2rem",
            padding: "2rem",
            background: "#f44336",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <h3>❌ Scan Error</h3>
          <p>{result.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h2>🖧 Network Security Scanner</h2>
      <p style={{ marginBottom: "1rem", color: "#FFD700" }}>
        Discover devices on your local network and identify potential security
        risks.
      </p>
      <button
        onClick={scan}
        disabled={loading}
        style={{
          padding: "1.2rem 3rem",
          background: loading
            ? "#666"
            : "linear-gradient(135deg, #4CAF50, #45a049)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
        }}
      >
        {loading ? "🔍 Scanning network..." : "🚀 Start Network Scan"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          {/* Summary Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "16px",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h3 style={{ color: "#FFD700", marginBottom: "1rem" }}>
              📊 Network Scan Summary
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#4CAF50",
                  }}
                >
                  {result.deviceCount || 0}
                </div>
                <div>Active Devices</div>
              </div>
              {result.networkInfo && (
                <>
                  <div
                    style={{
                      padding: "1rem",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {result.networkInfo.localIP}
                    </div>
                    <div>Your IP</div>
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                      {result.networkInfo.subnet}
                    </div>
                    <div>Network Subnet</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Devices Grid */}
          {result.devices && result.devices.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {result.devices.map((device, index) => (
                <div
                  key={device.ip || index}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "1.5rem",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.4rem",
                        color: "#FFD700",
                        margin: 0,
                      }}
                    >
                      {device.ip}
                    </h4>
                    <span
                      style={{
                        padding: "0.3rem 0.8rem",
                        background: "#4CAF50",
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {device.deviceType || "Unknown"}
                    </span>
                  </div>

                  <div
                    style={{
                      marginBottom: "1rem",
                      fontSize: "14px",
                      color: "#ccc",
                    }}
                  >
                    <div>
                      <strong>Hostname:</strong> {device.hostname || "Unknown"}
                    </div>
                    <div>
                      <strong>MAC:</strong> {device.macAddress || "Unknown"}
                    </div>
                    <div>
                      <strong>Ports:</strong> {device.portCount || 0}
                    </div>
                  </div>

                  {device.openPorts && device.openPorts.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <h5 style={{ color: "#FFD700", marginBottom: "0.8rem" }}>
                        🔓 Open Ports
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {device.openPorts.slice(0, 8).map((port) => (
                          <span
                            key={port.port}
                            style={{
                              padding: "0.4rem 0.8rem",
                              background:
                                port.riskLevel === "HIGH"
                                  ? "#F44336"
                                  : port.riskLevel === "MEDIUM"
                                  ? "#FF9800"
                                  : "#4CAF50",
                              color: "white",
                              borderRadius: "16px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {port.port} ({port.service})
                          </span>
                        ))}
                        {device.openPorts.length > 8 && (
                          <span
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#666",
                              color: "white",
                              borderRadius: "16px",
                              fontSize: "12px",
                            }}
                          >
                            +{device.openPorts.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {device.securityNotes && device.securityNotes.length > 0 && (
                    <div>
                      <h5 style={{ color: "#FF9800", marginBottom: "0.8rem" }}>
                        🛡️ Security Notes
                      </h5>
                      {device.securityNotes.map((note, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "0.8rem",
                            margin: "0.3rem 0",
                            background:
                              note.includes("CRITICAL") || note.includes("HIGH")
                                ? "rgba(244,67,54,0.2)"
                                : note.includes("✅")
                                ? "rgba(76,175,80,0.2)"
                                : "rgba(255,152,0,0.2)",
                            borderRadius: "8px",
                            borderLeft: "4px solid",
                            borderLeftColor:
                              note.includes("CRITICAL") || note.includes("HIGH")
                                ? "#F44336"
                                : note.includes("✅")
                                ? "#4CAF50"
                                : "#FF9800",
                          }}
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem", opacity: 0.7 }}>
              <h3>No devices found</h3>
              <p>
                This could be due to firewall settings or network configuration.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
