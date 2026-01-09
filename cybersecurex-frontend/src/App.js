import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ScannerPage from "./pages/ScannerPage";
import NetworkPage from "./pages/NetworkPage";
import PasswordPage from "./pages/PasswordPage";
import FileSharePage from "./pages/FileSharePage";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h1>🔐 CyberSecureX</h1>
        <ul>
          <li>
            <Link to="/">🏠 Home</Link>
          </li>
          <li>
            <Link to="/scanner">🔍 Scanner</Link>
          </li>
          <li>
            <Link to="/network">🖧 Network</Link>
          </li>
          <li>
            <Link to="/password">🛡️ Password</Link>
          </li>
          <li>
            <Link to="/files">📁 Files</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/password" element={<PasswordPage />} />
          <Route path="/files" element={<FileSharePage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
