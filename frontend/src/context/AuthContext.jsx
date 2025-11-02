import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get('/api/auth/verify')
      if (response.data.valid) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
    } catch (error) {
      console.error('Token verification error:', error)
      // Only clear token if it's an auth error, not a network error
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password })
      const { token } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      let errorMessage = 'Login failed'
      
      if (error.response?.status === 503) {
        errorMessage = 'Database not connected. MongoDB is required. Please check SETUP_MONGODB.md for setup instructions.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5000.'
      }
      
      return { 
        success: false, 
        message: errorMessage 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-dark">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

