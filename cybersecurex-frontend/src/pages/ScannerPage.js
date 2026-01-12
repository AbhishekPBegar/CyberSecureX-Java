import { useState } from "react";
import PageLayout from "../components/PageLayout";

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
      const res = await fetch("/api/scanner/scan?" + params.toString(), {
        method: "GET",
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: "error", message: "Network error while scanning" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="scanner-container">
        <div className="scanner-header">
          <h1>🔍 Website Security Scanner</h1>
          <p>Analyze websites for security vulnerabilities in seconds</p>
        </div>

        <div className="scanner-input">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="scanner-input-field"
          />
          <button
            onClick={handleScan}
            disabled={loading || !url.trim()}
            className="scanner-btn"
          >
            {loading ? "🔍 Scanning..." : "🚀 Scan Now"}
          </button>
        </div>

        {result && (
          <div className="scanner-results">
            <div className="result-card">
              <h3>
                📊 Results for: <span>{result.host || result.url}</span>
              </h3>

              <div className="metrics-grid">
                <div className="metric">
                  <span className="metric-label">HTTPS</span>
                  <span
                    className={`metric-value ${
                      result.hasSSL ? "success" : "danger"
                    }`}
                  >
                    {result.hasSSL ? "✅ Secure" : "❌ Not Secure"}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Reachable</span>
                  <span
                    className={`metric-value ${
                      result.reachable ? "success" : "warning"
                    }`}
                  >
                    {result.reachable ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
              </div>

              {result.openPorts?.length > 0 && (
                <div className="issue-section">
                  <h4>🔓 Open Ports ({result.openPorts.length})</h4>
                  <div className="ports-grid">
                    {result.openPorts.map((port) => (
                      <span key={port} className="port-tag danger">
                        {port}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.securityIssues?.length > 0 && (
                <div className="issue-section">
                  <h4>⚠️ Security Issues</h4>
                  <ul className="issues-list">
                    {result.securityIssues.map((issue, i) => (
                      <li key={i} className="issue-item">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {result?.status === "error" && (
          <div className="error-card">
            <h3>❌ Scan Failed</h3>
            <p>{result.message}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scanner-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .scanner-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .scanner-header p {
          color: #9ca3af;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .scanner-input {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .scanner-input-field {
          flex: 1;
          min-width: 300px;
          padding: 1rem 1.5rem;
          border: 2px solid #374151;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1rem;
          backdrop-filter: blur(10px);
        }
        .scanner-input-field::placeholder {
          color: #9ca3af;
        }
        .scanner-input-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .scanner-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .scanner-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .scanner-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .scanner-results {
          animation: slideUp 0.5s ease;
        }
        .result-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem;
        }
        .result-card h3 span {
          color: #10b981;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .metric {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }
        .metric-label {
          display: block;
          color: #9ca3af;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .metric-value {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .metric-value.success {
          color: #10b981;
        }
        .metric-value.danger {
          color: #ef4444;
        }
        .metric-value.warning {
          color: #f59e0b;
        }
        .issue-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .issue-section h4 {
          color: #f59e0b;
          margin-bottom: 1rem;
        }
        .ports-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .port-tag {
          padding: 0.5rem 1rem;
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .issues-list {
          list-style: none;
          padding: 0;
        }
        .issue-item {
          padding: 1rem;
          margin: 0.5rem 0;
          background: rgba(245, 158, 11, 0.1);
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          color: #fbbf24;
        }
        .error-card {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          color: #ef4444;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .scanner-container {
            padding: 1rem;
          }
          .scanner-header h1 {
            font-size: 2rem;
          }
          .scanner-input {
            flex-direction: column;
          }
          .scanner-input-field {
            min-width: auto;
          }
        }
      `}</style>
    </PageLayout>
  );
}
