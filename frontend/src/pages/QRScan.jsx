import React, { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import axios from 'axios'
import Confetti from 'react-confetti'

const QRScan = () => {
  const [result, setResult] = useState('')
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [lastScanned, setLastScanned] = useState(null)
  const html5QrCodeRef = useRef(null)
  const scannerInitialized = useRef(false)

  useEffect(() => {
    if (scanning && !scannerInitialized.current) {
      startScanner()
    }
    
    return () => {
      stopScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning])

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader")
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleScan(decodedText)
        },
        (errorMessage) => {
          // Ignore scanning errors, just continue
        }
      )
      
      scannerInitialized.current = true
      setError('')
    } catch (err) {
      console.error('Scanner error:', err)
      setError('Camera error. Please check permissions and allow camera access.')
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current && scannerInitialized.current) {
      try {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
        scannerInitialized.current = false
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  const handleScan = async (studentId) => {
    // Prevent duplicate scans
    if (studentId === result) {
      return
    }
    
    setResult(studentId)
    await stopScanner()
    setScanning(false)
    await markAttendance(studentId)
  }

  const markAttendance = async (studentId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await axios.post('/api/attendance/scan', {
        studentId,
        date: today
      })

      if (response.data.attendance) {
        setSuccess(true)
        setError('')
        setShowConfetti(true)
        setLastScanned(response.data.attendance)
        
        // Hide confetti after 3 seconds
        setTimeout(() => {
          setShowConfetti(false)
        }, 3000)

        // Reset after 2 seconds and continue scanning
        setTimeout(() => {
          setSuccess(false)
          setResult('')
          setScanning(true)
        }, 2000)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to mark attendance'
      setError(errorMsg)
      setSuccess(false)
      
      // Continue scanning after error
      setTimeout(() => {
        setError('')
        setResult('')
        setScanning(true)
      }, 3000)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fade-in">
        <h1 className="text-4xl font-bold text-dark mb-6 text-center">📷 Scan QR Code</h1>

        <div className="max-w-2xl mx-auto">
          {/* Camera Preview */}
          <div className="relative mb-6">
            <div className="relative rounded-xl overflow-hidden border-4 border-primary shadow-2xl bg-black min-h-[400px]">
              <div id="reader" className="w-full"></div>
              {scanning && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="border-4 border-dashed border-white rounded-lg w-64 h-64"></div>
                </div>
              )}
              {!scanning && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 bg-opacity-95 flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{success ? '✅' : '⏸️'}</div>
                    <p className="text-xl font-semibold text-dark">
                      {success ? 'Scanning paused' : 'Camera paused'}
                    </p>
                  </div>
                </div>
              )}

              {showConfetti && (
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  recycle={false}
                  numberOfPieces={200}
                />
              )}
            </div>
          </div>

          {/* Status Messages */}
          {success && lastScanned && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4 animate-fade-in">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🎉</span>
                <div>
                  <div className="font-bold text-lg">Attendance Marked Successfully!</div>
                  <div className="text-sm">
                    {lastScanned.studentName} - {lastScanned.className} - Bus {lastScanned.busNumber}
                  </div>
                  <div className="text-xs mt-1">
                    Time: {new Date(lastScanned.checkInTime).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 animate-fade-in">
              <div className="font-semibold">⚠️ {error}</div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={async () => {
                if (scanning) {
                  await stopScanner()
                  setScanning(false)
                } else {
                  setScanning(true)
                }
                setError('')
                setSuccess(false)
              }}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                scanning
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary text-dark hover:bg-opacity-80'
              }`}
            >
              {scanning ? '⏸️ Pause' : '▶️ Start Scanning'}
            </button>
            <button
              onClick={async () => {
                await stopScanner()
                setScanning(false)
                setError('')
                setSuccess(false)
                setResult('')
              }}
              className="px-6 py-3 bg-secondary text-white rounded-lg font-bold text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              🔄 Reset
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-primary bg-opacity-20 rounded-lg p-4">
            <h3 className="font-bold text-dark mb-2">📝 Instructions:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
              <li>Position the QR code within the camera frame</li>
              <li>Ensure good lighting for better scanning</li>
              <li>Wait for the confirmation message after scanning</li>
              <li>Each student can only be marked once per day</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRScan

