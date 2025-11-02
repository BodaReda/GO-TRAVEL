import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Diagnostics = () => {
  const [results, setResults] = useState({})

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const diagnostics = {}

    // Test Backend Health
    try {
      const healthResponse = await axios.get('/api/health', { timeout: 5000 })
      diagnostics.backendHealth = {
        status: '✅ OK',
        message: healthResponse.data.message,
        statusCode: healthResponse.status
      }
    } catch (error) {
      diagnostics.backendHealth = {
        status: '❌ ERROR',
        message: error.message,
        details: error.code || 'Unknown error'
      }
    }

    // Test Auth Endpoint
    try {
      const authResponse = await axios.post('/api/auth/login', {
        username: 'test',
        password: 'test'
      }, { timeout: 5000 })
      diagnostics.authEndpoint = {
        status: '✅ Connected',
        message: 'Auth endpoint is reachable'
      }
    } catch (error) {
      if (error.response?.status === 401) {
        diagnostics.authEndpoint = {
          status: '✅ Connected',
          message: 'Auth endpoint is working (401 is expected for invalid credentials)'
        }
      } else if (error.response?.status === 503) {
        diagnostics.authEndpoint = {
          status: '⚠️ MongoDB Not Connected',
          message: error.response.data.message,
          fix: 'Setup MongoDB - see SETUP_MONGODB.md'
        }
      } else {
        diagnostics.authEndpoint = {
          status: '❌ ERROR',
          message: error.message,
          details: error.code || 'Unknown error'
        }
      }
    }

    // Test MongoDB Connection (via students endpoint)
    try {
      const studentsResponse = await axios.get('/api/students', { timeout: 5000 })
      diagnostics.mongodb = {
        status: '✅ Connected',
        message: 'MongoDB is connected and working'
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        diagnostics.mongodb = {
          status: '❌ Network Error',
          message: 'Cannot reach backend server'
        }
      } else {
        diagnostics.mongodb = {
          status: '⚠️ May need MongoDB',
          message: error.response?.data?.message || error.message
        }
      }
    }

    setResults(diagnostics)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-6">🔍 System Diagnostics</h1>
        
        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Backend Server (Port 5000)</h3>
            {results.backendHealth ? (
              <div>
                <div className={`font-semibold ${results.backendHealth.status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {results.backendHealth.status}
                </div>
                <div className="text-gray-600">{results.backendHealth.message}</div>
              </div>
            ) : (
              <div>Testing...</div>
            )}
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Authentication Endpoint</h3>
            {results.authEndpoint ? (
              <div>
                <div className={`font-semibold ${
                  results.authEndpoint.status.includes('✅') ? 'text-green-600' : 
                  results.authEndpoint.status.includes('⚠️') ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {results.authEndpoint.status}
                </div>
                <div className="text-gray-600">{results.authEndpoint.message}</div>
                {results.authEndpoint.fix && (
                  <div className="mt-2 p-3 bg-yellow-100 rounded text-yellow-800">
                    <strong>Fix:</strong> {results.authEndpoint.fix}
                  </div>
                )}
              </div>
            ) : (
              <div>Testing...</div>
            )}
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">MongoDB Connection</h3>
            {results.mongodb ? (
              <div>
                <div className={`font-semibold ${
                  results.mongodb.status.includes('✅') ? 'text-green-600' : 
                  results.mongodb.status.includes('⚠️') ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {results.mongodb.status}
                </div>
                <div className="text-gray-600">{results.mongodb.message}</div>
              </div>
            ) : (
              <div>Testing...</div>
            )}
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          className="mt-6 bg-primary text-dark px-6 py-3 rounded-lg font-bold hover:bg-opacity-80 transition-all"
        >
          🔄 Run Diagnostics Again
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold mb-2">Quick Fixes:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>If MongoDB is not connected, see <code className="bg-white px-2 py-1 rounded">SETUP_MONGODB.md</code></li>
            <li>If backend is not reachable, make sure backend server is running: <code className="bg-white px-2 py-1 rounded">cd backend && npm run dev</code></li>
            <li>If frontend won't load, make sure frontend server is running: <code className="bg-white px-2 py-1 rounded">cd frontend && npm run dev</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Diagnostics

