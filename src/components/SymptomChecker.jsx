import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa'
import aiService from '../services/aiService.js'

function SymptomChecker() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI health assistant. How can I help you today? Please describe your symptoms in detail.",
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Prepare context for the AI
      const history = messages.concat(userMessage).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Call Local LLM
      const response = await aiService.analyzeSymptomsLocal(history)

      const botMessage = {
        role: 'assistant',
        content: response.analysis,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the local AI service. Please ensure your local LLM (Ollama) is running.",
        timestamp: new Date().toISOString(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceStatus('Speech Recognition not supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false // Stop after one sentence for chat
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
        setInput(prev => prev + (prev ? ' ' : '') + finalTranscript)
        setIsListening(false)
        setVoiceStatus('')
      } else if (interimTranscript) {
        setVoiceStatus(interimTranscript)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setVoiceStatus('')
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setVoiceStatus('Error: ' + event.error)
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

  const toggleVoice = () => {
    if (isListening) {
      stopVoiceInput()
    } else {
      startVoiceInput()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-zinc-50">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-200 bg-white">
        <NavLink to="/" className="shrink-0 w-8 h-8 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-zinc-600">←</NavLink>
        <div>
          <h1 className="text-lg font-bold">AI Health Assistant (Local Qwen 2.5)</h1>
          <p className="text-xs text-zinc-500">{t('symptoms.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : msg.isError
                  ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
              }`}>
              <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {msg.content}
              </div>
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-zinc-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-6">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-zinc-200">
        {voiceStatus && (
          <div className="text-xs text-blue-600 mb-2 font-medium animate-pulse">{voiceStatus}</div>
        )}
        <div className="flex items-end gap-2 bg-zinc-100 p-2 rounded-xl border border-zinc-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <button
            onClick={toggleVoice}
            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-zinc-200 text-zinc-500'
              }`}
          >
            {isListening ? <FaStop /> : <FaMicrophone />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            rows={1}
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-2.5 max-h-32 text-sm sm:text-base"
            style={{ minHeight: '44px' }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaPaperPlane className="text-sm" />}
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-zinc-400">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SymptomChecker