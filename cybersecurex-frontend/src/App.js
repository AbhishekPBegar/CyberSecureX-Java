import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ScannerPage from "./pages/ScannerPage";
import NetworkPage from "./pages/NetworkPage";
import PasswordPage from "./pages/PasswordPage";
import FileSharePage from "./pages/FileSharePage";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "2rem", background: "#0a0a0a" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/password" element={<PasswordPage />} />
            <Route path="/files" element={<FileSharePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
