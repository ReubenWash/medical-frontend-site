import axiosInstance from './axios'

// Get all active doctors
export const getDoctors = async () => {
  const response = await axiosInstance.get('/doctors/')
  return response.data
}

// Get a single doctor
export const getDoctor = async (id) => {
  const response = await axiosInstance.get(`/doctors/${id}/`)
  return response.data
}

// Get available slots for a doctor on a specific date
export const getAvailableSlots = async (doctorId, date) => {
  const response = await axiosInstance.get(`/doctors/${doctorId}/available-slots/`, {
    params: { date }
  })
  return response.data
}