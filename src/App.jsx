
import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AboutUs from "./components/AboutUs"
import BookingForm from './components/BookingForm'
import Sidebar from './components/Sidebar'
import DoctorsSection from './components/DoctorsSection'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import { getCurrentUser, isAuthenticated } from './api/auth'
import './App.css'
import Services from './components/Services'
import Footer from './components/Footer'

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [user, setUser] = useState(null)
  const [refreshSidebar, setRefreshSidebar] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser())
    }
  }, [])

  // Listen for token expiry logout triggered from axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => setUser(null)
    window.addEventListener('auth:logout', handleAuthLogout)
    return () => window.removeEventListener('auth:logout', handleAuthLogout)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLoginModal(false)
  }

  const handleSignup = (userData) => {
    setUser(userData)
    setShowSignupModal(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handleBookAppointment = () => {
    setRefreshSidebar(prev => !prev)
  }

  const handleStartBooking = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true)
      return
    }

    document.getElementById('booking-form')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const handleCloseLogin = () => setShowLoginModal(false)
  const handleCloseSignup = () => setShowSignupModal(false)
  const handleOpenLogin = () => setShowLoginModal(true)
  const handleOpenSignup = () => setShowSignupModal(true)

  const handleSwitchToSignup = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const handleSwitchToLogin = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  return (
    <div className="App">

      <Header
        user={user}
        onLoginClick={handleOpenLogin}
        onSignupClick={handleOpenSignup}
      />

      <Hero onStartBooking={handleStartBooking} />

      <div className="container">
        <div className="main-content">

          {user ? (
            <>
              <BookingForm onBookAppointment={handleBookAppointment} />

              <Sidebar
                onLogout={handleLogout}
                refreshSidebar={refreshSidebar}
              />
            </>
          ) : (
            <div className="login-required">
              <h2>Login Required</h2>
              <p>Please login or create an account to book an appointment.</p>

              <button
                className="btn btn-login"
                onClick={handleOpenLogin}
              >
                Login to Book
              </button>
            </div>
          )}

        </div>

        <DoctorsSection />
      </div>

      <Services />
      <AboutUs />
      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLogin}
        onLogin={handleLogin}
        onSwitchToSignup={handleSwitchToSignup}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={handleCloseSignup}
        onSignup={handleSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />

    </div>
  )
}

export default App

