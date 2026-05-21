import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-started" element={<PortalSelection />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
