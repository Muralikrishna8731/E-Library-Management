import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import PortalSelection from './pages/PortalSelection.jsx';
import UserLogin from './pages/UserLogin.jsx'; 
import AdminLogin from './pages/AdminLogin.jsx'; 
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; // Imported successfully
import UserLogin from './pages/UserLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Entry Point */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Portal Choice */}
        <Route path="/get-started" element={<PortalSelection />} />
        
        {/* Specific Login Routes */}
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ADDED: Route for Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
        {/* Future Dashboard Route Placeholder */}
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
