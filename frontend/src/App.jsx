import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CVVault from './pages/CVVault'
import JobRadar from './pages/JobRadar'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vault" element={<CVVault />} />
          <Route path="/radar" element={<JobRadar />} />
          <Route path="/radar" element={<div className="p-8 text-center text-gray-500">Job Radar Module coming soon...</div>} />
          <Route path="/optimizer" element={<div className="p-8 text-center text-gray-500">AI Optimizer Module coming soon...</div>} />
          <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings Module coming soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
