import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import aiService from '../services/aiService.js'
import AIAnalysisResult from './AIAnalysisResult.jsx'

function SymptomChecker() {
    const [symptom, setSymptom] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('checking')

    // Check server connection on component mount
    useEffect(() => {
        checkServerConnection()
    }, [])

    const checkServerConnection = async () => {
        try {
            const healthStatus = await aiService.checkHealth()
            if (healthStatus.status === 'OK') {
                setConnectionStatus('connected')
            } else {
                setConnectionStatus('error')
            }
        } catch (err) {
            setConnectionStatus('error')
            console.error('AI service connection failed:', err)
        }
    }

    const handleSymptomCheck = async () => {
        if (!symptom.trim()) {
            setError('Please describe your symptoms')
            return
        }

        if (symptom.trim().length < 10) {
            setError('Please provide more detailed symptoms (at least 10 characters)')
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const data = await aiService.analyzeSymptoms(symptom)
            setResult(data)
        } catch (err) {
            setError(err.message || 'Unable to connect to AI service. Please check your API configuration.')
            console.error('Symptom check error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Symptom Checker</h1>
            <p className="text-sm text-zinc-600">Get preliminary health insights based on your symptoms</p>
          </div>
        </div>
  
        {/* Connection Status */}
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${connectionStatus === 'connected' ? 'bg-green-100' : connectionStatus === 'error' ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {connectionStatus === 'connected' ? '🤖' : 
                 connectionStatus === 'error' ? '⚠️' : 
                 '🔄'}
              </span>
              <div className="font-medium">
                {connectionStatus === 'connected' ? 'AI Service Connected' : 
                 connectionStatus === 'error' ? 'AI Service Not Configured' : 
                 'Checking Connection...'}
              </div>
            </div>
            {connectionStatus === 'error' && (
              <button 
                onClick={checkServerConnection}
                className="ml-auto text-sm text-blue-600 hover:text-blue-700 underline font-medium"
              >
                Retry Connection
              </button>
            )}
          </div>
          {connectionStatus === 'error' && (
            <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
              <div className="text-sm text-yellow-800">
                <div className="font-medium mb-1">AI Service Setup Required</div>
                <div>To use the symptom checker, you need to configure a Gemini API key. Add your API key to the environment variables.</div>
                <div className="mt-2 text-xs">
                  Get your free API key from: <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 grid place-items-center">🩺</div>
              <div className="font-medium">Describe Your Symptoms</div>
            </div>
            <div className="p-5 space-y-4">
              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Symptoms *</label>
                <textarea
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  rows={5}
                  placeholder="Describe your symptoms here..."
                  className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <span>⚠️</span>
                    <span className="font-medium">Error:</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                onClick={handleSymptomCheck}
                disabled={isLoading || connectionStatus !== 'connected'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">AI Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🤖</span>
                    <span className="font-medium">Analyze Symptoms</span>
                  </>
                )}
              </button>
            </div>
          </div>
  
          <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-5 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xl">⚠️</div>
              <div className="font-semibold mb-1">Important Notice</div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                This tool provides preliminary guidance only. It is not a substitute for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
            <AIAnalysisResult 
              analysis={result.analysis} 
              timestamp={result.timestamp} 
            />
          </div>
        )}
      </div>
    )
  }
  
  

export default SymptomChecker