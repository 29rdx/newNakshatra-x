'use client';

import { useEffect } from 'react';

export default function PWARegistry() {
  useEffect(() => {
    // Clear all legacy CacheStorage entries in normal browsers
    if (typeof window !== 'undefined' && 'caches' in window) {
      window.caches.keys().then((keys) => {
        keys.forEach((key) => {
          window.caches.delete(key);
        });
      });
    }

    // Unregister legacy Service Workers to ensure fresh code delivery
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  return null;
}
