import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import OTPModal from '../components/OTPModal'

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  function updateField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      await register(form)
      toast.success('Registration successful! Please verify your email with OTP.')
      setShowOTPModal(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSuccess = () => {
    toast.success('Email verified! You can now login.')
    navigate('/login')
  }

  return (
    <>
      <div className="h-[100vh] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 p-6 max-w-7xl mx-auto lg:items-center">
        {/* Hero Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/25">
            <h2 className="text-4xl font-bold mb-3 text-white">Create your EchoMind account</h2>
            <p className="text-lg text-white/90">Verify your email to unlock full access and personalized chat history.</p>
          </div>
        </div>
        
        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-white">Register</h1>
          <p className="text-sm text-white/70 mb-6">Quick setup. We'll send you an OTP to verify your email.</p>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-white/90">
                Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="johndoe"
                value={form.username}
                onChange={updateField}
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500/50 transition-colors"
                required
              />
            </div>
            
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <p className="text-xs text-white/60 mt-6 text-center">
            We'll email a 6-digit OTP to verify your account.
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={form.email}
        onSuccess={handleOTPSuccess}
      />
    </>
  )
}

export default Register


