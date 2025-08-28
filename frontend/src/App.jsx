import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return (
      <nav className="flex   justify-between items-center p-6 max-w-7xl mx-auto">
        <div>
          <h1 className='text-white text-2xl font-bold'>ECHOMIND</h1>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/chat" className="text-white/80 hover:text-white transition-colors">
            Chat
          </Link>
          <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/history" className="text-white/80 hover:text-white transition-colors">
            History
          </Link>
          <Link to="/settings" className="text-white/80 hover:text-white transition-colors">
            Settings
          </Link>
        <Link to="/login" className="text-white/80 hover:text-white transition-colors">
          Logout
        </Link>
        </div>
      </nav>
    );
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
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route 
          path="/chat" 
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />
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