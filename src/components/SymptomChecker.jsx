import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { FaMicrophone, FaStop, FaPaperPlane, FaUser, FaRobot, FaStethoscope } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

      // Create a placeholder for the bot's response
      const botMessageId = Date.now();
      const initialBotMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        id: botMessageId
      }
      setMessages(prev => [...prev, initialBotMessage])

      // Handler for streaming chunks
      const onChunk = (chunk) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === botMessageId) {
            return { ...msg, content: msg.content + chunk }
          }
          return msg
        }))
      };

      // Call Local LLM with streaming
      await aiService.analyzeSymptomsLocal(history, onChunk)

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
    <div className="flex flex-col h-screen bg-white text-zinc-800">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 bg-white sticky top-0 z-10">
        <NavLink to="/" className="shrink-0 w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center text-zinc-600 transition-colors">←</NavLink>
        <div className="flex items-center gap-2">
          <span className="text-zinc-800 font-semibold px-2 py-1 rounded hover:bg-zinc-100 cursor-pointer transition-colors">
            Jansehat AI
          </span>
          <span className="text-sm text-zinc-400">Local Model</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="shrink-0 flex flex-col items-center">
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-zinc-200 grid place-items-center text-zinc-500">
                    <FaUser className="text-sm" />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full grid place-items-center text-white ${msg.isError ? 'bg-red-500' : 'bg-green-600'}`}>
                    <FaStethoscope className="text-sm" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-semibold text-sm text-zinc-900">
                  {msg.role === 'user' ? 'You' : 'AI Health Assistant'}
                </div>

                <div className={`prose prose-zinc max-w-none text-[15px] leading-7 ${msg.role === 'user' ? 'text-zinc-800' : 'text-zinc-800'}`}>
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                        h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-4" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-3" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base font-bold my-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-900" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && !messages[messages.length - 1]?.content && (
            <div className="flex gap-4 sm:gap-6">
              <div className="w-8 h-8 rounded-full bg-green-600 grid place-items-center text-white shrink-0">
                <FaStethoscope className="text-sm animate-pulse" />
              </div>
              <div className="flex-1 py-1">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pb-6 pt-2">
          {voiceStatus && (
            <div className="text-xs text-blue-600 mb-2 font-medium animate-pulse text-center">{voiceStatus}</div>
          )}

          <div className="relative flex items-end gap-2 bg-zinc-50 p-3 rounded-3xl border border-zinc-200 focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-200 shadow-sm transition-all">
            <button
              onClick={toggleVoice}
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors mb-0.5 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-zinc-200 text-zinc-500'}`}
              title="Voice Input"
            >
              {isListening ? <FaStop className="text-xs" /> : <FaMicrophone className="text-sm" />}
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Jansehat AI..."
              rows={1}
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-1.5 max-h-48 text-base text-zinc-800 placeholder:text-zinc-400"
              style={{ minHeight: '24px' }}
            />

            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all mb-0.5 ${!input.trim() || isLoading
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-zinc-800'
                }`}
            >
              {isLoading ? <div className="w-3 h-3 border-2 border-zinc-400 border-t-white rounded-full animate-spin" /> : <FaPaperPlane className="text-xs" />}
            </button>
          </div>

          <div className="text-center mt-3">
            <p className="text-[11px] text-zinc-400">
              Jansehat AI can make mistakes. Please verify important medical information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SymptomChecker