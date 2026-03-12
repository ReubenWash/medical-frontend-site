import React, { useState, useEffect } from 'react'
import '../styles/DoctorsSection.css'
import { getDoctors } from '../api/doctors'

const SPECIALTY_ICONS = {
  'Cardiologist':        '🫀',
  'Pediatrician':        '👶',
  'Dermatologist':       '🧴',
  'Orthopedist':         '🦴',
  'Neurologist':         '🧠',
  'Dentist':             '🦷',
  'Gynecologist':        '🩺',
  'Ophthalmologist':     '👁',
  'Psychiatrist':        '💬',
  'Radiologist':         '🔬',
  'Surgeon':             '🔪',
  'General Practitioner':'🩻',
}

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoctors()
      .then(data => setDoctors(data.results || data))
      .catch(err => console.error('Failed to load doctors:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="doctors-section">
      <h2 className="section-title">Our Expert Doctors</h2>
      <div className="doctors-grid">
        {[1,2,3,4].map(i => <div key={i} className="doctor-card skeleton" />)}
      </div>
    </div>
  )

  return (
    <div className="doctors-section">
      <h2 className="section-title">Our Expert Doctors</h2>
      <p className="section-subtitle">Meet our team of experienced medical professionals</p>
      <div className="doctors-grid">
        {doctors.length > 0 ? doctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-photo-wrap">
              {doctor.photo_url ? (
                <img src={doctor.photo_url} alt={doctor.full_name} className="doctor-photo" />
              ) : (
                <div className="doctor-avatar">
                  {SPECIALTY_ICONS[doctor.specialty] || '👨‍⚕️'}
                </div>
              )}
              <div className="doctor-status-dot" title="Active" />
            </div>
            <div className="doctor-name">{doctor.full_name}</div>
            <div className="doctor-specialty">{doctor.specialty}</div>
            {doctor.bio && <p className="doctor-bio">{doctor.bio}</p>}
            <div className="doctor-fee">
              <span>💰</span> Consultation: <strong>${doctor.consultation_fee}</strong>
            </div>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: '#666', gridColumn: '1/-1' }}>
            No doctors available at the moment.
          </p>
        )}
      </div>
    </div>
  )
}

export default DoctorsSection
