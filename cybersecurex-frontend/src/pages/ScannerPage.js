import { useState } from "react";

export default function ScannerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams({ url: url.trim() });
      const res = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network error while scanning" });
    } finally {
      setLoading(false);
    }
  };

  if (result?.status === "error") {
    return (
      <main>
        <h2>Website Security Scanner</h2>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com or https://example.com"
        />
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Scanning..." : "Scan"}
        </button>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#f44336",
            borderRadius: "8px",
            color: "white",
          }}
        >
          <h3>❌ Error</h3>
          <p>{result.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h2>🔍 Website Security Scanner</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website (e.g. google.com)"
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleScan}
          disabled={loading}
          style={{
            padding: "1rem 2rem",
            background: loading ? "#666" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "🔍 Scanning..." : "🚀 Scan Website"}
        </button>
      </div>

      {result && (
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "2rem",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3>📊 Scan Results for {result.host}</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
              }}
            >
              <h4>🌐 Basic Info</h4>
              <p>
                <strong>URL:</strong> {result.url}
              </p>
              <p>
                <strong>Host:</strong> {result.host}
              </p>
              <p>
                <strong>HTTPS:</strong> {result.hasSSL ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Reachable:</strong>{" "}
                {result.reachable ? "✅ Yes" : "❌ No"}
              </p>
            </div>

            {result.openPorts && result.openPorts.length > 0 && (
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}
              >
                <h4>🔓 Open Ports ({result.openPorts.length})</h4>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {result.openPorts.map((port) => (
                    <span
                      key={port}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#f44336",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {port}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.securityIssues && (
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                }}
              >
                <h4>🛡️ Security Analysis</h4>
                <ul style={{ textAlign: "left", listStyle: "none" }}>
                  {result.securityIssues.map((issue, i) => (
                    <li
                      key={i}
                      style={{
                        margin: "0.5rem 0",
                        padding: "0.5rem",
                        background: "rgba(255,152,0,0.3)",
                        borderRadius: "4px",
                      }}
                    >
                      ⚠️ {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
