import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CVVault from "./pages/CVVault";
import JobRadar from "./pages/JobRadar";
import Optimizer from "./pages/Optimizer";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<JobRadar />} />
          <Route path="/vault" element={<CVVault />} />
          <Route path="/radar" element={<JobRadar />} />
          <Route path="/optimizer" element={<Optimizer />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
