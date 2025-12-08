import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'
import decodePolyline from '../utils/decodePolyline'
import { getApiBaseUrl } from '../../config.js'

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

const STATIC_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY || ''

function RecenterOnNabha() {
    const map = useMap()
    useEffect(() => {
        map.setView([NABHA_COORDS.lat, NABHA_COORDS.lng], 13)
    }, [map])
    return null
}

function HospitalNavigation() {
    const { t } = useTranslation()
    const location = useLocation()
    const apiBase = getApiBaseUrl()
    const emergencyTriggeredRef = useRef(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [currentPosition, setCurrentPosition] = useState(null)
    const [routeDestination, setRouteDestination] = useState(null)
    const [destinationQuery, setDestinationQuery] = useState('')
    const [selectedFacility, setSelectedFacility] = useState(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [routeInstructions, setRouteInstructions] = useState([])
    const mapRef = useRef(null)
    const mapBoxRef = useRef(null)
    const routeLineRef = useRef(null)
    const [medicalFacilities, setMedicalFacilities] = useState([])
    const [googleFacilities, setGoogleFacilities] = useState([])
    const [isLowBandwidth, setIsLowBandwidth] = useState(false)
    const [useStaticMap, setUseStaticMap] = useState(false)
    const [staticReason, setStaticReason] = useState('')
    const [googleRoutePoints, setGoogleRoutePoints] = useState([])
    const googleLayerRef = useRef(null)

    // Detect low-bandwidth connections to switch to static maps gracefully
    useEffect(() => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        if (connection && (connection.effectiveType?.includes('2g') || connection.saveData)) {
            setIsLowBandwidth(true)
            setUseStaticMap(true)
            setStaticReason('Low bandwidth detected, using static map preview.')
        }
    }, [])

    // Register a tiny service worker that caches static map images (only when needed)
    useEffect(() => {
        if (!useStaticMap || !('serviceWorker' in navigator)) return
        navigator.serviceWorker.register('/static-map-sw.js').catch(() => {})
    }, [useStaticMap])

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

    const fetchGoogleNearby = React.useCallback(async () => {
        try {
            const base = currentPosition || NABHA_COORDS
            const typesToFetch = selectedType === 'all' ? ['hospital', 'pharmacy'] : [selectedType]
            const radius = 7000

            const responses = await Promise.all(typesToFetch.map(async (type) => {
                const url = `${apiBase}/api/maps/nearby?lat=${base.lat}&lng=${base.lng}&type=${type}&radius=${radius}`
                const res = await fetch(url)
                if (!res.ok) throw new Error('Failed to load Google Places')
                const data = await res.json()
                const places = Array.isArray(data.places) ? data.places : []
                return places.map((p) => {
                    const coords = p.geometry?.location
                    if (!coords?.lat || !coords?.lng) return null
                    return {
                        id: `g-${p.place_id}`,
                        name: p.name || 'Unknown',
                        type: type === 'pharmacy' ? 'pharmacy' : 'hospital',
                        address: p.vicinity || 'Address unavailable',
                        phone: '',
                        distance: '',
                        rating: p.rating,
                        specialties: [],
                        hours: p.opening_hours?.weekday_text?.join(', ') || '',
                        emergency: Array.isArray(p.types) ? p.types.includes('hospital') && p.types.includes('emergency_room') : false,
                        coordinates: { lat: coords.lat, lng: coords.lng }
                    }
                }).filter(Boolean)
            }))

            const merged = responses.flat()
            setGoogleFacilities(Array.isArray(merged) ? merged : [])
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Google Places fetch failed, falling back to OSM only', error)
            setGoogleFacilities([])
        }
    }, [apiBase, currentPosition, selectedType])

    useEffect(() => {
        fetchGoogleNearby()
    }, [fetchGoogleNearby])

    const combinedFacilities = useMemo(() => {
        const merged = [...medicalFacilities, ...googleFacilities]
        const seen = new Set()
        return merged.filter((facility) => {
            const key = `${facility.name}|${facility.coordinates.lat.toFixed(5)}|${facility.coordinates.lng.toFixed(5)}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
    }, [medicalFacilities, googleFacilities])

    const filteredFacilities = useMemo(() => combinedFacilities.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (facility.specialties || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesType = selectedType === 'all' || facility.type === selectedType
        return matchesSearch && matchesType
    }), [combinedFacilities, searchQuery, selectedType])

    const emergencyMode = useMemo(() => {
        const params = new URLSearchParams(location.search)
        return params.get('emergency') === '1'
    }, [location.search])

    // Auto-trigger navigation when coming from an emergency handoff
    useEffect(() => {
        if (!emergencyMode || emergencyTriggeredRef.current || filteredFacilities.length === 0) return
        const target = filteredFacilities.find((f) => f.type === 'hospital') || filteredFacilities[0]
        if (target) {
            emergencyTriggeredRef.current = true
            handleNavigation(target)
            setTimeout(() => startRouting(target), 400)
        }
    }, [emergencyMode, filteredFacilities])

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

const getGoogleMapEmbedUrl = (coords) => {
    if (!coords) return null
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`
}

const getGoogleDirectionsUrl = (origin, destination) => {
    if (!destination) return null
    const dest = `${destination.lat},${destination.lng}`
    const originPart = origin ? `&origin=${origin.lat},${origin.lng}` : ''
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}${originPart}`
}

const getStaticMapUrl = (coords) => {
    if (!coords || !STATIC_MAP_KEY) return ''
    return `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=14&size=640x320&markers=color:red|${coords.lat},${coords.lng}&key=${STATIC_MAP_KEY}`
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

    const startRouting = async (facilityOverride) => {
        const facility = facilityOverride || selectedFacility
        if (!facility) return
        const origin = currentPosition || NABHA_COORDS
        const destination = facility.coordinates
        setRouteDestination({ lat: destination.lat, lng: destination.lng })
        try {
            const res = await fetch(`${apiBase}/api/maps/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    origin: { lat: origin.lat, lng: origin.lng },
                    destination: { lat: destination.lat, lng: destination.lng }
                })
            })
            if (!res.ok) throw new Error('Directions request failed')
            const data = await res.json()
            if (data.polyline) {
                const decoded = decodePolyline(data.polyline)
                setGoogleRoutePoints(decoded)
                setUseStaticMap(false)
                const summary = []
                if (data.distance?.text) summary.push(`Distance: ${data.distance.text}`)
                if (data.duration?.text) summary.push(`ETA: ${data.duration.text}`)
                setRouteInstructions(summary.length ? summary : ['Route ready'])
            } else {
                setGoogleRoutePoints([])
                setRouteInstructions([])
                setUseStaticMap(true)
                setStaticReason('Directions unavailable, showing static map preview.')
            }
        } catch (error) {
            setGoogleRoutePoints([])
            setUseStaticMap(true)
            setStaticReason('Directions unavailable, showing static map preview.')
            // eslint-disable-next-line no-console
            console.warn('Google Directions failed, falling back to static map', error)
        }
    }

    const clearRoute = () => {
        setRouteDestination(null)
        setSelectedFacility(null)
        setRouteInstructions([])
        setGoogleRoutePoints([])
        if (routeLineRef.current && mapRef.current) {
            mapRef.current.removeLayer(routeLineRef.current)
            routeLineRef.current = null
        }
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

    // Draw / clear Google polyline on Leaflet map
    useEffect(() => {
        if (!mapRef.current) return
        if (routeLineRef.current) {
            mapRef.current.removeLayer(routeLineRef.current)
            routeLineRef.current = null
        }
        if (googleRoutePoints.length) {
            routeLineRef.current = L.polyline(googleRoutePoints, { color: 'blue', weight: 4 }).addTo(mapRef.current)
            mapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [32, 32] })
        }
    }, [googleRoutePoints])

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
                <div className="h-80 rounded-lg overflow-hidden relative">
                    {useStaticMap && (
                        <div className="absolute inset-0 z-10 bg-white">
                            {getStaticMapUrl(routeDestination || selectedFacility?.coordinates || NABHA_COORDS) ? (
                                <img
                                    src={getStaticMapUrl(routeDestination || selectedFacility?.coordinates || NABHA_COORDS)}
                                    alt="Static map preview"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-full w-full grid place-items-center text-sm text-zinc-500 px-4 text-center">
                                    Static map unavailable. Add VITE_GOOGLE_MAPS_BROWSER_KEY for previews.
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-xs text-zinc-700 p-2 flex items-center justify-between">
                                <span>{staticReason || (isLowBandwidth ? 'Low bandwidth detected, using static map preview.' : 'Using static map preview due to connection limits.')}</span>
                                <button onClick={() => setUseStaticMap(false)} className="px-2 py-1 bg-blue-600 text-white rounded">Retry live map</button>
                            </div>
                        </div>
                    )}
                    <MapContainer className={useStaticMap ? 'opacity-30 pointer-events-none' : ''} whenCreated={(map)=>{mapRef.current=map; if (!googleLayerRef.current) { googleLayerRef.current = L.layerGroup().addTo(map) } }} center={[NABHA_COORDS.lat, NABHA_COORDS.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RecenterOnNabha />
                        {!googleRoutePoints.length && <RoutingControl from={currentPosition} to={routeDestination} />}
                        {currentPosition && (
                            <Marker icon={ICONS.user} position={[currentPosition.lat, currentPosition.lng]}>
                                <Popup>Your location</Popup>
                            </Marker>
                        )}
                        {filteredFacilities.map((f) => (
                            <Marker eventHandlers={{ click: () => handleNavigation(f) }} icon={ICONS[f.type] || ICONS.hospital} key={f.id} position={[f.coordinates.lat, f.coordinates.lng]}>
                                <Popup>
                                    <div className="space-y-2">
                                        <div className="font-semibold">{f.name}</div>
                                        <div className="text-xs text-zinc-600">{f.address}</div>
                                        {f.rating && <div className="text-xs text-amber-600">⭐ {f.rating}</div>}
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => handleNavigation(f)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Navigate</button>
                                            <button onClick={() => {
                                                const url = getGoogleDirectionsUrl(currentPosition || NABHA_COORDS, f.coordinates)
                                                if (url) window.open(url, '_blank', 'noopener,noreferrer')
                                            }} className="px-2 py-1 border border-blue-200 text-blue-700 rounded text-xs">Open in Google Maps</button>
                                        </div>
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

            {/* Google Maps preview + open in Google Maps */}
            <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-800">Google Maps</h2>
                        <p className="text-xs text-zinc-500">Live view powered by Google</p>
                    </div>
                    <button
                        disabled={!routeDestination && !selectedFacility}
                        onClick={() => {
                            const url = getGoogleDirectionsUrl(currentPosition, routeDestination || selectedFacility?.coordinates || NABHA_COORDS)
                            if (url) window.open(url, '_blank', 'noopener,noreferrer')
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${routeDestination || selectedFacility ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'}`}
                    >
                        Open in Google Maps
                    </button>
                </div>
                <div className="h-64 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                    {getGoogleMapEmbedUrl(routeDestination || selectedFacility?.coordinates || NABHA_COORDS) ? (
                        <iframe
                            title="Google Maps preview"
                            src={getGoogleMapEmbedUrl(routeDestination || selectedFacility?.coordinates || NABHA_COORDS)}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    ) : (
                        <div className="h-full w-full grid place-items-center text-sm text-zinc-500">Select a destination to view in Google Maps</div>
                    )}
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
