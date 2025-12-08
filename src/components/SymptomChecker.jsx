import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa'
import aiService from '../services/aiService.js'
import AIAnalysisResult from './AIAnalysisResult.jsx'

function SymptomChecker() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [symptom, setSymptom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const recognitionRef = useRef(null)
  const analyzeTimerRef = useRef(null)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [detectedSeverity, setDetectedSeverity] = useState('')
  const messagesEndRef = useRef(null)
  const streamInterval = useRef(null)
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', content: null, isAnalysis: false, text: 'Hi! I can give preliminary health insights based on your symptoms. Please describe what you are feeling.' }
  ])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Check server connection on component mount
  useEffect(() => {
    checkServerConnection()
  }, [])

  // Cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (streamInterval.current) clearInterval(streamInterval.current)
    }
  }, [])

  // On open: optionally auto-start listening, and avoid analyzing any navigation phrase
  useEffect(() => {
    const autoAnalyze = localStorage.getItem('autoAnalyze') === '1'
    const autoListen = localStorage.getItem('autoListen') === '1'
    const voiceTranscript = localStorage.getItem('voiceTranscript') || ''
    // Clear navigation phrase like "symptom checker kholo" if present
    // Remove navigation chatter like "opening symptom checker" from transcript
    const cleaned = voiceTranscript
      .replace(/opening\s+symptom(s)?\s+(checker)?/ig, '')
      .replace(/symptom(s)?\s+(checker)?\s*(kholo|open)?/ig, '')
      .trim()
    if (cleaned) setSymptom(cleaned)
    localStorage.removeItem('voiceTranscript')
    if (autoListen) {
      // Start listening immediately on load
      startVoiceInput()
      localStorage.removeItem('autoListen')
    }
    if (cleaned && autoAnalyze) {
      // Give a brief tick for UI to update then analyze
      setTimeout(() => {
        handleSymptomCheck()
        localStorage.removeItem('autoAnalyze')
      }, 600)
    }
  }, [])

  // Listen for live voice events when page already open
  useEffect(() => {
    const handler = (e) => {
      const { text, autoAnalyze, autoListen } = e.detail || {}
      if (typeof text === 'string' && text.trim().length > 0) {
        setSymptom(text.trim())
        if (autoAnalyze) {
          const payload = text.trim()
          setTimeout(() => handleSymptomCheck(payload), 200)
        }
      } else if (autoListen) {
        startVoiceInput()
      }
    }
    window.addEventListener('voice-symptom-input', handler)
    return () => window.removeEventListener('voice-symptom-input', handler)
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

  const evaluateSeverity = (analysisText) => {
    if (!analysisText) return

    // 1. Try to find the specific "URGENCY LEVEL" section first
    const urgencySectionMatch = analysisText.match(/\*\*URGENCY LEVEL:?\*\*\s*([\s\S]*?)(?=\*\*|$)/i)

    if (urgencySectionMatch && urgencySectionMatch[1]) {
      const content = urgencySectionMatch[1].toLowerCase()
      if (content.includes('high') || content.includes('critical') || content.includes('emergency') || content.includes('immediate')) {
        setDetectedSeverity('High Urgency')
        setShowEmergencyModal(true)
        return
      }
    }

    // 2. Fallback: Only check for very explicit phrases at the start if section parsing fails
    // (Preventing "not severe" from triggering it)
    const lower = analysisText.toLowerCase()
    if (lower.includes('urgency level: high') || lower.includes('urgency level: critical')) {
      setDetectedSeverity('High Urgency')
      setShowEmergencyModal(true)
    }
  }

  const triggerEmergencyNavigation = () => {
    setShowEmergencyModal(false)
    navigate('/navigation?emergency=1')
  }

  const callNumber = (number) => {
    window.open(`tel:${number}`, '_self')
  }

  const handleSymptomCheck = async (textOverride) => {
    const textToAnalyze = (typeof textOverride === 'string' && textOverride.length > 0)
      ? textOverride
      : symptom

    if (!textToAnalyze.trim()) {
      setError(t('symptoms.errorEmpty'))
      return
    }

    if (textToAnalyze.trim().length < 2) {
      setError('Please provide more detail (at least 2 characters)')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setShowEmergencyModal(false)
    const userMessage = { id: `u-${Date.now()}`, role: 'user', content: null, isAnalysis: false, text: textToAnalyze.trim() }
    setMessages(prev => [...prev, userMessage])
    setSymptom('') // Clear input after sending

    try {
      // Ensure state reflects exactly what is analyzed
      const data = await aiService.analyzeSymptoms(textToAnalyze)
      setResult(data)
      evaluateSeverity(data.analysis)

      // Start simulated streaming
      setIsLoading(false) // Stop loading spinner, start streaming text

      const assistantMsgId = `a-${Date.now()}`
      // Add empty assistant message first
      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '', // Start empty
          isAnalysis: true,
          timestamp: data.timestamp,
          modelSource: data.modelSource,
          text: null
        }
      ])

      let currentIndex = 0
      const fullText = data.analysis
      const streamSpeed = 10 // ms

      if (streamInterval.current) clearInterval(streamInterval.current)

      streamInterval.current = setInterval(() => {
        currentIndex += 3 // Speed: 3 chars per tick

        if (currentIndex >= fullText.length) {
          currentIndex = fullText.length
          clearInterval(streamInterval.current)
        }

        const currentWindow = fullText.substring(0, currentIndex)

        setMessages(prev => prev.map(msg =>
          msg.id === assistantMsgId
            ? { ...msg, content: currentWindow }
            : msg
        ))

      }, streamSpeed)

      // Show a notice if this is a fallback response
      if (data.isFallback) {
        console.info('Using fallback response due to API limitations')
      }
    } catch (err) {
      setIsLoading(false)
      const msg = err?.message || t('symptoms.statusError')
      setError(msg)
      console.error('Symptom check error:', msg)
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: null, isAnalysis: false, text: `Error: ${msg}`, isError: true }
      ])
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
      setVoiceStatus('Listening...')
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
        // Append and schedule auto analysis using the fresh text
        let nextText = ''
        setSymptom(prev => {
          nextText = (prev + finalTranscript + ' ')
          return nextText
        })
        setVoiceStatus('Processing...')

        // Debounced auto-analyze to allow short pauses
        if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current)
        analyzeTimerRef.current = setTimeout(() => {
          if (nextText.trim().length >= 5) {
            handleSymptomCheck(nextText)
          }
        }, 800)
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
    <div className="flex flex-col h-[100dvh] bg-white">
      {/* Header - Minimalist */}
      <header className="shrink-0 h-14 md:h-16 border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 grid place-items-center hover:bg-gray-100 transition-colors text-gray-600">
            ←
          </NavLink>
          <h1 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            Jansehat AI
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">Symptom Checker</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {connectionStatus === 'error' ? (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full cursor-pointer hover:bg-red-100" onClick={checkServerConnection}>
              <span>Server Offline</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-green-500" title="Connected"></div>
          )}
        </div>
      </header>

      {/* Chat Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 md:p-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 md:gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* Avatar */}
              {m.role === 'assistant' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white grid place-items-center shadow-sm mt-1">
                  {/* Medical Pulse Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[90%] md:max-w-[85%] space-y-2 ${m.role === 'user' ? 'order-first' : ''}`}>
                <div className={`text-[15px] leading-relaxed rounded-2xl p-0 ${m.role === 'user'
                  ? 'bg-gray-100 text-gray-900 px-4 py-2.5 rounded-tr-sm'
                  : 'text-gray-900 bg-transparent'
                  }`}>
                  {m.isAnalysis ? (
                    <div className="overflow-hidden">
                      <AIAnalysisResult analysis={m.content} timestamp={m.timestamp} />
                      {m.modelSource && (
                        <div className="mt-2 text-xs text-gray-400 text-right">Model: {m.modelSource}</div>
                      )}
                    </div>
                  ) : (
                    <div className={`${m.isError ? 'text-red-600' : ''}`}>{m.text}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 md:gap-4 justify-start animate-fade-in">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white grid place-items-center shadow-sm mt-1">
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 h-8">
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="shrink-0 p-4 bg-white/80 backdrop-blur border-t border-gray-100 absolute bottom-0 w-full md:static">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={isListening ? (voiceStatus.startsWith('Listening:') ? voiceStatus.replace('Listening: ', '') : symptom) : symptom}
            onChange={(e) => setSymptom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (!isLoading && symptom.trim()) handleSymptomCheck()
              }
            }}
            rows={1}
            placeholder="Describe your symptoms..."
            disabled={isLoading || isListening}
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-gray-200 shadow-sm focus:border-gray-300 focus:ring-0 resize-none bg-gray-50 text-base max-h-32 focus:bg-white transition-colors custom-scrollbar"
            style={{ minHeight: '52px' }}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Voice Button */}
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-2 rounded-full transition-all ${isListening
                ? 'bg-red-50 text-red-600 animate-pulse'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <FaStop size={14} /> : <FaMicrophone size={16} />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSymptomCheck()}
              disabled={!symptom.trim() || isLoading}
              className={`p-2 rounded-full transition-all ${symptom.trim() && !isLoading
                ? 'bg-black text-white hover:bg-gray-800 shadow-sm'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              title="Send message"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>

        <div className="text-center mt-2.5">
          <p className="text-[11px] text-gray-400">
            Jansehat AI can make mistakes. Please consult a doctor for serious concerns.
          </p>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border-l-4 border-red-600">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm uppercase font-bold text-red-600 tracking-wider">High Urgency Detected</div>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Immediate Action Recommended</h3>
                <p className="text-sm text-gray-600 mt-1">Based on "<b>{detectedSeverity}</b>" symptoms.</p>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg">✕</button>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={triggerEmergencyNavigation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md transition-transform active:scale-[0.98]"
              >
                <span className="text-lg">🏥</span> Navigate to Hospital
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => callNumber('108')}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 font-semibold hover:bg-red-100 border border-red-100"
                >
                  <span>📞</span> Call 108
                </button>
                <button
                  onClick={() => callNumber('104')}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 border border-emerald-100"
                >
                  <span>👩‍⚕️</span> Call ASHA
                </button>
              </div>
            </div>
            <div className="text-center pt-2">
              <button onClick={() => setShowEmergencyModal(false)} className="text-xs text-gray-400 underline hover:text-gray-600">I understand, continue chatting</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SymptomChecker