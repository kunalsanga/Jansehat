import React, { useState } from 'react'
import { FaExclamationTriangle, FaMapMarkerAlt } from 'react-icons/fa'

function EmergencyMode() {
    const [isCalling, setIsCalling] = useState(false)
  const [locating, setLocating] = useState(false)

    const handleEmergencyClick = () => {
        setIsCalling(true)
        // Simulate calling ASHA worker
        setTimeout(() => {
            setIsCalling(false)
            alert('ASHA worker has been notified and is on the way!')
        }, 2000)
    }

  const handleShareLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Location not available on this device/browser')
      return
    }
    if (!window.isSecureContext && !window.location.origin.includes('localhost')) {
      alert('Location access may fail on non-HTTPS sites. Please use HTTPS or localhost.')
    }
    setLocating(true)
    const openMaps = (lat, lng, approx = false) => {
      const url = `https://www.google.com/maps?q=${lat},${lng}`
      window.open(url, '_blank')
      if (approx) {
        alert('Opened approximate location (IP-based). For precise pin, enable GPS permissions.')
      }
    }
    const fallbackToIP = async (reasonMsg) => {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (data && data.latitude && data.longitude) {
          setLocating(false)
          openMaps(data.latitude, data.longitude, true)
        } else {
          setLocating(false)
          alert('Unable to get location: ' + reasonMsg)
        }
      } catch (e) {
        setLocating(false)
        alert('Unable to get location: ' + reasonMsg)
      }
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const { latitude, longitude } = pos.coords
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`
        window.open(url, '_blank')
      },
      (err) => {
        // Provide clearer errors and try fallback
        const code = err && typeof err.code === 'number' ? err.code : -1
        let reason = err?.message || 'Unknown error'
        if (code === 1) reason = 'Permission denied. Please allow location access.'
        else if (code === 2) reason = 'Position unavailable. Turn on GPS or check network.'
        else if (code === 3) reason = 'Timed out. Trying network-based location...'
        fallbackToIP(reason)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
  }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-8">

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 text-center">
                Emergency Help
            </h1>

            {/* Big hand pointing down */}
            <p className="text-6xl text-gray-600 text-center animate-bounce">
                👇
            </p>

            {/* Big Emergency Button */}
<button
    onClick={handleEmergencyClick}
    disabled={isCalling}
    className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-red-700 text-white text-2xl font-semibold shadow-md flex flex-col items-center justify-center transition transform active:scale-95 ${
        isCalling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
    }`}
>
    <FaExclamationTriangle className="text-4xl mb-2" />
    {isCalling ? 'Sending...' : 'EMERGENCY'}
</button>


            {/* Quick Helper Buttons */}
            <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
                <button onClick={handleShareLocation} disabled={locating} className={`p-4 rounded-lg bg-gray-800 text-white text-center font-medium shadow transition flex flex-col items-center ${locating ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-900'}`}>
                    <FaMapMarkerAlt className="text-xl mb-1" />
                    {locating ? 'Fetching location…' : 'Share Location'}
                </button>
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-500 text-center max-w-xs mt-4">
                In case of emergency, an ASHA worker will reach your location shortly.
            </p>
        </div>
    )
}

export default EmergencyMode