// Cookie-free navigation click tracking.
//
// Records which menu link was clicked (header, dropdown, mobile menu, footer),
// and — crucially for diagnosing broken navigation — whether the browser
// actually ended up on the destination shortly afterwards.
//
// No personal data leaves the browser; the server derives the same
// daily-rotating pseudonymous hash used for page views.

export type NavLocation = "header" | "dropdown" | "mobile" | "footer";

const CHECK_DELAY_MS = 1200;

function deviceClass(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function send(payload: Record<string, unknown>) {
  void fetch("/api/public/navclick", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Call from a nav link's onClick. Logs the click, then checks a moment later
 * whether the URL actually changed to the destination and reports the outcome:
 *  - "arrived": the browser is on the destination path
 *  - "stuck":   still on the originating page (the failure we want to catch)
 *  - "elsewhere": ended up on some other path (redirect / not-found)
 */
export function trackNavClick(location: NavLocation, label: string, href: string) {
  if (typeof window === "undefined") return;

  const fromPath = window.location.pathname;
  const target = href.split("#")[0].split("?")[0] || "/";

  window.setTimeout(() => {
    const landed = window.location.pathname;
    const outcome =
      landed === target || landed === `${target}/`
        ? "arrived"
        : landed === fromPath
          ? "stuck"
          : "elsewhere";

    send({
      location,
      label,
      href,
      from_path: fromPath,
      landed_path: landed,
      outcome,
      device: deviceClass(),
    });
  }, CHECK_DELAY_MS);
}

/** Convenience helper for building onClick handlers inline. */
export function navClick(location: NavLocation, label: string, href: string) {
  return () => trackNavClick(location, label, href);
}
