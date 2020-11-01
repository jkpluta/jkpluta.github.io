self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('jkpluta').then(function(cache) {
            return fetch(event.request)
            .then(function(response) {
                cache.put(event.request, response.clone());
                console.log('PUT ' + event.request);
                return response;
            })
            .catch(function() {
                console.log('MATCH ' + event.request);
                return cache.match(event.request);
            });
        })
    );
});
