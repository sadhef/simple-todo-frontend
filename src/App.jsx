import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;