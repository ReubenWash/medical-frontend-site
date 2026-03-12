import axiosInstance from './axios'

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register/', userData)
  return response.data
}

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login/', { email, password })
  const { tokens, user } = response.data
  localStorage.setItem('access_token',  tokens.access)
  localStorage.setItem('refresh_token', tokens.refresh)
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

export const logout = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) await axiosInstance.post('/auth/logout/', { refresh })
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }
}

export const getCurrentUser  = () => {
  const u = localStorage.getItem('user')
  return u ? JSON.parse(u) : null
}
export const isAuthenticated = () => !!localStorage.getItem('access_token')

export const getMyProfile = async () => {
  const response = await axiosInstance.get('/auth/me/')
  return response.data
}
export const updateMyProfile = async (data) => {
  const response = await axiosInstance.patch('/auth/me/', data)
  return response.data
}

// ── Email verification ──────────────────────────────────────────────────────
export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(`/auth/verify-email/?token=${token}`)
  return response.data
}
export const resendVerification = async (email) => {
  const response = await axiosInstance.post('/auth/resend-verification/', { email })
  return response.data
}

// ── Password reset ──────────────────────────────────────────────────────────
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password/', { email })
  return response.data
}
export const resetPassword = async (uid, token, newPassword, newPassword2) => {
  const response = await axiosInstance.post('/auth/reset-password/', {
    uid, token, new_password: newPassword, new_password2: newPassword2
  })
  return response.data
}
