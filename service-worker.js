// 📌 Nombre y versión de la caché (cambia la versión en cada actualización)
const CACHE_NAME = 'entrenador-deportivo-v1.0';

// 📌 Archivos que se guardarán en caché para uso offline
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
  './lista-compra.html', // si tienes la lista de compra
  './icons/icon-192.png',  // icono PWA
  './icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// 📌 Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('📥 Instalando Service Worker...');
  self.skipWaiting(); // Fuerza que se active inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// 📌 Activación del Service Worker y limpieza de caché vieja
self.addEventListener('activate', event => {
  console.log('⚡ Activando nuevo Service Worker...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // Mantener solo la caché actual
          .map(key => {
            console.log('🗑️ Eliminando caché antigua:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim(); // Activar el nuevo SW sin esperar
});

// 📌 Estrategia de carga: Red primero, luego caché como respaldo
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guardar copia en caché
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Si falla (sin internet), usar la caché
        return caches.match(event.request);
      })
  );
});
