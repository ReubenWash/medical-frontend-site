import React, { useState, useEffect } from 'react';
import '../styles/BookingForm.css';
import { getDoctors, getAvailableSlots } from '../api/doctors';
import { bookAppointment } from '../api/appointments';
import { isAuthenticated } from '../api/auth';

const BookingForm = ({ onBookAppointment }) => {
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
    appointment_type: 'general'
  });
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }))
  }, [])

  // Load doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors()
        setDoctors(data.results || data)
      } catch (err) {
        console.error('Failed to load doctors:', err)
      }
    }
    fetchDoctors()
  }, [])

  // Load available slots when doctor or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.doctor || !formData.date) return
      setSlotsLoading(true)
      setAvailableSlots([])
      setSelectedTime('')
      try {
        const data = await getAvailableSlots(formData.doctor, formData.date)
        setAvailableSlots(data.available_slots || [])
      } catch (err) {
        console.error('Failed to load slots:', err)
        setAvailableSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }
    fetchSlots()
  }, [formData.doctor, formData.date])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setFormData(prev => ({ ...prev, time }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isAuthenticated()) {
      setError('Please login or create an account to book an appointment.')
      return
    }

    if (!formData.doctor) {
      setError('Please select a doctor.')
      return
    }

    if (!formData.time) {
      setError('Please select a time slot.')
      return
    }

    setLoading(true)
    try {
      // Convert time from "09:00" to "09:00:00" for Django
      const payload = {
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time + ':00',
        reason: formData.reason,
        appointment_type: formData.appointment_type,
      }

      const data = await bookAppointment(payload)
      setSuccess('Appointment booked successfully! You will be notified once confirmed.')
      onBookAppointment(data)

      // Reset form
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData({
        doctor: '',
        date: tomorrow.toISOString().split('T')[0],
        time: '',
        reason: '',
        appointment_type: 'general'
      })
      setSelectedTime('')
      setAvailableSlots([])
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        const firstError = Object.values(errors)[0]
        setError(Array.isArray(firstError) ? firstError[0] : firstError)
      } else {
        setError('Failed to book appointment. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="booking-form" id="booking-form">
      <h2 className="form-title">Book an Appointment</h2>

      {error && (
        <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>
      )}
      {success && (
        <p style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{success}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Doctor:</label>
          <select
            className="form-select"
            name="doctor"
            value={formData.doctor}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Doctor...</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.full_name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Appointment Type:</label>
          <select
            className="form-select"
            name="appointment_type"
            value={formData.appointment_type}
            onChange={handleInputChange}
          >
            <option value="general">General Consultation</option>
            <option value="follow_up">Follow-Up</option>
            <option value="specialist">Specialist</option>
            <option value="checkup">Routine Check-up</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Choose Date:</label>
          <input
            type="date"
            className="form-input"
            id="appointment-date"
            name="date"
            value={formData.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Select a Time:</label>
          {slotsLoading ? (
            <p style={{ fontSize: '14px', color: '#666' }}>Loading available slots...</p>
          ) : availableSlots.length > 0 ? (
            <div className="time-slots">
              {availableSlots.map(time => (
                <div
                  key={time}
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#666' }}>
              {formData.doctor && formData.date
                ? 'No available slots for this date.'
                : 'Select a doctor and date to see available slots.'}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Reason for Visit</label>
          <textarea
            className="form-input"
            placeholder="Briefly describe your symptoms or reason for visit"
            rows="3"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-signup submit-btn"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;