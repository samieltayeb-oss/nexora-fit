import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkFirst, NetworkOnly, CacheFirst, StaleWhileRevalidate, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // NEVER CACHE: Auth, Sync, and Security routes
    {
      matcher: ({ url }) => {
        return (
          url.pathname.startsWith('/api/health/sync') ||
          url.pathname.startsWith('/auth') ||
          url.pathname.startsWith('/login')
        );
      },
      handler: new NetworkOnly(),
    },
    // NETWORK FIRST: Supabase Queries (App Data)
    {
      matcher: ({ url }) => url.origin.includes('supabase.co'),
      handler: new NetworkFirst({
        cacheName: 'supabase-data',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours fallback
          }),
        ],
      }),
    },
    // CACHE FIRST: Fonts, Icons, Images
    {
      matcher: ({ request }) =>
        request.destination === 'font' ||
        request.destination === 'image',
      handler: new CacheFirst({
        cacheName: 'static-assets',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
        ],
      }),
    },
    // STALE WHILE REVALIDATE: Other Static Assets (JS/CSS)
    {
      matcher: ({ request }) =>
        request.destination === 'script' ||
        request.destination === 'style',
      handler: new StaleWhileRevalidate({
        cacheName: 'static-resources',
      }),
    },
    // DEFAULT NEXT.JS CACHE (App Shell)
    ...defaultCache,
  ],
});

serwist.addEventListeners();
