import { useEffect } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "./SiteChrome";

import { CookieConsent } from "./CookieConsent";
import { initConsentMode, trackPageView } from "@/lib/analytics";
import { recordPageView } from "@/lib/page-view";


export function SiteLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => { initConsentMode(); }, []);
  useEffect(() => {
    trackPageView(pathname);
    if (typeof window === "undefined") return;
    if (hash) {
      // Let in-page anchors (e.g. the header "Get index updates" CTA) land on
      // their section instead of being yanked back to the top.
      const el = document.getElementById(hash.replace(/^#/, ""));
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        requestAnimationFrame(() => {
          document.getElementById(hash.replace(/^#/, ""))?.scrollIntoView({ block: "start" });
        });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    recordPageView(pathname);
  }, [pathname, hash]);



  return (
    <div className="flex min-h-screen flex-col">
      
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <CookieConsent />
    </div>
  );
}
