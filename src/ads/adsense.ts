// Thin wrapper around the Google AdSense (adsbygoogle) script.
//
// AdSense's loader only scans the DOM for ad slots once. In a client-routed
// SPA, each <ins class="adsbygoogle"> element must be pushed individually when
// it mounts. `AdSlot` handles remounting per route; this module owns loading
// the script once and exposing a safe push.

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let injected = false;

// Ensures the AdSense script is present. In production it ships in index.html's
// <head> (for verification/review), so this is normally a no-op — it detects
// the existing tag and skips. Kept as a fallback so AdSlot works even if the
// head tag is ever absent. No-op without a publisher ID.
export const ensureAdSenseScript = (client: string): void => {
  if (injected || typeof window === "undefined" || !client) return;
  injected = true;

  // Already loaded via index.html (or a previous call)? Don't add a duplicate.
  if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

  const script = document.createElement("script");
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
};

// Requests an ad for the most recently rendered <ins> slot. Wrapped so an ad
// error can never break the app.
export const pushAd = (): void => {
  if (typeof window === "undefined") return;
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("AdSense error:", err);
  }
};
