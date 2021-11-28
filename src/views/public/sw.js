self.addEventListener('install', event => {
    console.log('WORKER: install event in progress.');
});

self.addEventListener('fetch', event => {
    console.log('WORKER: Fetching', event.request);

    // event.respondWith(
    //     fetch(event.request)
    // );
});
