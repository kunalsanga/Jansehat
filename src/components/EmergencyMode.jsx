import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

function EmergencyMode() {
    const [emergencyType, setEmergencyType] = useState('')
    const [location, setLocation] = useState('')
    const [isCalling, setIsCalling] = useState(false)

    const emergencyServices = [
        {
            id: 1,
            name: 'Ambulance',
            number: '108',
            description: 'Medical emergency transport',
            icon: '🚑',
            color: 'bg-red-500'
        },
        {
            id: 2,
            name: 'Police',
            number: '100',
            description: 'Law enforcement emergency',
            icon: '👮',
            color: 'bg-blue-500'
        },
        {
            id: 3,
            name: 'Fire Department',
            number: '101',
            description: 'Fire and rescue services',
            icon: '🚒',
            color: 'bg-orange-500'
        },
        {
            id: 4,
            name: 'Women Helpline',
            number: '1091',
            description: 'Women safety and support',
            icon: '👩',
            color: 'bg-pink-500'
        },
        {
            id: 5,
            name: 'Child Helpline',
            number: '1098',
            description: 'Child protection services',
            icon: '👶',
            color: 'bg-green-500'
        },
        {
            id: 6,
            name: 'Mental Health',
            number: '1800-599-0019',
            description: 'Mental health crisis support',
            icon: '🧠',
            color: 'bg-purple-500'
        }
    ]

    const nearbyHospitals = [
        {
            id: 1,
            name: 'Apollo Hospital',
            distance: '2.3 km',
            address: '123 Medical District, City',
            phone: '+1-555-0123',
            emergency: true,
            specialties: ['Emergency', 'Cardiology', 'Neurology']
        },
        {
            id: 2,
            name: 'City General Hospital',
            distance: '1.8 km',
            address: '456 Health Street, City',
            phone: '+1-555-0456',
            emergency: true,
            specialties: ['Emergency', 'Trauma', 'Surgery']
        },
        {
            id: 3,
            name: 'Metro Medical Center',
            distance: '3.1 km',
            address: '789 Care Avenue, City',
            phone: '+1-555-0789',
            emergency: true,
            specialties: ['Emergency', 'Pediatrics', 'Orthopedics']
        }
    ]

    const handleEmergencyCall = (service) => {
        setIsCalling(true)
        // Simulate calling
        setTimeout(() => {
            setIsCalling(false)
            alert(`Calling ${service.name} at ${service.number}`)
        }, 2000)
    }

    const handleHospitalCall = (hospital) => {
        alert(`Calling ${hospital.name} at ${hospital.phone}`)
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Emergency Mode</h1>
                    <p className="text-xs sm:text-sm text-zinc-600">Quick access to emergency services and urgent care</p>
                </div>
            </div>

            {/* Emergency Alert */}
            <div className="rounded-xl sm:rounded-2xl bg-red-50 border border-red-200 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center text-xl">🚨</div>
                    <div>
                        <h3 className="font-semibold text-red-800">Emergency Alert</h3>
                        <p className="text-sm text-red-700">If this is a life-threatening emergency, call 108 immediately or go to the nearest emergency room.</p>
                    </div>
                </div>
            </div>

            {/* Emergency Services */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold">Emergency Services</h2>
                    <p className="text-sm text-zinc-600">Tap to call emergency services</p>
                </div>
                <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {emergencyServices.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => handleEmergencyCall(service)}
                                disabled={isCalling}
                                className={`p-4 rounded-lg border-2 border-transparent hover:border-zinc-300 transition-all text-left ${isCalling ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-full ${service.color} text-white flex items-center justify-center text-lg`}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{service.name}</h3>
                                        <p className="text-lg font-bold text-zinc-800">{service.number}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-600">{service.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nearby Hospitals */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold">Nearby Emergency Hospitals</h2>
                    <p className="text-sm text-zinc-600">Emergency-ready hospitals in your area</p>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                    {nearbyHospitals.map((hospital) => (
                        <div key={hospital.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm">{hospital.name}</h3>
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Emergency</span>
                                </div>
                                <p className="text-xs text-zinc-600 mb-1">{hospital.address}</p>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <span>📍 {hospital.distance}</span>
                                    <span>📞 {hospital.phone}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {hospital.specialties.map((specialty, index) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => handleHospitalCall(hospital)}
                                className="ml-3 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition"
                            >
                                Call Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                </div>
                <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">📍</span>
                                <span className="font-medium text-sm">Share Location</span>
                            </div>
                            <p className="text-xs text-zinc-600">Share your current location with emergency contacts</p>
                        </button>
                        <button className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">📋</span>
                                <span className="font-medium text-sm">Medical Info</span>
                            </div>
                            <p className="text-xs text-zinc-600">Quick access to your medical information</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmergencyMode
