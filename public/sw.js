// DentaStock Service Worker
// Manual PWA implementation for TanStack Start SSR compatibility

const CACHE_NAME = 'dentastock-v1'
const STATIC_CACHE_NAME = 'dentastock-static-v1'
const FONT_CACHE_NAME = 'dentastock-fonts-v1'

// Assets to cache on install (minimal set that we know exists)
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon/favicon.ico',
  '/favicon/favicon-96x96.png',
  '/favicon/apple-touch-icon.png',
  '/favicon/web-app-manifest-192x192.png',
  '/favicon/web-app-manifest-512x512.png',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      // Cache static assets, but don't fail install if some are missing
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Failed to cache ${url}:`, err)
          }),
        ),
      )
    }),
  )
  // Take control immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete old versions of our caches
            return (
              name.startsWith('dentastock-') &&
              name !== CACHE_NAME &&
              name !== STATIC_CACHE_NAME &&
              name !== FONT_CACHE_NAME
            )
          })
          .map((name) => caches.delete(name)),
      )
    }),
  )
  // Take control of all pages immediately
  self.clients.claim()
})

// Fetch event - network-first for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Google Fonts - Cache First (long-lived)
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
        })
      }),
    )
    return
  }

  // Navigation requests (HTML pages) - Network First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache a copy of the response
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return networkResponse
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // If no cached page, return a basic offline message
            return new Response(
              '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
              {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
              },
            )
          })
        }),
    )
    return
  }

  // Static assets (JS, CSS, images) - Stale While Revalidate
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.json')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(() => cachedResponse)

          // Return cached response immediately, update cache in background
          return cachedResponse || fetchPromise
        })
      }),
    )
    return
  }

  // All other requests - Network First
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        return networkResponse
      })
      .catch(() => {
        return caches.match(request)
      }),
  )
})
