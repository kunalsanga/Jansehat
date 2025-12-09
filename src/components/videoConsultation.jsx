import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Skeleton from './Skeleton'
import { useCallStatus as useInvitationStatus } from '../context/CallInvitationHandler'

function VideoConsultation() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isInCall, setIsInCall] = useState(false)
  const [isCallConnected, setIsCallConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(true)
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: t('video.typeVideo'),
    symptoms: ''
  })

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const callTimerRef = useRef(null)

  useEffect(() => {
    const id = setTimeout(() => setIsDoctorsLoading(false), 400)
    return () => clearTimeout(id)
  }, [])

  // Localized doctors data
  const availableDoctors = [
    {
      id: 1,
      name: t('video.doctors.d1.name'),
      specialty: t('video.doctors.d1.specialty'),
      experience: '8 years',
      rating: 4.9,
      avatar: '👩‍⚕️',
      status: t('video.doctors.d1.status'),
      nextAvailable: t('video.doctors.d1.next')
    },
    {
      id: 2,
      name: t('video.doctors.d2.name'),
      specialty: t('video.doctors.d2.specialty'),
      experience: '12 years',
      rating: 4.8,
      avatar: '👨‍⚕️',
      status: t('video.doctors.d2.status'),
      nextAvailable: t('video.doctors.d2.next')
    },
    {
      id: 3,
      name: t('video.doctors.d3.name'),
      specialty: t('video.doctors.d3.specialty'),
      experience: '6 years',
      rating: 4.9,
      avatar: '👩‍⚕️',
      status: t('video.doctors.d3.status'),
      nextAvailable: t('video.doctors.d3.next')
    }
  ]

  const [selectedDoctor, setSelectedDoctor] = useState(null)

  // Listen for call acceptance
  const { status: callStatus, data: callData } = useInvitationStatus();

  useEffect(() => {
    if (callStatus === 'accepted' && callData?.roomID) {
      navigate(`/patient/video-call?roomID=${callData.roomID}`);
    } else if (callStatus === 'declined') {
      alert('Doctor is busy and declined the call.');
    }
  }, [callStatus, callData, navigate]);

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
      alert(t('video.availableDoctors'))
      return
    }

    const mediaInitialized = await initializeMedia()
    if (!mediaInitialized) return

    setIsInCall(true)

    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)

    // Simulate doctor joining after 3 seconds
    setTimeout(() => {
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
      alert(t('video.availableDoctors'))
      return
    }

    // Send broadcast request
    import('../context/CallInvitationHandler').then(({ sendCallRequest }) => {
      sendCallRequest(formData.patientName || "Anonymous Patient", "123");
      alert("Calling Doctor... (Check Doctor Dashboard)");
    });
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
        <div className="flex-1 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {isInCall ? t('video.inCallTitle') : t('video.pageTitle')}
          </h1>
          <button
            onClick={() => navigate('/patient/video-call')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse hover:bg-red-700 transition"
          >
            🔴 Join Live Call
          </button>
        </div>
      </div>

      {!isInCall ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left: form */}
          <div className="xl:col-span-2 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 text-green-600 grid place-items-center text-sm sm:text-base">📅</div>
              <div className="font-semibold text-sm sm:text-base">{t('video.sectionTitle')}</div>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">{t('video.patientName')}</label>
                  <input
                    type="text"
                    placeholder={t('video.patientNamePh')}
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">{t('video.phoneNumber')}</label>
                  <input
                    type="tel"
                    placeholder={t('video.phoneNumberPh')}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">{t('video.preferredDate')}</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 pr-10 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">📅</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">{t('video.preferredTime')}</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">{t('video.selectTime')}</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">{t('video.type')}</label>
                <select
                  value={formData.consultationType}
                  onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value={t('video.typeVideo')}>{t('video.typeVideo')}</option>
                  <option value={t('video.typeAudio')}>{t('video.typeAudio')}</option>
                  <option value={t('video.typeChat')}>{t('video.typeChat')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">{t('video.symptomsLabel')}</label>
                <textarea
                  rows="4"
                  placeholder={t('video.symptomsPh')}
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await initializeMedia()
                    if (success) {
                      alert(t('video.testCamera'))
                      if (localStreamRef.current) {
                        localStreamRef.current.getTracks().forEach(track => track.stop())
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm"
                >
                  🧪 {t('video.testCamera')}
                </button>
                <button type="submit" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition text-sm sm:text-base">
                  <span>📞</span>
                  <span>{t('video.bookBtn')} (Request Call)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Doctor Selection */}
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-xl sm:rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center text-lg sm:text-xl mb-2 sm:mb-3">👨‍⚕️</div>
              <div className="font-semibold mb-3 text-sm sm:text-base">{t('video.availableDoctors')}</div>
              <div className="space-y-3">
                {isDoctorsLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 rounded-lg border border-zinc-200">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-1/3" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  availableDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${selectedDoctor?.id === doctor.id
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
                            <span className={`px-2 py-1 rounded-full text-xs ${doctor.status === t('video.doctors.d1.status') || doctor.status === t('video.doctors.d2.status')
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
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5 bg-gradient-to-b from-green-50 to-white">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 text-green-600 grid place-items-center text-lg sm:text-xl mb-2 sm:mb-3">⏰</div>
              <div className="font-semibold mb-2 text-sm sm:text-base">{t('video.availableHours')}</div>
              <div className="text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-zinc-100"><span>{t('video.monFri')}</span><span className="font-medium">9:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between py-1 border-b border-zinc-100"><span>{t('video.saturday')}</span><span className="font-medium">9:00 AM - 2:00 PM</span></div>
                <div className="flex justify-between py-1"><span>{t('video.sunday')}</span><span className="text-red-600 font-medium">{t('video.closed')}</span></div>
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
                  {isCallConnected ? `${t('video.connected')} • ${formatDuration(callDuration)}` : t('video.connecting')}
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
                  <div className="text-xs text-zinc-500 mt-2">{t('video.doctorConnected')}</div>
                </div>
              ) : (
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-zinc-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto animate-pulse">
                    {selectedDoctor?.avatar}
                  </div>
                  <div className="text-lg font-medium">{selectedDoctor?.name}</div>
                  <div className="text-sm text-zinc-400">{t('video.connecting')}</div>
                  <div className="text-xs text-zinc-500 mt-2">{t('video.pleaseWait')}</div>
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
                  {t('video.cameraOff')}
                </div>
              )}
              {!localStreamRef.current && (
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-white text-xs">
                  <div className="text-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <div>{t('video.loadingCamera')}</div>
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