self.addEventListener('install', event => {
    console.log('Install...');
    event.waitUntil(
        caches.open('jkpluta').then(function(cache) {
            return cache.addAll(['index.html', 'info.html', 'bookmarks.html', 'icons.html', 'manifest.json', 'service-worker.js', 'js/script.js', 'img/error.png']);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('jkpluta').then(function(cache) {
            return fetch(event.request)
            .then(function(response) {
                cache.put(event.request, response.clone());
                return response;
            })
            .catch(function() {
                return cache.match(event.request);
            });
        })
    );
});
