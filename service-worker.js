const CACHE_NAME = 'entrenador-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './data.js',
  './workouts.js',
  './progreso.js',
  './progreso-fotos.js',
  './nutricion.js',
  './nutricion.html',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalación y cacheo de archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación y limpieza de cache antigua
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch: responde con cache o busca en red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
