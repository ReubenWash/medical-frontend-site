import React, { useState } from 'react'
import '../styles/Modal.css'
import { login, forgotPassword } from '../api/auth'

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToSignup }) => {
  const [view, setView]       = useState('login')   // 'login' | 'forgot' | 'sent'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const reset = () => {
    setView('login'); setError('')
    setEmail(''); setPassword(''); setForgotEmail('')
  }

  const handleClose = () => { reset(); onClose() }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      reset()
      onLogin(user)
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(forgotEmail)
      setView('sent')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal active" onClick={(e) => { if (e.target.classList.contains('modal')) handleClose() }}>
      <div className="modal-content">

        {/* ── Login View ── */}
        {view === 'login' && (
          <>
            <div className="modal-header">
              <h2>Login to Your Account</h2>
              <button className="close-modal" onClick={handleClose}>&times;</button>
            </div>

            {error && <p className="form-error">{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="Enter your email"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: '12px' }}>
                <button type="button" className="switch-btn" onClick={() => { setView('forgot'); setError('') }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-signup modal-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="modal-switch">
              Don't have an account?{' '}
              <button className="switch-btn" onClick={() => { handleClose(); onSwitchToSignup() }}>Sign Up</button>
            </p>
          </>
        )}

        {/* ── Forgot Password View ── */}
        {view === 'forgot' && (
          <>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button className="close-modal" onClick={handleClose}>&times;</button>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && <p className="form-error">{error}</p>}

            <form onSubmit={handleForgot}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="Enter your email"
                  value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-signup modal-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="modal-switch">
              <button className="switch-btn" onClick={() => { setView('login'); setError('') }}>
                ← Back to Login
              </button>
            </p>
          </>
        )}

        {/* ── Email Sent Confirmation ── */}
        {view === 'sent' && (
          <>
            <div className="modal-header">
              <h2>Check Your Email</h2>
              <button className="close-modal" onClick={handleClose}>&times;</button>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <p style={{ color: '#374151', marginBottom: '8px', fontWeight: '600' }}>Reset link sent!</p>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                If an account exists for <strong>{forgotEmail}</strong>, you'll receive a password reset link shortly. Check your spam folder too.
              </p>
              <button className="btn btn-signup" onClick={() => { setView('login'); setError('') }}>
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginModal
