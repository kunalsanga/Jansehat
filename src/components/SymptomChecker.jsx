import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next' // KEEP: i18n
import { NavLink, useNavigate } from 'react-router-dom' // KEEP: useNavigate for emergency
import { FaMicrophone, FaStop, FaPaperPlane, FaUser, FaStethoscope } from 'react-icons/fa' // MERGED Icons
import ReactMarkdown from 'react-markdown' // KEEP: ReactMarkdown from main
import remarkGfm from 'remark-gfm' // KEEP: remarkGfm from main
import rehypeRaw from 'rehype-raw' // NEW: For rendering HTML
import aiService from '../services/aiService.js'

// Helper component for rendering AI results (from i18n-integration)
function AIAnalysisResult({ analysis, timestamp, modelSource }) {
    // Note: We are using ReactMarkdown now, so this helper structure needs adjustment
    // Since the main branch provides ReactMarkdown logic, we'll embed the emergency check here.
    return (
        <div className="prose prose-zinc max-w-none text-[15px] leading-7">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
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
                {analysis}
            </ReactMarkdown>
        </div>
    );
}

function SymptomChecker() {
    const { t } = useTranslation() // KEEP: i18n
    const navigate = useNavigate() // KEEP: useNavigate

    // MERGED/ADOPTED STATE from main branch (Conversational Chat Model)
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: t('symptoms.welcome'), // Use i18n for welcome message
            timestamp: new Date().toISOString()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [voiceStatus, setVoiceStatus] = useState('')
    const messagesEndRef = useRef(null)
    const recognitionRef = useRef(null)

    // KEEP: Emergency Modal State
    const [showEmergencyModal, setShowEmergencyModal] = useState(false)
    const [detectedSeverity, setDetectedSeverity] = useState('')

    // KEEP: Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // KEEP: Scroll on message change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // KEEP: Cleanup recognition
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    // NEW LOGIC: Emergency Detection (Adapted from i18n-integration)
    const evaluateSeverity = (analysisText) => {
        if (!analysisText) return

        // 1. Try to find the specific "URGENCY LEVEL" section first
        const urgencySectionMatch = analysisText.match(/\*\*URGENCY LEVEL:?\*\*\s*([\s\S]*?)(?=\*\*|$)/i)

        if (urgencySectionMatch && urgencySectionMatch[1]) {
            const content = urgencySectionMatch[1].toLowerCase()
            if (content.includes('high') || content.includes('critical') || content.includes('emergency') || content.includes('immediate')) {
                setDetectedSeverity(t('symptoms.severityHigh')) // Use i18n
                setShowEmergencyModal(true)
                return
            }
        }

        // 2. Fallback: Check for explicit phrases
        const lower = analysisText.toLowerCase()
        if (lower.includes('urgency level: high') || lower.includes('urgency level: critical')) {
            setDetectedSeverity(t('symptoms.severityHigh')) // Use i18n
            setShowEmergencyModal(true)
        }
    }

    // KEEP: Emergency Navigation Handlers
    const triggerEmergencyNavigation = () => {
        setShowEmergencyModal(false)
        navigate('/navigation?emergency=1')
    }

    const callNumber = (number) => {
        window.open(`tel:${number}`, '_self')
    }

    // ADOPT MAIN LOGIC: Send Message (Conversational, Streaming)
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        const textToAnalyze = input.trim(); // Capture text before clearing
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

            let fullAnalysisText = ""; // To evaluate severity after stream finishes

            // Handler for streaming chunks
            const onChunk = (chunk) => {
                fullAnalysisText += chunk; // Build the full text
                setMessages(prev => prev.map(msg => {
                    if (msg.id === botMessageId) {
                        return { ...msg, content: msg.content + chunk }
                    }
                    return msg
                }))
            };

            // Call Local LLM with streaming
            await aiService.analyzeSymptomsLocal(history, onChunk)

            // AFTER STREAM FINISHES: Evaluate Severity
            evaluateSeverity(fullAnalysisText)

        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage = {
                role: 'assistant',
                content: t('symptoms.errorConnection'), // Use i18n
                timestamp: new Date().toISOString(),
                isError: true
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    // ADOPT MAIN LOGIC: Keyboard Handler
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // ADOPT MAIN LOGIC: Speech Recognition
    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setVoiceStatus(t('symptoms.errorVoiceSupport')) // Use i18n
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        // Use current i18n language
        recognition.lang = t('i18n.localeCode') || 'en-US'

        recognitionRef.current = recognition

        recognition.onstart = () => {
            setIsListening(true)
            setVoiceStatus(t('symptoms.voiceListening')) // Use i18n
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
            setVoiceStatus(t('symptoms.errorVoice') + event.error) // Use i18n
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
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white text-zinc-800">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 bg-white sticky top-0 z-10">
                <NavLink to="/" className="shrink-0 w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center text-zinc-600 transition-colors">←</NavLink>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-800 font-semibold px-2 py-1 rounded hover:bg-zinc-100 cursor-pointer transition-colors">
                        {t('symptoms.title')} {/* Use i18n */}
                    </span>
                    <span className="text-sm text-zinc-400">{t('symptoms.modelSource')}</span> {/* Use i18n */}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                    {messages.map((msg, index) => (
                        <div key={msg.id || index} className="flex gap-4 sm:gap-6">
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
                                    {msg.role === 'user' ? t('symptoms.you') : t('symptoms.assistant')} {/* Use i18n */}
                                </div>

                                <div className={`prose prose-zinc max-w-none text-[15px] leading-7 ${msg.role === 'user' ? 'text-zinc-800' : 'text-zinc-800'}`}>
                                    {msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    ) : (
                                        <AIAnalysisResult analysis={msg.content} /> // Use helper component with Markdown
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
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
                            title={isListening ? t('symptoms.voiceStop') : t('symptoms.voiceStart')}
                        >
                            {isListening ? <FaStop className="text-xs" /> : <FaMicrophone className="text-sm" />}
                        </button>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('symptoms.placeholder')}
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
                            {t('symptoms.disclaimer')} {/* Use i18n */}
                        </p>
                    </div>
                </div>
            </div>

            {/* Emergency Modal (Adapted from i18n-integration) */}
            {showEmergencyModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border-l-4 border-red-600">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm uppercase font-bold text-red-600 tracking-wider">{t('symptoms.urgencyTitle')}</div>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{t('symptoms.actionRecommended')}</h3>
                                <p className="text-sm text-gray-600 mt-1">{t('symptoms.basedOnSeverity')} <b>{detectedSeverity}</b> {t('symptoms.symptoms')}.</p>
                            </div>
                            <button onClick={() => setShowEmergencyModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg">✕</button>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <button
                                onClick={triggerEmergencyNavigation}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md transition-transform active:scale-[0.98]"
                            >
                                <span className="text-lg">🏥</span> {t('symptoms.buttonNavigate')}
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => callNumber('108')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 font-semibold hover:bg-red-100 border border-red-100"
                                >
                                    <span>📞</span> {t('symptoms.buttonCall108')}
                                </button>
                                <button
                                    onClick={() => callNumber('104')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 border border-emerald-100"
                                >
                                    <span>👩‍⚕️</span> {t('symptoms.buttonCallAsha')}
                                </button>
                            </div>
                        </div>
                        <div className="text-center pt-2">
                            <button onClick={() => setShowEmergencyModal(false)} className="text-xs text-gray-400 underline hover:text-gray-600">{t('symptoms.continueChatting')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SymptomChecker