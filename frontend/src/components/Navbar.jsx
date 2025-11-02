import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) return null

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/scan', label: 'Scan QR' },
    { path: '/students', label: 'Manage Students' },
  ]

  return (
    <nav className="bg-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-primary">🚌 Bus Attendance</h1>
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-primary text-dark'
                      : 'hover:bg-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-secondary rounded-lg font-semibold hover:bg-opacity-80 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

