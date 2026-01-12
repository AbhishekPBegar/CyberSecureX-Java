import { useState } from "react";
import PageLayout from "../components/PageLayout";

export default function NetworkScannerPage() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/network/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target.trim() }),
      });
      const data = await res.json();

      // Transform YOUR backend response to UI format
      const uiResult = {
        status: data.status,
        networkInfo: data.networkInfo,
        deviceCount: data.deviceCount,
        message: data.message,
        devices: data.devices || [],
        hosts:
          data.devices.length > 0
            ? data.devices.map((d) => d.ip || d)
            : [data.networkInfo?.localIP],
        openPorts: data.devices?.flatMap((device) => device.ports || []) || [],
      };

      setResult(uiResult);
    } catch (e) {
      setResult({
        status: "error",
        message: "Network scan failed - check backend connection",
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
          <p>Discover devices, open ports & security risks on your network</p>
        </div>

        <div className="network-input">
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Scan local network (leave empty for auto-scan)"
            className="network-input-field"
          />
          <button
            onClick={handleScan}
            disabled={loading}
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
                  <span className="stat-number">{result.deviceCount || 0}</span>
                  <span className="stat-label">Live Devices</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {result.networkInfo?.subnet || "N/A"}
                  </span>
                  <span className="stat-label">Subnet</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{result.localIP || "N/A"}</span>
                  <span className="stat-label">Your IP</span>
                </div>
              </div>

              {result.networkInfo && (
                <div className="network-details">
                  <h4>🌐 Network Info</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Local IP:</span>
                      <span>{result.networkInfo.localIP}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Subnet:</span>
                      <span>{result.networkInfo.subnet}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Adapter:</span>
                      <span>{result.networkInfo.networkInterface}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {result.devices && result.devices.length > 0 && (
              <div className="devices-section">
                <h3>🔍 Discovered Devices ({result.devices.length})</h3>
                <div className="devices-grid">
                  {result.devices.map((device, i) => (
                    <div key={i} className="device-card">
                      <div className="device-ip">{device.ip || device}</div>
                      <div className="device-name">
                        {device.name || "Unknown"}
                      </div>
                      <div className="device-ports">
                        {device.ports?.length > 0 ? (
                          device.ports.map((port) => (
                            <span key={port} className="port-tag medium">
                              {port}
                            </span>
                          ))
                        ) : (
                          <span className="no-ports">No open ports</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.deviceCount === 0 && (
              <div className="no-devices">
                <h3>✅ Network Clean</h3>
                <p>{result.message}</p>
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
          padding: 2.5rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
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
        .network-details {
          background: rgba(255, 255, 255, 0.03);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          color: #9ca3af;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
        }
        .devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .device-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        .device-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .device-ip {
          font-size: 1.8rem;
          font-weight: 800;
          color: #00d4ff;
          margin-bottom: 0.5rem;
          font-family: monospace;
        }
        .device-name {
          color: #9ca3af;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .device-ports {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        .port-tag {
          padding: 0.4rem 1rem;
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .no-ports {
          color: #10b981;
          font-weight: 600;
        }
        .no-devices {
          text-align: center;
          padding: 3rem;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 16px;
          border: 1px solid rgba(16, 185, 129, 0.3);
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
          .summary-stats {
            grid-template-columns: 1fr;
          }
          .devices-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageLayout>
  );
}
