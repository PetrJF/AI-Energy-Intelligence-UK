// Google Analytics 4 + Consent Mode v2
// Replace this with your real GA4 Measurement ID (e.g. "G-XXXXXXXXXX").
// Leaving it empty disables GA entirely (consent UI still works).
export const GA_MEASUREMENT_ID = "";

const STORAGE_KEY = "aiei-consent-v1";

export type ConsentChoice = "all" | "analytics-only" | "denied";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "all" || v === "analytics-only" || v === "denied" ? v : null;
}

export function storeConsent(choice: ConsentChoice) {
  window.localStorage.setItem(STORAGE_KEY, choice);
  applyConsent(choice);
  window.dispatchEvent(new CustomEvent("aiei:consent", { detail: choice }));
}

/** Initialise gtag stub + Consent Mode defaults. Safe to call before any consent. */
export function initConsentMode() {
  if (typeof window === "undefined") return;
  if ((window as any).__aieiGtagInit) return;
  (window as any).__aieiGtagInit = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());

  // Consent Mode v2 — deny everything by default
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  // Apply any prior choice immediately (no banner flash for returning users)
  const prior = getStoredConsent();
  if (prior) applyConsent(prior);
}

function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (choice === "all") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    loadGtagScript();
  } else if (choice === "analytics-only") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    loadGtagScript();
  } else {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}

let scriptLoaded = false;
function loadGtagScript() {
  if (scriptLoaded || !GA_MEASUREMENT_ID || typeof document === "undefined") return;
  scriptLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });
}

export function trackPageView(path: string, title?: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(name: string, params?: Record<string, any>) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params || {});
}

export function revokeConsent() {
  window.localStorage.removeItem(STORAGE_KEY);
  applyConsent("denied");
  window.dispatchEvent(new CustomEvent("aiei:consent", { detail: null }));
}
