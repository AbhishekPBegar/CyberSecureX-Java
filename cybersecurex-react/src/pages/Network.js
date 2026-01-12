import React, { useState } from "react";
import "../styles/Network.css";

const Network = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const scanNetwork = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/network/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Scan failed");
      }

      const data = await response.json();

      if (data.status === "error") {
        setError(data.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalPorts = (devices = []) =>
    devices.reduce(
      (total, d) => total + (d.openPorts ? d.openPorts.length : 0),
      0
    );

  const getHighRiskCount = (devices = []) =>
    devices.reduce((total, d) => {
      if (d.openPorts) {
        return total + d.openPorts.filter((p) => p.riskLevel === "HIGH").length;
      }
      return total;
    }, 0);

  return (
    <div className="container">
      <div className="header">
        <h1>🖧 Network Security Scanner</h1>
        <p>Discover devices on your local network and analyze their security</p>
      </div>

      <div className="warning-banner">
        <strong>⚠️ Important:</strong> Only scan networks you own or have
        permission to test.
      </div>

      <div className="scan-form">
        <h3>🔍 Local Network Discovery</h3>
        <p>
          Click below to scan your local network for active devices, open ports,
          and potential security issues.
        </p>

        <button className="btn" onClick={scanNetwork} disabled={loading}>
          {loading ? "🔍 Scanning..." : "🚀 Start Network Scan"}
        </button>

        <small>⏱️ This scan may take 30–60 seconds</small>
      </div>

      {loading && (
        <div className="loading" style={{ display: "block" }}>
          <div className="spinner"></div>
          <h3>🔍 Scanning Your Network...</h3>
          <p>Discovering active devices and analyzing security...</p>
        </div>
      )}

      {error && (
        <div className="network-info">
          <h3 style={{ color: "var(--accent-red)" }}>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="results" style={{ display: "block" }}>
          {/* Summary */}
          <div className="summary">
            <h3>📊 Network Scan Summary</h3>
            <p>
              <strong>Scan completed:</strong> {result.timestamp}
            </p>

            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">{result.deviceCount}</div>
                <div>Active Devices</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">
                  {getTotalPorts(result.devices)}
                </div>
                <div>Total Open Ports</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">
                  {getHighRiskCount(result.devices)}
                </div>
                <div>High Risk Services</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">
                  {result.networkInfo?.localIP || "Unknown"}
                </div>
                <div>Your IP</div>
              </div>
            </div>
          </div>

          {/* Network Info */}
          {result.networkInfo && (
            <div className="network-info">
              <h3>🌐 Network Information</h3>
              <div className="info-grid">
                {Object.entries(result.networkInfo).map(([key, value]) => (
                  <div className="info-item" key={key}>
                    <strong>{key}:</strong>
                    <br />
                    {value || "Unknown"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devices */}
          {result.devices?.length > 0 && (
            <>
              <h3
                style={{
                  color: "var(--accent-neon)",
                  margin: "20px 0",
                  fontFamily: "Orbitron, monospace",
                }}
              >
                🔍 Discovered Devices
              </h3>

              <div className="devices-grid">
                {result.devices.map((device, i) => (
                  <div className="device-card" key={i}>
                    <div className="device-header">
                      <div className="device-ip">{device.ip}</div>
                      <div className="device-type">
                        {device.deviceType || "Unknown"}
                      </div>
                    </div>

                    <div className="device-info">
                      <strong>Hostname:</strong> {device.hostname || "Unknown"}
                      <br />
                      <strong>MAC:</strong> {device.macAddress || "Unknown"}
                      <br />
                      <strong>Status:</strong>{" "}
                      <span style={{ color: "var(--accent-neon)" }}>
                        ✅ Active
                      </span>
                    </div>

                    {device.openPorts?.length > 0 && (
                      <div className="ports-section">
                        <strong>Open Ports ({device.openPorts.length}):</strong>

                        <div className="ports-grid">
                          {device.openPorts.map((port, idx) => (
                            <div
                              key={idx}
                              className={`port-badge port-${port.riskLevel.toLowerCase()}`}
                            >
                              {port.port}
                              <br />
                              <small>{port.service}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {device.securityNotes?.length > 0 && (
                      <div className="security-notes">
                        <h5>🛡️ Security Analysis:</h5>
                        {device.securityNotes.map((note, idx) => {
                          let cls = "note-info";
                          if (note.includes("CRITICAL")) cls = "note-critical";
                          else if (
                            note.includes("WARNING") ||
                            note.includes("HIGH")
                          )
                            cls = "note-warning";
                          else if (note.includes("✅")) cls = "note-success";

                          return (
                            <div key={idx} className={`security-note ${cls}`}>
                              {note}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Network;
