import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'

const Dashboard = () => {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterBus, setFilterBus] = useState('')
  const [filterClass, setFilterClass] = useState('')

  useEffect(() => {
    fetchSummary()
  }, [selectedDate])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/attendance/summary/${selectedDate}`)
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching summary:', error)
      if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
        // Handle network errors or missing data gracefully
        setSummary([])
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredSummary = summary.filter(item => {
    if (filterBus && item.busNumber !== filterBus) return false
    if (filterClass && item.className !== filterClass) return false
    return true
  })

  const presentCount = filteredSummary.filter(item => item.status === 'Present').length
  const absentCount = filteredSummary.filter(item => item.status === 'Absent').length
  const totalCount = filteredSummary.length
  const attendancePercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0

  const uniqueBuses = [...new Set(summary.map(item => item.busNumber))].sort()
  const uniqueClasses = [...new Set(summary.map(item => item.className))].sort()

  const exportToExcel = () => {
    const data = filteredSummary.map(item => ({
      'Student ID': item.studentId,
      'Name': item.name,
      'Class': item.className,
      'Bus Number': item.busNumber,
      'Status': item.status,
      'Check-in Time': item.checkInTime ? new Date(item.checkInTime).toLocaleString() : 'N/A'
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance')
    XLSX.writeFile(wb, `attendance-${selectedDate}.xlsx`)
  }

  const exportToCSV = async () => {
    try {
      let url = `/api/export/csv/${selectedDate}`
      if (filterBus) url += `?busNumber=${filterBus}`
      if (filterClass) url += `${filterBus ? '&' : '?'}className=${filterClass}`
      
      const response = await axios.get(url, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `attendance-${selectedDate}.csv`
      link.click()
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-dark mb-6">📊 Dashboard</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bus Number</label>
            <select
              value={filterBus}
              onChange={(e) => setFilterBus(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">All Buses</option>
              {uniqueBuses.map(bus => (
                <option key={bus} value={bus}>{bus}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Class</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={exportToExcel}
              className="flex-1 bg-primary text-dark py-2 px-4 rounded-lg font-semibold hover:bg-opacity-80 transition-all"
            >
              📥 Excel
            </button>
            <button
              onClick={exportToCSV}
              className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-80 transition-all"
            >
              📄 CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-dark">{totalCount}</div>
            <div className="text-gray-700">Total Students</div>
          </div>
          <div className="bg-green-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-800">{presentCount}</div>
            <div className="text-gray-700">Present</div>
          </div>
          <div className="bg-red-200 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-800">{absentCount}</div>
            <div className="text-gray-700">Absent</div>
          </div>
          <div className="bg-accent rounded-xl p-4 text-center text-white">
            <div className="text-3xl font-bold">{attendancePercentage}%</div>
            <div>Attendance</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Attendance Progress</span>
            <span className="font-semibold text-gray-700">{attendancePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-dark mb-4">Student Attendance</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSummary.map((item) => (
              <div
                key={item.studentId}
                className={`rounded-xl p-4 border-2 transition-all duration-300 transform hover:scale-105 ${
                  item.status === 'Present'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-dark">{item.name}</h3>
                  <span className={`text-2xl ${item.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.status === 'Present' ? '✅' : '❌'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>ID: {item.studentId}</div>
                  <div>Class: {item.className}</div>
                  <div>Bus: {item.busNumber}</div>
                  {item.checkInTime && (
                    <div className="text-xs text-gray-500 mt-2">
                      Check-in: {new Date(item.checkInTime).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

