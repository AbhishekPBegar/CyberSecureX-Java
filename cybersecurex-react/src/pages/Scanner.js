import React, { useState } from "react";
import "../styles/Scanner.css";

const Scanner = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const scanWebsite = async () => {
    if (!url.trim()) {
      alert("Please enter a website URL");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `url=${encodeURIComponent(url)}`,
      });

      if (!response.ok) {
        throw new Error("Failed to scan website");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔍 Website Security Scanner</h1>
        <p>Analyze websites for security vulnerabilities and open ports</p>
      </div>

      <div className="scanner-form">
        <h3>Enter Website URL</h3>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter website URL (e.g., google.com or https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scanWebsite()}
          />

          <button className="btn" onClick={scanWebsite} disabled={loading}>
            {loading ? "Scanning..." : "Scan Website"}
          </button>
        </div>

        <small>⚠️ Only scan websites you own or have permission to test</small>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Scanning website... This may take a few seconds.</p>
        </div>
      )}

      {error && (
        <div className="results" style={{ display: "block" }}>
          <div className="result-item error">
            <h4>❌ Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="results" style={{ display: "block" }}>
          <h3>Scan Results for: {result.host}</h3>

          <div className="result-item">
            <h4>🌐 Basic Information</h4>
            <p>
              <strong>URL:</strong> {result.url}
            </p>
            <p>
              <strong>Host:</strong> {result.host}
            </p>
            <p>
              <strong>Timestamp:</strong> {result.timestamp}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {result.reachable ? "✅ Reachable" : "❌ Not Reachable"}
            </p>
            <p>
              <strong>HTTPS:</strong> {result.hasSSL ? "✅ Yes" : "❌ No"}
            </p>
          </div>

          {result.openPorts?.length > 0 && (
            <div className="result-item">
              <h4>🔓 Open Ports</h4>
              <div className="port-list">
                {result.openPorts.map((port, i) => (
                  <span className="port" key={i}>
                    {port}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.securityIssues?.length > 0 && (
            <div className="result-item">
              <h4>🛡️ Security Analysis</h4>
              <ul className="issue-list">
                {result.securityIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {result.message && (
            <div className="result-item">
              <h4>📋 Summary</h4>
              <p>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;
