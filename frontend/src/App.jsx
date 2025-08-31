import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  if (isAuthenticated) {
    return (
      <nav className="flex justify-between items-center py-5 px-10 border-b border-white/20  w-[100vw] mx-auto bg-black">
      {/* <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto bg-red-300"> */}
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
          <button
            onClick={toggleTheme}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-lg bg-white/10"
          >
            {isDarkMode ? (
              <i className="ri-sun-fill text-xl"></i>
            ) : (
              <i className="ri-moon-fill text-xl"></i>
            )}
          </button>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto ">
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
  const { isDarkMode, backgroundColor } = useTheme();
  
  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}
      style={{ backgroundColor: backgroundColor }}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse ${
          isDarkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 rounded-full opacity-30 animate-bounce ${
          isDarkMode ? 'bg-pink-500' : 'bg-purple-400'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute bottom-20 left-1/4 w-20 h-20 rounded-full opacity-25 animate-pulse ${
          isDarkMode ? 'bg-blue-500' : 'bg-pink-400'
        }`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute bottom-40 right-1/3 w-28 h-28 rounded-full opacity-20 animate-bounce ${
          isDarkMode ? 'bg-indigo-500' : 'bg-indigo-400'
        }`} style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating squares */}
        <div className={`absolute top-1/3 left-1/2 w-16 h-16 rotate-45 opacity-15 animate-pulse ${
          isDarkMode ? 'bg-purple-600' : 'bg-blue-300'
        }`} style={{ animationDelay: '1.5s' }}></div>
        <div className={`absolute bottom-1/3 right-1/4 w-12 h-12 rotate-45 opacity-20 animate-bounce ${
          isDarkMode ? 'bg-pink-600' : 'bg-purple-300'
        }`} style={{ animationDelay: '2.5s' }}></div>
      </div>

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
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#fff' : '#000',
            border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App