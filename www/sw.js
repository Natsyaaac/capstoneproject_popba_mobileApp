/**
 * @fileOverview Service Worker for Balloon Pop Maths
 * @description Provides offline caching and PWA functionality
 * @version 1.0.0
 */

const CACHE_NAME = 'balloon-pop-maths-v1';
const DYNAMIC_CACHE = 'balloon-pop-dynamic';

const STATIC_ASSETS = [
    'index.html',
    '404.html',
    'assets/css/style.css',
    'assets/css/style_cloud.css',
    'assets/js/platform-service.js',
    'assets/js/offline-service.js',
    'assets/js/firebase-config.js',
    'assets/js/initialisation.js',
    'assets/js/display.js',
    'assets/js/audio.js',
    'assets/js/animation.js',
    'assets/js/events.js',
    'assets/js/game-logic.js',
    'assets/js/maths.js',
    'assets/js/input-soal.js',
    'assets/js/storyMode.js',
    'assets/js/nightMode.js',
    'assets/js/background.js',
    'assets/js/mail.js',
    'assets/images/balloon-favicon.ico',
    'assets/images/balloon-purple-cropped.png',
    'assets/images/balloon-blue-sprite.png',
    'assets/images/balloon-green-sprite.png',
    'assets/images/balloon-orange-sprite.png',
    'assets/images/balloon-pink-sprite.png',
    'assets/images/balloon-purple-sprite.png',
    'assets/images/balloon-red-sprite.png',
    'assets/images/balloon-yellow-sprite.png',
    'assets/images/pin.svg',
    'assets/sounds/pop.mp3',
    'assets/sounds/deflate.mp3',
    'assets/sounds/high-score.mp3',
    'assets/sounds/unlucky.mp3',
    'assets/sounds/well-done.mp3',
    'assets/sounds/music_background.mp3',
    'assets/fonts/whale-i-tried.woff2',
    'assets/fonts/whale-i-tried.woff',
    'assets/fonts/whale-i-tried.ttf'
];

const EXTERNAL_ASSETS = [
    'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Rajdhani&display=swap'
];

self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching static assets');
                var staticPromise = cache.addAll(STATIC_ASSETS.map(function(url) {
                    return new Request(url, { cache: 'reload' });
                })).catch(function(error) {
                    console.warn('[ServiceWorker] Some static assets failed to cache:', error);
                    return cache.addAll(STATIC_ASSETS.filter(function(url) {
                        return !url.includes('assets/sounds/');
                    }).map(function(url) {
                        return new Request(url, { cache: 'reload' });
                    }));
                });
                
                var externalPromise = Promise.all(EXTERNAL_ASSETS.map(function(url) {
                    return fetch(url, { mode: 'cors' })
                        .then(function(response) {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        })
                        .catch(function(error) {
                            console.warn('[ServiceWorker] Failed to cache external asset:', url, error);
                        });
                }));
                
                return Promise.all([staticPromise, externalPromise]);
            })
            .then(function() {
                console.log('[ServiceWorker] All assets cached');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                console.log('[ServiceWorker] Claiming clients');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    
    if (url.origin.includes('firebase') || 
        url.origin.includes('googleapis') ||
        url.origin.includes('emailjs')) {
        event.respondWith(networkFirst(event.request));
        return;
    }
    
    if (event.request.destination === 'audio' || 
        event.request.destination === 'video') {
        event.respondWith(cacheFirst(event.request));
        return;
    }
    
    if (event.request.mode === 'navigate') {
        event.respondWith(networkFirst(event.request));
        return;
    }
    
    event.respondWith(staleWhileRevalidate(event.request));
});

function cacheFirst(request) {
    return caches.match(request)
        .then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetchAndCache(request);
        })
        .catch(function() {
            return new Response('Offline - Resource not available', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        });
}

function networkFirst(request) {
    return fetch(request)
        .then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
                var responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(request, responseClone);
                    });
            }
            return networkResponse;
        })
        .catch(function() {
            return caches.match(request)
                .then(function(cachedResponse) {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    if (request.mode === 'navigate') {
                        var url = new URL(request.url);
                        if (url.pathname === '/' || url.pathname === '/index.html') {
                            return caches.match('/index.html');
                        }
                        return caches.match('/404.html');
                    }
                    
                    return new Response('Offline', {
                        status: 503, 
                        statusText: 'Service Unavailable'
                    });
                });
        });
}

function staleWhileRevalidate(request) {
    return caches.match(request)
        .then(function(cachedResponse) {
            var fetchPromise = fetch(request)
                .then(function(networkResponse) {
                    if (networkResponse && networkResponse.status === 200) {
                        var responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(request, responseClone);
                            });
                    }
                    return networkResponse;
                })
                .catch(function() {
                    return cachedResponse || new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            
            return cachedResponse || fetchPromise;
        });
}

function fetchAndCache(request) {
    return fetch(request)
        .then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
                var responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        cache.put(request, responseClone);
                    });
            }
            return networkResponse;
        });
}

self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        var urls = event.data.urls;
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urls);
            });
    }
});

self.addEventListener('sync', function(event) {
    if (event.tag === 'sync-firebase-deletions') {
        event.waitUntil(
            self.clients.matchAll()
                .then(function(clients) {
                    clients.forEach(function(client) {
                        client.postMessage({
                            type: 'PROCESS_PENDING_DELETIONS'
                        });
                    });
                })
        );
    }
});
