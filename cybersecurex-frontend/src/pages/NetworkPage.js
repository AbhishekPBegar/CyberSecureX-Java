import { useState } from "react";
import PageLayout from "../components/PageLayout";

export default function NetworkScannerPage() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!target.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/network/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({
        status: "error",
        message: "Network scan failed - check target IP/domain",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="network-container">
        <div className="network-header">
          <h1>🌐 Network Vulnerability Scanner</h1>
          <p>Discover open ports, services & security risks</p>
        </div>

        <div className="network-input">
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="192.168.1.1 or example.com"
            className="network-input-field"
          />
          <button
            onClick={handleScan}
            disabled={loading || !target.trim()}
            className="network-btn"
          >
            {loading ? "🔍 Scanning..." : "⚡ Scan Network"}
          </button>
        </div>

        {result && result.status !== "error" && (
          <div className="network-results">
            <div className="scan-summary">
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">
                    {result.openPorts?.length || 0}
                  </span>
                  <span className="stat-label">Open Ports</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {result.hosts?.length || 0}
                  </span>
                  <span className="stat-label">Live Hosts</span>
                </div>
              </div>
            </div>

            {result.openPorts?.length > 0 && (
              <div className="ports-section">
                <h3>🔓 Open Ports & Services</h3>
                <div className="ports-grid">
                  {result.openPorts.map((port, i) => (
                    <div key={i} className="port-card">
                      <div className="port-number">{port.port}</div>
                      <div className="port-service">
                        {port.service || "Unknown"}
                      </div>
                      <div className={`port-risk ${port.risk || "low"}`}>
                        {port.risk === "high"
                          ? "HIGH"
                          : port.risk === "medium"
                          ? "MEDIUM"
                          : "LOW"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.vulnerabilities?.length > 0 && (
              <div className="vuln-section">
                <h3>⚠️ Detected Vulnerabilities</h3>
                <div className="vuln-grid">
                  {result.vulnerabilities.map((vuln, i) => (
                    <div key={i} className="vuln-card">
                      <span className="vuln-icon">🚨</span>
                      <div>
                        <h4>{vuln.title}</h4>
                        <p>{vuln.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        .network-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .network-header h1 {
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .network-header p {
          color: #9ca3af;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .network-input {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .network-input-field {
          flex: 1;
          min-width: 300px;
          padding: 1.2rem 1.5rem;
          border: 2px solid #374151;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          color: #00d4ff;
          font-size: 1.1rem;
          font-family: "Courier New", monospace;
          backdrop-filter: blur(10px);
        }
        .network-input-field::placeholder {
          color: #6b7280;
        }
        .network-input-field:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
        }
        .network-btn {
          padding: 1.2rem 2.5rem;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .network-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 212, 255, 0.4);
        }
        .network-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .scan-summary {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          color: #9ca3af;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .ports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .port-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
        }
        .port-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .port-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #00d4ff;
          margin-bottom: 0.5rem;
          font-family: monospace;
        }
        .port-service {
          color: #9ca3af;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .port-risk {
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .port-risk.low {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
        .port-risk.medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        .port-risk.high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .vuln-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .vuln-grid {
          display: grid;
          gap: 1.5rem;
        }
        .vuln-card {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .vuln-icon {
          font-size: 2rem;
          margin-top: 0.2rem;
        }
        .vuln-card h4 {
          margin: 0 0 0.5rem 0;
          color: #ef4444;
        }
        .vuln-card p {
          margin: 0;
          color: #fca5a5;
        }
        .error-card {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          color: #ef4444;
        }
        @media (max-width: 768px) {
          .network-container {
            padding: 1rem;
          }
          .network-header h1 {
            font-size: 2.2rem;
          }
          .network-input {
            flex-direction: column;
          }
          .ports-grid {
            grid-template-columns: 1fr;
          }
          .summary-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  );
}
