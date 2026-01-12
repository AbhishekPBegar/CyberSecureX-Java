import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Network from "./pages/Network";

const Password = () => <h1 style={{ color: "white" }}>Password Page</h1>;
const FileShare = () => <h1 style={{ color: "white" }}>File Share Page</h1>;

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/network" element={<Network />} />
        <Route path="/password" element={<Password />} />
        <Route path="/file-share" element={<FileShare />} />
      </Routes>
    </Router>
  );
}

export default App;
