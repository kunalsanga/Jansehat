import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { FaMicrophone, FaStop } from 'react-icons/fa'
import aiService from '../services/aiService.js'
import AIAnalysisResult from './AIAnalysisResult.jsx'

function SymptomChecker() {
    const { t } = useTranslation()
    const [symptom, setSymptom] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('checking')
    const [isListening, setIsListening] = useState(false)
    const [voiceStatus, setVoiceStatus] = useState('')
    const recognitionRef = useRef(null)

    // Check server connection on component mount
    useEffect(() => {
        checkServerConnection()
    }, [])

    // Check for voice input on component mount
    useEffect(() => {
        const voiceTranscript = localStorage.getItem('voiceTranscript')
        if (voiceTranscript) {
            setSymptom(voiceTranscript)
            localStorage.removeItem('voiceTranscript') // Clear after using
        }
    }, [])

    // Cleanup recognition on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
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
            setError(t('symptoms.errorEmpty'))
            return
        }

        if (symptom.trim().length < 10) {
            setError(t('symptoms.errorShort'))
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const data = await aiService.analyzeSymptoms(symptom)
            setResult(data)
        } catch (err) {
            setError(err.message || t('symptoms.statusError'))
            console.error('Symptom check error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setVoiceStatus('Speech Recognition not supported')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = navigator.language || 'en-US'
        
        recognitionRef.current = recognition

        recognition.onstart = () => {
            setIsListening(true)
            setVoiceStatus('Listening... Speak your symptoms')
        }

        recognition.onresult = (event) => {
            let finalTranscript = ''
            let interimTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript
                } else {
                    interimTranscript += transcript
                }
            }

            if (finalTranscript) {
                setSymptom(prev => prev + finalTranscript + ' ')
                setVoiceStatus('Processing...')
                
                // Auto-analyze after a pause
                setTimeout(() => {
                    if (symptom.trim().length > 10) {
                        handleSymptomCheck()
                    }
                }, 2000)
            } else if (interimTranscript) {
                setVoiceStatus(`Listening: ${interimTranscript}`)
            }
        }

        recognition.onend = () => {
            setIsListening(false)
            setVoiceStatus('')
        }

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
            setVoiceStatus(`Error: ${event.error}`)
        }

        recognition.start()
    }

    const stopVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsListening(false)
            setVoiceStatus('')
        }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-9 h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50">←</NavLink>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('symptoms.title')}</h1>
            <p className="text-sm text-zinc-600">{t('symptoms.subtitle')}</p>
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
                {connectionStatus === 'connected' ? t('symptoms.statusConnected') : 
                 connectionStatus === 'error' ? t('symptoms.statusError') : 
                 t('symptoms.statusChecking')}
              </div>
            </div>
            {connectionStatus === 'error' && (
              <button 
                onClick={checkServerConnection}
                className="ml-auto text-sm text-blue-600 hover:text-blue-700 underline font-medium"
              >
                {t('symptoms.retry')}
              </button>
            )}
          </div>
          {connectionStatus === 'error' && (
            <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
              <div className="text-sm text-yellow-800">
                <div className="font-medium mb-1">{t('symptoms.setupRequired')}</div>
                <div>{t('symptoms.setupGuide')}</div>
                <div className="mt-2 text-xs">
                  {t('symptoms.getKey')} <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 grid place-items-center">🩺</div>
              <div className="font-medium">{t('symptoms.describeTitle')}</div>
            </div>
            <div className="p-5 space-y-4">
              {/* Symptoms */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">{t('symptoms.describeLabel')}</label>
                  <div className="flex items-center gap-2">
                    {!isListening ? (
                      <button
                        onClick={startVoiceInput}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <FaMicrophone className="text-xs" />
                        Voice Input
                      </button>
                    ) : (
                      <button
                        onClick={stopVoiceInput}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <FaStop className="text-xs" />
                        Stop
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  rows={5}
                  placeholder={t('symptoms.describePlaceholder')}
                  className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {voiceStatus && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {voiceStatus}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <span>⚠️</span>
                    <span className="font-medium">{t('symptoms.errorPrefix')}</span>
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
                    <span className="font-medium">{t('symptoms.btnAnalyzing')}</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🤖</span>
                    <span className="font-medium">{t('symptoms.btnAnalyze')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
  
          <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="p-5 text-center">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-xl">⚠️</div>
              <div className="font-semibold mb-1">{t('symptoms.noticeTitle')}</div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {t('symptoms.noticeText')}
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