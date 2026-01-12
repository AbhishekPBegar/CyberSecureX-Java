import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-logo">
        🔐 <span>CyberSecureX</span>
      </div>

      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>

        <li className={location.pathname === "/scanner" ? "active" : ""}>
          <Link to="/scanner">Scanner</Link>
        </li>

        <li className={location.pathname === "/network" ? "active" : ""}>
          <Link to="/network">Network</Link>
        </li>

        <li className={location.pathname === "/password" ? "active" : ""}>
          <Link to="/password">Password</Link>
        </li>

        <li className={location.pathname === "/file-share" ? "active" : ""}>
          <Link to="/file-share">File Share</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
