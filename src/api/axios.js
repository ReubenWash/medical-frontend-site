import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medical-backend234567.onrender.com/api/v1'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh })
        const newAccess   = res.data.access
        const newRefresh  = res.data.refresh  // backend now rotates — always store latest

        localStorage.setItem('access_token', newAccess)
        if (newRefresh) localStorage.setItem('refresh_token', newRefresh)

        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return axiosInstance(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('auth:logout'))
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
