import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'

const NABHA_COORDS = { lat: 30.3747, lng: 76.1524 } // Nabha, Punjab

// Fix default marker icons in Vite
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl
})

// Professional-looking custom pin icons
function createPinIcon(hexColor, size = 22) {
    const width = size
    const height = Math.round(size * 1.5)
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${width}" height="${height}" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
          <feOffset dx="0" dy="1" result="offsetblur"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11.5 13 20 16 32 3-12 16-20.5 16-32C32 7.163 24.837 0 16 0z" fill="${hexColor}" filter="url(#shadow)"/>
      <circle cx="16" cy="16" r="6" fill="#ffffff"/>
    </svg>`
    const url = `data:image/svg+xml;base64,${btoa(svg)}`
    return L.icon({ iconUrl: url, iconSize: [width, height], iconAnchor: [width/2, height], popupAnchor: [0, -height + 4] })
}

const ICONS = {
    hospital: createPinIcon('#ef4444', 20),
    pharmacy: createPinIcon('#10b981', 18),
    diagnostic: createPinIcon('#8b5cf6', 18),
    user: createPinIcon('#3b82f6', 16)
}

function RecenterOnNabha() {
    const map = useMap()
    useEffect(() => {
        map.setView([NABHA_COORDS.lat, NABHA_COORDS.lng], 13)
    }, [map])
    return null
}

function HospitalNavigation() {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [userLocation, setUserLocation] = useState('')
    const [currentPosition, setCurrentPosition] = useState(null)
    const [routeDestination, setRouteDestination] = useState(null)
    const [destinationQuery, setDestinationQuery] = useState('')
    const [selectedFacility, setSelectedFacility] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [routeInstructions, setRouteInstructions] = useState([])
    const mapRef = useRef(null)
    const mapBoxRef = useRef(null)

    const [medicalFacilities, setMedicalFacilities] = useState([])

    // Fetch real facilities from OpenStreetMap (Overpass API) around Nabha
    useEffect(() => {
        async function fetchFacilities() {
            try {
                const radiusMeters = 8000 // ~8km around Nabha
                const query = `
                    [out:json][timeout:25];
                    (
                      node["amenity"~"hospital|clinic|pharmacy"](around:${radiusMeters},${NABHA_COORDS.lat},${NABHA_COORDS.lng});
                      way["amenity"~"hospital|clinic|pharmacy"](around:${radiusMeters},${NABHA_COORDS.lat},${NABHA_COORDS.lng});
                      relation["amenity"~"hospital|clinic|pharmacy"](around:${radiusMeters},${NABHA_COORDS.lat},${NABHA_COORDS.lng});
                    );
                    out center tags;`;
                const res = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    body: new URLSearchParams({ data: query }).toString()
                })
                if (!res.ok) throw new Error('Failed to load facilities')
                const data = await res.json()
                const elements = Array.isArray(data.elements) ? data.elements : []
                const mapped = elements
                    .map(el => {
                        const tags = el.tags || {}
                        const lat = el.lat || (el.center && el.center.lat)
                        const lon = el.lon || (el.center && el.center.lon)
                        if (typeof lat !== 'number' || typeof lon !== 'number') return null
                        const amenity = (tags.amenity || '').toLowerCase()
                        let type = amenity
                        if (amenity === 'clinic') type = 'hospital'
                        if (!['hospital','pharmacy','diagnostic'].includes(type)) {
                            type = amenity === 'pharmacy' ? 'pharmacy' : 'hospital'
                        }
                        const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city'] || tags['addr:town'] || tags['addr:village'], tags['addr:state']]
                            .filter(Boolean)
                            .join(', ')
                        return {
                            id: `${el.type}-${el.id}`,
                            name: tags.name || 'Unnamed',
                            type,
                            address: address || (tags['addr:full'] || 'Address unavailable'),
                            phone: tags.phone || tags['contact:phone'] || '',
                            distance: '',
                            rating: undefined,
                            specialties: [],
                            hours: tags.opening_hours || '',
                            emergency: !!tags.emergency,
                            coordinates: { lat, lng: lon }
                        }
                    })
                    .filter(Boolean)

                // Deduplicate by name + coords
                const seen = new Set()
                const deduped = []
                for (const f of mapped) {
                    const key = `${f.name}|${f.coordinates.lat.toFixed(5)}|${f.coordinates.lng.toFixed(5)}`
                    if (!seen.has(key)) { seen.add(key); deduped.push(f) }
                }
                setMedicalFacilities(deduped)
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('Could not fetch real facilities, using empty list', e)
                setMedicalFacilities([])
            }
        }
        fetchFacilities()
    }, [])

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
        setSelectedFacility(facility)
        setDestinationQuery(facility.name)
        setRouteDestination({ lat: facility.coordinates.lat, lng: facility.coordinates.lng })
        setShowSuggestions(false)
        // Focus map and center on destination
        try {
            if (mapBoxRef.current) {
                mapBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            if (mapRef.current) {
                mapRef.current.flyTo([facility.coordinates.lat, facility.coordinates.lng], 15)
            }
        } catch (_) {}
    }

    const startRouting = () => {
        if (!selectedFacility) return
        setRouteDestination({
            lat: selectedFacility.coordinates.lat,
            lng: selectedFacility.coordinates.lng
        })
    }

    const clearRoute = () => {
        setRouteDestination(null)
        setSelectedFacility(null)
        setRouteInstructions([])
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

    function RoutingControl({ from, to }) {
        const map = useMap()
        const controlRef = useRef(null)
        useEffect(() => {
            if (!to) return
            const start = from ? L.latLng(from.lat, from.lng) : L.latLng(NABHA_COORDS.lat, NABHA_COORDS.lng)
            const end = L.latLng(to.lat, to.lng)

            if (controlRef.current) {
                controlRef.current.setWaypoints([start, end])
                return
            }

            const ctrl = L.Routing.control({
                waypoints: [start, end],
                lineOptions: { styles: [{ color: '#2563eb', opacity: 0.8, weight: 6 }] },
                show: false,
                addWaypoints: false,
                routeWhileDragging: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                altLineOptions: { styles: [{ color: '#93c5fd', opacity: 0.6, weight: 4 }] },
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map)

            ctrl.on('routingerror', () => {
                // Silent fail in UI; optionally notify user
                // eslint-disable-next-line no-console
                console.warn('Routing failed. Check network or OSRM availability.')
            })

            ctrl.on('routesfound', (e) => {
                try {
                    const route = e.routes && e.routes[0]
                    if (!route) return setRouteInstructions([])
                    // leaflet-routing-machine provides instructions on route.instructions
                    if (route.instructions && route.instructions.length) {
                        const items = route.instructions.map((ins, idx) => {
                            const dist = ins.distance ? ` (${Math.round(ins.distance)} m)` : ''
                            return `${idx + 1}. ${ins.text}${dist}`
                        })
                        setRouteInstructions(items)
                    } else {
                        // fallback summary
                        const km = (route.summary.totalDistance / 1000).toFixed(1)
                        const min = Math.round(route.summary.totalTime / 60)
                        setRouteInstructions([`Distance: ${km} km`, `ETA: ${min} min`])
                    }
                } catch (_) {
                    setRouteInstructions([])
                }
            })

            controlRef.current = ctrl

            return () => {
                if (controlRef.current) {
                    map.removeControl(controlRef.current)
                    controlRef.current = null
                }
            }
        }, [from, to, map])
        return null
    }

    const handleCall = (facility) => {
        alert(`Calling ${facility.name} at ${facility.phone}`)
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <NavLink to="/" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-zinc-200 grid place-items-center hover:bg-zinc-50 text-sm sm:text-base">←</NavLink>
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">{t('nav.hospitalNavigation')}</h1>
                    <p className="text-xs sm:text-sm text-zinc-600">{t('nav.findAndNavigate')}</p>
                </div>
            </div>

            {/* Map View (TOP) */}
            <div ref={mapBoxRef} className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-2 sm:p-4">
                <div className="h-80 rounded-lg overflow-hidden">
                    <MapContainer whenCreated={(map)=>{mapRef.current=map}} center={[NABHA_COORDS.lat, NABHA_COORDS.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RecenterOnNabha />
                        <RoutingControl from={currentPosition} to={routeDestination} />
                        {currentPosition && (
                            <Marker icon={ICONS.user} position={[currentPosition.lat, currentPosition.lng]}>
                                <Popup>Your location</Popup>
                            </Marker>
                        )}
                        {filteredFacilities.map((f) => (
                            <Marker eventHandlers={{ click: () => handleNavigation(f) }} icon={ICONS[f.type] || ICONS.hospital} key={f.id} position={[f.coordinates.lat, f.coordinates.lng]}>
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

            {/* Search and Filters */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder={t('nav.searchPlaceholder')}
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
                        <option value="all">{t('nav.allTypes')}</option>
                        <option value="hospital">{t('nav.hospitals')}</option>
                        <option value="pharmacy">{t('nav.pharmacies')}</option>
                        <option value="diagnostic">{t('nav.diagnostics')}</option>
                    </select>
                </div>
            </div>

            {/* Current Location */}
            <div className="rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">📍</div>
                    <div>
                        <h3 className="font-semibold text-blue-800">{t('nav.currentLocation')}</h3>
                        <p className="text-sm text-blue-700">{t('nav.detectingLocation')}</p>
                    </div>
                </div>
            </div>

            {/* Facilities List (below the map) */}
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
                                🗺️ {t('nav.navigate')}
                            </button>
                            <button
                                onClick={() => handleCall(facility)}
                                className="px-3 py-2 border border-zinc-300 text-zinc-700 rounded-lg text-sm hover:bg-zinc-50 transition"
                            >
                                📞 {t('nav.call')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            

            {/* Simple Navigation UI */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 sm:p-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">{t('nav.whereTo')}</label>
                    <input
                        value={destinationQuery}
                        onChange={(e) => { setDestinationQuery(e.target.value); setShowSuggestions(true); setSelectedFacility(null) }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t('nav.searchPlaceholder')}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {showSuggestions && destinationQuery.trim().length > 0 && (
                        <div className="mt-2 max-h-48 overflow-auto border border-zinc-200 rounded-lg divide-y bg-white">
                            {filteredFacilities
                                .filter(f => f.name.toLowerCase().includes(destinationQuery.toLowerCase()))
                                .slice(0, 8)
                                .map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => { setSelectedFacility(f); setDestinationQuery(f.name); setShowSuggestions(false) }}
                                        className="w-full text-left px-3 py-2 hover:bg-zinc-50 flex items-center justify-between"
                                    >
                                        <span className="flex items-center gap-2"><span>{getTypeIcon(f.type)}</span>{f.name}</span>
                                        <span className="text-xs text-zinc-500">{f.distance}</span>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={startRouting} disabled={!selectedFacility} className={`px-4 py-2 rounded-lg text-white ${selectedFacility ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}>{t('nav.start')}</button>
                    <button onClick={clearRoute} className="px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50">{t('nav.clear')}</button>
                </div>
                {routeInstructions.length > 0 && (
                    <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 text-sm space-y-1 max-h-40 overflow-auto">
                        {routeInstructions.map((t, i) => (
                            <div key={i}>{t}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HospitalNavigation
