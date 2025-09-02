import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard'

  function updateField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(form)
      toast.success('Logged in successfully!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[100vh]  px-30 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 p-6 max-w-9xl mx-auto lg:items-center  bg-black  text-white">
      {/* Hero Section - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block z-[999999]">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-black to-gray-900 border border-blue-500/25">
          <h2 className="text-4xl font-bold mb-3 text-white">Welcome back to EchoMind</h2>
          <p className="text-lg text-white/90">Continue your conversations powered by AI. Secure and fast access.</p>
        </div>
      </div>
      
      {/* Form Card */}
      <div className="bg-black backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl ">
        <h1 className="text-3xl font-bold mb-2 text-white">Login</h1>
        <p className="text-sm text-white/70 mb-6">Use your email and password to access your account</p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white/90">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={updateField}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white/90">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={updateField}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
              required
            />
          </div>
          
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-xs text-white/60 mt-6 text-center">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default Login


