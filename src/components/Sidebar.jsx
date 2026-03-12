import React, { useState, useEffect } from 'react'
import '../styles/Sidebar.css'
import { getMyProfile, isAuthenticated, logout } from '../api/auth'
import { getMyAppointments, cancelAppointment } from '../api/appointments'
import { resendVerification } from '../api/auth'

const Sidebar = ({ onLogout, refreshSidebar }) => {
  const [userInfo, setUserInfo]       = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [resending, setResending]     = useState(false)
  const [resendMsg, setResendMsg]     = useState('')

  useEffect(() => {
    if (!isAuthenticated()) { setLoading(false); return }
    const fetchData = async () => {
      try {
        const [profile, apptData] = await Promise.all([getMyProfile(), getMyAppointments()])
        setUserInfo(profile)
        setAppointments(apptData.results || apptData)
      } catch (err) {
        console.error('Failed to load sidebar data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [refreshSidebar])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await cancelAppointment(id)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch { alert('Failed to cancel appointment.') }
  }

  const handleLogout = async () => { await logout(); onLogout() }

  const handleResendVerification = async () => {
    setResending(true)
    try {
      await resendVerification(userInfo.email)
      setResendMsg('Verification email sent!')
      setTimeout(() => setResendMsg(''), 4000)
    } catch { setResendMsg('Failed to send. Try again.') }
    finally { setResending(false) }
  }

  const formatDateTime = (date, time) => {
    const d = new Date(`${date}T${time}`)
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const statusClass = (s) => s === 'confirmed' ? 'appt-confirmed' : s === 'pending' ? 'appt-pending' : 'appt-cancelled'

  if (loading) return (
    <div className="sidebar">
      <div className="sidebar-card"><p className="sidebar-loading">Loading...</p></div>
    </div>
  )

  if (!isAuthenticated() || !userInfo) return (
    <div className="sidebar">
      <div className="sidebar-card">
        <h3 className="card-title">My Information</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>Please login to view your info.</p>
      </div>
    </div>
  )

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const activeAppts  = appointments.filter(a => ['pending','confirmed'].includes(a.status))

  return (
    <div className="sidebar">
      {/* User Info Card */}
      <div className="sidebar-card">
        <div className="user-avatar-wrap">
          <div className="user-avatar">
            {userInfo.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="user-name">{userInfo.full_name}</div>
            <div className="user-role">Patient</div>
          </div>
        </div>

        {/* Email verification warning */}
        {!userInfo.is_email_verified && (
          <div className="verify-banner">
            <span>⚠️</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '13px' }}>Email not verified</div>
              <button className="resend-btn" onClick={handleResendVerification} disabled={resending}>
                {resending ? 'Sending...' : 'Resend verification email'}
              </button>
              {resendMsg && <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>{resendMsg}</div>}
            </div>
          </div>
        )}

        <div className="info-list">
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{userInfo.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{userInfo.phone || '—'}</span>
          </div>
          {userInfo.gender && (
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>{userInfo.gender.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Appointments Card */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3 className="card-title">My Appointments</h3>
          {pendingCount > 0 && (
            <span className="pending-badge">{pendingCount} pending</span>
          )}
        </div>

        {activeAppts.length > 0 ? (
          <div className="appt-list">
            {activeAppts.slice(0, 5).map(a => (
              <div key={a.id} className="appt-item">
                <div className="appt-doctor">{a.doctor?.full_name}</div>
                <div className="appt-time">{formatDateTime(a.date, a.time)}</div>
                <div className="appt-footer">
                  <span className={`appt-status ${statusClass(a.status)}`}>{a.status}</span>
                  {['pending','confirmed'].includes(a.status) && (
                    <button className="appt-cancel-btn" onClick={() => handleCancel(a.id)}>Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-appts">No upcoming appointments.</p>
        )}
      </div>
    </div>
  )
}

export default Sidebar
