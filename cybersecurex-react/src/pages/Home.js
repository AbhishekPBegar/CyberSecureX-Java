import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const title = "CyberSecureX";
  const message = "Welcome to your Security Toolkit!";

  return (
    <div className="container">
      <div className="header">
        <h1 className="pulse">
          🔐 <span>{title}</span>
        </h1>

        <p style={{ fontSize: "1.2rem" }}>{message}</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>🔍 Website Scanner</h3>
          <p>
            Check for open ports & common vulnerabilities on any public website.
            Analyze SSL certificates and security headers.
          </p>
          <Link to="/scanner" className="btn">
            Start Scanning
          </Link>
        </div>

        <div className="feature-card">
          <h3>🖧 Network Discovery</h3>
          <p>
            Discover active devices on your local network, along with open ports
            and services running on each device.
          </p>
          <Link to="/network" className="btn">
            Scan Network
          </Link>
        </div>

        <div className="feature-card">
          <h3>🛡️ Password Checker</h3>
          <p>
            Evaluate password strength & check if it's been breached online
            using HaveIBeenPwned database.
          </p>
          <Link to="/password" className="btn">
            Check Password
          </Link>
        </div>

        <div className="feature-card">
          <h3>📁 Secure File Share</h3>
          <p>
            Upload files securely with expiry time, download limits, and
            optional password protection.
          </p>
          <Link to="/file-share" className="btn">
            Share Files
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
