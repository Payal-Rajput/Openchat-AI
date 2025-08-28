import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return null; // Don't show navigation when authenticated
  }
  
  return (
    <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <Link to="/login" className="text-white/80 hover:text-white transition-colors">
        Login
      </Link>
      <Link to="/register" className="text-white/80 hover:text-white transition-colors">
        Register
      </Link>
    </nav>
  );
};

const AppContent = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App