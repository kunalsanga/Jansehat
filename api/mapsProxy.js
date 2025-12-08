import express from 'express'

// Registers Google Maps proxy endpoints to keep API keys server-side
export function registerMapsProxy(app) {
  const router = express.Router()
  const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY

  const ensureKey = (res) => {
    if (!MAPS_KEY) {
      res.status(500).json({ error: 'Google Maps API key not configured' })
      return false
    }
    return true
  }

  // Nearby search (hospital / pharmacy)
  router.get('/nearby', async (req, res) => {
    try {
      const { lat, lng, type = 'hospital', radius = '5000' } = req.query || {}
      const allowedTypes = ['hospital', 'pharmacy']
      if (!ensureKey(res)) return
      if (!lat || !lng || !allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'lat, lng and valid type are required' })
      }

      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
      url.search = new URLSearchParams({
        location: `${lat},${lng}`,
        radius,
        type,
        key: MAPS_KEY
      }).toString()

      const response = await fetch(url)
      if (!response.ok) {
        return res.status(502).json({ error: 'Failed to reach Google Places' })
      }
      const data = await response.json()

      const places = Array.isArray(data.results)
        ? data.results.map((place) => ({
            name: place.name,
            geometry: place.geometry,
            place_id: place.place_id,
            vicinity: place.vicinity,
            opening_hours: place.opening_hours,
            rating: place.rating,
            types: place.types
          }))
        : []

      res.json({ places, status: data.status })
    } catch (error) {
      console.error('Nearby search failed:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  // Directions proxy
  router.post('/route', async (req, res) => {
    try {
      const { origin, destination } = req.body || {}
      if (!ensureKey(res)) return

      const toCoordString = (value) => {
        if (!value) return null
        if (typeof value === 'string') return value
        if (typeof value === 'object' && typeof value.lat === 'number' && typeof value.lng === 'number') {
          return `${value.lat},${value.lng}`
        }
        return null
      }

      const originStr = toCoordString(origin)
      const destStr = toCoordString(destination)
      if (!originStr || !destStr) {
        return res.status(400).json({ error: 'origin and destination are required' })
      }

      const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
      url.search = new URLSearchParams({
        origin: originStr,
        destination: destStr,
        mode: 'driving',
        key: MAPS_KEY
      }).toString()

      const response = await fetch(url)
      if (!response.ok) {
        return res.status(502).json({ error: 'Failed to reach Google Directions' })
      }

      const data = await response.json()
      const route = Array.isArray(data.routes) && data.routes.length > 0 ? data.routes[0] : null
      if (!route) {
        return res.status(404).json({ error: 'No route found', status: data.status })
      }

      const firstLeg = Array.isArray(route.legs) && route.legs.length ? route.legs[0] : null
      res.json({
        polyline: route.overview_polyline?.points,
        distance: firstLeg?.distance,
        duration: firstLeg?.duration,
        route,
        status: data.status
      })
    } catch (error) {
      console.error('Directions request failed:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  app.use('/api/maps', router)
}

