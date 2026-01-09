import { useState } from "react";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    try {
      const params = new URLSearchParams({ password });
      const res = await fetch("/api/password/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network error while analyzing" });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "#4CAF50"; // green
    if (score >= 50) return "#FF9800"; // orange
    if (score >= 25) return "#FF5722"; // red
    return "#F44336"; // dark red
  };

  const getStrengthClass = (strength) => {
    return `strength-${strength.toLowerCase().replace(/\s+/g, "-")}`;
  };

  if (result?.status === "error") {
    return (
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <h2>🛡️ Password Security Checker</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to analyze"
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            marginBottom: "1rem",
          }}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding: "1rem 2rem",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "🔍 Analyze Password"}
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
          <h3>❌ Analysis Error</h3>
          <p>{result.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <h2>🛡️ Password Security Checker</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password here..."
          style={{
            flex: 1,
            padding: "1.2rem",
            borderRadius: "12px",
            border: "2px solid rgba(255,255,255,0.3)",
            fontSize: "18px",
            background: "rgba(255,255,255,0.9)",
            color: "#333",
          }}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding: "1.2rem 2.5rem",
            background: loading
              ? "#666"
              : "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(76,175,80,0.3)",
          }}
        >
          {loading ? "🔍 Analyzing..." : "🔍 Analyze Password"}
        </button>
      </div>

      {result && (
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "2.5rem",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* Score Circle */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              className={getStrengthClass(result.strength)}
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                margin: "0 auto 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                background: `linear-gradient(135deg, ${getScoreColor(
                  result.score
                )}, ${getScoreColor(result.score)})`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              {result.score}/100
            </div>
            <h2 style={{ color: "#FFD700", marginBottom: "0.5rem" }}>
              {result.strength} Password
            </h2>
          </div>

          {/* Breach Status */}
          {result.breachInfo && (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                textAlign: "center",
                background: result.breachInfo.breached
                  ? "rgba(244,67,54,0.2)"
                  : "rgba(76,175,80,0.2)",
                border: `2px solid ${
                  result.breachInfo.breached ? "#F44336" : "#4CAF50"
                }`,
              }}
            >
              <h3
                style={{
                  color: result.breachInfo.breached ? "#F44336" : "#4CAF50",
                  marginBottom: "1rem",
                }}
              >
                {result.breachInfo.breached ? "🚨 BREACHED" : "✅ SAFE"}
              </h3>
              <p style={{ fontSize: "16px", fontWeight: "500" }}>
                {result.breachInfo.message}
              </p>
              {result.breachInfo.breached && result.breachInfo.count && (
                <p style={{ fontSize: "14px", marginTop: "0.5rem" }}>
                  Found in <strong>{result.breachInfo.count}</strong> data
                  breaches
                </p>
              )}
            </div>
          )}

          {/* Detailed Analysis */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Analysis Card */}
            {result.analysis && (
              <div
                style={{
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                }}
              >
                <h4 style={{ color: "#FFD700", marginBottom: "1rem" }}>
                  📊 Technical Analysis
                </h4>
                <div style={{ fontSize: "15px", lineHeight: "1.6" }}>
                  <div>
                    <strong>Length:</strong> {result.analysis.length} chars
                  </div>
                  <div>
                    <strong>Unique chars:</strong> {result.analysis.uniqueChars}
                  </div>
                  <div>
                    <strong>Entropy:</strong> {result.analysis.entropy} bits
                  </div>
                  <div>
                    <strong>Lowercase:</strong>{" "}
                    {result.analysis.hasLowercase ? "✅" : "❌"}
                  </div>
                  <div>
                    <strong>Uppercase:</strong>{" "}
                    {result.analysis.hasUppercase ? "✅" : "❌"}
                  </div>
                  <div>
                    <strong>Numbers:</strong>{" "}
                    {result.analysis.hasNumbers ? "✅" : "❌"}
                  </div>
                  <div>
                    <strong>Special chars:</strong>{" "}
                    {result.analysis.hasSpecialChars ? "✅" : "❌"}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions Card */}
            {result.suggestions && (
              <div
                style={{
                  padding: "1.5rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                }}
              >
                <h4 style={{ color: "#FF9800", marginBottom: "1rem" }}>
                  💡 Improvement Suggestions
                </h4>
                <ul style={{ listStyle: "none", padding: "0" }}>
                  {result.suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      style={{
                        margin: "0.5rem 0",
                        padding: "0.8rem",
                        background: "rgba(255,152,0,0.2)",
                        borderRadius: "8px",
                        borderLeft: "4px solid #FF9800",
                      }}
                    >
                      {suggestion}
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
