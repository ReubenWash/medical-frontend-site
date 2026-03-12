import axiosInstance from './axios'

// Get all appointments for logged in patient
export const getMyAppointments = async () => {
  const response = await axiosInstance.get('/appointments/')
  return response.data
}

// Book a new appointment
export const bookAppointment = async (appointmentData) => {
  const response = await axiosInstance.post('/appointments/', appointmentData)
  return response.data
}

// Cancel an appointment
export const cancelAppointment = async (id, reason = '') => {
  const response = await axiosInstance.post(`/appointments/${id}/cancel/`, { reason })
  return response.data
}

// Get a single appointment
export const getAppointment = async (id) => {
  const response = await axiosInstance.get(`/appointments/${id}/`)
  return response.data
}