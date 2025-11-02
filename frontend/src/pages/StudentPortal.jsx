import React, { useState } from 'react'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'

const StudentPortal = () => {
  const [studentId, setStudentId] = useState('')
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attendance, setAttendance] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!studentId.trim()) {
      setError('Please enter your Student ID')
      return
    }

    setLoading(true)
    setError('')
    setStudent(null)
    setAttendance([])

    try {
      // Get student info
      const studentResponse = await axios.get(`/api/students/${studentId}`)
      setStudent(studentResponse.data)

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0]
      try {
        const attendanceResponse = await axios.get(`/api/attendance/date/${today}`)
        const todayAttendance = attendanceResponse.data.find(
          a => a.studentId === studentId
        )
        if (todayAttendance) {
          setAttendance([todayAttendance])
        }
      } catch (err) {
        // No attendance record is okay
        setAttendance([])
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Student ID not found. Please check your ID and try again.')
      } else {
        setError('Error loading student information. Please try again.')
      }
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary to-secondary">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">🚌</h1>
          <h2 className="text-3xl font-bold text-dark mb-2">Student Portal</h2>
          <p className="text-gray-600">View your QR Code & Attendance</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Your Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g., STU001"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-all text-center text-lg font-semibold"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-dark py-3 rounded-lg font-bold text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Loading...' : '🔍 View My QR Code'}
          </button>
        </form>

        {student && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{student.name}</h3>
              <div className="text-sm space-y-1 opacity-90">
                <div><strong>Student ID:</strong> {student.studentId}</div>
                <div><strong>Class:</strong> {student.className}</div>
                <div><strong>Bus Number:</strong> {student.busNumber}</div>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="bg-white border-4 border-primary rounded-xl p-6 text-center">
              <h4 className="font-bold text-dark mb-4">Your QR Code</h4>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <QRCodeSVG
                    value={student.studentId}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Show this QR code to the bus supervisor for attendance
              </p>
              <button
                onClick={() => window.print()}
                className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition-all text-sm"
              >
                🖨️ Print QR Code
              </button>
            </div>

            {/* Today's Attendance Status */}
            {attendance.length > 0 ? (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <div className="font-bold">Attendance Marked Today!</div>
                    <div className="text-sm mt-1">
                      Time: {new Date(attendance[0].checkInTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏳</span>
                  <div>
                    <div className="font-bold">No attendance marked today</div>
                    <div className="text-sm mt-1">
                      Show your QR code to the supervisor
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setStudent(null)
                setStudentId('')
                setAttendance([])
                setError('')
              }}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
            >
              Search Another Student
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact your bus supervisor</p>
        </div>
      </div>
    </div>
  )
}

export default StudentPortal


