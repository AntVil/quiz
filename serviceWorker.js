let cacheName = "password-manager";
let filesToCache = [
    "/index.html",

    // js files
    "/scripts/index.js",
    "/scripts/util.js",
    "/scripts/questionScreen.js",
    "/scripts/listScreen.js",
    "/scripts/statisticScreen.js",
    "/scripts/editScreen.js",

    // css files
    "/styles/index.css",
    "/styles/nav.css",
    "/styles/questionScreen.css",
    "/styles/listScreen.css",
    "/styles/statisticScreen.css",
    "/styles/editScreen.css"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
