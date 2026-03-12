import React, { useState } from 'react'
import '../styles/Modal.css'
import { register, resendVerification } from '../api/auth'

const SignupModal = ({ isOpen, onClose, onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '',
    phone: '', gender: '', password: '', password2: ''
  })
  const [showPw, setShowPw]   = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg]         = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.password2) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const data = await register(formData)
      localStorage.setItem('access_token',  data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      setRegistered(true)
      // Pass user up but stay showing verification banner
      onSignup(data.user)
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        const first = Object.values(errors)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendMsg('')
    try {
      await resendVerification(formData.email)
      setResendMsg('Verification email resent! Check your inbox.')
    } catch {
      setResendMsg('Failed to resend. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ first_name:'', last_name:'', email:'', phone:'', gender:'', password:'', password2:'' })
    setError(''); setRegistered(false); setResendMsg('')
    onClose()
  }

  // ── Success / Email Verification Banner ──
  if (registered) {
    return (
      <div className="modal active" onClick={(e) => { if (e.target.classList.contains('modal')) handleClose() }}>
        <div className="modal-content" style={{ textAlign: 'center' }}>
          <div className="modal-header">
            <h2>Account Created!</h2>
            <button className="close-modal" onClick={handleClose}>&times;</button>
          </div>
          <div style={{ padding: '10px 0 24px' }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎉</div>
            <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              Welcome, {formData.first_name}!
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              We've sent a verification email to <strong>{formData.email}</strong>.<br />
              Please check your inbox and click the link to verify your account.
            </p>
            <div className="verification-notice">
              <span>📧</span> Didn't receive it?{' '}
              <button className="switch-btn" onClick={handleResend} disabled={resendLoading}>
                {resendLoading ? 'Sending...' : 'Resend email'}
              </button>
            </div>
            {resendMsg && <p style={{ fontSize: '13px', color: '#16a34a', marginTop: '10px' }}>{resendMsg}</p>}
            <button className="btn btn-signup" style={{ marginTop: '24px' }} onClick={handleClose}>
              Continue to Site
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal active" onClick={(e) => { if (e.target.classList.contains('modal')) handleClose() }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Account</h2>
          <button className="close-modal" onClick={handleClose}>&times;</button>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input type="text" className="form-input" placeholder="First name"
                name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input type="text" className="form-input" placeholder="Last name"
                name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" className="form-input" placeholder="Enter your email"
              name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" placeholder="+233..."
                name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input form-select-input" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="password-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Create a password (min 8 chars)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw(s => !s)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div className="password-wrap">
              <input
                type={showPw2 ? 'text' : 'password'}
                className="form-input"
                placeholder="Confirm your password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw2(s => !s)}>
                {showPw2 ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-signup modal-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="modal-switch">
          Already have an account?{' '}
          <button className="switch-btn" onClick={() => { handleClose(); onSwitchToLogin() }}>Login</button>
        </p>
      </div>
    </div>
  )
}

export default SignupModal
