import React, { useState } from 'react'
import { FaExclamationTriangle, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa'

function EmergencyMode() {
    const [isCalling, setIsCalling] = useState(false)

    const handleEmergencyClick = () => {
        setIsCalling(true)
        // Simulate calling ASHA worker
        setTimeout(() => {
            setIsCalling(false)
            alert('ASHA worker has been notified and is on the way!')
        }, 2000)
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
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                <button className="p-4 rounded-lg bg-gray-800 text-white text-center font-medium shadow hover:bg-gray-900 transition flex flex-col items-center">
                    <FaMapMarkerAlt className="text-xl mb-1" />
                    Share Location
                </button>
                <button className="p-4 rounded-lg bg-gray-800 text-white text-center font-medium shadow hover:bg-gray-900 transition flex flex-col items-center">
                    <FaNotesMedical className="text-xl mb-1" />
                    Medical Info
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