// Cookie-free, first-party page view ping. No personal data leaves the browser:
// the server derives a daily-rotating pseudonymous hash for unique counts.
let lastPath: string | null = null;

function deviceClass(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function recordPageView(path: string) {
  if (typeof window === "undefined") return;
  if (path === lastPath) return;
  lastPath = path;
  if (path.startsWith("/AIAdmin")) return;

  const body = JSON.stringify({
    path,
    referrer: document.referrer || "",
    device: deviceClass(),
  });

  void fetch("/api/public/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
