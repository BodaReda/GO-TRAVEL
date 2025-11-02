import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'

const StudentManagement = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    className: '',
    busNumber: ''
  })
  const [showQRModal, setShowQRModal] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent.studentId}`, formData)
      } else {
        await axios.post('/api/students', formData)
      }
      
      fetchStudents()
      resetForm()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving student')
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormData({
      studentId: student.studentId,
      name: student.name,
      className: student.className,
      busNumber: student.busNumber
    })
    setShowForm(true)
  }

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/students/${studentId}`)
        fetchStudents()
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting student')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      className: '',
      busNumber: ''
    })
    setEditingStudent(null)
    setShowForm(false)
  }

  const openQRModal = (student) => {
    setShowQRModal(student)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-dark">👥 Student Management</h1>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-primary text-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
          >
            ➕ Add Student
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-primary animate-fade-in">
            <h2 className="text-2xl font-bold text-dark mb-4">
              {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  required
                  disabled={!!editingStudent}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Class</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bus Number</label>
                <input
                  type="text"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-dark py-3 rounded-lg font-bold hover:bg-opacity-80 transition-all"
                >
                  {editingStudent ? '💾 Update' : '➕ Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-gradient-to-br from-primary to-secondary rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="flex justify-center mb-3">
                  <QRCodeSVG
                    value={student.studentId}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              
              <div className="text-white mb-4">
                <h3 className="text-xl font-bold mb-2">{student.name}</h3>
                <div className="text-sm space-y-1">
                  <div><strong>ID:</strong> {student.studentId}</div>
                  <div><strong>Class:</strong> {student.className}</div>
                  <div><strong>Bus:</strong> {student.busNumber}</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openQRModal(student)}
                  className="flex-1 bg-white text-dark py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm"
                >
                  🔍 View QR
                </button>
                <button
                  onClick={() => handleEdit(student)}
                  className="flex-1 bg-dark text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(student.studentId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl">No students added yet. Click "Add Student" to get started!</p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQRModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-dark mb-4">{showQRModal.name}</h2>
              <div className="bg-white p-4 rounded-lg border-4 border-primary mb-4 inline-block">
                <QRCodeSVG
                  value={showQRModal.studentId}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-gray-600 mb-4">
                <div>Student ID: <strong>{showQRModal.studentId}</strong></div>
                <div>Class: <strong>{showQRModal.className}</strong></div>
                <div>Bus: <strong>{showQRModal.busNumber}</strong></div>
              </div>
              <button
                onClick={() => setShowQRModal(null)}
                className="bg-primary text-dark px-6 py-2 rounded-lg font-bold hover:bg-opacity-80 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentManagement

