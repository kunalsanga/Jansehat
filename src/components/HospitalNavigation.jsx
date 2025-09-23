import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const NABHA_COORDS = { lat: 30.3747, lng: 76.1524 } // Nabha, Punjab

function RecenterOnNabha() {
    const map = useMap()
    useEffect(() => {
        map.setView([NABHA_COORDS.lat, NABHA_COORDS.lng], 13)
    }, [map])
    return null
}

function HospitalNavigation() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [userLocation, setUserLocation] = useState('')
    const [currentPosition, setCurrentPosition] = useState(null)

    const medicalFacilities = [
        {
            id: 1,
            name: 'Apollo Hospital',
            type: 'hospital',
            address: '123 Medical District, City',
            phone: '+1-555-0123',
            distance: '2.3 km',
            rating: 4.8,
            specialties: ['Cardiology', 'Neurology', 'Emergency', 'Surgery'],
            hours: '24/7',
            emergency: true,
            coordinates: { lat: 28.6139, lng: 77.2090 }
        },
        {
            id: 2,
            name: 'City General Hospital',
            type: 'hospital',
            address: '456 Health Street, City',
            phone: '+1-555-0456',
            distance: '1.8 km',
            rating: 4.6,
            specialties: ['Emergency', 'Trauma', 'Surgery', 'Pediatrics'],
            hours: '24/7',
            emergency: true,
            coordinates: { lat: 28.6140, lng: 77.2091 }
        },
        {
            id: 3,
            name: 'Metro Medical Center',
            type: 'hospital',
            address: '789 Care Avenue, City',
            phone: '+1-555-0789',
            distance: '3.1 km',
            rating: 4.7,
            specialties: ['Emergency', 'Pediatrics', 'Orthopedics', 'Dermatology'],
            hours: '24/7',
            emergency: true,
            coordinates: { lat: 28.6141, lng: 77.2092 }
        },
        {
            id: 4,
            name: 'CVS Pharmacy',
            type: 'pharmacy',
            address: '321 Main Street, City',
            phone: '+1-555-0321',
            distance: '0.8 km',
            rating: 4.4,
            specialties: ['Prescription', 'OTC Medicines', 'Health Products'],
            hours: '8:00 AM - 10:00 PM',
            emergency: false,
            coordinates: { lat: 28.6142, lng: 77.2093 }
        },
        {
            id: 5,
            name: 'Walgreens Pharmacy',
            type: 'pharmacy',
            address: '654 Oak Avenue, City',
            phone: '+1-555-0654',
            distance: '1.2 km',
            rating: 4.3,
            specialties: ['Prescription', 'OTC Medicines', 'Vaccinations'],
            hours: '7:00 AM - 11:00 PM',
            emergency: false,
            coordinates: { lat: 28.6143, lng: 77.2094 }
        },
        {
            id: 6,
            name: 'Apollo Pharmacy',
            type: 'pharmacy',
            address: '987 Health Plaza, City',
            phone: '+1-555-0987',
            distance: '2.1 km',
            rating: 4.5,
            specialties: ['Prescription', 'Specialty Medicines', 'Health Consultations'],
            hours: '9:00 AM - 9:00 PM',
            emergency: false,
            coordinates: { lat: 28.6144, lng: 77.2095 }
        },
        {
            id: 7,
            name: 'City Diagnostic Center',
            type: 'diagnostic',
            address: '147 Test Street, City',
            phone: '+1-555-0147',
            distance: '1.5 km',
            rating: 4.6,
            specialties: ['Blood Tests', 'X-Ray', 'MRI', 'CT Scan'],
            hours: '7:00 AM - 8:00 PM',
            emergency: false,
            coordinates: { lat: 28.6145, lng: 77.2096 }
        },
        {
            id: 8,
            name: 'Metro Lab Services',
            type: 'diagnostic',
            address: '258 Lab Avenue, City',
            phone: '+1-555-0258',
            distance: '2.7 km',
            rating: 4.4,
            specialties: ['Pathology', 'Microbiology', 'Biochemistry'],
            hours: '8:00 AM - 6:00 PM',
            emergency: false,
            coordinates: { lat: 28.6146, lng: 77.2097 }
        }
    ]

    const filteredFacilities = medicalFacilities.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            facility.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesType = selectedType === 'all' || facility.type === selectedType
        return matchesSearch && matchesType
    })

    const getTypeIcon = (type) => {
        switch (type) {
            case 'hospital': return '🏥'
            case 'pharmacy': return '💊'
            case 'diagnostic': return '🔬'
            default: return '🏢'
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'hospital': return 'bg-red-100 text-red-700'
            case 'pharmacy': return 'bg-blue-100 text-blue-700'
            case 'diagnostic': return 'bg-green-100 text-green-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const handleNavigation = (facility) => {
        const destination = `${facility.coordinates.lat},${facility.coordinates.lng}`
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank')
    }

    useEffect(() => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setCurrentPosition(coords)
            },
            () => {
                setCurrentPosition(null)
            },
            { enableHighAccuracy: true, timeout: 5000 }
        )
    }, [])

    const handleCall = (facility) => {
        alert(`Calling ${facility.name} at ${facility.phone}`)
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Hospital Navigation</h1>
                    <p className="text-xs sm:text-sm text-zinc-600">Find and navigate to nearby hospitals and pharmacies</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search hospitals, pharmacies, or specialties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="hospital">Hospitals</option>
                        <option value="pharmacy">Pharmacies</option>
                        <option value="diagnostic">Diagnostic Centers</option>
                    </select>
                </div>
            </div>

            {/* Current Location */}
            <div className="rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">📍</div>
                    <div>
                        <h3 className="font-semibold text-blue-800">Current Location</h3>
                        <p className="text-sm text-blue-700">Detecting your location for accurate distances...</p>
                    </div>
                </div>
            </div>

            {/* Facilities List */}
            <div className="space-y-3">
                {filteredFacilities.map((facility) => (
                    <div key={facility.id} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">{getTypeIcon(facility.type)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-sm sm:text-base">{facility.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(facility.type)}`}>
                                            {facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}
                                        </span>
                                        {facility.emergency && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                                Emergency
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-zinc-600 mb-2">{facility.address}</p>
                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        <span>📍 {facility.distance}</span>
                                        <span>⭐ {facility.rating}</span>
                                        <span>🕒 {facility.hours}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                                {facility.specialties.map((specialty, index) => (
                                    <span key={index} className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-full">
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleNavigation(facility)}
                                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                            >
                                🗺️ Navigate
                            </button>
                            <button
                                onClick={() => handleCall(facility)}
                                className="px-3 py-2 border border-zinc-300 text-zinc-700 rounded-lg text-sm hover:bg-zinc-50 transition"
                            >
                                📞 Call
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map View */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-2 sm:p-4">
                <div className="h-80 rounded-lg overflow-hidden">
                    <MapContainer center={[NABHA_COORDS.lat, NABHA_COORDS.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RecenterOnNabha />
                        {currentPosition && (
                            <Marker position={[currentPosition.lat, currentPosition.lng]}>
                                <Popup>Your location</Popup>
                            </Marker>
                        )}
                        {filteredFacilities.map((f) => (
                            <Marker key={f.id} position={[f.coordinates.lat, f.coordinates.lng]}>
                                <Popup>
                                    <div className="space-y-1">
                                        <div className="font-semibold">{f.name}</div>
                                        <div className="text-xs text-zinc-600">{f.address}</div>
                                        <button onClick={() => handleNavigation(f)} className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">Navigate</button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}

export default HospitalNavigation
