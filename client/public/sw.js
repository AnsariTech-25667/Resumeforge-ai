// Service Worker for ResumeForge AI PWA
const CACHE_NAME = 'resumeforge-v1.2.0';
const STATIC_CACHE = 'resumeforge-static-v1.2.0';
const DYNAMIC_CACHE = 'resumeforge-dynamic-v1.2.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  '/offline.html'
];

// Dynamic assets to cache (API endpoints, user data, etc.)
const DYNAMIC_PATTERNS = [
  /^https:\/\/api\.resumeforge\.ai\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\/api\//
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(handleStaticAssetRequest(request));
    return;
  }

  // Handle dynamic content
  if (DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(handleDynamicRequest(request));
    return;
  }

  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Default: network first, cache fallback
  event.respondWith(handleDefaultRequest(request));
});

// Navigation requests - cache first, network fallback
async function handleNavigationRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Navigation request failed, serving offline page');
    return caches.match('/offline.html');
  }
}

// Static assets - cache first
async function handleStaticAssetRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static asset request failed:', error);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Dynamic content - network first, cache fallback
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      // Don't cache responses larger than 5MB
      if (networkResponse.headers.get('content-length') < 5 * 1024 * 1024) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Content not available offline', { status: 404 });
  }
}

// API requests - network first with offline queue
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Cache successful GET requests only
      if (request.method === 'GET') {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }
    throw new Error('API request failed');
  } catch (error) {
    // For GET requests, try cache
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // For POST/PUT/DELETE requests, queue for later sync
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      await queueOfflineRequest(request);
      return new Response(JSON.stringify({
        success: false,
        message: 'Request queued for sync when online',
        queued: true
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      message: 'API not available offline'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Resource not available offline', { status: 404 });
  }
}

// Offline request queue management
async function queueOfflineRequest(request) {
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: request.method !== 'GET' ? await request.text() : null,
    timestamp: Date.now()
  };

  // Store in IndexedDB
  const db = await openOfflineDB();
  const transaction = db.transaction(['requests'], 'readwrite');
  const store = transaction.objectStore('requests');
  await store.add(requestData);
}

// IndexedDB setup for offline queue
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ResumeForgeOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create requests store for offline queue
      if (!db.objectStoreNames.contains('requests')) {
        const store = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
      
      // Create data store for offline resume data
      if (!db.objectStoreNames.contains('resumeData')) {
        const store = db.createObjectStore('resumeData', { keyPath: 'id' });
        store.createIndex('lastModified', 'lastModified');
      }
    };
  });
}

// Background sync for queued requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncQueuedRequests());
  }
});

async function syncQueuedRequests() {
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['requests'], 'readonly');
    const store = transaction.objectStore('requests');
    const requests = await store.getAll();

    for (const requestData of requests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });

        if (response.ok) {
          // Remove from queue on success
          const deleteTransaction = db.transaction(['requests'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('requests');
          await deleteStore.delete(requestData.id);
          
          // Notify client of successful sync
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'SYNC_SUCCESS',
                data: { url: requestData.url, method: requestData.method }
              });
            });
          });
        }
      } catch (error) {
        console.error('Failed to sync request:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // If app is already open, focus it
      for (const client of clients) {
        if ('focus' in client) {
          client.focus();
          // Send message to client about notification click
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            action,
            data
          });
          return;
        }
      }
      
      // Otherwise, open new window
      if (self.clients.openWindow) {
        const url = data.url || '/';
        return self.clients.openWindow(url);
      }
    })
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_RESUME_DATA':
      cacheResumeData(data);
      break;
      
    case 'GET_CACHED_RESUME':
      getCachedResume(data.id).then(resume => {
        event.ports[0].postMessage(resume);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
  }
});

// Cache resume data for offline use
async function cacheResumeData(resumeData) {
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['resumeData'], 'readwrite');
    const store = transaction.objectStore('resumeData');
    
    const dataToStore = {
      ...resumeData,
      lastModified: Date.now(),
      cached: true
    };
    
    await store.put(dataToStore);
    
    // Notify client
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'RESUME_CACHED',
          data: { id: resumeData.id }
        });
      });
    });
  } catch (error) {
    console.error('Failed to cache resume data:', error);
  }
}

// Get cached resume
async function getCachedResume(id) {
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['resumeData'], 'readonly');
    const store = transaction.objectStore('resumeData');
    return await store.get(id);
  } catch (error) {
    console.error('Failed to get cached resume:', error);
    return null;
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    // Clear IndexedDB
    const db = await openOfflineDB();
    const transaction = db.transaction(['requests', 'resumeData'], 'readwrite');
    await transaction.objectStore('requests').clear();
    await transaction.objectStore('resumeData').clear();
    
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.respondWith(
    handleFetchRequest(event.request).then(response => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow requests
      if (duration > 3000) {
        console.warn(`Slow request detected: ${event.request.url} took ${duration}ms`);
      }
      
      return response;
    })
  );
});

// Periodic cleanup of old cache entries
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const cacheDate = new Date(dateHeader).getTime();
        if (now - cacheDate > maxAge) {
          await cache.delete(request);
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}, 24 * 60 * 60 * 1000); // Run daily

console.log('Service Worker: Loaded successfully');