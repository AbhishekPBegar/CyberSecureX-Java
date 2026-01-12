import { useState } from "react";
import PageLayout from "../components/PageLayout";

export default function PasswordCrackerPage() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCrack = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/password/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({
        strength: "error",
        time: "N/A",
        message: "Network error during analysis",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="cracker-container">
        <div className="cracker-header">
          <h1>🔓 Password Strength Analyzer</h1>
          <p>Test password security against modern cracking techniques</p>
        </div>

        <div className="cracker-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to analyze..."
            className="cracker-input-field"
            maxLength={50}
          />
          <button
            onClick={handleCrack}
            disabled={loading || !password.trim()}
            className="cracker-btn"
          >
            {loading ? "⚡ Analyzing..." : "💥 Test Strength"}
          </button>
        </div>

        {result && (
          <div className="cracker-results">
            <div className="strength-meter">
              <div className={`strength-bar ${result.strength}`}>
                <div
                  className="strength-fill"
                  style={{
                    width: `${getStrengthPercentage(result.strength)}%`,
                  }}
                />
              </div>
              <span className="strength-label">
                {getStrengthText(result.strength)}
              </span>
            </div>

            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-label">Crack Time</span>
                <span className="metric-value">{result.time || "N/A"}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Length</span>
                <span className="metric-value">{password.length}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Score</span>
                <span className="metric-value">{result.score || 0}/100</span>
              </div>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="recommendations">
                <h4>🛠️ Recommendations</h4>
                <div className="rec-grid">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="rec-item">
                      <span className="rec-icon">⚠️</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.strength === "error" && (
          <div className="error-card">
            <h3>❌ Analysis Failed</h3>
            <p>{result.message}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .cracker-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .cracker-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cracker-header p {
          color: #9ca3af;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .cracker-input {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .cracker-input-field {
          flex: 1;
          min-width: 300px;
          padding: 1.2rem 1.5rem;
          border: 2px solid #374151;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1.1rem;
          font-family: monospace;
          backdrop-filter: blur(10px);
          letter-spacing: 1px;
        }
        .cracker-input-field::placeholder {
          color: #9ca3af;
          letter-spacing: 0;
        }
        .cracker-input-field:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
        }
        .cracker-btn {
          padding: 1.2rem 2.5rem;
          background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        .cracker-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 107, 107, 0.5);
        }
        .cracker-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cracker-results {
          animation: slideUp 0.5s ease;
        }
        .strength-meter {
          margin: 2rem 0;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          text-align: center;
        }
        .strength-bar {
          height: 20px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
          position: relative;
        }
        .strength-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 1s ease;
        }
        .strength-label {
          font-size: 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .strength-weak .strength-fill {
          background: #ef4444;
        }
        .strength-medium .strength-fill {
          background: #f59e0b;
        }
        .strength-strong .strength-fill {
          background: #10b981;
        }
        .strength-verystrong .strength-fill {
          background: linear-gradient(90deg, #10b981, #059669);
        }
        .strength-weak .strength-label {
          color: #ef4444;
        }
        .strength-medium .strength-label {
          color: #f59e0b;
        }
        .strength-strong .strength-label {
          color: #10b981;
        }
        .strength-verystrong .strength-label {
          color: #059669;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .metric {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .metric-label {
          display: block;
          color: #9ca3af;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .metric-value {
          font-size: 1.4rem;
          font-weight: 700;
          font-family: monospace;
        }
        .recommendations {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rec-grid {
          display: grid;
          gap: 1rem;
        }
        .rec-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 12px;
          border-left: 4px solid #f59e0b;
        }
        .rec-icon {
          font-size: 1.2rem;
          margin-top: 0.2rem;
        }
        .error-card {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          color: #ef4444;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .cracker-container {
            padding: 1rem;
          }
          .cracker-header h1 {
            font-size: 2rem;
          }
          .cracker-input {
            flex-direction: column;
          }
          .cracker-input-field {
            min-width: auto;
          }
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </PageLayout>
  );
}

function getStrengthPercentage(strength) {
  const percentages = {
    weak: 25,
    medium: 50,
    strong: 75,
    verystrong: 100,
    error: 0,
  };
  return percentages[strength] || 0;
}

function getStrengthText(strength) {
  const texts = {
    weak: "WEAK",
    medium: "MEDIUM",
    strong: "STRONG",
    verystrong: "VERY STRONG",
    error: "ERROR",
  };
  return texts[strength] || "UNKNOWN";
}
