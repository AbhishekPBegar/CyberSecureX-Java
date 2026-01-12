export default function Home() {
  return (
    <div className="container">
      <h1>🔐 CyberSecureX</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
        Professional cybersecurity toolkit for vulnerability assessment and
        security analysis.
      </p>

      <div className="card-grid">
        <div className="security-card">
          <h3>🔍 Website Scanner</h3>
          <p>
            Port scanning, SSL analysis, security headers, and vulnerability
            detection.
          </p>
        </div>

        <div className="security-card">
          <h3>🛡️ Password Checker</h3>
          <p>
            Strength analysis + real-time breach detection via HaveIBeenPwned
            API.
          </p>
        </div>

        <div className="security-card">
          <h3>🖧 Network Scanner</h3>
          <p>
            Device discovery, port mapping, service identification, risk
            assessment.
          </p>
        </div>

        <div className="security-card">
          <h3>📁 Secure File Share</h3>
          <p>
            Encrypted uploads, password protection, expiry controls, download
            limits.
          </p>
        </div>
      </div>
    </div>
  );
}
