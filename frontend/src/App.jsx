import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

const App = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <Link to="/login" className="text-white/80 hover:text-white transition-colors">
          Login
        </Link>
        <Link to="/register" className="text-white/80 hover:text-white transition-colors">
          Register
        </Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App