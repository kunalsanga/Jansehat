// Decodes a Google encoded polyline string into Leaflet-friendly coordinates
// Source: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
export default function decodePolyline(encoded) {
  if (!encoded || typeof encoded !== 'string') return []

  let index = 0
  const len = encoded.length
  const path = []
  let lat = 0
  let lng = 0

  while (index < len) {
    let shift = 0
    let result = 0
    let byte
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1)
    lat += deltaLat

    shift = 0
    result = 0
    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1)
    lng += deltaLng

    path.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }

  return path
}

