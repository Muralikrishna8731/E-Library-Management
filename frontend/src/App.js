import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import PortalSelection from './pages/PortalSelection.jsx';
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
        <Route
          path="/library"
          element={(
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin-dashboard"
          element={(
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />

        <Route path="/dashboard" element={<Navigate to="/library" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
