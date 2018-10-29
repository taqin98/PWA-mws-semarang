var CACHE_NAME = 'taqin-cache-v4';
var urlsToCache = [
  '/',
  '/manifest.json',
  '/project1_add2numbers/add2numbers.html',
  '/project2_mapbox/mapbox.html',
  '/project3_kuliner/kuliner.html',
  '/assets/note.json',
  '/assets/js/readnote.js',
  '/assets/js/peta.js',
  '/assets/js/add2numbers.js',
  '/assets/css/mystyle.css',
  '/assets/css/leaflet.css',
  '/assets/js/leaflet.js',
  '/images/taqin.jpg',
  '/images/firebase.png',
  '/images/icons/icon-72x72.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('in install serviceworker... cache opened!');
        return cache.addAll(urlsToCache);
      })
  );

});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});



self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheNames) {
          return cacheNames != CACHE_NAME
        }).map(function(cacheNames) {
          return caches.delete(cacheNames)
        })

      );
    })
  );
});