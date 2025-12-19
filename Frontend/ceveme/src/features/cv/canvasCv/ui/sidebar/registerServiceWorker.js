// src/fonts/registerServiceWorker.js
export function registerFontSW() {
  if (!('serviceWorker' in navigator)) return;
  // pozwól przeglądarce zachować cache między sesjami (prośba – nie zawsze się uda)
  if (navigator.storage?.persist) {
    try {
      navigator.storage.persist();
    } catch {}
  }
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
