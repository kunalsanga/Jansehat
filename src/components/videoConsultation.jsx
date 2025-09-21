import React, { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

function VideoConsultation() {
    const [isInCall, setIsInCall] = useState(false)
    const [isCallConnected, setIsCallConnected] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [callDuration, setCallDuration] = useState(0)
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: '',
        preferredDate: '',
        preferredTime: '',
        consultationType: 'Video Call',
        symptoms: ''
    })
    
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const localStreamRef = useRef(null)
    const callTimerRef = useRef(null)

    // Dummy doctors data
    const availableDoctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'General Medicine',
            experience: '8 years',
            rating: 4.9,
            avatar: '👩‍⚕️',
            status: 'Available',
            nextAvailable: 'Now'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Cardiology',
            experience: '12 years',
            rating: 4.8,
            avatar: '👨‍⚕️',
            status: 'Available',
            nextAvailable: '5 mins'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Pediatrics',
            experience: '6 years',
            rating: 4.9,
            avatar: '👩‍⚕️',
            status: 'Busy',
            nextAvailable: '30 mins'
        }
    ]

    const [selectedDoctor, setSelectedDoctor] = useState(null)

    // Initialize camera and microphone
    const initializeMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: true
            })
            localStreamRef.current = stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
                localVideoRef.current.play()
            }
            return true
        } catch (error) {
            console.error('Error accessing media devices:', error)
            alert('Unable to access camera and microphone. Please check permissions.')
            return false
        }
    }

    // Start video call
    const startVideoCall = async () => {
        if (!selectedDoctor) {
            alert('Please select a doctor first')
            return
        }

        console.log('Starting video call...')
        const mediaInitialized = await initializeMedia()
        if (!mediaInitialized) return

        console.log('Media initialized, starting call...')
        setIsInCall(true)
        
        // Start call timer
        callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1)
        }, 1000)

        // Simulate doctor joining after 3 seconds
        setTimeout(() => {
            console.log('Doctor connected')
            setIsCallConnected(true)
        }, 3000)
    }

    // End video call
    const endVideoCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
        }
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current)
        }
        setIsInCall(false)
        setIsCallConnected(false)
        setCallDuration(0)
        setSelectedDoctor(null)
    }

    // Toggle mute
    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks()
            audioTracks.forEach(track => {
                track.enabled = !track.enabled
            })
            setIsMuted(!isMuted)
        }
    }

    // Toggle video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks()
            videoTracks.forEach(track => {
                track.enabled = !track.enabled
            })
            setIsVideoOn(!isVideoOn)
        }
    }

    // Format call duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!selectedDoctor) {
            alert('Please select a doctor first')
            return
        }
        startVideoCall()
    }

    // Update video element when stream changes
    useEffect(() => {
        if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current
            localVideoRef.current.play().catch(console.error)
        }
    }, [isInCall])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop())
            }
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current)
            }
        }
    }, [])

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              {isInCall ? 'Video Consultation' : 'Book Your Consultation'}
            </h1>
          </div>
        </div>
  
        {!isInCall ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: form */}
            <div className="xl:col-span-2 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 text-green-600 grid place-items-center text-sm sm:text-base">📅</div>
                <div className="font-semibold text-sm sm:text-base">Book Your Consultation</div>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Patient Name *</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Preferred Date *</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        required
                        className="w-full px-3 py-2 pr-10 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" 
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">📅</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">Preferred Time *</label>
                    <select 
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="">Select time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Consultation Type</label>
                  <select 
                    value={formData.consultationType}
                    onChange={(e) => setFormData({...formData, consultationType: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="Audio Call">Audio Call</option>
                    <option value="Chat">Chat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Describe Your Symptoms *</label>
                  <textarea 
                    rows="4" 
                    placeholder="Please describe your symptoms and any relevant medical history..." 
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none" 
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={async () => {
                      console.log('Testing camera access...')
                      const success = await initializeMedia()
                      if (success) {
                        alert('Camera access successful! You can now start the consultation.')
                        // Stop the test stream
                        if (localStreamRef.current) {
                          localStreamRef.current.getTracks().forEach(track => track.stop())
                        }
                      }
                    }}
                    className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm"
                  >
                    🧪 Test Camera
                  </button>
                  <button type="submit" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition text-sm sm:text-base">
                    <span>📞</span>
                    <span>Book Consultation</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Doctor Selection */}
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-xl sm:rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-lg sm:text-xl mb-2 sm:mb-3">👨‍⚕️</div>
                <div className="font-semibold mb-3 text-sm sm:text-base">Available Doctors</div>
                <div className="space-y-3">
                  {availableDoctors.map((doctor) => (
                    <div 
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        selectedDoctor?.id === doctor.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{doctor.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{doctor.name}</div>
                          <div className="text-xs text-zinc-600">{doctor.specialty}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              doctor.status === 'Available' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {doctor.status}
                            </span>
                            <span className="text-xs text-zinc-500">⭐ {doctor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5 bg-gradient-to-b from-green-50 to-white">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-600 grid place-items-center text-lg sm:text-xl mb-2 sm:mb-3">⏰</div>
                <div className="font-semibold mb-2 text-sm sm:text-base">Available Hours</div>
                <div className="text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-zinc-100"><span>Monday - Friday:</span><span className="font-medium">9:00 AM - 6:00 PM</span></div>
                  <div className="flex justify-between py-1 border-b border-zinc-100"><span>Saturday:</span><span className="font-medium">9:00 AM - 2:00 PM</span></div>
                  <div className="flex justify-between py-1"><span>Sunday:</span><span className="text-red-600 font-medium">Closed</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Video Call Interface */
          <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 grid place-items-center">📹</div>
                <div>
                  <div className="font-semibold text-sm sm:text-base">
                    {selectedDoctor?.name} - {selectedDoctor?.specialty}
                  </div>
                  <div className="text-xs text-zinc-600">
                    {isCallConnected ? `Connected • ${formatDuration(callDuration)}` : 'Connecting...'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-zinc-200 text-zinc-700'}`}
                >
                  {isMuted ? '🔇' : '🎤'}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-full ${isVideoOn ? 'bg-zinc-200 text-zinc-700' : 'bg-red-500 text-white'}`}
                >
                  {isVideoOn ? '📹' : '📷'}
                </button>
                <button
                  onClick={endVideoCall}
                  className="p-2 rounded-full bg-red-500 text-white"
                >
                  📞
                </button>
              </div>
            </div>
            
            <div className="relative bg-black rounded-b-xl sm:rounded-b-2xl" style={{ height: '500px' }}>
              {/* Remote Video (Doctor) */}
              <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                {isCallConnected ? (
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-zinc-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
                      {selectedDoctor?.avatar}
                    </div>
                    <div className="text-lg font-medium">{selectedDoctor?.name}</div>
                    <div className="text-sm text-zinc-400">{selectedDoctor?.specialty}</div>
                    <div className="text-xs text-zinc-500 mt-2">Doctor is connected</div>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-zinc-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto animate-pulse">
                      {selectedDoctor?.avatar}
                    </div>
                    <div className="text-lg font-medium">{selectedDoctor?.name}</div>
                    <div className="text-sm text-zinc-400">Connecting...</div>
                    <div className="text-xs text-zinc-500 mt-2">Please wait while we connect you</div>
                  </div>
                )}
              </div>
              
              {/* Local Video (Patient) */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-zinc-900 rounded-lg overflow-hidden border-2 border-white">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover transform scaleX(-1)"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-white text-xs">
                    Camera Off
                  </div>
                )}
                {!localStreamRef.current && (
                  <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-white text-xs">
                    <div className="text-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                      <div>Loading Camera...</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

export default VideoConsultation