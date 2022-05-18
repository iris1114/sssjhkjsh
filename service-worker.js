
// https://github.com/shadowwalker/next-pwa/blob/master/examples/offline-fallback/service-worker.js
import { skipWaiting, clientsClaim } from "workbox-core";
import { CacheFirst } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build#add_an_injection_point
precacheAndRoute(self.__WB_MANIFEST);

skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

registerRoute(new RegExp("/_next/static/.*"), new CacheFirst({}), "GET");
