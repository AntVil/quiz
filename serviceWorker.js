let cacheName = "password-manager";
let filesToCache = [
    "/quiz/index.html",

    // js files
    "/quiz/scripts/index.js",
    "/quiz/scripts/util.js",
    "/quiz/scripts/fadeInfo.js",
    "/quiz/scripts/questionScreen.js",
    "/quiz/scripts/listScreen.js",
    "/quiz/scripts/statisticScreen.js",
    "/quiz/scripts/editScreen.js",
    "/quiz/scripts/settingsScreen.js",

    // css files
    "/quiz/styles/index.css",
    "/quiz/styles/themes.css",
    "/quiz/styles/nav.css",
    "/quiz/styles/fadeInfo.css",
    "/quiz/styles/questionScreen.css",
    "/quiz/styles/listScreen.css",
    "/quiz/styles/statisticScreen.css",
    "/quiz/styles/editScreen.css",
    "/quiz/styles/settingsScreen.css"
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
