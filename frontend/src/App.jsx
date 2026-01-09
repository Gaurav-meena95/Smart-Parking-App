import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'


function AppContent() {
  const [currentRole, setCurrentRole] = useState('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleHomePage = (role) => {
    switch (role) {
      case 'user':
        return '/home';
      case 'manager':
        return '/manager';
      case 'driver':
        return '/driver';
      case 'admin':
        return '/admin';
      default:
        return '/home';
    }
  };

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    navigate(getRoleHomePage(role));
  };

 
  return (
    <>

        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/layout" element={< MainLayout />} />
        </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - Landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        {/* All other routes */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}