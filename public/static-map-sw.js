// Caches Google Static Map images for low-bandwidth fallback
const CACHE_NAME = 'static-map-cache-v1'
const STATIC_MAP_PATTERN = /maps\.googleapis\.com\/maps\/api\/staticmap/i

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (!STATIC_MAP_PATTERN.test(request.url)) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request)
      const networkPromise = fetch(request)
        .then((response) => {
          cache.put(request, response.clone())
          return response
        })
        .catch(() => cached || Response.error())

      return cached || networkPromise
    })
  )
})

