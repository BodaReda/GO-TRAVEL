import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import QRScan from './pages/QRScan'
import StudentManagement from './pages/StudentManagement'
import Login from './pages/Login'
import Diagnostics from './pages/Diagnostics'
import StudentPortal from './pages/StudentPortal'
import Navbar from './components/Navbar'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/scan" 
        element={
          <ProtectedRoute>
            <QRScan />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/students" 
        element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        } 
      />
      <Route path="/diagnostics" element={<Diagnostics />} />
      <Route path="/student" element={<StudentPortal />} />
      <Route path="/student-portal" element={<StudentPortal />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

function AppContent() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  
  // Don't show navbar on student portal or login page
  const showNavbar = location.pathname !== '/student' && 
                     location.pathname !== '/student-portal' && 
                     location.pathname !== '/login'
  
  return (
    <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <AppRoutes />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App

